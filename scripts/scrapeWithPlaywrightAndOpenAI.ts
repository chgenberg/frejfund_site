import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface ScrapedData {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  ogImage: string;
  schema: string[];
  visibleText: string;
}

function validateAndFormatUrl(url: string): string {
  try {
    // Lägg till https:// om det saknas
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Validera URL
    new URL(url);
    return url;
  } catch (e) {
    throw new Error('Ogiltig URL. Kontrollera att URL:en är korrekt formaterad.');
  }
}

export async function scrapeAndAnalyze(url: string) {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Validera och formatera URL
    const formattedUrl = validateAndFormatUrl(url);
    console.log('Validerad URL:', formattedUrl);

    console.log('Hämtar webbsida...');
    const response = await fetch(formattedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; FrejFundBot/1.0; +https://frejfund.se)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText()}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    console.log('Extraherar data från sidan...');
    const data: ScrapedData = {
      title: $('title').text().trim(),
      description: $('meta[name="description"]').attr('content') || '',
      ogTitle: $('meta[property="og:title"]').attr('content') || '',
      ogDescription: $('meta[property="og:description"]').attr('content') || '',
      ogType: $('meta[property="og:type"]').attr('content') || '',
      ogImage: $('meta[property="og:image"]').attr('content') || '',
      schema: $('script[type="application/ld+json"]')
        .map((_, el) => $(el).html() || '')
        .get()
        .filter(Boolean),
      visibleText: $('body').text().replace(/\s+/g, ' ').trim()
    };

    console.log('Skickar data till OpenAI...');
    const prompt = `Du är en expert på att analysera företagssajter. Här är data från en hemsida:\nTitel: ${data.title}\nMeta description: ${data.description}\nOpenGraph: ${JSON.stringify({
      ogTitle: data.ogTitle,
      ogDescription: data.ogDescription,
      ogType: data.ogType,
      ogImage: data.ogImage
    }, null, 2)}\nSchema.org: ${data.schema.join('\n')}\nText: ${data.visibleText.slice(0, 4000)}\n\nExtrahera och sammanfatta:\n- Företagsnamn\n- Bransch\n- Område\n- Antal SKUs idag\n- Affärsidé\n- Målgrupp/kundsegment\n- Team/grundare\n- Erbjudande/produkt/tjänst\n- Kontaktinfo\n- Nyhetsartiklar eller pressmeddelanden\n- Kundrecensioner eller testimonials\n- Annat relevant för en affärsplan\nReturnera som ett JSON-objekt med nycklar: company_name, industry, area, sku_count, business_idea, customer_segments, team, revenue_model, market_size, competition, funding_details, contact_info, news_articles, testimonials, och övrigt. Svara på svenska.`;

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-1106-preview',
        messages: [
          { role: 'system', content: 'Du är en expert på affärsplaner.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.2
      })
    });

    if (!openaiRes.ok) {
      const errorData = await openaiRes.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    console.log('Får svar från OpenAI...');
    const openaiData = await openaiRes.json();
    const content = openaiData.choices?.[0]?.message?.content || '';
    let result;
    try {
      // Ta bort markdown-formatering om den finns
      const jsonContent = content.replace(/```json\n?|\n?```/g, '').trim();
      result = JSON.parse(jsonContent);
    } catch (e) {
      console.error('Fel vid parsning av JSON:', e);
      result = { 
        raw: content,
        error: 'Kunde inte tolka analysen som JSON'
      };
    }

    return result;
  } catch (e) {
    console.error('Fel i scrapeAndAnalyze:', e);
    throw e;
  }
} 