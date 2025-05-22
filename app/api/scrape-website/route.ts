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
    const result = await scrapeAndAnalyze(url);
    console.log('Scraping klar, resultat:', result);
    
    return NextResponse.json(result);
  } catch (e) {
    console.error('Fel vid scraping:', e);
    const errorMessage = e instanceof Error ? e.message : 'Okänt fel';
    
    // Kontrollera om felet är relaterat till Playwright
    if (errorMessage.includes('playwright') || errorMessage.includes('browser')) {
      return NextResponse.json({ 
        error: 'Web scraping service is not available',
        details: 'Please try again later'
      }, { status: 503 });
    }
    
    // Kontrollera om felet är relaterat till OpenAI
    if (errorMessage.includes('OpenAI') || errorMessage.includes('API')) {
      return NextResponse.json({ 
        error: 'AI service is not available',
        details: 'Please try again later'
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      error: 'Kunde inte skrapa eller analysera hemsidan',
      details: errorMessage
    }, { status: 500 });
  }
} 