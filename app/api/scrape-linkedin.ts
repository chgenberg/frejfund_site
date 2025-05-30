import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Endast POST tillåtet' });
  }
  const { profiles } = req.body;
  if (!profiles || !Array.isArray(profiles)) {
    return res.status(400).json({ error: 'profiles krävs' });
  }
  // Mocka extraherad info
  const result = profiles.map((url, i) => `Namn: Person ${i+1}\nTitel: Grundare\nLinkedIn: ${url}`).join('\n\n');
  return res.status(200).json({ result });
} 