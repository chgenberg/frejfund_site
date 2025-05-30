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
    const prompt = `Du är en expert på företagsanalys. Din uppgift är att analysera företagets webbsida och försöka hitta svar på dessa frågor:

Svara ENDAST med ett JSON-objekt med följande nycklar (använd exakt dessa engelska nycklar):
{
  "company_name": "Företagsnamn",
  "industry": "Bransch (SaaS, Tech, Konsumentvaror, Hälsa, Fintech, Industri, Tjänster, Utbildning, Energi, Annat)",
  "area": "Geografiskt område (Sverige, Norden, Europa, Globalt, Annat)",
  "company_value": "Vad gör företaget och vilket värde skapar det?",
  "customer_problem": "Vilket problem löser de för sina kunder?",
  "problem_evidence": "Bevis för att problemet existerar",
  "market_gap": "Vilket gap på marknaden fyller de?",
  "solution": "Hur löser de problemet?",
  "why_now": "Varför är timingen rätt?",
  "target_customer": "Vem är målgruppen?",
  "market_size": "Marknadsstorlek (TAM/SAM/SOM om tillgängligt)",
  "market_trends": "Relevanta marknadstrender",
  "traction": "Traction och resultat hittills",
  "revenue_block": "Hur tjänar de pengar?",
  "growth_plan": "Tillväxtplaner",
  "team": "Information om teamet/grundarna",
  "founder_equity": "Ägarstruktur om tillgängligt",
  "team_skills": "Teamets kompetenser",
  "competitors": "Konkurrenter",
  "unique_solution": "Vad gör lösningen unik?",
  "ip_rights": "Immateriella rättigheter",
  "main_risks": "Huvudsakliga risker",
  "esg": "ESG/hållbarhetsaspekter"
}

Om information saknas, skriv "Ej angivet". Svara på svenska, men använd de engelska nycklarna ovan.

Analysera webbsidan:
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
    
    console.log('OpenAI svar mottaget, längd:', content.length);
    
    let result;
    try {
      // Ta bort markdown-formatering om den finns
      const jsonContent = content.replace(/```json\n?|\n?```/g, '').trim();
      console.log('Försöker parsa JSON...');
      result = JSON.parse(jsonContent);
      // Lägg till metainformation
      result._metadata = {
        scraped_at: new Date().toISOString(),
        source_url: formattedUrl,
        title: data.title,
        raw_text_length: data.visibleText.length
      };
      result.success = true;
      console.log('JSON-parsning lyckades!');
    } catch (e: any) {
      console.error('Fel vid parsning av JSON:', e);
      console.error('OpenAI svar (första 500 tecken):', content.slice(0, 500));
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
    console.log('Returnerar resultat...');
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