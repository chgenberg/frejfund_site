import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { rateLimit, getIp } from '../_utils/rateLimit';

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 requests per minute per IP
    const ip = getIp(request)
    if (!rateLimit(`questions:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const { previousAnalysis } = await request.json();

    if (!previousAnalysis) {
      return NextResponse.json({ error: 'Previous analysis is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `You are an expert business analyst who specializes in conducting deep-dive interviews to gather critical business intelligence. Your job is to analyze existing business information and generate 6-8 highly targeted follow-up questions.

CRITICAL REQUIREMENTS:

1. **ANALYZE GAPS**: Review the existing information and identify what critical details are missing for creating ultra-specific, actionable recommendations.

2. **PERSONALIZED QUESTIONS**: Each question must be tailored to their specific business context, industry, and current situation.

3. **STRATEGIC FOCUS**: Questions should gather information that enables you to provide:
   - Specific implementation strategies
   - Targeted competitive advantages
   - Precise market opportunities
   - Concrete growth tactics
   - Exact operational improvements

4. **BUSINESS-CRITICAL AREAS**: Focus on areas that directly impact:
   - Revenue growth & customer acquisition
   - Operational efficiency & cost reduction
   - Competitive positioning & market strategy
   - Team/capability development
   - Investor appeal & fundability

5. **QUESTION QUALITY**: Each question should:
   - Reference their specific situation
   - Seek quantifiable information when possible
   - Target actionable insights
   - Avoid generic business advice

RESPONSE FORMAT: Return a JSON object with this structure:
{
  "questions": [
    {
      "id": "question_1",
      "title": "Specific question tailored to their business",
      "subtitle": "Why this question is important for their specific situation",
      "placeholder": "Detailed example answer that shows what kind of specificity you're looking for"
    }
  ]
}

EXAMPLES OF GOOD QUESTIONS (tailored to their context):
- "Your [specific industry] customers mentioned [specific problem]. What's the #1 objection they raise during sales calls, and what's your current success rate overcoming it?"
- "Since you're competing with [specific competitor], what's your process for demonstrating ROI to prospects who are currently using [competitor's solution]?"
- "You mentioned [specific revenue/growth metric]. What's the biggest bottleneck preventing you from doubling that in the next 6 months?"

Generate 6-8 questions that will unlock the most valuable insights for creating ultra-specific business recommendations.`;

    const userPrompt = `Based on this company's existing analysis, generate personalized follow-up questions:

EXISTING COMPANY INFORMATION:
Company: ${previousAnalysis.answers?.company_name || 'Not specified'}
Industry: ${previousAnalysis.answers?.industry || 'Not specified'}
Problem: ${previousAnalysis.answers?.customer_problem || 'Not specified'}
Solution: ${previousAnalysis.answers?.solution || 'Not specified'}
Target Market: ${previousAnalysis.answers?.target_market || 'Not specified'}
Business Model: ${previousAnalysis.answers?.revenue_model || 'Not specified'}
Competition: ${previousAnalysis.answers?.competitors || 'Not specified'}
Traction: ${previousAnalysis.answers?.traction || 'Not specified'}
Team: ${previousAnalysis.answers?.team || 'Not specified'}
Overall Score: ${previousAnalysis.overallScore || 'Not specified'}

ACTIONABLE INSIGHTS ALREADY PROVIDED:
${previousAnalysis.actionableInsights ? 
  previousAnalysis.actionableInsights.map((insight: any, index: number) => 
    `${index + 1}. ${insight.title}: ${insight.description}`
  ).join('\n') : 'No previous insights available'}

WEBSITE/DOCUMENT ANALYSIS:
${previousAnalysis.websiteData ? JSON.stringify(previousAnalysis.websiteData) : 'No website data available'}

Generate 6-8 highly specific questions that will help create ultra-personalized recommendations for THIS EXACT company. Focus on areas where you need more detail to provide concrete, hands-on advice.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Try to parse JSON response
    let questionsResult;
    try {
      questionsResult = JSON.parse(response);
    } catch (parseError) {
      console.error('Failed to parse questions JSON:', parseError);
      // Return fallback questions if parsing fails
      questionsResult = {
        questions: [
          {
            id: 'main_challenge',
            title: 'What is your biggest business challenge right now?',
            subtitle: 'The specific obstacle preventing your next level of growth',
            placeholder: 'e.g., "We close only 15% of qualified leads because our demo-to-decision takes 3 months"'
          },
          {
            id: 'customer_segments',
            title: 'Describe your most profitable customer types',
            subtitle: 'Include company size, industry, and what they pay you',
            placeholder: 'e.g., "Mid-size law firms (50-200 employees) pay $2,400/month for compliance automation"'
          },
          {
            id: 'competitor_weakness',
            title: 'What do customers hate about your main competitor?',
            subtitle: 'Specific pain points you hear repeatedly',
            placeholder: 'e.g., "Salesforce is too complex - takes 3 months to set up and costs 2x our price"'
          },
          {
            id: 'sales_process',
            title: 'Walk me through your current sales process',
            subtitle: 'From first contact to signed contract',
            placeholder: 'e.g., "1) Inbound lead, 2) Discovery call, 3) Demo, 4) Proposal, 5) Decision"'
          },
          {
            id: 'six_month_goal',
            title: 'What specific goal do you want to achieve in 6 months?',
            subtitle: 'Something measurable that would significantly impact your business',
            placeholder: 'e.g., "Increase MRR from $45K to $120K by closing 3 enterprise deals"'
          },
          {
            id: 'team_gap',
            title: 'What is your team\'s biggest capability gap?',
            subtitle: 'What expertise do you need but don\'t have?',
            placeholder: 'e.g., "We need a VP Sales with 10+ years SaaS experience"'
          }
        ]
      };
    }

    return NextResponse.json(questionsResult);

  } catch (error) {
    console.error('Generate deep questions error:', error);
    return NextResponse.json(
      { error: 'Failed to generate personalized questions' },
      { status: 500 }
    );
  }
} 