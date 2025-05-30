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
  metaKeywords?: string;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  links: string[];
  images: string[];
  structuredData?: any[];
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
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    console.log('Extraherar data från sidan...');
    
    // Extrahera strukturerad data från JSON-LD
    const structuredData: any[] = [];
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const jsonData = $(el).html();
        if (jsonData) {
          structuredData.push(JSON.parse(jsonData));
        }
      } catch (e) {
        // Ignorera felaktig JSON
      }
    });

    const data: ScrapedData = {
      title: $('title').text().trim(),
      description: $('meta[name="description"]').attr('content') || '',
      metaKeywords: $('meta[name="keywords"]').attr('content') || '',
      ogTitle: $('meta[property="og:title"]').attr('content') || '',
      ogDescription: $('meta[property="og:description"]').attr('content') || '',
      ogType: $('meta[property="og:type"]').attr('content') || '',
      ogImage: $('meta[property="og:image"]').attr('content') || '',
      schema: $('script[type="application/ld+json"]')
        .map((_: number, el: any) => $(el).html() || '')
        .get()
        .filter(Boolean),
      headings: {
        h1: $('h1').map((_: number, el: any) => $(el).text().trim()).get(),
        h2: $('h2').map((_: number, el: any) => $(el).text().trim()).get(),
        h3: $('h3').map((_: number, el: any) => $(el).text().trim()).get()
      },
      links: $('a[href]').map((_: number, el: any) => $(el).attr('href')).get().slice(0, 20),
      images: $('img[alt]').map((_: number, el: any) => $(el).attr('alt')).get().slice(0, 10),
      visibleText: $('body').text().replace(/\s+/g, ' ').trim(),
      structuredData
    };

    console.log('Skickar data till OpenAI för djupanalys...');
    
    // Förbättrad prompt: Fokusera på affärsplanens frågor
    const prompt = `Du är en expert på företagsanalys. Din uppgift är att analysera företagets webbsida och försöka hitta svar på exakt dessa frågor (på svenska):

1. Vad gör företaget och vilket värde skapar det?
2. Vilket problem löser de för sina kunder?
3. Hur vanligt är problemet – och hur bevisar de det?
4. Vilket "gap" på marknaden fyller de?
5. Hur löser de problemet? (Lösning)
6. Varför är timingen rätt?
7. Vem är målgruppen/kunden?
8. Hur stort är marknadsutrymmet? (TAM/SAM/SOM)
9. Vilka viktiga marknadstrender gynnar dem?
10. Hur ser traction ut hittills?
11. Hur tjänar de pengar? (intäktsströmmar)
12. Vad är tillväxtplanen?
13. Hur ser teamet ut?
14. Hur stor ägarandel har grundarna?
15. Vilka kompetenser täcker teamet – och saknas det någon?
16. Har de styrelse eller rådgivare?
17. Vilka är konkurrenterna?
18. Vad gör lösningen unik?
19. Har de immateriella rättigheter (IP)?
20. Kapitalbehov och användning
21. Exit-strategi
22. Vilka är de största riskerna?
23. Hur adresserar de hållbarhet/ESG?

Svara ENDAST med ett JSON-objekt där varje fråga är en nyckel och svaret är så konkret och kortfattat som möjligt. Om information saknas, skriv "Ej angivet".

Exempel:
{
  "vad_gor_foretaget": "...",
  "problem": "...",
  ...
}

Analysera webbsidan och försök fylla i så många svar som möjligt. Här är webbsidans data:
Titel: ${data.title}
Meta beskrivning: ${data.description}
H1: ${data.headings.h1.join(', ')}
H2: ${data.headings.h2.join(', ')}
Synlig text (första 3000 tecken): ${data.visibleText.slice(0, 3000)}
`;

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-1106-preview',
        messages: [
          { 
            role: 'system', 
            content: 'Du är en expert på företagsanalys och affärsplaner. Analysera webbsidor noggrant och extrahera ALL relevant information strukturerat. Svara ENDAST med JSON utan markdown-formatering.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.1,
        response_format: { type: "json_object" }
      })
    });

    if (!openaiRes.ok) {
      const errorData = await openaiRes.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    console.log('Får detaljerat svar från OpenAI...');
    const openaiData = await openaiRes.json();
    const content = openaiData.choices?.[0]?.message?.content || '';
    
    let result;
    try {
      // Ta bort markdown-formatering om den finns
      const jsonContent = content.replace(/```json\n?|\n?```/g, '').trim();
      result = JSON.parse(jsonContent);
      // Lägg till metainformation
      result._metadata = {
        scraped_at: new Date().toISOString(),
        source_url: formattedUrl,
        title: data.title,
        raw_text_length: data.visibleText.length
      };
      result.success = true;
    } catch (e: any) {
      console.error('Fel vid parsning av JSON:', e);
      result = {
        raw: content,
        error: 'Kunde inte tolka analysen som JSON',
        success: false,
        _metadata: {
          scraped_at: new Date().toISOString(),
          source_url: formattedUrl,
          error: true
        }
      };
    }
    return result;
  } catch (e: any) {
    console.error('Fel i scrapeAndAnalyze:', e);
    return {
      success: false,
      error: e.message || 'Ett fel uppstod vid skrapning',
      _metadata: {
        scraped_at: new Date().toISOString(),
        error: true
      }
    };
  }
} 