import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL saknas i förfrågan' },
        { status: 400 }
      );
    }

    console.log('Testar skrapning av:', url);
    const { scrapeAndAnalyze } = await import('../../../scrapeWithPlaywrightAndOpenAI');
    const result = await scrapeAndAnalyze(url);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Fel vid test av skrapning:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Ett fel uppstod vid skrapning',
        details: error.stack
      },
      { status: 500 }
    );
  }
} 