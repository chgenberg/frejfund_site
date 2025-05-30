import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Endast POST tillåtet' });
  }
  try {
    const data = req.body;
    const submissionsDir = path.join(process.cwd(), 'submissions');
    if (!fs.existsSync(submissionsDir)) {
      fs.mkdirSync(submissionsDir);
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `submission-${timestamp}.txt`;
    const filePath = path.join(submissionsDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: 'Kunde inte spara data' });
  }
} 