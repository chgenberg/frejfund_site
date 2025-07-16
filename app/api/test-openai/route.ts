import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Check for API key before instantiating OpenAI client
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        error: 'OpenAI API key not configured',
        hasKey: false 
      }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Test simple completion
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: "Say hello!" }],
      model: "gpt-3.5-turbo",
    });

    return NextResponse.json({
      success: true,
      message: completion.choices[0].message.content
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error
    }, { status: 500 });
  }
} 