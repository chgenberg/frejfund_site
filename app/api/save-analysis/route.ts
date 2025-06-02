import { NextRequest, NextResponse } from 'next/server';

// OBS: Detta är en mockad version. Implementera med Supabase enligt DATABASE_SETUP.md

interface SaveAnalysisRequest {
  userId?: string; // Kommer från Supabase Auth
  companyName: string;
  industry: string;
  score: number;
  answers: any;
  insights: any[];
  actionItems: any[];
  isPremium: boolean;
  premiumAnalysis?: any;
}

export async function POST(request: NextRequest) {
  try {
    const data: SaveAnalysisRequest = await request.json();
    
    // TODO: Implementera med Supabase
    // const { data: analysis, error } = await supabase
    //   .from('analyses')
    //   .insert({
    //     user_id: data.userId,
    //     company_name: data.companyName,
    //     industry: data.industry,
    //     score: data.score,
    //     answers: data.answers,
    //     insights: data.insights,
    //     action_items: data.actionItems,
    //     is_premium: data.isPremium,
    //     premium_analysis: data.premiumAnalysis,
    //     title: `${data.companyName} - Affärsanalys`,
    //     description: `Score: ${data.score}/100`
    //   })
    //   .select()
    //   .single();
    
    // Mockad respons
    const mockAnalysis = {
      id: 'mock-' + Date.now(),
      created_at: new Date().toISOString(),
      ...data
    };
    
    return NextResponse.json({ 
      success: true, 
      analysis: mockAnalysis,
      message: 'Analys sparad! (OBS: Detta är en demo. Implementera databas enligt DATABASE_SETUP.md)'
    });
    
  } catch (error) {
    console.error('Error saving analysis:', error);
    return NextResponse.json(
      { error: 'Failed to save analysis' },
      { status: 500 }
    );
  }
} 