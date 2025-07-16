import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    // Check for API key before instantiating OpenAI client
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const body = await req.json();

    const { answers, company, email, bransch, omrade, hasWebsite, isPremium = false } = body;

    // Strukturera svaren för OpenAI
    const structuredAnswers = JSON.stringify(answers, null, 2);

    const prompt = `Analysera följande affärsplan för ${company} och generera en investeringsanalys.

Företagsinfo:
${JSON.stringify(answers, null, 2)}

Generera ett JSON-objekt med följande struktur:
{
  "score": [0-100],
  "categories": {
    "problemSolution": {
      "score": [0-100],
      "label": "Problem–Lösning Fit",
      "description": "Poäng för problemets akuthet & USP-styrka",
      "metrics": {
        "gapIndex": { "value": [0-10], "type": "number" },
        "problemCriticality": { "value": [0-10], "type": "number" }
      },
      "insights": ["3-5 konkreta insikter"]
    },
    "marketTiming": {
      "score": [0-100],
      "label": "Marknad & Timing",
      "description": "TAM-validitet, trender, Why now",
      "metrics": {
        "tamConfidence": { "value": [0-100], "type": "percentage" },
        "marketGrowth": { "value": [0-100], "type": "percentage" }
      },
      "insights": ["3-5 konkreta insikter"]
    },
    "moatCompetition": {
      "score": [0-100],
      "label": "Moat & Konkurrens",
      "description": "Unikhet, skydd, hot",
      "metrics": {
        "defensibilityScore": { "value": [0-10], "type": "number" },
        "competitiveThreat": { "value": [0-10], "type": "number" }
      },
      "insights": ["3-5 konkreta insikter"]
    },
    "tractionKpi": {
      "score": [0-100],
      "label": "Traction & KPI-progress",
      "description": "MRR/DAU tillväxt & benchmarks",
      "metrics": {
        "growthQuality": { "value": [0-10], "type": "number" },
        "mrr": { "value": ${answers.mrr_arr?.mrr || 0}, "type": "currency" },
        "growthRate": { "value": ${answers.mrr_arr?.growth || 0}, "type": "percentage" }
      },
      "insights": ["3-5 konkreta insikter"]
    },
    "unitEconomics": {
      "score": [0-100],
      "label": "Unit Economics",
      "description": "CAC vs LTV, break-even-prognos",
      "metrics": {
        "paybackMonths": { "value": ${answers.unit_economics?.payback || 0}, "type": "number" },
        "ltvCacRatio": { "value": ${(answers.unit_economics?.ltv || 0) / (answers.unit_economics?.cac || 1)}, "type": "number" },
        "grossMargin": { "value": ${answers.unit_economics?.gross_margin || 0}, "type": "percentage" }
      },
      "insights": ["3-5 konkreta insikter"]
    },
    "teamExecution": {
      "score": [0-100],
      "label": "Team & Execution",
      "description": "Founder-market-fit, coachability",
      "metrics": {
        "teamStrength": { "value": [0-10], "type": "number" },
        "executionSpeed": { "value": [0-10], "type": "number" }
      },
      "insights": ["3-5 konkreta insikter"]
    },
    "financialHealth": {
      "score": [0-100],
      "label": "Finansiell Hälsa",
      "description": "Burn, runway, finansplan",
      "metrics": {
        "cashRisk": { "value": [0-10], "type": "number" },
        "runwayMonths": { "value": ${answers.runway || 0}, "type": "number" },
        "burnRate": { "value": ${answers.burn_rate || 0}, "type": "currency" }
      },
      "insights": ["3-5 konkreta insikter"]
    },
    "riskCompliance": {
      "score": [0-100],
      "label": "Risk & Compliance",
      "description": "Röd-gul-grön-flags",
      "metrics": {
        "riskLevel": { "value": [0-10], "type": "number" },
        "complianceStatus": { "value": [0-10], "type": "number" }
      },
      "insights": ["3-5 konkreta insikter"]
    },
    "storytellingDeck": {
      "score": [0-100],
      "label": "Storytelling & Deck-kvalitet",
      "description": "Captivate-Validate-Motivate-poäng",
      "metrics": {
        "pitchClarity": { "value": [0-10], "type": "number" },
        "narrativeStrength": { "value": [0-10], "type": "number" }
      },
      "insights": ["3-5 konkreta insikter"]
    }
  },
  "feedback": {
    "[field_name]": "specifik feedback för detta fält"
  },
  ${isPremium ? `"premiumAnalysis": {
    "swot": {
      "strengths": ["5 styrkor"],
      "weaknesses": ["5 svagheter"],
      "opportunities": ["5 möjligheter"],
      "threats": ["5 hot"]
    },
    "financialProjections": {
      "year1": { "revenue": 0, "costs": 0, "ebitda": 0, "customers": 0 },
      "year2": { "revenue": 0, "costs": 0, "ebitda": 0, "customers": 0 },
      "year3": { "revenue": 0, "costs": 0, "ebitda": 0, "customers": 0 }
    },
    "detailedRecommendations": {
      "immediate": [
        {
          "action": "vad som ska göras",
          "why": "varför det är viktigt",
          "how": "hur det ska göras",
          "impact": "förväntad effekt",
          "resources": "resurser som behövs",
          "timeline": "tidsram"
        }
      ],
      "shortTerm": [liknande struktur]
    },
    "benchmarkAnalysis": {
      "industryComparison": {
        "grossMargin": { "us": "X%", "industry": "Y%", "verdict": "text" },
        "cacPayback": { "us": "X months", "industry": "Y months", "verdict": "text" },
        "growthRate": { "us": "X%", "industry": "Y%", "verdict": "text" },
        "churnRate": { "us": "X%", "industry": "Y%", "verdict": "text" }
      },
      "peerComparison": [
        { "company": "namn", "funding": "$X", "revenue": "$Y ARR", "valuation": "$Z" }
      ]
    },
    "investmentProposal": {
      "askAmount": "X MSEK",
      "valuation": "Y MSEK pre-money",
      "useOfFunds": {
        "productDevelopment": "X%",
        "salesMarketing": "Y%",
        "teamExpansion": "Z%",
        "other": "W%"
      },
      "keyMetrics": {
        "currentMRR": "X SEK",
        "targetMRR12Months": "Y SEK",
        "currentCustomers": 0,
        "targetCustomers12Months": 0,
        "burnRate": "X SEK/månad",
        "monthsRunway": 0
      },
      "investorBenefits": ["5 fördelar för investerare"]
    },
    "investorFilm": {
      "whyStatement": "företagets WHY",
      "emotionalHook": "emotionell krok",
      "targetEmotion": "målgruppens känsla",
      "soraPrompt": "detaljerad SORA AI prompt för 30 sek film",
      "scriptStructure": [
        {
          "timeframe": "0-5 sek",
          "duration": "5 sek",
          "content": "vad som händer",
          "emotion": "känsla"
        }
      ],
      "productionTips": {
        "visual": ["5 visuella tips"],
        "audio": ["5 ljudtips"]
      },
      "storyboard": [
        { "shot": "beskrivning", "icon": "emoji", "duration": "X sek" }
      ]
    },
    "marketInsights": {
      "marketSize": {
        "current": "X miljarder SEK",
        "growth": "+Y% årligen",
        "projected": "Z miljarder SEK",
        "source": "källa"
      },
      "keyTrends": [
        {
          "icon": "emoji",
          "name": "trendnamn",
          "description": "beskrivning",
          "impact": "Hög/Medium/Låg",
          "timeframe": "1-2 år"
        }
      ],
      "regulatory": [
        {
          "name": "regulering",
          "description": "beskrivning",
          "impact": "Positive/Neutral/Negative"
        }
      ],
      "customerBehavior": ["4 kundbeteenden"],
      "decisionMakers": [
        {
          "role": "roll",
          "priority": "vad de prioriterar"
        }
      ],
      "competitiveLandscape": {
        "leaders": [
          { "name": "företag", "share": "X%" }
        ],
        "ourAdvantage": "vår konkurrensfördel"
      }
    },
    "aiImagePrompts": {
      "prompts": [
        {
          "title": "Förtroende & Partnerskap",
          "icon": "🤝",
          "usage": "LinkedIn, hemsida",
          "emotion": "trust",
          "keywords": ["förtroende", "partnerskap"],
          "prompt": "detaljerad bildprompt anpassad för företaget"
        }
        // ... 9 fler prompts
      ]
    }
  },` : ''}
  "actionItems": [
    {
      "priority": "high/medium/low",
      "title": "åtgärd",
      "description": "beskrivning",
      "timeframe": "tidsram",
      "impact": "förväntad effekt"
    }
  ]
}

Var mycket specifik och anpassa alla rekommendationer till ${company} och deras situation. Basera poängen på verklig investeringspotential.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 8000,
      response_format: { type: "json_object" }
    });

    const analysis = completion.choices[0].message.content;
    
    if (!analysis) {
      throw new Error('No analysis generated');
    }

    const parsedAnalysis = JSON.parse(analysis);
    
    // Formatera resultatet för frontend
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
    return NextResponse.json({
      error: 'Failed to analyze business plan',
      message: 'An error occurred while analyzing your business plan. Please try again.'
    }, { status: 500 });
  }
} 