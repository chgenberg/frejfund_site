import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key is not configured' },
      { status: 500 }
    );
  }

  try {
    const { answers, applicationType } = await req.json();

    // Skapa en strukturerad prompt för OpenAI
    const prompt = `Du är en expert på att analysera affärsplaner. Här är informationen från en affärsplan:

Företagsnamn: ${answers.company_name}

Affärsidé:
${Object.entries(answers.business_idea || {}).map(([key, value]) => `${key}: ${value}`).join('\n')}

Kundsegment:
${Object.entries(answers.customer_segments || {}).map(([key, value]) => `${key}: ${value}`).join('\n')}

Problem & Lösning:
${Object.entries(answers.problem_solution || {}).map(([key, value]) => `${key}: ${value}`).join('\n')}

Marknadsanalys:
${Object.entries(answers.market_analysis || {}).map(([key, value]) => `${key}: ${value}`).join('\n')}

Affärsmodell:
${Object.entries(answers.business_model || {}).map(([key, value]) => `${key}: ${value}`).join('\n')}

Team:
${Object.entries(answers.team || {}).map(([key, value]) => `${key}: ${value}`).join('\n')}

Finansiering:
${Object.entries(answers.funding_details || {}).map(([key, value]) => `${key}: ${value}`).join('\n')}

Ge en detaljerad analys av affärsplanen med följande struktur:
1. Sammanfattning (max 200 ord)
2. Styrkor (3-5 punkter)
3. Svagheter (3-5 punkter)
4. Förbättringsområden (3-5 konkreta förslag)
5. Investeringspotential (1-5, där 5 är högst, med motivering)
6. Rekommendationer för ${applicationType === 'almi' ? 'Almi' : 'investerare'} (3-5 konkreta förslag)
7. Helhetsbetyg (1-100) med motivering

Betygsätt följande områden (1-100) och beräkna ett genomsnitt:
- Affärsidé och unik säljpunkt
- Marknadsanalys och kundsegment
- Affärsmodell och intäktsströmmar
- Team och kompetens
- Finansiering och resursplan
- Risker och hantering

Svara på svenska och formatera svaret som ett JSON-objekt med följande nycklar: 
summary, strengths, weaknesses, improvements, investment_potential, recommendations, total_score, score_breakdown, score_explanation.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-1106-preview',
        messages: [
          { role: 'system', content: 'Du är en expert på affärsplaner och investeringsanalys. Svara ENDAST med JSON-objektet som efterfrågas, utan någon annan text eller förklaringar.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: 'Failed to analyze business plan' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    try {
      // Ta bort eventuella markdown-markeringar eller extra text
      let cleanedContent = content;
      
      // Om innehållet börjar med "Betyg" eller annan text, försök hitta JSON-delen
      if (!content.trim().startsWith('{')) {
        // Leta efter första { och sista }
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}');
        
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          cleanedContent = content.substring(jsonStart, jsonEnd + 1);
        }
      }
      
      // Ta bort eventuella markdown code blocks
      cleanedContent = cleanedContent.replace(/```json\s*/g, '').replace(/```/g, '').trim();
      
      // Försök parsa JSON-svaret
      const analysis = JSON.parse(cleanedContent);
      
      // Säkerställ att alla förväntade fält finns
      const defaultAnalysis = {
        summary: analysis.summary || 'Ingen sammanfattning tillgänglig',
        strengths: analysis.strengths || [],
        weaknesses: analysis.weaknesses || [],
        improvements: analysis.improvements || [],
        investment_potential: analysis.investment_potential || 3,
        recommendations: analysis.recommendations || [],
        total_score: analysis.total_score || 75,
        score_breakdown: analysis.score_breakdown || {},
        score_explanation: analysis.score_explanation || 'Ingen förklaring tillgänglig'
      };
      
      return NextResponse.json(defaultAnalysis);
    } catch (e) {
      console.error('Failed to parse OpenAI response:', e);
      console.error('Raw content:', content);
      
      // Om parsning misslyckas helt, returnera en standardanalys
      return NextResponse.json({
        summary: 'Analysen kunde inte genomföras korrekt.',
        strengths: ['Affärsidén har dokumenterats', 'Team finns på plats'],
        weaknesses: ['Analysen kunde inte slutföras helt'],
        improvements: ['Försök igen eller kontakta support'],
        investment_potential: 3,
        recommendations: ['Se över affärsplanen och försök igen'],
        total_score: 60,
        score_breakdown: {
          'Affärsidé': 60,
          'Marknadsanalys': 60,
          'Team': 60
        },
        score_explanation: 'Standardbetyg på grund av tekniskt fel'
      });
    }
  } catch (error) {
    console.error('Error analyzing business plan:', error);
    return NextResponse.json(
      { error: 'Failed to analyze business plan' },
      { status: 500 }
    );
  }
} 