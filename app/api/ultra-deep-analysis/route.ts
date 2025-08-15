import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ultraDeepSchema } from '../_utils/aiSchemas';
import { aiConfig } from '../_utils/aiConfig';
import { rateLimit, getIp } from '../_utils/rateLimit';

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 requests per minute per IP
    const ip = getIp(request)
    if (!rateLimit(`ultra:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const { deepAnswers, previousAnalysis } = await request.json();

    if (!deepAnswers) {
      return NextResponse.json({ error: 'Deep answers are required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    async function generate() {
      const chatCompletion = await openai.chat.completions.create({
        model: aiConfig.models.ultra,
        messages: [
          { role: 'system', content: `You are a world-class business strategy consultant with 20+ years experience helping startups scale to $100M+ valuations. You specialize in creating ultra-specific, actionable recommendations that directly address each company's unique situation.

CRITICAL REQUIREMENTS FOR ULTRA-DEEP ANALYSIS:

1. **HYPER-PERSONALIZED INSIGHTS**: Every recommendation must reference the user's SPECIFIC situation, numbers, challenges, and context. No generic advice.

2. **IMPLEMENTATION BLUEPRINTS**: Each insight must include:
   - Exact step-by-step implementation (with timelines)
   - Specific tools/software to use
   - Key metrics to track  
   - Expected ROI/results with numbers
   - Common pitfalls and how to avoid them

3. **INDUSTRY-SPECIFIC EXPERTISE**: Tailor advice to their exact business model, customer segments, and competitive landscape.

4. **INVESTOR FOCUS**: Frame everything in terms of what will increase valuation and investment attractiveness.

5. **PRIORITIZATION**: Rank recommendations by impact vs effort, focusing on highest ROI actions first.

6. **CONCRETE EXAMPLES**: Reference specific companies, tools, strategies that have worked in similar situations.

Your response must include:
- 5-7 ultra-specific actionable insights
- Each insight should be 200-300 words with detailed implementation
- Use their exact numbers, customer types, and challenges mentioned
- Include specific timeline and expected results
- Reference their competitor weaknesses and how to exploit them
- Address their specific team gaps and goals

FORMAT: Return a JSON object with this structure:
{ "insights": [ ... ], "summary": { ... } }` },
          { role: 'user', content: `Based on this company's detailed responses, create ultra-specific recommendations:

COMPANY'S DEEP ANSWERS:
${Object.entries(deepAnswers).map(([key, value]) => `${key.replace(/_/g, ' ').toUpperCase()}: ${value}`).join('\n\n')}

${previousAnalysis ? `
PREVIOUS ANALYSIS CONTEXT:
Company: ${previousAnalysis.answers?.company_name || 'Not specified'}
Overall Score: ${previousAnalysis.overallScore || 'Not specified'}
Industry: ${previousAnalysis.answers?.industry || 'Not specified'}
Problem: ${previousAnalysis.answers?.customer_problem || 'Not specified'}
Solution: ${previousAnalysis.answers?.solution || 'Not specified'}
` : ''}

Generate 5-7 ultra-specific, hands-on recommendations that directly address their exact situation, challenges, and goals. Each recommendation should be immediately actionable with concrete implementation steps.` }
        ],
        temperature: aiConfig.temperature.strict,
        max_tokens: aiConfig.maxTokens,
      });

      const response = chatCompletion.choices[0]?.message?.content;
      if (!response) throw new Error('No response from OpenAI');

      let analysisResult;
      try { analysisResult = JSON.parse(response); } 
      catch { analysisResult = { insights: [], summary: {}, rawResponse: response }; }
      return analysisResult;
    }

    let result = await generate();
    try { ultraDeepSchema.parse(result); } catch { result = await generate(); try { ultraDeepSchema.parse(result); } catch {} }

    if (!Array.isArray(result.insights)) result.insights = [];
    while (result.insights.length < 5) { /* push default synthesized insight */ 
      result.insights.push({
        title: 'Establish a focused 90-day growth plan',
        priority: 'high', impact: 'high', timeframe: '90 days',
        expectedResult: 'Measurable revenue and pipeline growth',
        implementation: { overview: 'Define targets, channels, and weekly execution cadence', steps: ['Set 90-day KPIs', 'Pick 2 acquisition channels', 'Create weekly operating rhythm'], tools: ['HubSpot/CRM', 'Analytics'], metrics: ['Leads/week', 'Conversion rates', 'Revenue'], timeline: 'Weeks 1-2 setup; weeks 3-12 execute', budget: 'Variable', commonPitfalls: ['Too many priorities', 'No weekly review'] },
        whyThis: 'Creates execution focus and investor confidence', investorImpact: 'Demonstrates growth discipline'
      });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Ultra-deep analysis error:', error);
    return NextResponse.json({ error: 'Failed to generate ultra-deep analysis' }, { status: 500 });
  }
} 