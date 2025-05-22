import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  if (!message) {
    return NextResponse.json({ error: 'No message provided' }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-1106-preview', // 4.1-mini
        messages: [
          { role: 'system', content: 'Du är FrejFunds AI-medarbetare. Svara alltid vänligt, professionellt och på svenska.' },
          { role: 'user', content: message },
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });
    const data = await openaiRes.json();
    const answer = data.choices?.[0]?.message?.content || 'Jag är ledsen, men jag kunde inte generera ett svar just nu.';
    return NextResponse.json({ answer });
  } catch (e) {
    return NextResponse.json({ error: 'Fel vid kontakt med OpenAI.' }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
} 