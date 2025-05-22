import { NextRequest, NextResponse } from 'next/server';
import { scrapeAndAnalyze } from '../../../scripts/scrapeWithPlaywrightAndOpenAI';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'URL saknas' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return NextResponse.json({ 
        error: 'AI service is not configured properly',
        details: 'Please contact support'
      }, { status: 500 });
    }

    console.log('Startar scraping av:', url);
    try {
      const result = await scrapeAndAnalyze(url);
      console.log('Scraping klar, resultat:', result);
      return NextResponse.json(result);
    } catch (scrapeError: any) {
      console.error('Fel vid scraping:', scrapeError);
      
      // Kontrollera om felet är relaterat till Puppeteer
      if (scrapeError.message?.includes('puppeteer') || 
          scrapeError.message?.includes('browser') || 
          scrapeError.message?.includes('chrome')) {
        return NextResponse.json({ 
          error: 'Web scraping service is not available',
          details: 'Browser service is not properly configured',
          debug: scrapeError.message
        }, { status: 503 });
      }
      
      // Kontrollera om felet är relaterat till OpenAI
      if (scrapeError.message?.includes('OpenAI') || 
          scrapeError.message?.includes('API')) {
        return NextResponse.json({ 
          error: 'AI service is not available',
          details: 'OpenAI service is not properly configured',
          debug: scrapeError.message
        }, { status: 503 });
      }
      
      throw scrapeError; // Rethrow för att hanteras av den yttre catch-blocket
    }
  } catch (e) {
    console.error('Fel i scrape-website route:', e);
    const errorMessage = e instanceof Error ? e.message : 'Okänt fel';
    
    return NextResponse.json({ 
      error: 'Kunde inte skrapa eller analysera hemsidan',
      details: errorMessage,
      debug: process.env.NODE_ENV === 'development' ? e : undefined
    }, { status: 500 });
  }
} 