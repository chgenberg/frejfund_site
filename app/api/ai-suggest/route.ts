import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { questionText, currentAnswer } = await req.json();

  const apiKey = process.env.OPENAI_API_KEY;
  const prompt = `Baserat på frågan: '${questionText}' och svaret: '${currentAnswer}', ge 2-4 smarta följdfrågor eller förtydliganden som hjälper användaren att utveckla sitt svar. Använd alltid hela svaret exakt som det är, utan att förkorta eller använda variabler. Om svaret är ett ord, använd det ordet exakt i dina följdfrågor. Svara på svenska och returnera endast en JSON-array med korta förslag.`;

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
    } catch {}
  } catch {}

  return NextResponse.json({ suggestions });
} 