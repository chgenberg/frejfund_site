import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { OpenAI } from 'openai';
import fetch from 'node-fetch';

export const runtime = 'nodejs';

const slides = [
  { key: 'cover', title: 'Omslag', text: 'Pitchdeck för [Företagsnamn]\nTagline eller slogan här.' },
  { key: 'problem', title: 'Problem', text: 'Vilket problem löser ni? Här visas en AI-genererad beskrivning av kundens problem.' },
  { key: 'solution', title: 'Lösning', text: 'Hur löser ni problemet? Här visas AI-genererad beskrivning av lösningen.' },
  { key: 'market', title: 'Marknad', text: 'Marknadens storlek (TAM/SAM/SOM) och potential. Här visas AI-genererade siffror och insikter.' },
  { key: 'team', title: 'Team', text: 'Vilka är ni? Här visas teamets styrkor och roller.' },
  { key: 'traction', title: 'Traction', text: 'Vad har ni åstadkommit hittills? Milstolpar, användartillväxt, intäkter.' },
  { key: 'competitors', title: 'Konkurrenter', text: 'Hur ser konkurrensen ut? AI-genererad matris och positionering.' },
  { key: 'financials', title: 'Finansiellt', text: 'Budget, runway, use of funds. Här visas AI-genererade nyckeltal.' },
  { key: 'roadmap', title: 'Roadmap', text: 'Plan framåt. Viktiga milstolpar och tidslinje.' },
  { key: 'exit', title: 'Exit', text: 'Exit-strategi och vision för framtiden.' }
];

const FONT_MAP: Record<string, StandardFonts> = {
  Helvetica: StandardFonts.Helvetica,
  Times: StandardFonts.TimesRoman,
  Courier: StandardFonts.Courier,
  Lato: StandardFonts.Helvetica, // fallback
  Pacifico: StandardFonts.Helvetica // fallback
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  try {
    const { answers, score } = await request.json();
    
    // Simulera PDF-generering (i verkligheten skulle detta använda en PDF-bibliotek som jsPDF eller puppeteer)
    const pdfContent = `
    PITCH DECK - ${answers.company || 'Ditt Företag'}
    
    EXECUTIVE SUMMARY
    Score: ${score}/100
    
    PROBLEM & LÖSNING
    ${answers.customer_problem || 'Problem definierat'}
    ${answers.solution || 'Lösning presenterad'}
    
    MARKNAD
    ${answers.market_size || 'Marknadsanalys'}
    
    TEAM
    ${answers.team || 'Teamet presenterat'}
    
    TRACTION
    ${answers.traction || 'Traction rapporterat'}
    
    FINANSIERING
    ${JSON.stringify(answers.capital_block) || 'Finansieringsbehov'}
    
    --- Genererad av FrejFund AI ---
    `;

    // Skapa en mock PDF-response
    const pdfBuffer = Buffer.from(pdfContent, 'utf8');
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="pitch-deck.pdf"',
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating pitch deck:', error);
    return NextResponse.json({ error: 'Kunde inte generera pitch deck' }, { status: 500 });
  }
}

function hexToRgb(hex: string) {
  hex = hex.replace('#', '');
  const bigint = parseInt(hex, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  return rgb(r, g, b);
} 