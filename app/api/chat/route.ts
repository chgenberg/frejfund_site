import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  if (!message) {
    return NextResponse.json({ error: 'No message provided' }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API key is not configured' }, { status: 500 });
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-1106-preview',
        messages: [
          { role: 'system', content: 'Du är FrejFunds AI-medarbetare. Svara alltid vänligt, professionellt och på svenska.' },
          { role: 'user', content: message },
        ],
        max_tokens: 600,
        temperature: 0.7,
        response_format: { type: "text" }
      }),
    });

    if (!openaiRes.ok) {
      const errorData = await openaiRes.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json({ 
        error: 'Failed to get response from AI',
        details: errorData.error?.message || 'Unknown error'
      }, { status: openaiRes.status });
    }

    const data = await openaiRes.json();
    const answer = data.choices?.[0]?.message?.content || 'Jag är ledsen, men jag kunde inte generera ett svar just nu.';
    return NextResponse.json({ answer });
  } catch (e) {
    console.error('Error in chat:', e);
    return NextResponse.json({ 
      error: 'Failed to process chat message',
      details: e instanceof Error ? e.message : 'Unknown error'
    }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
} 