import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const inputSizes = [10, 50, 100, 500, 1000, 5000, 10000, 50000];
    const dataPoints: { n: number; ms: number }[] = [];

    for (const size of inputSizes) {
      const injectedCode = `n = ${size}\n${code}`;
      
      const response = await fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          source_code: injectedCode,
          language_id: 71,
          stdin: ""
        })
      });

      if (!response.ok) {
         break;
      }
      
      const data = await response.json();
      
      const timeInSeconds = parseFloat(data.time || "0");
      let executionTime = Math.round(timeInSeconds * 1000);
      
      // If time limit exceeded, artificially push a high latency
      if (data.status && data.status.id === 5) {
        executionTime = 2000;
      }

      dataPoints.push({ n: size, ms: executionTime });
      
      if (data.status && data.status.id === 5) {
         break; // Stop escalating if it's already Timing Out
      }
    }

    // Mathematical Curve Fitting Logic
    let complexityClass = "O(n)";
    
    if (dataPoints.length > 1) {
       const last = dataPoints[dataPoints.length - 1];
       const prev = dataPoints[dataPoints.length - 2];
       
       if (last && prev && prev.n > 0) {
           const ratioN = last.n / prev.n; 
           const ratioT = last.ms / (prev.ms || 1); 
           
           if (last.ms < 5) {
               complexityClass = "O(1)";
           } else if (ratioT > Math.pow(ratioN, 1.5)) {
               complexityClass = "O(n²)";
           } else if (ratioT > ratioN * 1.2) {
               complexityClass = "O(n log n)";
           } else if (ratioT >= ratioN * 0.7) {
               complexityClass = "O(n)";
           } else if (ratioT > 1.2) {
               complexityClass = "O(log n)";
           } else {
               complexityClass = "O(1)";
           }
       }
    }

    return NextResponse.json({
      dataPoints,
      complexityClass
    });

  } catch (error: any) {
    console.error('Telemetry API error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
