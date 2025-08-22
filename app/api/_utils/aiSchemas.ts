import { z } from 'zod';

export const actionableInsightSchema = z.object({
  title: z.string(),
  impact: z.union([z.literal('high'), z.literal('medium'), z.literal('low'), z.string()]),
  timeframe: z.string(),
  description: z.string().optional(),
  implementation: z.array(z.string()).optional(),
  expectedResult: z.string().optional(),
  investorPerspective: z.string().optional(),
  evidenceSource: z.string().optional(),
  targetMetric: z.string().optional(),
  _source: z.string().optional()
});

export const initialAnalysisSchema = z.object({
  initialAnalysis: z.object({
    overallScore: z.number().optional(),
    executiveSummary: z.string().optional(),
    investmentThesis: z.string().optional(),
    marketOpportunity: z.string().optional(),
    customerPain: z.string().optional(),
    solution: z.string().optional(),
    competitivePosition: z.string().optional(),
    teamAssessment: z.string().optional(),
    financialAnalysis: z.string().optional(),
    riskAssessment: z.string().optional(),
    growthStrategy: z.string().optional(),
    fundingAnalysis: z.string().optional(),
    problemSolutionScore: z.number().optional(),
    marketScore: z.number().optional(),
    competitiveScore: z.number().optional(),
    tractionScore: z.number().optional(),
    financialScore: z.number().optional(),
    teamScore: z.number().optional(),
    financialHealthScore: z.number().optional(),
    riskScore: z.number().optional(),
    pitchScore: z.number().optional(),
    problemInsights: z.array(z.string()).optional(),
    marketInsights: z.array(z.string()).optional(),
    moatInsights: z.array(z.string()).optional(),
    tractionInsights: z.array(z.string()).optional(),
    financialInsights: z.array(z.string()).optional(),
    teamInsights: z.array(z.string()).optional(),
    healthInsights: z.array(z.string()).optional(),
    riskInsights: z.array(z.string()).optional(),
    pitchInsights: z.array(z.string()).optional(),
    actionableInsights: z.array(actionableInsightSchema).optional()
  }),
  followUpQuestions: z.array(z.string()).optional()
});

export const finalAnalysisSchema = z.object({
  analysis: z.object({
    companyContext: z.array(z.string()).optional(),
    overallScore: z.number().optional(),
    executiveSummary: z.string().optional(),
    investmentThesis: z.string().optional(),
    marketOpportunity: z.string().optional(),
    customerPain: z.string().optional(),
    solution: z.string().optional(),
    competitivePosition: z.string().optional(),
    teamAssessment: z.string().optional(),
    financialAnalysis: z.string().optional(),
    riskAssessment: z.string().optional(),
    growthStrategy: z.string().optional(),
    fundingAnalysis: z.string().optional(),
    problemSolutionScore: z.number().optional(),
    marketScore: z.number().optional(),
    competitiveScore: z.number().optional(),
    tractionScore: z.number().optional(),
    financialScore: z.number().optional(),
    teamScore: z.number().optional(),
    financialHealthScore: z.number().optional(),
    riskScore: z.number().optional(),
    pitchScore: z.number().optional(),
    problemInsights: z.array(z.string()).optional(),
    marketInsights: z.array(z.string()).optional(),
    moatInsights: z.array(z.string()).optional(),
    tractionInsights: z.array(z.string()).optional(),
    financialInsights: z.array(z.string()).optional(),
    teamInsights: z.array(z.string()).optional(),
    healthInsights: z.array(z.string()).optional(),
    riskInsights: z.array(z.string()).optional(),
    pitchInsights: z.array(z.string()).optional(),
    actionableInsights: z.array(actionableInsightSchema).optional(),
    categoryScores: z.object({
      problemSolutionScore: z.number().optional(),
      marketScore: z.number().optional(),
      competitiveScore: z.number().optional(),
      tractionScore: z.number().optional(),
      financialScore: z.number().optional(),
      teamScore: z.number().optional(),
      riskScore: z.number().optional()
    }).optional()
  })
});

export const ultraDeepSchema = z.object({
  insights: z.array(z.object({
    title: z.string(),
    priority: z.union([z.literal('high'), z.literal('medium'), z.literal('low'), z.string()]),
    impact: z.union([z.literal('high'), z.literal('medium'), z.literal('low'), z.string()]),
    timeframe: z.string(),
    expectedResult: z.string().optional(),
    implementation: z.object({
      overview: z.string().optional(),
      steps: z.array(z.string()).optional(),
      tools: z.array(z.string()).optional(),
      metrics: z.array(z.string()).optional(),
      timeline: z.string().optional(),
      budget: z.string().optional(),
      commonPitfalls: z.array(z.string()).optional()
    }).optional(),
    whyThis: z.string().optional(),
    investorImpact: z.string().optional()
  })),
  summary: z.object({
    keyTheme: z.string().optional(),
    expectedTimelineToResults: z.string().optional(),
    totalExpectedImpact: z.string().optional()
  }).optional()
});

export function hasMinInsights(obj: any, path: ('initialAnalysis'|'analysis'|'insights') = 'insights', min = 3): boolean {
  try {
    if (path === 'insights') {
      return Array.isArray(obj?.insights) && obj.insights.length >= min;
    }
    const ai = obj?.[path]?.actionableInsights;
    return Array.isArray(ai) && ai.length >= min;
  } catch {
    return false;
  }
} 