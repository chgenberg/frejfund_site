import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { deepAnswers, previousAnalysis } = await request.json();

    if (!deepAnswers) {
      return NextResponse.json({ error: 'Deep answers are required' }, { status: 400 });
    }

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a world-class business strategy consultant with 20+ years experience helping startups scale to $100M+ valuations. You specialize in creating ultra-specific, actionable recommendations that directly address each company's unique situation.

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
{
  "insights": [
    {
      "title": "Specific action title",
      "priority": "high/medium/low",
      "impact": "high/medium/low", 
      "timeframe": "exact timeline",
      "expectedResult": "specific result with numbers",
      "implementation": {
        "overview": "brief overview",
        "steps": ["step 1", "step 2", ...],
        "tools": ["specific tools needed"],
        "metrics": ["specific metrics to track"],
        "timeline": "detailed timeline",
        "budget": "estimated cost/investment",
        "commonPitfalls": ["pitfall 1", "pitfall 2"]
      },
      "whyThis": "explanation of why this specific action for this specific company",
      "investorImpact": "how this affects valuation/fundability"
    }
  ],
  "summary": {
    "keyTheme": "main theme across all recommendations",
    "expectedTimelineToResults": "when they should see results",
    "totalExpectedImpact": "overall expected business impact"
  }
}`
        },
        {
          role: "user",
          content: `Based on this company's detailed responses, create ultra-specific recommendations:

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

Generate 5-7 ultra-specific, hands-on recommendations that directly address their exact situation, challenges, and goals. Each recommendation should be immediately actionable with concrete implementation steps.`
        }
      ],
      temperature: 0.3,
      max_tokens: 4000,
    });

    const response = chatCompletion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Try to parse JSON response
    let analysisResult;
    try {
      analysisResult = JSON.parse(response);
    } catch (parseError) {
      // If JSON parsing fails, create a structured response
      analysisResult = {
        insights: [
          {
            title: "Comprehensive Analysis Generated",
            priority: "high",
            impact: "high",
            timeframe: "Immediate implementation",
            expectedResult: "Significant business improvement",
            implementation: {
              overview: response.substring(0, 200) + "...",
              steps: ["Review the generated analysis", "Implement step by step"],
              tools: ["Standard business tools"],
              metrics: ["Revenue growth", "Customer acquisition"],
              timeline: "30-90 days",
              budget: "Varies by implementation",
              commonPitfalls: ["Lack of focus", "Poor execution"]
            },
            whyThis: "Based on your specific business context and challenges",
            investorImpact: "Positions company for stronger investment appeal"
          }
        ],
        summary: {
          keyTheme: "Personalized business optimization",
          expectedTimelineToResults: "30-90 days",
          totalExpectedImpact: "Significant improvement in key metrics"
        },
        rawResponse: response
      };
    }

    return NextResponse.json(analysisResult);

  } catch (error) {
    console.error('Ultra-deep analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to generate ultra-deep analysis' },
      { status: 500 }
    );
  }
} 