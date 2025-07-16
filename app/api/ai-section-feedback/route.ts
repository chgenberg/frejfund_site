import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { section, text } = await req.json();
  if (!section || !text) {
    return NextResponse.json({ error: 'Missing section or text' }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not configured');
    return NextResponse.json({ 
      error: 'AI service is not configured properly',
      details: 'Please contact support'
    }, { status: 500 });
  }

  const prompt = `Here is the ${section} description for a startup: "${text}". Provide pedagogical feedback in English:
1. What is good?
2. What can be improved?
3. Tips for the entrepreneur.
Answer thoroughly but concisely, always in complete sentences and never end in the middle of a sentence. If the answer becomes long, end with a summary. Answer in max 10 sentences.`;

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
        max_tokens: 600,
        temperature: 0.7
      })
    });

    if (!openaiRes.ok) {
      const errorData = await openaiRes.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json({ 
        error: 'Failed to generate feedback',
        details: errorData.error?.message || 'Unknown error'
      }, { status: openaiRes.status });
    }

    const data = await openaiRes.json();
    const feedback = data.choices?.[0]?.message?.content || '';
    return NextResponse.json({ feedback });
  } catch (e) {
    console.error('Error in section feedback:', e);
    return NextResponse.json({ 
      error: 'Failed to generate feedback',
      details: e instanceof Error ? e.message : 'Unknown error'
    }, { status: 500 });
  }
} 