import { NextRequest, NextResponse } from 'next/server';
import { scrapeAndAnalyze } from '../../../scripts/scrapeWithPlaywrightAndOpenAI';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'URL saknas i förfrågan' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY saknas i miljövariablerna');
      return NextResponse.json({ error: 'OpenAI API-nyckel saknas' }, { status: 500 });
    }

    console.log('Startar skrapning av:', url);
    const result = await scrapeAndAnalyze(url);
    
    // Wrap result in 'data' property for frontend compatibility
    return NextResponse.json({
      success: result.success,
      data: result,
      error: result.error
    });
  } catch (error: any) {
    console.error('Fel vid skrapning:', error);
    
    // Mer specifik felhantering
    if (error.message.includes('OPENAI_API_KEY')) {
      return NextResponse.json({ error: 'OpenAI API-nyckel saknas eller är ogiltig' }, { status: 500 });
    }
    
    if (error.message.includes('Ogiltig URL')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Generellt fel
    return NextResponse.json(
      { 
        error: error.message || 'Ett fel uppstod vid skrapning',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 