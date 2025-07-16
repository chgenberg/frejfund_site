import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import axios from 'axios';
import { JSDOM } from 'jsdom';

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

    console.log('🔍 Scraping website with JSDOM:', url);

    // Prepare URL
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;

    let scrapedContent;
    try {
      // Scrape website content using axios and JSDOM
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

      // Pre-process HTML to remove problematic elements and resources
      let cleanedHtml = response.data
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove all style tags
        .replace(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi, '') // Remove stylesheet links
        .replace(/<link[^>]*>/gi, '') // Remove all link tags
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove all script tags
        .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '') // Remove iframes
        .replace(/<video[^>]*>[\s\S]*?<\/video>/gi, '') // Remove videos
        .replace(/<audio[^>]*>[\s\S]*?<\/audio>/gi, '') // Remove audio
        .replace(/<img[^>]*>/gi, '') // Remove images
        .replace(/<object[^>]*>[\s\S]*?<\/object>/gi, '') // Remove objects
        .replace(/<embed[^>]*>/gi, '') // Remove embed tags
        .replace(/style\s*=\s*["'][^"']*["']/gi, '') // Remove inline styles
        .replace(/src\s*=\s*["'][^"']*["']/gi, '') // Remove src attributes
        .replace(/href\s*=\s*["'][^"']*["']/gi, ''); // Remove href attributes

      // Parse HTML with JSDOM - simple configuration
      const dom = new JSDOM(cleanedHtml, {
        resources: "usable"
      });
      
      const document = dom.window.document;

      // Remove unnecessary elements
      const elementsToRemove = document.querySelectorAll('script, style, nav, footer, header, .nav, .footer, .header');
      elementsToRemove.forEach(el => el.remove());

      // Extract title
      const titleElement = document.querySelector('title');
      const title = titleElement ? titleElement.textContent?.trim() || '' : '';

      // Extract meta description
      const metaElement = document.querySelector('meta[name="description"]');
      const metaDescription = metaElement ? metaElement.getAttribute('content') || '' : '';

      // Extract headings
      const headings: string[] = [];
      const headingElements = document.querySelectorAll('h1, h2, h3');
      headingElements.forEach(el => {
        const text = el.textContent?.trim();
        if (text && text.length > 5) {
          headings.push(text);
        }
      });

      // Extract paragraphs
      const paragraphs: string[] = [];
      const paragraphElements = document.querySelectorAll('p');
      paragraphElements.forEach(el => {
        const text = el.textContent?.trim();
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
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          const text = el.textContent?.trim();
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
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert at analyzing company websites and extracting business information. 
          Analyze the text and extract the following information if available:
          - Customer problems/pain being solved
          - The solution/product
          - Target audience and customer segments
          - Unique advantages/USP
          - Team and founders
          - Business model and pricing
          - Traction and proof points
          
          Return ONLY a JSON object with the following structure:
          {
            "customer_pain": "description",
            "solution": "description", 
            "elevator_pitch": "max 140 characters",
            "target_customer": "description",
            "unique_tech": "description",
            "team": "description",
            "revenue_model": "description",
            "traction": "description",
            "company_value": "description"
          }
          
          If information is missing, use null for that field. Write all descriptions in English and keep them concise but informative.`
        },
        {
          role: "user",
          content: `Analyze this website and extract business information:\n\n${scrapedContent}`
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