import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { questionId, questionText, currentAnswer, businessDomain, websiteUrl, scrapedData } = await req.json();

  const apiKey = process.env.OPENAI_API_KEY;
  
  // Om vi har skrapad data, använd den för att generera bättre förslag
  if (scrapedData && questionId) {
    let contextualPrompt = '';
    
    // Bygg en kontext från skrapad data
    const context = {
      company: scrapedData.company_name || 'Företaget',
      industry: scrapedData.industry || 'Ej specificerat',
      value: scrapedData.company_value || 'Ej specificerat',
      target: scrapedData.target_customer || 'Ej specificerat',
      competitors: scrapedData.competitors || 'Ej specificerat'
    };
    
    // Anpassa förslag baserat på frågan
    const questionSpecificPrompts = {
      'customer_problem': `Baserat på att ${context.company} verkar inom ${context.industry} och erbjuder: "${context.value}", generera ett specifikt svar på frågan "${questionText}". Fokusera på det exakta problemet deras målgrupp (${context.target}) har.`,
      
      'problem_evidence': `För ${context.company} inom ${context.industry}, ge konkreta bevis eller datapunkter som visar att problemet de löser verkligen existerar. Inkludera statistik, studier eller trender som är relevanta för ${context.target}.`,
      
      'market_gap': `Analysera marknadsluckan för ${context.company}. Med tanke på konkurrenter som ${context.competitors}, vad är det specifika gap som ${context.company} fyller på marknaden?`,
      
      'why_now': `Förklara varför timingen är rätt för ${context.company} inom ${context.industry}. Vilka tekniska, marknadsmässiga eller regulatoriska förändringar gör att nu är rätt tid?`,
      
      'unique_solution': `Baserat på att ${context.company} konkurrerar med ${context.competitors}, vad gör deras lösning unik eller svår att kopiera? Fokusera på specifika konkurrensfördelar.`,
      
      'main_risks': `För ett företag som ${context.company} inom ${context.industry}, identifiera de största riskerna och hur de kan hanteras.`
    };
    
    contextualPrompt = questionSpecificPrompts[questionId as keyof typeof questionSpecificPrompts] || 
      `Baserat på informationen om ${context.company}, generera ett relevant svar på frågan: "${questionText}"`;
    
    contextualPrompt += ` Svara på svenska med ett konkret, specifikt svar som är minst 100 ord långt.`;
    
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
            { role: 'system', content: 'Du är en expert på affärsplaner och företagsanalys. Ge ENDAST konkreta, specifika svar direkt utan förklaringar om hur du kom fram till svaret. Svara kort och koncist men informativt. Inga långa utläggningar eller pedagogiska förklaringar.' },
            { role: 'user', content: contextualPrompt }
          ],
          max_tokens: 300,
          temperature: 0.3
        })
      });
      
      const data = await openaiRes.json();
      const suggestion = data.choices?.[0]?.message?.content || '';
      
      return NextResponse.json({ suggestion });
    } catch (error) {
      console.error('Error generating contextual suggestion:', error);
    }
  }
  
  // Fallback till original funktionalitet för följdfrågor
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