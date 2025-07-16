import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
  try {
    // Check for API key before instantiating OpenAI client
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    console.log('🔍 Scraping website with Cheerio:', url);

    // Prepare URL
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;

    let scrapedContent;
    try {
      // Scrape website content using axios and cheerio
      const response = await axios.get(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'sv-SE,sv;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        timeout: 10000,
        maxRedirects: 5
      });

      const $ = cheerio.load(response.data);

      // Remove unnecessary elements
      $('script, style, nav, footer, header, .nav, .footer, .header').remove();

      // Extract title
      const title = $('title').text().trim();

      // Extract meta description
      const metaDescription = $('meta[name="description"]').attr('content') || '';

      // Extract headings
      const headings: string[] = [];
      $('h1, h2, h3').each((_, element) => {
        const text = $(element).text().trim();
        if (text && text.length > 5) {
          headings.push(text);
        }
      });

      // Extract paragraphs
      const paragraphs: string[] = [];
      $('p').each((_, element) => {
        const text = $(element).text().trim();
        if (text && text.length > 20) {
          paragraphs.push(text);
        }
      });

      // Extract content from common areas
      const contentSelectors = [
        'main', '.main', '#main',
        '.content', '#content',
        '.about', '.hero', '.intro',
        'article', 'section',
        '.description', '.summary'
      ];

      const additionalContent: string[] = [];
      contentSelectors.forEach(selector => {
        $(selector).each((_, element) => {
          const text = $(element).text().trim();
          if (text && text.length > 50) {
            // Limit to 500 characters per section
            additionalContent.push(text.substring(0, 500));
          }
        });
      });

      console.log('✅ Website scraped successfully');

      // Combine all scraped content for AI analysis
      scrapedContent = [
        title,
        metaDescription,
        ...headings.slice(0, 10),
        ...paragraphs.slice(0, 15),
        ...additionalContent.slice(0, 5)
      ].filter(Boolean).join('\n\n');

    } catch (error: any) {
      console.error('❌ Scraping failed:', error.message);
      return NextResponse.json({ 
        error: 'Failed to scrape website: ' + (error.message || 'Unknown error')
      }, { status: 400 });
    }

    if (!scrapedContent || scrapedContent.length < 50) {
      return NextResponse.json({ 
        error: 'No meaningful content found on website' 
      }, { status: 400 });
    }

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
          content: `Analysera denna hemsida och extrahera affärsinformation:\n\n${scrapedContent}`
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