import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { section, answers } = await request.json();
    
    // Simulera AI-feedback med realistiskt innehåll
    const feedbackData = {
      'business_idea': `✅ Stark affärsidé med tydligt värde för kunden. Bra problemformulering och lösningsansats. 
      
      💡 Förslag: Konkretisera er unika värdeproposition ytterligare och kvantifiera nyttan för kunden.`,
      
      'market_analysis': `📊 Bra marknadsförståelse med tydlig TAM/SAM/SOM-uppdelning. Marknadstrender väl identifierade.
      
      💡 Förslag: Lägg till konkreta källor för marknadsdata och inkludera regional analys.`,
      
      'team': `👥 Starkt team med relevant branschexpertis och komplementära färdigheter. Bra balans mellan teknik och affär.
      
      💡 Förslag: Överväg att förstärka med säljexpertis och internationell erfarenhet.`,
      
      'competition': `⚔️ Välgenomtänkt konkurrentanalys med tydlig differentiering. Bra förståelse för direkta och indirekta konkurrenter.
      
      💡 Förslag: Utveckla defensiva strategier och beskriv hur ni ska behålla konkurrensfördelen.`,
      
      'funding': `💰 Realistisk kapitalallokering och välmotiverat finansieringsbehov. Bra fördelning mellan olika investeringsområden.
      
      💡 Förslag: Inkludera scenario-analys och backup-plan för olika finansieringsalternativ.`
    };

    // Välj feedback baserat på sektion
    const feedback = feedbackData[section as keyof typeof feedbackData] || 
      `Analyserar ${section}... Bra innehåll som visar förståelse för området. Fortsätt utveckla denna del med mer specifika exempel och data.`;

    const prompt = `Ge AI-feedback på varje del av affärsplanen. Gör varje feedback ca 30% kortare än tidigare, men se till att meningarna är kompletta och inte slutar mitt i. Svara på svenska. Format: {"budget_forecast": "...", ...}`;

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Error generating AI feedback:', error);
    return NextResponse.json({ error: 'Kunde inte generera feedback' }, { status: 500 });
  }
} 