import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Endast POST tillåtet' });
  }
  const { bransch } = req.body;
  if (!bransch) return res.status(400).json({ error: 'Bransch krävs' });
  // Mocka AI-förslag
  const result = `Exempel på konkurrenter inom ${bransch}:

- Bolag A: Ledande aktör inom ${bransch}.
- Bolag B: Innovativ startup med fokus på digitalisering.
- Bolag C: Stort internationellt företag med bred portfölj.

Så här skiljer ni er: Unik teknik, nischad målgrupp eller bättre kundupplevelse.`;
  return res.status(200).json({ result });
} 