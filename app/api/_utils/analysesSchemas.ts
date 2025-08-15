import { z } from 'zod'

export const analysisCreateSchema = z.object({
	companyName: z.string().min(1).default('Unknown'),
	industry: z.string().optional().nullable(),
	score: z.number().int().min(0).max(100).default(0),
	answers: z.any().default({}),
	insights: z.any().optional().nullable(),
	actionItems: z.any().optional().nullable(),
	isPremium: z.boolean().default(false),
	premiumAnalysis: z.any().optional().nullable(),
	title: z.string().optional().nullable(),
	description: z.string().optional().nullable(),
	ultraDeepAnalysis: z.any().optional().nullable(),
	insightCount: z.number().int().min(0).optional().nullable(),
	dataQualityScore: z.number().int().min(0).max(100).optional().nullable(),
})

export const analysisUpdateSchema = analysisCreateSchema.partial()

export type AnalysisCreateInput = z.infer<typeof analysisCreateSchema>
export type AnalysisUpdateInput = z.infer<typeof analysisUpdateSchema> 