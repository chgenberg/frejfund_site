import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { aiConfig } from '../_utils/aiConfig';

export async function GET() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        status: 'error',
        message: 'OPENAI_API_KEY not configured',
        keyPresent: false
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    // Test basic API access
    const testResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Use cheapest model for testing
      messages: [{ role: 'user', content: 'Say "API key works" in JSON format' }],
      max_tokens: 50,
      response_format: { type: "json_object" }
    });

    // Test configured models
    const modelTests = [];
    for (const [key, model] of Object.entries(aiConfig.models)) {
      try {
        await openai.chat.completions.create({
          model: model,
          messages: [{ role: 'user', content: 'Test' }],
          max_tokens: 10,
          ...(model.startsWith('gpt-5') ? {} : { temperature: 0.5 })
        });
        modelTests.push({ role: key, model, status: 'available' });
      } catch (error: any) {
        modelTests.push({ 
          role: key, 
          model, 
          status: 'unavailable', 
          error: error.message?.substring(0, 100) 
        });
      }
    }

    return NextResponse.json({
      status: 'success',
      message: 'API key working',
      keyPresent: true,
      basicTest: JSON.parse(testResponse.choices[0].message.content || '{}'),
      modelAvailability: modelTests,
      config: {
        maxTokens: aiConfig.maxTokens,
        models: aiConfig.models
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message || 'API key test failed',
      keyPresent: !!process.env.OPENAI_API_KEY,
      error: error.status || 'unknown'
    }, { status: 500 });
  }
} 