import puppeteer from 'puppeteer';
import fetch from 'node-fetch';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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
  let browser;
  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Validera och formatera URL
    const formattedUrl = validateAndFormatUrl(url);
    console.log('Validerad URL:', formattedUrl);

    console.log('Startar Puppeteer...');
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process'
      ],
      headless: true
    });
    
    console.log('Öppnar ny sida...');
    const page = await browser.newPage();
    
    console.log('Navigerar till:', formattedUrl);
    try {
      const response = await page.goto(formattedUrl, { 
        waitUntil: 'domcontentloaded', 
        timeout: 30000 
      });
      
      if (!response) {
        throw new Error('Inget svar från servern');
      }
      
      if (!response.ok()) {
        throw new Error(`HTTP ${response.status()}: ${response.statusText()}`);
      }
      
      console.log('Sidan laddad, status:', response.status());
    } catch (navigationError: any) {
      console.error('Fel vid navigation:', navigationError);
      throw new Error(`Kunde inte ladda sidan: ${navigationError.message || 'Okänt fel'}`);
    }

    console.log('Extraherar data från sidan...');
    const data = await page.evaluate(() => {
      const getMeta = (name: string) => {
        const el = document.querySelector(`meta[name='${name}']`) as HTMLMetaElement;
        return el ? el.content : '';
      };
      const getOG = (property: string) => {
        const el = document.querySelector(`meta[property='${property}']`) as HTMLMetaElement;
        return el ? el.content : '';
      };
      const schema = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => s.textContent);
      const visibleText = document.body.innerText;
      return {
        title: document.title,
        description: getMeta('description'),
        ogTitle: getOG('og:title'),
        ogDescription: getOG('og:description'),
        ogType: getOG('og:type'),
        ogImage: getOG('og:image'),
        schema,
        visibleText
      };
    });

    console.log('Stänger webbläsaren...');
    await browser.close();
    browser = null;

    console.log('Skickar data till OpenAI...');
    const prompt = `Du är en expert på att analysera företagssajter. Här är data från en hemsida:\nTitel: ${data.title}\nMeta description: ${data.description}\nOpenGraph: ${JSON.stringify({
      ogTitle: data.ogTitle,
      ogDescription: data.ogDescription,
      ogType: data.ogType,
      ogImage: data.ogImage
    }, null, 2)}\nSchema.org: ${data.schema.join('\\n')}\nText: ${data.visibleText.slice(0, 4000)}\n\nExtrahera och sammanfatta:\n- Företagsnamn\n- Bransch\n- Område\n- Antal SKUs idag\n- Affärsidé\n- Målgrupp/kundsegment\n- Team/grundare\n- Erbjudande/produkt/tjänst\n- Kontaktinfo\n- Nyhetsartiklar eller pressmeddelanden\n- Kundrecensioner eller testimonials\n- Annat relevant för en affärsplan\nReturnera som ett JSON-objekt med nycklar: company_name, industry, area, sku_count, business_idea, customer_segments, team, revenue_model, market_size, competition, funding_details, contact_info, news_articles, testimonials, och övrigt. Svara på svenska.`;

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
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
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Fel vid stängning av browser:', closeError);
      }
    }
    throw e;
  }
} 