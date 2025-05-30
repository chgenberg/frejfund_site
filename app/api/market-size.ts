import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Endast POST tillåtet' });
  }
  const { bransch } = req.body;
  if (!bransch) return res.status(400).json({ error: 'Bransch krävs' });
  try {
    const prompt = `Ge en uppskattning av TAM, SAM och SOM för branschen: ${bransch}. Svara kortfattat och på svenska, t.ex.\nTAM: ...\nSAM: ...\nSOM: ...`;
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300
      })
    });
    const data = await openaiRes.json();
    const result = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({ result });
  } catch (e) {
    return res.status(500).json({ error: 'Kunde inte hämta marknadsdata' });
  }
} 