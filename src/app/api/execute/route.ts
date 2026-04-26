import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code, language } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    // language_id: 71 is Python 3 in Judge0
    const response = await fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source_code: code,
        language_id: 71,
        stdin: ""
      })
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ 
        error: `Judge0 API returned status ${response.status}`, 
        details: text 
      }, { status: response.status });
    }

    const data = await response.json();
    
    // Judge0 returns time in string "0.042" (seconds). Convert to ms.
    const timeInSeconds = parseFloat(data.time || "0");
    const executionTime = Math.round(timeInSeconds * 1000);

    return NextResponse.json({
      output: data.stdout || "",
      stderr: data.stderr || data.compile_output || "",
      executionTime
    });

  } catch (error: any) {
    console.error('Execution API error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
