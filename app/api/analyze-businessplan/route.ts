import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { answers, applicationType } = await req.json();

  const apiKey = '***REMOVED***Qcn0TpQ3ewkWHR-b3HScwXJAchrAZG3QrmwXRwwF2mL8MsVZcApZyn37sVNBE95uCIH5UyG1BbT3BlbkFJKUcYQM5uJtbU7Q7bQdK0qxJ-iJz5ywDN22tpgZ-xXEcIEb6U2LBEwQgQ2PsPpXP7jNZxvli_cA';

  // Compose a detailed prompt
  const prompt = `Du är en expert på startup-finansiering och ansökningar till Almi, Vinnova och VC. Analysera denna affärsplan enligt följande kriterier:
- Affärsidé & vision
- Marknad & kunder
- Lösning & innovation
- Team & styrning
- Affärsmodell & intäkter
- Traction & validering
- Budget & finansieringsbehov
- Risker & mitigering
- Effekter & hållbarhet
- Exit/återbetalning

För varje område:
- Ge en score (0-10)
- Ge en kort analys (styrkor/svagheter)
- Ge konkreta förbättringsförslag

Avsluta med en totalpoäng, SWOT och en kort sammanfattning om hur affärsplanen står sig mot ${applicationType === 'almi' ? 'Almis' : applicationType === 'vinnova' ? 'Vinnovas' : 'VC/investerarens'} krav.

Returnera som JSON:
{
  "total_score": ...,
  "scores": { ... },
  "swot": { ... },
  "suggestions": { ... },
  "summary": "..."
}

Här är affärsplanen:
${Object.entries(answers).map(([k, v]) => `${k}: ${v}`).join('\n')}
`;

  let result = null;
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
          { role: 'system', content: 'You are a helpful business analyst.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1200,
        temperature: 0.2
      })
    });
    const data = await openaiRes.json();
    // Try to parse JSON from the response
    const text = data.choices?.[0]?.message?.content || '';
    try {
      result = JSON.parse(text);
    } catch (e) {
      // If not valid JSON, return as text
      result = { raw: text };
    }
  } catch (e) {
    result = { error: 'Kunde inte analysera affärsplanen.' };
  }

  return NextResponse.json(result);
} 