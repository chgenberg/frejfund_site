import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { section, answers } = await request.json();
    
    // Simulera AI-feedback med realistiskt innehåll
    const feedbackData = {
      'business_idea': `✅ Strong business idea with clear customer value. Good problem formulation and solution approach. 
      
      💡 Suggestion: Further concretize your unique value proposition and quantify the customer benefit.`,
      
      'market_analysis': `📊 Good market understanding with clear TAM/SAM/SOM breakdown. Market trends well identified.
      
      💡 Suggestion: Add concrete sources for market data and include regional analysis.`,
      
      'team': `👥 Strong team with relevant industry expertise and complementary skills. Good balance between technical and business.
      
      💡 Suggestion: Consider strengthening with sales expertise and international experience.`,
      
      'competition': `⚔️ Well-thought competitive analysis with clear differentiation. Good understanding of direct and indirect competitors.
      
      💡 Suggestion: Develop defensive strategies and describe how you will maintain competitive advantage.`,
      
      'funding': `💰 Realistic capital allocation and well-motivated funding needs. Good distribution across different investment areas.
      
      💡 Suggestion: Include scenario analysis and backup plan for different financing alternatives.`
    };

    // Välj feedback baserat på sektion
    const feedback = feedbackData[section as keyof typeof feedbackData] || 
      `Analyzing ${section}... Good content that shows understanding of the area. Continue developing this part with more specific examples and data.`;

    const prompt = `Ge AI-feedback på varje del av affärsplanen. Gör varje feedback ca 30% kortare än tidigare, men se till att meningarna är kompletta och inte slutar mitt i. Svara på svenska. Format: {"budget_forecast": "...", ...}`;

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Error generating AI feedback:', error);
    return NextResponse.json({ error: 'Kunde inte generera feedback' }, { status: 500 });
  }
} 