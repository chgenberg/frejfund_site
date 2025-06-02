import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { answers, company, email, bransch, omrade, hasWebsite } = await req.json();

    const prompt = `Analyze this business plan for ${company} in the ${bransch} industry:

Business Idea & Solution:
${answers.business_idea}

Problem & Solution:
${answers.problem_solution}

Target Market & Customer Segments:
${answers.target_market}
${answers.customer_segments}

Competitors & Market Position:
${answers.competitors}

Revenue Model & Marketing:
${answers.revenue_model}
${answers.marketing_strategy}

Team & Organization:
${answers.team}

Financial Plan & Funding:
${answers.financial_plan}
${answers.funding_needs}

Please provide a detailed analysis focusing on:
1. Market potential and opportunity
2. Competitive advantages and challenges
3. Revenue model viability
4. Team capabilities
5. Financial projections and funding needs
6. Key risks and mitigation strategies
7. Recommendations for improvement

Format the response in clear sections with specific, actionable insights.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
      max_tokens: 2000,
    });

    const analysis = completion.choices[0].message.content;

    if (!analysis || analysis.trim().length < 100) {
      return NextResponse.json({
        error: 'Insufficient analysis generated',
        message: 'The provided information was not detailed enough to generate a meaningful analysis. Please provide more comprehensive answers to the questions.'
      }, { status: 400 });
    }

    return NextResponse.json({ 
      analysis,
      answers,
      company,
      email,
      bransch,
      omrade,
      hasWebsite
    });
  } catch (error) {
    console.error('Error analyzing business plan:', error);
    return NextResponse.json({
      error: 'Failed to analyze business plan',
      message: 'An error occurred while analyzing your business plan. Please try again with more detailed information.'
    }, { status: 500 });
  }
} 