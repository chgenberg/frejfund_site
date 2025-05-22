import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { answers } = await req.json();
  if (!answers) {
    return NextResponse.json({ error: 'Missing answers' }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not configured');
    return NextResponse.json({ 
      error: 'AI service is not configured properly',
      details: 'Please contact support'
    }, { status: 500 });
  }

  const planText = JSON.stringify(answers, null, 2);
  const prompt = `Här är en affärsplan (struktur i JSON):\n${planText}\nSätt ett investerar-betyg mellan 1 och 100 (där 100 är "deal ready" och 1 är "mycket låg investeringspotential"). Motivera kort varför du sätter just detta betyg, och kommentera styrkor och svagheter. Svara på svenska och returnera JSON: { "score": XX, "motivation": "...", "strengths": "...", "weaknesses": "..." }`;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-1106-preview',
        messages: [
          { role: 'system', content: 'Du är en erfaren investerare och pedagogisk affärscoach. Svara ENDAST med JSON-objektet som efterfrågas, utan någon annan text eller förklaringar.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!openaiRes.ok) {
      const errorData = await openaiRes.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json({ 
        error: 'Failed to analyze business plan',
        details: errorData.error?.message || 'Unknown error'
      }, { status: openaiRes.status });
    }

    const data = await openaiRes.json();
    // Försök parsa JSON från GPT
    let result = null;
    try {
      result = JSON.parse(data.choices?.[0]?.message?.content || '{}');
    } catch (e) {
      console.error('Failed to parse OpenAI response:', e);
      return NextResponse.json({ 
        error: 'Failed to parse AI response',
        details: 'Please try again'
      }, { status: 500 });
    }
    return NextResponse.json(result);
  } catch (e) {
    console.error('Error in business plan analysis:', e);
    return NextResponse.json({ 
      error: 'Failed to analyze business plan',
      details: e instanceof Error ? e.message : 'Unknown error'
    }, { status: 500 });
  }
} 