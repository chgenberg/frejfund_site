import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { prisma } from '../../../lib/prisma'
import { analysisCreateSchema } from '../_utils/analysesSchemas'

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

function computeDataQualityScore(answers: any): number {
	try {
		if (!answers || typeof answers !== 'object') return 10
		const keys = Object.keys(answers)
		const nonEmpty = keys.filter(k => {
			const v = (answers as any)[k]
			if (v == null) return false
			if (typeof v === 'string') return v.trim().length > 0
			if (Array.isArray(v)) return v.length > 0
			if (typeof v === 'object') return Object.keys(v).length > 0
			return true
		}).length
		const richness = Math.min(100, Math.round((nonEmpty / Math.max(1, keys.length)) * 60))
		const bonus = ['business_model','monthlyRevenue','teamSize','market_size','market_size_estimate'].reduce((acc, k) => acc + (answers[k] ? 8 : 0), 0)
		return Math.max(10, Math.min(100, richness + bonus))
	} catch { return 20 }
}

export async function GET(_request: NextRequest) {
	try {
		const supabase = createRouteHandlerClient({ cookies })
		const { data: { user } } = await supabase.auth.getUser()
		if (!user) return NextResponse.json({ analyses: [] })

		const items = await prisma.analysis.findMany({
			where: { userId: user.id },
			orderBy: { createdAt: 'desc' },
		})
		return NextResponse.json({ analyses: items.map(mapAnalysis) })
	} catch (err) {
		console.error('GET /api/analyses failed', err)
		return NextResponse.json({ error: 'Failed to fetch analyses' }, { status: 500 })
	}
}

export async function POST(request: NextRequest) {
	try {
		const supabase = createRouteHandlerClient({ cookies })
		const { data: { user } } = await supabase.auth.getUser()
		if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

		const bodyRaw = await request.json()
		const parsed = analysisCreateSchema.safeParse(bodyRaw)
		if (!parsed.success) {
			return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
		}
		const body = parsed.data
		const dataQuality = body.dataQualityScore ?? computeDataQualityScore(body.answers)

		const created = await prisma.analysis.create({
			data: {
				userId: user.id,
				companyName: body.companyName,
				industry: body.industry ?? null,
				score: body.score,
				answers: body.answers,
				insights: body.insights ?? null,
				actionItems: body.actionItems ?? null,
				isPremium: body.isPremium ?? false,
				premiumAnalysis: body.premiumAnalysis ?? null,
				title: body.title ?? `${body.companyName} - Business Analysis`,
				description: body.description ?? `Score: ${body.score} / 100`,
				ultraDeepAnalysis: body.ultraDeepAnalysis ?? null,
				ultraDeepCreatedAt: body.ultraDeepAnalysis ? new Date() : null,
				insightCount: body.insightCount ?? null,
				dataQualityScore: dataQuality,
			},
		})
		return NextResponse.json({ analysis: mapAnalysis(created) }, { status: 201 })
	} catch (err) {
		console.error('POST /api/analyses failed', err)
		return NextResponse.json({ error: 'Failed to create analysis' }, { status: 500 })
	}
} 