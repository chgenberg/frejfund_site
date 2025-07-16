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
          content: `Du är en erfaren investerare och affärsanalytiker. Analysera följande affärsplansinformation och generera en detaljerad investeringsanalys.
          
          Returnera ett JSON-objekt med följande struktur:
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
          
          Basera scores på:
          - Problem/Solution fit (hur väl löser de ett verkligt problem)
          - Market timing (är det rätt tid för denna lösning)
          - Moat/Competition (hur försvarbar är positionen)
          - Traction & KPIs (bevis på framgång)
          - Unit Economics (är affärsmodellen hållbar)
          - Team (har teamet rätt kompetens)
          - Financial Health (runway, burn rate)
          - Risk & Compliance (hur väl hanteras risker)
          - Storytelling (kan de sälja sin vision)
          
          Ge konkreta, actionable insights baserat på svaren.`
        },
        {
          role: "user",
          content: `Analysera denna affärsplan:\n\n${JSON.stringify(answers, null, 2)}`
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