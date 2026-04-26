import { NextResponse } from 'next/server';
import Groq from "groq-sdk";



const apiKey = process.env.GROQ_API_KEY || '';
const groq = new Groq({ apiKey });

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'GROQ_API_KEY is not configured.' }, { status: 500 });
    }

    const systemPrompt = `You are an adversarial test case generator. Given a piece of code, produce exactly 5 edge cases designed to break it or trigger worst-case complexity. Respond ONLY in JSON: { "cases": [{ "name": "...", "input": "...", "reason": "..." }] }`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: code }
      ],
      response_format: { type: "json_object" }
    });

    let jsonStr = completion.choices[0].message.content || '{}';
    
    // Safety check: remove markdown code blocks if the model wrapped the JSON
    jsonStr = jsonStr.replace(/```json\n?|```/g, '').trim();

    try {
      const parsed = JSON.parse(jsonStr);
      return NextResponse.json(parsed);
    } catch (err) {
      return NextResponse.json({ error: 'Failed to parse Groq JSON response', details: jsonStr }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Breaker API error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
