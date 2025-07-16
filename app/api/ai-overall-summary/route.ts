import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { answers } = await req.json();
  if (!answers) {
    return NextResponse.json({ error: 'Missing answers' }, { status: 400 });
  }

  const planText = JSON.stringify(answers, null, 2);
  const prompt = `Here is the complete business plan (structure in JSON):\n${planText}\nWrite a summary in English that highlights strengths, weaknesses and recommends next steps. Max 5 sentences. Write pedagogically and constructively.`;

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
          { role: 'system', content: 'You are a pedagogical and constructive business coach.' },
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