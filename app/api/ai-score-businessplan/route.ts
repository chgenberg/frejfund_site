import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { answers } = await req.json();
  if (!answers) {
    return NextResponse.json({ error: 'Missing answers' }, { status: 400 });
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
          { role: 'system', content: 'Du är en erfaren investerare och pedagogisk affärscoach.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });
    const data = await openaiRes.json();
    // Försök parsa JSON från GPT
    let result = null;
    try {
      result = JSON.parse(data.choices?.[0]?.message?.content || '{}');
    } catch {
      result = { score: null, motivation: '', strengths: '', weaknesses: '' };
    }
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: 'OpenAI error' }, { status: 500 });
  }
} 