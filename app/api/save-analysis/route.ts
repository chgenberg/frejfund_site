import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// OBS: Detta är en mockad version. Implementera med Supabase enligt DATABASE_SETUP.md

interface SaveAnalysisRequest {
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
    
    // Hämta användaren
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Du måste vara inloggad för att spara analyser' },
        { status: 401 }
      );
    }
    
    // Spara analysen
    const { data: analysis, error } = await supabase
      .from('analyses')
      .insert({
        user_id: user.id,
        company_name: data.companyName,
        industry: data.industry,
        score: data.score,
        answers: data.answers,
        insights: data.insights,
        action_items: data.actionItems,
        is_premium: data.isPremium,
        premium_analysis: data.premiumAnalysis,
        title: `${data.companyName} - Affärsanalys`,
        description: `Score: ${data.score}/100`
      })
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Kunde inte spara analysen' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      analysis,
      message: 'Analys sparad! Du kan nu se den i din dashboard.'
    });
    
  } catch (error) {
    console.error('Error saving analysis:', error);
    return NextResponse.json(
      { error: 'Ett fel uppstod vid sparning' },
      { status: 500 }
    );
  }
} 