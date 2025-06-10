import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { answers } = await req.json();
  if (!answers) {
    return NextResponse.json({ error: 'Missing answers' }, { status: 400 });
  }

  const planText = JSON.stringify(answers, null, 2);
  const prompt = `Här är hela affärsplanen (struktur i JSON):\n${planText}\nSkriv en summering på svenska som lyfter styrkor, svagheter och rekommenderar nästa steg. Max 5 meningar. Skriv pedagogiskt och konstruktivt.`;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Du är en pedagogisk och konstruktiv affärscoach.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });
    const data = await openaiRes.json();
    const summary = data.choices?.[0]?.message?.content || '';
    return NextResponse.json({ summary });
  } catch {}
} 