import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    // Check for API key before instantiating OpenAI client
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { answers } = await request.json();
    
    if (!answers) {
      return NextResponse.json({ error: 'Answers are required' }, { status: 400 });
    }

    // Generate analysis using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an experienced investor and business analyst. Analyze the following business plan information and generate a detailed investment analysis.
          
          Return a JSON object with the following structure:
          {
            "overallScore": number (0-100),
            "categories": {
              "problemSolution": { "score": number, "label": string, "description": string, "insights": [string] },
              "marketTiming": { "score": number, "label": string, "description": string, "insights": [string] },
              "moatCompetition": { "score": number, "label": string, "description": string, "insights": [string] },
              "tractionKpi": { "score": number, "label": string, "description": string, "insights": [string] },
              "unitEconomics": { "score": number, "label": string, "description": string, "insights": [string] },
              "teamExecution": { "score": number, "label": string, "description": string, "insights": [string] },
              "financialHealth": { "score": number, "label": string, "description": string, "insights": [string] },
              "riskCompliance": { "score": number, "label": string, "description": string, "insights": [string] },
              "storytellingDeck": { "score": number, "label": string, "description": string, "insights": [string] }
            },
            "actionableInsights": [
              {
                "title": string,
                "impact": "high" | "medium" | "low",
                "timeframe": string,
                "description": string,
                "implementation": [string],
                "expectedResult": string,
                "investorPerspective": string
              }
            ]
          }
          
          Base scores on:
          - Problem/Solution fit (how well do they solve a real problem)
          - Market timing (is it the right time for this solution)
          - Moat/Competition (how defensible is the position)
          - Traction & KPIs (proof of success)
          - Unit Economics (is the business model sustainable)
          - Team (does the team have the right competence)
          - Financial Health (runway, burn rate)
          - Risk & Compliance (how well are risks managed)
          - Storytelling (can they sell their vision)
          
          Provide concrete, actionable insights based on the answers. Write all content in English.`
        },
        {
          role: "user",
          content: `Analyze this business plan:\n\n${JSON.stringify(answers, null, 2)}`
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');
    
    return NextResponse.json({
      success: true,
      analysis: analysis
    });

  } catch (error) {
    console.error('Error generating analysis:', error);
    return NextResponse.json(
      { error: 'Failed to generate analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 