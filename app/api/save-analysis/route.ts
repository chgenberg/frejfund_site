import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { prisma } from '../../../lib/prisma';

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
    
    // Still use Supabase for auth until full migration
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'You must be logged in to save analyses' }, { status: 401 });
    }

    // Use Prisma for database operations
    const analysis = await prisma.analysis.create({
      data: {
        userId: user.id,
        companyName: data.companyName || 'Unknown',
        industry: data.industry,
        score: data.score || 0,
        answers: data.answers || {},
        insights: data.insights,
        actionItems: data.actionItems,
        isPremium: data.isPremium || false,
        premiumAnalysis: data.premiumAnalysis,
        title: `${data.companyName || 'Analysis'} - Business Analysis`,
        description: `Score: ${data.score ?? '-'} / 100`,
        ultraDeepAnalysis: data.ultraDeepAnalysis,
        ultraDeepCreatedAt: data.ultraDeepAnalysis ? new Date() : null,
        insightCount: data.insightCount,
        dataQualityScore: data.dataQualityScore,
      },
    });

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error('Error saving analysis:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
} 