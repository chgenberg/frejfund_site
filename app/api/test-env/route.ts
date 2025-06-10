import { NextResponse } from 'next/server';

export async function GET() {
  const hasKey = !!process.env.OPENAI_API_KEY;
  const keyLength = process.env.OPENAI_API_KEY?.length || 0;
  
  return NextResponse.json({
    hasKey,
    keyLength,
    message: hasKey ? 'API key is configured' : 'API key is missing'
  });
} 