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
      followUpContent += `Q: ${context.followUpQuestions[parseInt(key.slice(1))]}\n`;
      followUpContent += `A: ${answer}\n\n`;
    });

    // Final comprehensive analysis
    const finalResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an expert investment analyst. You have already performed an initial analysis and asked follow-up questions. Now complete your comprehensive investment assessment using all available information.

Generate a detailed investment report including:

1. Investment Recommendation (Strong Buy, Buy, Hold, Pass) with clear rationale
2. Overall Investment Score (0-100)
3. Key Strengths and Opportunities
4. Major Risks and Concerns
5. Detailed Analysis by Category
6. Specific Action Items and Next Steps
7. Comparison to similar successful companies
8. Funding recommendation and valuation estimate

Format as a structured JSON for the results page.`
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