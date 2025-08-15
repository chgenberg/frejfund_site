import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { prisma } from '../../../../lib/prisma'

function mapAnalysis(a: any) {
	return {
		id: a.id,
		user_id: a.userId,
		created_at: a.createdAt,
		updated_at: a.updatedAt,
		company_name: a.companyName,
		industry: a.industry,
		score: a.score,
		answers: a.answers,
		insights: a.insights,
		action_items: a.actionItems,
		is_premium: a.isPremium,
		premium_analysis: a.premiumAnalysis,
		title: a.title,
		description: a.description,
		ultra_deep_analysis: a.ultraDeepAnalysis,
		ultra_deep_created_at: a.ultraDeepCreatedAt,
		insight_count: a.insightCount,
		data_quality_score: a.dataQualityScore,
	}
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const supabase = createRouteHandlerClient({ cookies })
		const { data: { user } } = await supabase.auth.getUser()
		if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

		const item = await prisma.analysis.findFirst({
			where: { id: params.id, userId: user.id },
		})
		if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
		return NextResponse.json({ analysis: mapAnalysis(item) })
	} catch (err) {
		console.error('GET /api/analyses/[id] failed', err)
		return NextResponse.json({ error: 'Failed to fetch analysis' }, { status: 500 })
	}
} 