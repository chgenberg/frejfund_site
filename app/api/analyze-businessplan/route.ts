import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { answers, applicationType } = await req.json();

  const apiKey = process.env.OPENAI_API_KEY;

  // Compose a detailed prompt
  const prompt = `