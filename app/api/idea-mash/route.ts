import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { target, tech, model } = await req.json();
  if (!target || !tech || !model) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  const prompt = `Du är en kreativ startup-generator. Kombinera målgruppen "${target}", tekniken "${tech}" och affärsmodellen "${model}" till en galen, inspirerande startup-idé. Svara med:
1. En micro-pitch (max 140 tecken, på svenska)
2. Ett kreativt namnförslag (max 3 ord)
Format:
Pitch: ...\nNamn: ...`;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Du är en kreativ, inspirerande och lekfull startup-idé-generator. Svara alltid på svenska.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 200,
        temperature: 1.1,
      }),
    });
    const data = await openaiRes.json();
    const text = data.choices?.[0]?.message?.content || '';
    const pitchMatch = text.match(/Pitch:\s*(.+)/i);
    const nameMatch = text.match(/Namn:\s*(.+)/i);
    return NextResponse.json({
      pitch: pitchMatch ? pitchMatch[1].trim() : '',
      name: nameMatch ? nameMatch[1].trim() : '',
    });
  } catch (e) {
    return NextResponse.json({ error: 'Fel vid kontakt med OpenAI.' }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
} 