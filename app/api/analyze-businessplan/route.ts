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
    const data = await req.json();
    
    // Helper function to parse JSON safely
    const parseJsonSafely = (value: any, fallback: any = null) => {
      try {
        return value ? JSON.parse(value) : fallback;
      } catch {
        return fallback;
      }
    };
    
    // Parse complex fields
    const milestones = parseJsonSafely(data.milestones, []);
    const capitalBlock = parseJsonSafely(data.capital_block, {});
    const founderFit = parseJsonSafely(data.founder_market_fit, {});
    const esg = parseJsonSafely(data.esg, {});

    // Skapa en strukturerad prompt för OpenAI
    const prompt = `Du är en expert på att analysera affärsplaner för investerare. Analysera följande information:

Företagsnamn: ${data.company_name || 'Ej angivet'}
Bransch: ${data.bransch || 'Ej angivet'}
Område: ${data.omrade || 'Ej angivet'}

AFFÄRSIDÉ & VÄRDE:
${data.company_value || 'Ej angivet'}

PROBLEM & LÖSNING:
Problem: ${data.customer_problem || 'Ej angivet'}
Bevis för problem: ${data.problem_evidence || 'Ej angivet'}
Marknadsgap: ${data.market_gap || 'Ej angivet'}
Lösning: ${data.solution || 'Ej angivet'}
Varför nu: ${data.why_now || 'Ej angivet'}

MARKNAD:
Målgrupp: ${data.target_customer || 'Ej angivet'}
Marknadsstorlek: ${data.market_size || 'Ej angivet'}
Trender: ${data.market_trends || 'Ej angivet'}

TRACTION & AFFÄRSMODELL:
Nuvarande traction: ${data.traction || 'Ej angivet'}
Intäktsmodell: ${data.revenue_block || 'Ej angivet'}
Runway: ${data.runway || 'Ej angivet'} månader

TILLVÄXTPLAN:
${data.growth_plan || 'Ej angivet'}

MILSTOLPAR:
${milestones && milestones.length > 0 ? milestones.map((m: any) => `- ${m.milestone || ''} (${m.date || ''})`).join('\n') : 'Inga milstolpar angivna'}

TEAM:
${data.team || 'Ej angivet'}
Founder-Market Fit: ${founderFit?.score || 'Ej angivet'}/5
${founderFit?.text || ''}
Teamkompetenser: ${data.team_skills || 'Ej angivet'}
Rekryteringsplan: ${data.hiring_plan || 'Ej angivet'}
Styrelse/Rådgivare: ${data.board_advisors || 'Ej angivet'}

KONKURRENS & MOAT:
Konkurrenter: ${data.competitors || 'Ej angivet'}
Unik lösning: ${data.unique_solution || 'Ej angivet'}
IP/Patent: ${data.ip_rights || 'Ej angivet'}

FINANSIERING:
Kapitalbehov: ${capitalBlock?.amount || 'Ej angivet'} MSEK
Användning: 
- Produktutveckling: ${capitalBlock?.product || '0'}%
- Försäljning/Marketing: ${capitalBlock?.sales || '0'}%
- Team: ${capitalBlock?.team || '0'}%
- Övrigt: ${capitalBlock?.other || '0'}%
Sannolikhet för mer kapital: ${capitalBlock?.probability || 'Ej angivet'}/5

EXIT & RISKER:
Exit-strategi: ${data.exit_strategy || 'Ej angivet'}
Huvudrisker: ${data.main_risks || 'Ej angivet'}

ESG:
${esg?.miljö ? '✓ Miljö' : ''} ${esg?.socialt ? '✓ Socialt' : ''} ${esg?.governance ? '✓ Styrning' : ''}
${esg?.text || 'Inga ESG-initiativ beskrivna'}

ÖVRIGT:
${data.anything_else || 'Ingen ytterligare information'}

Ge en detaljerad investeringsanalys med följande struktur:
1. Sammanfattning (max 200 ord)
2. Styrkor (3-5 konkreta punkter)
3. Svagheter (3-5 konkreta punkter)
4. Förbättringsområden (3-5 specifika förslag)
5. Investeringspotential (1-5, där 5 är högst, med detaljerad motivering)
6. Rekommendationer för investerare (3-5 konkreta förslag)
7. Helhetsbetyg (1-100) med motivering

Inkludera också:
- Betygsätt följande områden (1-100):
  * Problem/Lösning fit
  * Marknadspotential
  * Affärsmodell & skalbarhet
  * Team & kompetens
  * Traction & bevis
  * Konkurrensfördel
  * Finansiell plan
  * Exit-potential

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
          { role: 'system', content: 'Du är en erfaren investeringsanalytiker specialiserad på startups. Svara ENDAST med JSON-objektet som efterfrågas, utan någon annan text eller förklaringar.' },
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

    const responseData = await response.json();
    const content = responseData.choices[0].message.content;

    try {
      const analysis = JSON.parse(content);
      
      // Create final response with both analysis and original answers
      const finalResponse = {
        score: analysis.total_score || 75,
        answers: data, // Return all the original answers
        feedback: {
          summary: analysis.summary,
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses,
          improvements: analysis.improvements,
          recommendations: analysis.recommendations,
          score_explanation: analysis.score_explanation
        },
        analysis: analysis
      };
      
      return NextResponse.json(finalResponse);
    } catch (e) {
      console.error('Failed to parse OpenAI response:', e);
      
      // Return a default response if parsing fails
      return NextResponse.json({
        score: 60,
        answers: data,
        feedback: {
          summary: 'Analysen kunde inte genomföras korrekt på grund av ett tekniskt fel.',
          strengths: ['Affärsidén har dokumenterats', 'Grundläggande information finns'],
          weaknesses: ['Analysen kunde inte slutföras'],
          improvements: ['Försök igen eller kontakta support'],
          recommendations: ['Kontrollera all information och försök igen'],
          score_explanation: 'Standardbetyg på grund av tekniskt fel'
        }
      });
    }
  } catch (error) {
    console.error('Error analyzing business plan:', error);
    return NextResponse.json(
      { error: 'Failed to analyze business plan', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 