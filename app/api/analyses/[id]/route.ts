import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { prisma } from '../../../../lib/prisma'
import { analysisUpdateSchema } from '../../_utils/analysesSchemas'

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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const supabase = createRouteHandlerClient({ cookies })
		const { data: { user } } = await supabase.auth.getUser()
		if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

		const existing = await prisma.analysis.findFirst({ where: { id: params.id, userId: user.id } })
		if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

		const bodyRaw = await request.json()
		const parsed = analysisUpdateSchema.safeParse(bodyRaw)
		if (!parsed.success) {
			return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
		}
		const data = parsed.data

		const updated = await prisma.analysis.update({
			where: { id: params.id },
			data: {
				companyName: data.companyName ?? existing.companyName,
				industry: data.industry ?? existing.industry,
				score: data.score ?? existing.score,
				answers: data.answers ?? existing.answers,
				insights: data.insights ?? existing.insights,
				actionItems: data.actionItems ?? existing.actionItems,
				isPremium: data.isPremium ?? existing.isPremium,
				premiumAnalysis: data.premiumAnalysis ?? existing.premiumAnalysis,
				title: data.title ?? existing.title,
				description: data.description ?? existing.description,
				ultraDeepAnalysis: data.ultraDeepAnalysis ?? existing.ultraDeepAnalysis,
				ultraDeepCreatedAt: data.ultraDeepAnalysis ? new Date() : existing.ultraDeepCreatedAt,
				insightCount: data.insightCount ?? existing.insightCount,
				dataQualityScore: data.dataQualityScore ?? existing.dataQualityScore,
			},
		})
		return NextResponse.json({ analysis: mapAnalysis(updated) })
	} catch (err) {
		console.error('PUT /api/analyses/[id] failed', err)
		return NextResponse.json({ error: 'Failed to update analysis' }, { status: 500 })
	}
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const supabase = createRouteHandlerClient({ cookies })
		const { data: { user } } = await supabase.auth.getUser()
		if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

		// Ensure the analysis belongs to the user
		const existing = await prisma.analysis.findFirst({ where: { id: params.id, userId: user.id } })
		if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

		await prisma.analysis.delete({ where: { id: params.id } })
		return NextResponse.json({ success: true })
	} catch (err) {
		console.error('DELETE /api/analyses/[id] failed', err)
		return NextResponse.json({ error: 'Failed to delete analysis' }, { status: 500 })
	}
} 