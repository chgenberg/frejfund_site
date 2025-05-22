import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { section, text } = await req.json();
  if (!section || !text) {
    return NextResponse.json({ error: 'Missing section or text' }, { status: 400 });
  }

  const prompt = `Här är ${section}-beskrivningen för ett startup: "${text}". Ge en kort, pedagogisk kommentar på svenska: 1. Vad är bra? 2. Vad kan förbättras? 3. Tips till entreprenören. Svara i tre meningar.`;

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
          { role: 'system', content: 'Du är en pedagogisk och konstruktiv affärscoach.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });
    const data = await openaiRes.json();
    const feedback = data.choices?.[0]?.message?.content || '';
    return NextResponse.json({ feedback });
  } catch (e) {
    return NextResponse.json({ error: 'OpenAI error' }, { status: 500 });
  }
} 