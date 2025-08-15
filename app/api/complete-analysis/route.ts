import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { finalAnalysisSchema, hasMinInsights } from '../_utils/aiSchemas';
import { aiConfig } from '../_utils/aiConfig';

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const { followUpAnswers, userEmail } = await request.json();
    
    // Retrieve stored context
    const globalAny = global as any;
    const context = globalAny.analysisContext?.[userEmail];
    
    if (!context) {
      return NextResponse.json({ error: 'Analysis context not found' }, { status: 404 });
    }

    // Prepare follow-up content
    let followUpContent = `Additional information provided:\n\n`;
    Object.entries(followUpAnswers).forEach(([key, answer]) => {
      const questionIndex = parseInt(key.slice(1));
      const question = context.followUpQuestions?.[questionIndex] || `Question ${questionIndex + 1}`;
      followUpContent += `Q: ${question}\n`;
      followUpContent += `A: ${answer}\n\n`;
    });

    async function generate(prompt: string, strict = false) {
      const res = await openai.chat.completions.create({
        model: aiConfig.models.final,
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: `Initial Analysis Context:\n${context.combinedContent}\n\nInitial Analysis Results:\n${JSON.stringify(context.initialAnalysis, null, 2)}\n\n${followUpContent}` }
        ],
        temperature: strict ? aiConfig.temperature.strict : aiConfig.temperature.final,
        max_tokens: aiConfig.maxTokens,
        response_format: { type: 'json_object' }
      });
      return JSON.parse(res.choices[0].message.content || '{}');
    }

    const basePrompt = `You are an expert investment analyst. You have already performed an initial analysis and asked follow-up questions. Now complete your comprehensive investment assessment using all available information.

CRITICAL REQUIREMENT FOR PERSONALIZED ACTIONABLE INSIGHTS:
You MUST generate 3-5 SPECIFIC, TAILORED actionable insights based on THIS EXACT COMPANY'S situation. 

FORBIDDEN - DO NOT use generic advice like:
- "Quantify customer pain in monetary terms"
- "Build strategic partnerships early" 
- "Strengthen your competitive moat"
- "Implement data-driven growth tracking"

REQUIRED - Generate insights that are:
1. SPECIFIC to their industry/business model mentioned
2. REFERENCE their actual target customers described
3. USE their specific challenges/opportunities identified  
4. MENTION their actual product/service details
5. TAILORED to their current stage and context
6. INCLUDE specific numbers/metrics relevant to their situation`;

    let finalAnalysis = await generate(basePrompt);

    let valid = false;
    try {
      finalAnalysisSchema.parse(finalAnalysis);
      valid = hasMinInsights(finalAnalysis, 'analysis', 3);
    } catch {}

    if (!valid) {
      const strict = basePrompt + `\n\nSTRICT MODE: If some details are missing, make reasonable assumptions and STILL provide 3-5 concrete, immediately actionable recommendations with steps, tools, metrics and expected outcomes.`;
      finalAnalysis = await generate(strict, true);
      try {
        finalAnalysisSchema.parse(finalAnalysis);
        valid = hasMinInsights(finalAnalysis, 'analysis', 3);
      } catch {}
    }

    if (!valid) {
      // Last resort patching
      finalAnalysis.analysis = finalAnalysis.analysis || {};
      finalAnalysis.analysis.actionableInsights = finalAnalysis.analysis.actionableInsights || [];
      while (finalAnalysis.analysis.actionableInsights.length < 3) {
        finalAnalysis.analysis.actionableInsights.push({
          title: 'Define and measure key unit economics',
          impact: 'high',
          timeframe: '1-2 weeks',
          description: 'Establish clear CAC/LTV, gross margin and payback calculations.',
          implementation: ['Instrument analytics', 'Define formulae', 'Validate with sample cohorts'],
          expectedResult: 'Investor-grade clarity on business model performance',
          investorPerspective: 'Demonstrates operating discipline and scalability'
        });
      }
    }

    // Clean up stored context
    delete globalAny.analysisContext[userEmail];
    
    return NextResponse.json({ success: true, analysis: finalAnalysis, userInfo: context.userInfo });

  } catch (error) {
    console.error('Complete analysis error:', error);
    return NextResponse.json({ error: 'Failed to complete analysis' }, { status: 500 });
  }
} 