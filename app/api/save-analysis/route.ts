import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

interface SaveAnalysisRequest {
  companyName?: string;
  industry?: string;
  score?: number;
  answers?: any;
  insights?: any;
  actionItems?: any;
  isPremium?: boolean;
  premiumAnalysis?: any;
  // New fields
  ultraDeepAnalysis?: any;
  insightCount?: number;
  dataQualityScore?: number;
}

export async function POST(request: NextRequest) {
  try {
    const data: SaveAnalysisRequest = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'You must be logged in to save analyses' }, { status: 401 });
    }

    const insertPayload: any = {
      user_id: user.id,
      company_name: data.companyName || 'Unknown',
      industry: data.industry,
      score: data.score,
      answers: data.answers,
      insights: data.insights,
      action_items: data.actionItems,
      is_premium: data.isPremium,
      premium_analysis: data.premiumAnalysis,
      title: `${data.companyName || 'Analysis'} - Business Analysis`,
      description: `Score: ${data.score ?? '-'} / 100`,
    };

    if (data.ultraDeepAnalysis) {
      insertPayload.ultra_deep_analysis = data.ultraDeepAnalysis;
      insertPayload.ultra_deep_created_at = new Date().toISOString();
      if (typeof data.insightCount === 'number') insertPayload.insight_count = data.insightCount;
      if (typeof data.dataQualityScore === 'number') insertPayload.data_quality_score = data.dataQualityScore;
    }

    const { data: analysis, error } = await supabase
      .from('analyses')
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Could not save analysis' }, { status: 500 });
    }

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error('Error saving analysis:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
} 