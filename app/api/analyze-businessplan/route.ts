import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { aiConfig } from '../_utils/aiConfig';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const body = await req.json();
    const { answers, company, email, bransch, omrade, hasWebsite, isPremium = false } = body;

    const prompt = `Analyze the following business plan for ${company} and generate an investment analysis.

Company information:
${JSON.stringify(answers, null, 2)}

Return a JSON object with the following structure:
{
  "score": [0-100],
  "categories": {
    "problemSolution": {
      "score": [0-100],
      "label": "Problem–Solution Fit",
      "description": "Problem urgency & uniqueness of value proposition",
      "metrics": {
        "gapIndex": { "value": [0-10], "type": "number" },
        "problemCriticality": { "value": [0-10], "type": "number" }
      },
      "insights": ["3-5 concrete insights"]
    },
    "marketTiming": {
      "score": [0-100],
      "label": "Market & Timing",
      "description": "TAM validity, trends, Why now",
      "metrics": {
        "tamConfidence": { "value": [0-100], "type": "percentage" },
        "marketGrowth": { "value": [0-100], "type": "percentage" }
      },
      "insights": ["3-5 concrete insights"]
    },
    "moatCompetition": {
      "score": [0-100],
      "label": "Moat & Competition",
      "description": "Differentiation, defensibility, threats",
      "metrics": {
        "defensibilityScore": { "value": [0-10], "type": "number" },
        "competitiveThreat": { "value": [0-10], "type": "number" }
      },
      "insights": ["3-5 concrete insights"]
    },
    "tractionKpi": {
      "score": [0-100],
      "label": "Traction & KPIs",
      "description": "MRR/DAU growth & benchmarks",
      "metrics": {
        "growthQuality": { "value": [0-10], "type": "number" },
        "mrr": { "value": ${answers.mrr_arr?.mrr || 0}, "type": "currency" },
        "growthRate": { "value": ${answers.mrr_arr?.growth || 0}, "type": "percentage" }
      },
      "insights": ["3-5 concrete insights"]
    },
    "unitEconomics": {
      "score": [0-100],
      "label": "Unit Economics",
      "description": "CAC vs LTV, break-even forecast",
      "metrics": {
        "paybackMonths": { "value": ${answers.unit_economics?.payback || 0}, "type": "number" },
        "ltvCacRatio": { "value": ${(answers.unit_economics?.ltv || 0) / (answers.unit_economics?.cac || 1)}, "type": "number" },
        "grossMargin": { "value": ${answers.unit_economics?.gross_margin || 0}, "type": "percentage" }
      },
      "insights": ["3-5 concrete insights"]
    },
    "teamExecution": {
      "score": [0-100],
      "label": "Team & Execution",
      "description": "Founder-market fit, coachability",
      "metrics": {
        "teamStrength": { "value": [0-10], "type": "number" },
        "executionSpeed": { "value": [0-10], "type": "number" }
      },
      "insights": ["3-5 concrete insights"]
    },
    "financialHealth": {
      "score": [0-100],
      "label": "Financial Health",
      "description": "Burn, runway, funding plan",
      "metrics": {
        "cashRisk": { "value": [0-10], "type": "number" },
        "runwayMonths": { "value": ${answers.runway || 0}, "type": "number" },
        "burnRate": { "value": ${answers.burn_rate || 0}, "type": "currency" }
      },
      "insights": ["3-5 concrete insights"]
    },
    "riskCompliance": {
      "score": [0-100],
      "label": "Risk & Compliance",
      "description": "Red/Yellow/Green flags",
      "metrics": {
        "riskLevel": { "value": [0-10], "type": "number" },
        "complianceStatus": { "value": [0-10], "type": "number" }
      },
      "insights": ["3-5 concrete insights"]
    },
    "storytellingDeck": {
      "score": [0-100],
      "label": "Storytelling & Deck Quality",
      "description": "Captivate-Validate-Motivate score",
      "metrics": {
        "pitchClarity": { "value": [0-10], "type": "number" },
        "narrativeStrength": { "value": [0-10], "type": "number" }
      },
      "insights": ["3-5 concrete insights"]
    }
  },
  "feedback": { "[field_name]": "specific feedback for this field" },
  ${isPremium ? `"premiumAnalysis": { "swot": { "strengths": ["5"], "weaknesses": ["5"], "opportunities": ["5"], "threats": ["5"] } } ,` : ''}
  "actionItems": [ { "priority": "high/medium/low", "title": "action", "description": "desc", "timeframe": "timeline", "impact": "expected impact" } ]
}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: aiConfig.models.general,
      temperature: aiConfig.temperature.default,
      max_tokens: aiConfig.maxTokens,
      response_format: { type: 'json_object' }
    });

    const analysis = completion.choices[0].message.content;
    if (!analysis) throw new Error('No analysis generated');

    const parsedAnalysis = JSON.parse(analysis);

    const result = {
      score: parsedAnalysis.score || 75,
      answers: {
        ...answers,
        company_name: company,
        email: email,
        bransch: bransch,
        omrade: omrade,
        hasWebsite: hasWebsite,
        premiumAnalysis: isPremium ? parsedAnalysis.premiumAnalysis : undefined
      },
      feedback: parsedAnalysis.feedback || {},
      insights: parsedAnalysis.insights || [],
      actionItems: parsedAnalysis.actionItems || [],
      subscriptionLevel: isPremium ? 'premium' : 'standard'
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error analyzing business plan:', error);
    return NextResponse.json({ error: 'Failed to analyze business plan', message: 'An error occurred while analyzing your business plan. Please try again.' }, { status: 500 });
  }
} 