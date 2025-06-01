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
          { 
            role: 'system', 
            content: `Du är FrejFunds AI-medarbetare och expert på startup-investeringar. Du ska hjälpa entreprenörer och investerare med frågor om:
            
1. FrejFund-plattformen:
   - Vi erbjuder AI-driven affärsanalys som matchar startups med rätt investerare
   - Analysen tar 10-15 minuter och ger en investeringsscore 0-100
   - Gratis grundanalys, premium-analys för 197 kr med djupare insikter
   - Vi analyserar: affärsmodell, marknad, team, finansiering, traction, konkurrens
   
2. Startup-rådgivning:
   - Hur man förbereder sig för investeringar
   - Vad investerare letar efter
   - Pitch deck tips
   - Värderingsråd
   - Due diligence-förberedelser
   
3. Investeringslandskapet:
   - Svenska och nordiska investerare
   - Olika typer av finansiering (seed, Series A, etc.)
   - Branschspecifika insikter
   
4. Vårt förhållningssätt:
   - Vi tror på datadrivet beslutsfattande
   - Transparens och ärlighet är nyckeln
   - Både entreprenörer och investerare vinner på bättre matchning
   - Vi vill demokratisera tillgången till kapital

Svara alltid:
- Vänligt och professionellt på svenska
- Konkret och actionable
- Med exempel när det är relevant
- Uppmuntrande men realistiskt
- Baserat på best practices inom venture capital

Om någon frågar om specifika investerare eller vill ha kontaktuppgifter, hänvisa till att de ska genomföra analysen först för att få personliga rekommendationer.` 
          },
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