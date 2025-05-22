import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { bransch, omrade } = await req.json();

  // Improved OpenAI prompt for Swedish, number + source only
  const apiKey = process.env.OPENAI_API_KEY;
  const prompt = `Svara på svenska. Uppskatta den totala marknadsstorleken (TAM) i SEK för branschen: "${bransch}" och målgruppen/området: "${omrade}". Svara ENBART med:
Marknadsstorlek: [siffra] SEK\nKälla: [kort källa eller förklaring]\nInga metodbeskrivningar, bara siffra och källa.`;

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
    const match = text.match(/Marknadsstorlek:\s*([\d\s.,]+)\s*SEK[\s\n\r]*Källa:\s*(.+)/i);
    if (match) {
      estimate = `Marknadsstorlek: ${match[1].trim()} SEK`;
      source = `Källa: ${match[2].trim()}`;
    } else {
      estimate = text.trim();
      source = '';
    }
  } catch (e) {
    estimate = 'Kunde inte hämta marknadsdata.';
    source = '';
  }

  return NextResponse.json({ estimate, source });
} 