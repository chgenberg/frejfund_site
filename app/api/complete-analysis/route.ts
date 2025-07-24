import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

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

    // Final comprehensive analysis
    const finalResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system", 
          content: `You are an expert investment analyst. You have already performed an initial analysis and asked follow-up questions. Now complete your comprehensive investment assessment using all available information.

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
6. INCLUDE specific numbers/metrics relevant to their situation

Example of GOOD personalized insight:
"Based on your SaaS platform for [specific industry mentioned], interview your existing customers at [specific customer types they mentioned] to calculate the exact time savings from [specific process they automate]. If customers save 3 hours/week at €75/hour = €11,700/year value per customer, use this in sales conversations to justify your €2,000 annual fee."

Example of BAD generic insight:
"Quantify customer pain in monetary terms by interviewing customers"

Each insight MUST reference specific details from their answers and be immediately actionable for their exact situation.

Generate a detailed investment report with this exact JSON structure:

{
  "analysis": {
    "overallScore": 75, // Overall investment score 0-100
    "executiveSummary": "string",
    "investmentThesis": "string", 
    "marketOpportunity": "string",
    "customerPain": "string",
    "solution": "string",
    "competitivePosition": "string",
    "teamAssessment": "string",
    "financialAnalysis": "string",
    "riskAssessment": "string",
    "growthStrategy": "string",
    "fundingAnalysis": "string",
    // Category scores 0-100
    "problemSolutionScore": 80,
    "marketScore": 75,
    "competitiveScore": 70,
    "tractionScore": 85,
    "financialScore": 78,
    "teamScore": 88,
    "financialHealthScore": 75,
    "riskScore": 70,
    "pitchScore": 80,
    // Insights arrays (2-3 bullet points each)
    "problemInsights": ["insight1", "insight2"],
    "marketInsights": ["insight1", "insight2"],
    "moatInsights": ["insight1", "insight2"],
    "tractionInsights": ["insight1", "insight2"],
    "financialInsights": ["insight1", "insight2"],
    "teamInsights": ["insight1", "insight2"],
    "healthInsights": ["insight1", "insight2"],
    "riskInsights": ["insight1", "insight2"],
    "pitchInsights": ["insight1", "insight2"],
         // 3-5 actionable insights (MUST generate multiple)
     "actionableInsights": [
       {
         "title": "Action title",
         "impact": "high/medium/low",
         "timeframe": "1-2 weeks", 
         "description": "What to do",
         "implementation": ["step1", "step2", "step3"],
         "expectedResult": "Expected outcome",
         "investorPerspective": "Why investors care"
       },
       {
         "title": "Second action",
         "impact": "high/medium/low",
         "timeframe": "timeframe",
         "description": "description", 
         "implementation": ["step1", "step2", "step3"],
         "expectedResult": "Expected outcome",
         "investorPerspective": "Why investors care"
       },
       {
         "title": "Third action",
         "impact": "high/medium/low",
         "timeframe": "timeframe",
         "description": "description",
         "implementation": ["step1", "step2", "step3"], 
         "expectedResult": "Expected outcome",
         "investorPerspective": "Why investors care"
       }
     ]
  }
}`
        },
        {
          role: "user",
          content: `Initial Analysis Context:\n${context.combinedContent}\n\nInitial Analysis Results:\n${JSON.stringify(context.initialAnalysis, null, 2)}\n\n${followUpContent}`
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });

    const finalAnalysis = JSON.parse(finalResponse.choices[0].message.content || '{}');
    
    // Clean up stored context
    delete globalAny.analysisContext[userEmail];
    
    return NextResponse.json({
      success: true,
      analysis: finalAnalysis,
      userInfo: context.userInfo
    });

  } catch (error) {
    console.error('Complete analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to complete final analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 