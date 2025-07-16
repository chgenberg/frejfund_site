import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { bransch, omrade } = await req.json();

  // Improved OpenAI prompt for English, number + source only
  const apiKey = process.env.OPENAI_API_KEY;
  const prompt = `Answer in English. Estimate the total addressable market (TAM) in SEK for the industry: "${bransch}" and target group/area: "${omrade}". Answer ONLY with:
Market size: [number] SEK\nSource: [brief source or explanation]\nNo methodology descriptions, just number and source.`;

  let estimate = '';
  let source = '';

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
          { role: 'system', content: 'Du är en expert på marknadsanalys.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.2
      })
    });
    const data = await openaiRes.json();
    const text = data.choices?.[0]?.message?.content || '';
    // Extract number and source
    const match = text.match(/Market size:\s*([\d\s.,]+)\s*SEK[\s\n\r]*Source:\s*(.+)/i);
    if (match) {
      estimate = `Market size: ${match[1].trim()} SEK`;
      source = `Source: ${match[2].trim()}`;
    } else {
      estimate = text.trim();
      source = '';
    }
  } catch {}

  return NextResponse.json({ estimate, source });
} 