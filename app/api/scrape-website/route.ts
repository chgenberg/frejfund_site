import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Scrape website content
    const scrapeResponse = await fetch(process.env.SCRAPER_API_URL || 'https://api.scraperapi.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SCRAPER_API_KEY}`
      },
      body: JSON.stringify({
        url,
        render_js: true,
        wait_for_selector: 'body',
        premium: true
      })
    });

    if (!scrapeResponse.ok) {
      // Fallback to simple fetch if scraper fails
      const response = await fetch(url);
      const html = await response.text();
      
      // Extract text content from HTML
      const textContent = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 8000);

      // Use OpenAI to extract business information
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `Du är en expert på att analysera företagshemsidor och extrahera affärsinformation. 
            Analysera texten och extrahera följande information om den finns:
            - Kundens problem/pain som löses
            - Lösningen/produkten
            - Målgrupp och kundsegment
            - Unika fördelar/USP
            - Team och grundare
            - Affärsmodell och prissättning
            - Traction och proof points
            
            Returnera ENDAST ett JSON-objekt med följande struktur:
            {
              "customer_pain": "beskrivning",
              "solution": "beskrivning",
              "elevator_pitch": "max 140 tecken",
              "target_customer": "beskrivning",
              "unique_tech": "beskrivning",
              "team": "beskrivning",
              "revenue_model": "beskrivning",
              "traction": "beskrivning",
              "company_value": "beskrivning"
            }
            
            Om information saknas, använd null för det fältet.`
          },
          {
            role: "user",
            content: `Analysera denna hemsida och extrahera affärsinformation:\n\n${textContent}`
          }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      const extractedData = JSON.parse(completion.choices[0].message.content || '{}');
      
      return NextResponse.json({
        success: true,
        data: extractedData,
        source: 'website_analysis'
      });
    }

    const scrapeData = await scrapeResponse.json();
    
    // Process with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `Du är en expert på att analysera företagshemsidor och extrahera affärsinformation. 
          Analysera texten och extrahera följande information om den finns:
          - Kundens problem/pain som löses
          - Lösningen/produkten
          - Målgrupp och kundsegment
          - Unika fördelar/USP
          - Team och grundare
          - Affärsmodell och prissättning
          - Traction och proof points
          
          Returnera ENDAST ett JSON-objekt med följande struktur:
          {
            "customer_pain": "beskrivning",
            "solution": "beskrivning",
            "elevator_pitch": "max 140 tecken",
            "target_customer": "beskrivning",
            "unique_tech": "beskrivning",
            "team": "beskrivning",
            "revenue_model": "beskrivning",
            "traction": "beskrivning",
            "company_value": "beskrivning"
          }
          
          Om information saknas, använd null för det fältet.`
        },
        {
          role: "user",
          content: `Analysera denna hemsida och extrahera affärsinformation:\n\n${scrapeData.content || scrapeData.text || ''}`
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const extractedData = JSON.parse(completion.choices[0].message.content || '{}');
    
    return NextResponse.json({
      success: true,
      data: extractedData,
      source: 'website_analysis'
    });

  } catch (error) {
    console.error('Error scraping website:', error);
    return NextResponse.json(
      { error: 'Failed to scrape website', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 