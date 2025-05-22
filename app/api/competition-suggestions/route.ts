import { NextRequest, NextResponse } from 'next/server';

// Optionally, you can use a real web search API here. For now, we'll use Bing Web Search API as an example.
const BING_API_KEY = process.env.BING_API_KEY || '';
const BING_ENDPOINT = 'https://api.bing.microsoft.com/v7.0/search';

async function searchCompetitorsOnWeb(query: string): Promise<string[]> {
  if (!BING_API_KEY) return [];
  try {
    const res = await fetch(`${BING_ENDPOINT}?q=${encodeURIComponent(query)}&mkt=sv-SE`, {
      headers: { 'Ocp-Apim-Subscription-Key': BING_API_KEY }
    });
    const data = await res.json();
    // Extract company names from web page titles/snippets
    const competitors: string[] = [];
    if (data.webPages?.value) {
      for (const item of data.webPages.value) {
        // Try to extract company name from title
        const match = item.name.match(/([A-ZÅÄÖa-zåäö0-9\- ]+)/);
        if (match) {
          const name = match[1].trim();
          if (name && !competitors.includes(name)) competitors.push(name);
        }
      }
    }
    return competitors.slice(0, 5);
  } catch (e) {
    return [];
  }
}

export async function POST(req: NextRequest) {
  const { business_idea, bransch, omrade, customer_segments, answers } = await req.json();

  // Compose a detailed OpenAI prompt
  const apiKey = '***REMOVED***Qcn0TpQ3ewkWHR-b3HScwXJAchrAZG3QrmwXRwwF2mL8MsVZcApZyn37sVNBE95uCIH5UyG1BbT3BlbkFJKUcYQM5uJtbU7Q7bQdK0qxJ-iJz5ywDN22tpgZ-xXEcIEb6U2LBEwQgQ2PsPpXP7jNZxvli_cA';
  const prompt = `Du är en expert på marknadsanalys. Baserat på denna affärsidé, bransch, område och kundgrupp, lista 3–5 faktiska konkurrenter på svenska marknaden. Svara ENDAST med en JSON-array med företagsnamn, inga förklaringar eller text.\n\nAffärsidé: ${business_idea}\nBransch: ${bransch}\nOmråde: ${omrade}\nKundgrupp: ${customer_segments}\n`;

  let aiSuggestions: string[] = [];
  let webSuggestions: string[] = [];

  try {
    // 1. Get suggestions from OpenAI
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Du är en expert på marknadsanalys.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.2
      })
    });
    const data = await openaiRes.json();
    let text = data.choices?.[0]?.message?.content || '';
    if (text.startsWith('```json')) {
      text = text.replace(/^```json/, '').replace(/```$/, '').trim();
    }
    try {
      aiSuggestions = JSON.parse(text);
      if (!Array.isArray(aiSuggestions)) aiSuggestions = [text];
    } catch (e) {
      aiSuggestions = text.split('\n').map((s: string) => s.replace(/^[-*\d.\s]+/, '').trim()).filter(Boolean);
    }

    // 2. Get suggestions from Bing Web Search
    const webQuery = `${bransch} ${omrade} konkurrenter företag ${business_idea} ${customer_segments || ''}`;
    webSuggestions = await searchCompetitorsOnWeb(webQuery);
  } catch (e) {
    aiSuggestions = [];
    webSuggestions = [];
  }

  // Merge and deduplicate
  const allSuggestions = Array.from(new Set([...aiSuggestions, ...webSuggestions])).filter(Boolean);

  return NextResponse.json({ suggestions: allSuggestions });
} 