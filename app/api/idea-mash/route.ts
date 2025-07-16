import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { target, tech, model } = await req.json();
  if (!target || !tech || !model) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  const prompt = `You are a creative startup generator. Combine the target group "${target}", technology "${tech}" and business model "${model}" into a crazy, inspiring startup idea. Respond with:
1. A micro-pitch (max 140 characters, in English)
2. A creative name suggestion (max 3 words)
Format:
Pitch: ...\nName: ...`;

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
          { role: 'system', content: 'You are a creative, inspiring and playful startup idea generator. Always respond in English.' },
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
  } catch {}
}

export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
} 