import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  if (!message) {
    return NextResponse.json({ error: 'No message provided' }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API key is not configured' }, { status: 500 });
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-1106-preview',
        messages: [
          { 
            role: 'system', 
            content: `You are FrejFund's AI assistant and expert on startup investments. You help entrepreneurs and investors with questions about:
            
1. The FrejFund platform:
   - We offer AI-driven business analysis that matches startups with the right investors
   - The analysis takes 10-15 minutes and provides an investment score 0-100
   - Free basic analysis, premium analysis for 197 SEK with deeper insights
   - We analyze: business model, market, team, financing, traction, competition
   
2. Startup advisory:
   - How to prepare for investments
   - What investors look for
   - Pitch deck tips
   - Valuation advice
   - Due diligence preparations
   
3. Investment landscape:
   - Swedish and Nordic investors
   - Different types of financing (seed, Series A, etc.)
   - Industry-specific insights
   
4. Our approach:
   - We believe in data-driven decision making
   - Transparency and honesty are key
   - Both entrepreneurs and investors benefit from better matching
   - We want to democratize access to capital

Always respond:
- Friendly and professionally in English
- Concrete and actionable
- With examples when relevant
- Encouraging but realistic
- Based on best practices in venture capital

If someone asks about specific investors or wants contact information, refer them to complete the analysis first to get personalized recommendations.` 
          },
          { role: 'user', content: message },
        ],
        max_tokens: 600,
        temperature: 0.7,
        response_format: { type: "text" }
      }),
    });

    if (!openaiRes.ok) {
      const errorData = await openaiRes.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json({ 
        error: 'Failed to get response from AI',
        details: errorData.error?.message || 'Unknown error'
      }, { status: openaiRes.status });
    }

    const data = await openaiRes.json();
    const answer = data.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response right now.';
    return NextResponse.json({ answer });
  } catch (e) {
    console.error('Error in chat:', e);
    return NextResponse.json({ 
      error: 'Failed to process chat message',
      details: e instanceof Error ? e.message : 'Unknown error'
    }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
} 