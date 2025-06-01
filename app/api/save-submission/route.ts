import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Använd Render's disk mount path om den finns, annars lokal submissions mapp
    const baseDir = process.env.RENDER ? '/opt/render/project/src/data' : process.cwd();
    const submissionsDir = path.join(baseDir, 'submissions');
    
    if (!fs.existsSync(submissionsDir)) {
      fs.mkdirSync(submissionsDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `submission-${timestamp}.json`;
    const filePath = path.join(submissionsDir, filename);
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    
    console.log(`Submission saved to: ${filePath}`);
    
    return NextResponse.json({ success: true, path: filePath });
  } catch (error) {
    console.error('Error saving submission:', error);
    return NextResponse.json({ error: 'Kunde inte spara data' }, { status: 500 });
  }
} 