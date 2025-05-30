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

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const logoFile = formData.get('logo') as File | null;
  const color1 = formData.get('color1') as string;
  const color2 = formData.get('color2') as string;
  const color3 = formData.get('color3') as string;
  const fontKey = (formData.get('font') as string) || 'Helvetica';
  const fontName = FONT_MAP[fontKey] || StandardFonts.Helvetica;

  // Kontrollera PNG
  if (logoFile && logoFile.type !== 'image/png') {
    return NextResponse.json({ error: 'Endast PNG-filer med transparent bakgrund är tillåtna.' }, { status: 400 });
  }

  // Skapa PDF
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(fontName);
  let logoImage, logoDims;
  if (logoFile) {
    const arrayBuffer = await logoFile.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    logoImage = await pdfDoc.embedPng(bytes);
    if (logoImage) {
      logoDims = logoImage.scale(120 / logoImage.width);
    }
  }

  // Hämta AI-bilder för varje slide
  const aiImages: (Uint8Array | null)[] = [];
  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    // Avancerad prompt för pitchdeck, investmentcoach och designer
    const prompt = `You are the world's best investment coach and pitchdeck designer. Create a modern, professional, minimalistic illustration for a pitch deck slide titled '${slide.title}' for a startup. Use a Scandinavian, clean style, and incorporate the brand colors ${color1}, ${color2}, ${color3}. The image should visually represent: ${slide.text}. No text in the image. White or transparent background. Suitable for investors.`;
    try {
      const response = await openai.images.generate({
        model: 'o1-image',
        prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'url',
      });
      if (!response.data || !response.data[0]?.url) {
        aiImages.push(null);
        continue;
      }
      const imageUrl = response.data[0].url;
      if (!imageUrl) {
        aiImages.push(null);
        continue;
      }
      // Hämta bilden som buffer
      const imgRes = await fetch(imageUrl);
      const imgBuffer = new Uint8Array(await imgRes.arrayBuffer());
      aiImages.push(imgBuffer);
    } catch (e) {
      // Om misslyckas, pusha null (ingen bild)
      aiImages.push(null);
    }
  }

  for (let i = 0; i < slides.length; i++) {
    const page = pdfDoc.addPage([600, 800]);
    // Bakgrund
    page.drawRectangle({ x: 0, y: 0, width: 600, height: 800, color: rgb(0.96, 0.97, 0.98) });
    // Färgad ram
    page.drawRectangle({ x: 20, y: 20, width: 560, height: 760, borderWidth: 4, color: hexToRgb([color1, color2, color3][i % 3]), opacity: 0.08 });
    // Rubrik
    page.drawText(slides[i].title, { x: 50, y: 740, size: 32, font, color: hexToRgb(color1) });
    // Logotyp
    if (logoImage && logoDims) {
      page.drawImage(logoImage, { x: 420, y: 700, width: logoDims.width, height: logoDims.height });
    }
    // AI-bild
    if (aiImages[i]) {
      try {
        const img = await pdfDoc.embedPng(aiImages[i]!);
        page.drawImage(img, { x: 50, y: 500, width: 400, height: 250 });
      } catch (e) {
        // Om PNG-embed misslyckas, ignorera
      }
    }
    // Dummytext
    page.drawText(slides[i].text, { x: 50, y: 440, size: 16, font, color: rgb(0.1, 0.13, 0.18), maxWidth: 500, lineHeight: 22 });
    // Färgkoder
    if (i === 0) {
      page.drawText('Signaturfärger:', { x: 50, y: 400, size: 14, font, color: rgb(0.09, 0.28, 0.36) });
      page.drawRectangle({ x: 50, y: 380, width: 30, height: 15, color: hexToRgb(color1) });
      page.drawRectangle({ x: 90, y: 380, width: 30, height: 15, color: hexToRgb(color2) });
      page.drawRectangle({ x: 130, y: 380, width: 30, height: 15, color: hexToRgb(color3) });
      page.drawText(color1, { x: 50, y: 365, size: 10, font, color: rgb(0,0,0) });
      page.drawText(color2, { x: 90, y: 365, size: 10, font, color: rgb(0,0,0) });
      page.drawText(color3, { x: 130, y: 365, size: 10, font, color: rgb(0,0,0) });
    }
  }

  const pdfBytes = await pdfDoc.save();
  const pdfBase64 = Buffer.from(pdfBytes).toString('base64');
  const url = `data:application/pdf;base64,${pdfBase64}`;
  return NextResponse.json({ url });
}

function hexToRgb(hex: string) {
  hex = hex.replace('#', '');
  const bigint = parseInt(hex, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  return rgb(r, g, b);
} 