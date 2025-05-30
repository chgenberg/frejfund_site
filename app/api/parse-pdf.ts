// @ts-expect-error
// eslint-disable-next-line
declare module 'pdf-parse';
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import pdfParse from 'pdf-parse';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Endast POST tillåtet' });
  }
  const form = new formidable.IncomingForm();
  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) return res.status(400).json({ error: 'Kunde inte läsa filen' });
    const file = files.file;
    if (!file || Array.isArray(file) || file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Endast PDF-filer stöds' });
    }
    try {
      const data = fs.readFileSync(file.filepath);
      const parsed = await pdfParse(data);
      return res.status(200).json({ text: parsed.text });
    } catch (e) {
      return res.status(400).json({ error: 'Kunde inte tolka PDF-filen' });
    }
  });
} 