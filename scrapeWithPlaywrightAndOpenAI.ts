const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface ScrapedData {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  ogImage: string;
  visibleText: string;
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
    
    // Validera URL med WHATWG URL API
    const urlObj = new URL(url);
    return urlObj.toString();
  } catch (e) {
    throw new Error('Ogiltig URL. Kontrollera att URL:en är korrekt formaterad.');
  }
}

// Enkel HTML-parser utan externa beroenden
function extractFromHTML(html: string, tag: string, attribute?: string): string {
  const regex = attribute 
    ? new RegExp(`<${tag}[^>]*${attribute}="([^"]*)"[^>]*>`, 'i')
    : new RegExp(`<${tag}[^>]*>([^<]*)<\/${tag}>`, 'i');
  const match = html.match(regex);
  return match ? match[1] : '';
}

function extractAllFromHTML(html: string, tag: string): string[] {
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)<\/${tag}>`, 'gi');
  const matches = html.matchAll(regex);
  return Array.from(matches).map(match => match[1].trim()).filter(Boolean);
}

function extractMetaContent(html: string, property: string): string {
  const regex = new RegExp(`<meta[^>]*property="${property}"[^>]*content="([^"]*)"`, 'i');
  const match = html.match(regex);
  if (match) return match[1];
  
  // Prova också name-attribut
  const nameRegex = new RegExp(`<meta[^>]*name="${property}"[^>]*content="([^"]*)"`, 'i');
  const nameMatch = html.match(nameRegex);
  return nameMatch ? nameMatch[1] : '';
}

function extractVisibleText(html: string): string {
  // Ta bort script och style-taggar
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Ta bort alla HTML-taggar
  text = text.replace(/<[^>]+>/g, ' ');
  
  // Ta bort extra whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

function extractStructuredData(html: string): any[] {
  const structuredData: any[] = [];
  const regex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  const matches = html.matchAll(regex);
  
  for (const match of matches) {
    try {
      const jsonData = match[1].trim();
      if (jsonData) {
        structuredData.push(JSON.parse(jsonData));
      }
    } catch (e) {
      // Ignorera felaktig JSON
    }
  }
  
  return structuredData;
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
        'User-Agent': 'Mozilla/5.0 (compatible; FrejFundBot/1.0; +https://www.frejfund.com)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();

    console.log('Extraherar data från sidan...');
    
    const data: ScrapedData = {
      title: extractFromHTML(html, 'title'),
      description: extractMetaContent(html, 'description'),
      ogTitle: extractMetaContent(html, 'og:title'),
      ogDescription: extractMetaContent(html, 'og:description'),
      ogType: extractMetaContent(html, 'og:type'),
      ogImage: extractMetaContent(html, 'og:image'),
      headings: {
        h1: extractAllFromHTML(html, 'h1'),
        h2: extractAllFromHTML(html, 'h2'),
        h3: extractAllFromHTML(html, 'h3')
      },
      links: [], // Vi kan lägga till länkextraktion senare om behövs
      images: [], // Vi kan lägga till bildextraktion senare om behövs
      visibleText: extractVisibleText(html).slice(0, 3000),
      structuredData: extractStructuredData(html)
    };

    console.log('Skickar data till OpenAI för djupanalys...');
    
    // Förbättrad prompt: Fokusera på affärsplanens frågor
    const prompt = `Du är en expert på företagsanalys. Din uppgift är att analysera företagets webbsida och försöka hitta svar på dessa frågor:

Svara ENDAST med ett JSON-objekt med följande nycklar (använd exakt dessa engelska nycklar):
{
  "company_name": "Företagsnamn",
  "industry": "Bransch (SaaS, Tech, Konsumentvaror, Hälsa, Fintech, Industri, Tjänster, Utbildning, Energi, Annat)",
  "area": "Geografiskt område (Sverige, Norden, Europa, Globalt, Annat)",
  "company_value": "Vad gör företaget och vilket värde skapar det? (Dela upp i stycken med \\n\\n mellan styckena)",
  "customer_problem": "Vilket problem löser de för sina kunder? (Dela upp i stycken med \\n\\n mellan styckena)",
  "problem_evidence": "Bevis för att problemet existerar (Dela upp i stycken med \\n\\n mellan styckena)",
  "market_gap": "Vilket gap på marknaden fyller de? (Dela upp i stycken med \\n\\n mellan styckena)",
  "solution": "Hur löser de problemet? (Dela upp i stycken med \\n\\n mellan styckena)",
  "why_now": "Varför är timingen rätt? (Dela upp i stycken med \\n\\n mellan styckena)",
  "target_customer": "Vem är målgruppen? (Dela upp i stycken med \\n\\n mellan styckena)",
  "market_size": "Marknadsstorlek (TAM/SAM/SOM om tillgängligt) (Dela upp i stycken med \\n\\n mellan styckena)",
  "market_trends": "Relevanta marknadstrender (Dela upp i stycken med \\n\\n mellan styckena)",
  "traction": "Traction och resultat hittills (Dela upp i stycken med \\n\\n mellan styckena)",
  "revenue_block": "Hur tjänar de pengar? (Dela upp i stycken med \\n\\n mellan styckena)",
  "growth_plan": "Tillväxtplaner (Dela upp i stycken med \\n\\n mellan styckena)",
  "team": "Information om teamet/grundarna (Dela upp i stycken med \\n\\n mellan styckena)",
  "founder_equity": "Ägarstruktur om tillgängligt (Dela upp i stycken med \\n\\n mellan styckena)",
  "team_skills": "Teamets kompetenser (Dela upp i stycken med \\n\\n mellan styckena)",
  "competitors": "Konkurrenter (Dela upp i stycken med \\n\\n mellan styckena)",
  "unique_solution": "Vad gör lösningen unik? (Dela upp i stycken med \\n\\n mellan styckena)",
  "ip_rights": "Immateriella rättigheter (Dela upp i stycken med \\n\\n mellan styckena)",
  "main_risks": "Huvudsakliga risker (Dela upp i stycken med \\n\\n mellan styckena)",
  "esg": "ESG/hållbarhetsaspekter (Dela upp i stycken med \\n\\n mellan styckena)"
}

Viktigt:
1. Om information saknas, skriv "Ej angivet"
2. Svara på svenska, men använd de engelska nycklarna ovan
3. För längre svar, dela upp texten i logiska stycken med \\n\\n mellan styckena
4. Varje stycke ska vara sammanhängande och fokusera på ett specifikt aspekt
5. Använd punktlistor (-) för att strukturera information där det är lämpligt

Analysera webbsidan:
Titel: ${data.title}
Meta beskrivning: ${data.description}
H1: ${data.headings.h1.join(', ')}
H2: ${data.headings.h2.join(', ')}
Synlig text (första 3000 tecken): ${data.visibleText}
Strukturerad data: ${JSON.stringify(data.structuredData).slice(0, 1000)}
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