import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { questionText, currentAnswer, businessDomain } = await req.json();

  const apiKey = process.env.OPENAI_API_KEY;
  const prompt = `Baserat på frågan: '${questionText}', svaret: '${currentAnswer}', och företagets domän/beskrivning: '${businessDomain}', ge EXAKT 2 smarta följdfrågor eller förtydliganden som är relevanta för detta företag. Använd alltid hela svaret exakt som det är, utan att förkorta eller använda variabler. Om svaret är ett ord, använd det ordet exakt i dina följdfrågor. Svara på svenska och returnera endast en JSON-array med exakt 2 förslag.`;

  let suggestions = [];
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
          { role: 'system', content: 'Du är en expert på att coacha entreprenörer.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.3
      })
    });
    const data = await openaiRes.json();
    let text = data.choices?.[0]?.message?.content || '';
    if (text.startsWith('```json')) {
      text = text.replace(/^```json/, '').replace(/```$/, '').trim();
    }
    try {
      suggestions = JSON.parse(text);
      if (!Array.isArray(suggestions)) suggestions = [text];
      // Säkerställ att vi alltid har exakt 2 förslag
      if (suggestions.length > 2) suggestions = suggestions.slice(0, 2);
      while (suggestions.length < 2) suggestions.push('Inget ytterligare förslag tillgängligt.');
    } catch {}
  } catch {}

  return NextResponse.json({ suggestions });
} 