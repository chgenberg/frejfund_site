import { NextRequest, NextResponse } from 'next/server';
import { scrapeAndAnalyze } from '../../../scripts/scrapeWithPlaywrightAndOpenAI';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'URL saknas' }, { status: 400 });
    }

    console.log('Startar scraping av:', url);
    const result = await scrapeAndAnalyze(url);
    console.log('Scraping klar, resultat:', result);
    
    return NextResponse.json(result);
  } catch (e) {
    console.error('Fel vid scraping:', e);
    return NextResponse.json({ 
      error: 'Kunde inte skrapa eller analysera hemsidan.',
      details: e instanceof Error ? e.message : 'Okänt fel'
    }, { status: 500 });
  }
} 