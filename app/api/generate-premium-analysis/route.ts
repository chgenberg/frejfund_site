import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Hämta den sparade analysen från localStorage (skickas från frontend)
    const { existingAnalysis } = await req.json();
    
    if (!existingAnalysis || !existingAnalysis.answers) {
      return NextResponse.json({
        error: 'No existing analysis found',
        message: 'Please complete the business plan analysis first'
      }, { status: 400 });
    }

    // Återanvänd samma API men med isPremium = true
    const response = await fetch(new URL('/api/analyze-businessplan', req.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: existingAnalysis.answers,
        company: existingAnalysis.answers.company_name,
        email: existingAnalysis.answers.email,
        bransch: existingAnalysis.answers.bransch,
        omrade: existingAnalysis.answers.omrade,
        hasWebsite: existingAnalysis.answers.hasWebsite,
        isPremium: true
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate premium analysis');
    }

    const premiumResult = await response.json();
    
    // Kombinera med existing analysis
    const enhancedResult = {
      ...existingAnalysis,
      ...premiumResult,
      subscriptionLevel: 'premium'
    };

    return NextResponse.json(enhancedResult);
  } catch (error) {
    console.error('Error generating premium analysis:', error);
    return NextResponse.json({
      error: 'Failed to generate premium analysis',
      message: 'An error occurred while generating your premium analysis'
    }, { status: 500 });
  }
} 