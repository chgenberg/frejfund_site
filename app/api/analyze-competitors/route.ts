import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function getCompetitorList(answers: Record<string, unknown>) {
  // GPT-prompt för att hitta konkurrenter
  const prompt = `Du är en marknadsanalytiker. Här är en affärsplan: ${JSON.stringify(answers, null, 2)}\n\nLista de tre största konkurrenterna (namn och webbadress) till detta bolag. Returnera som JSON-array: [{\"name\":..., \"url\":...}]`;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Du är en expert på marknadsanalys.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.2
    })
  });
  const data = await res.json();
  let competitors = [];
  try {
    const content = data.choices?.[0]?.message?.content || '';
    competitors = JSON.parse(content.replace(/```json\n?|\n?```/g, '').trim());
  } catch {}
  return competitors;
}

export async function POST(req: NextRequest) {
  const { answers } = await req.json();
  if (!answers) return NextResponse.json({ error: 'answers krävs' }, { status: 400 });

  // 1. Hämta konkurrentlista från GPT
  const competitors = await getCompetitorList(answers);

  // 2. Skrapa och analysera varje konkurrent (mocka webbsökning om ingen url)
  const results = [];
  for (const c of competitors) {
    try {
      const { scrapeAndAnalyze } = await import('../../../scrapeWithPlaywrightAndOpenAI');
      await scrapeAndAnalyze(c.url);
      // GPT-prompt för analys
      const analysisPrompt = `Besök denna URL: ${c.url}. Sammanfatta företagets erbjudande, styrkor, svagheter och möjligheter i 2-3 meningar. Svara på svenska. Om sidan inte kan nås, skriv 'Kunde inte analysera'.`;
      const analysisRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: 'Du är en expert på konkurrensanalys.' },
            { role: 'user', content: analysisPrompt }
          ],
          max_tokens: 500,
          temperature: 0.2
        })
      });
      const analysisData = await analysisRes.json();
      let analysis = {};
      try {
        const content = analysisData.choices?.[0]?.message?.content || '';
        analysis = JSON.parse(content.replace(/```json\n?|\n?```/g, '').trim());
      } catch {}
      results.push({
        name: c.name,
        url: c.url,
        ...analysis
      });
    } catch {}
  }
  return NextResponse.json({ competitors: results });
} 