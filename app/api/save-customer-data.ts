import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

export const runtime = 'nodejs';

function hashEmail(email: string) {
  return crypto.createHash('sha256').update(email).digest('hex');
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, company, url, answers } = data;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const id = email ? hashEmail(email) : crypto.randomUUID();
    const dir = path.join(process.cwd(), 'customer_data', id);
    await fs.mkdir(dir, { recursive: true });
    const filePath = path.join(dir, `test_${timestamp}.txt`);
    let content = `Datum: ${timestamp}\n`;
    if (email) content += `E-post: ${email}\n`;
    if (company) content += `Företagsnamn: ${company}\n`;
    if (url) content += `URL: ${url}\n`;
    content += `\nSVAR:\n${JSON.stringify(answers, null, 2)}\n`;
    await fs.writeFile(filePath, content, 'utf-8');
    return NextResponse.json({ success: true, file: filePath });
  } catch (error) {
    console.error('Kunde inte spara kunddata:', error);
    return NextResponse.json({ error: 'Kunde inte spara data' }, { status: 500 });
  }
} 