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

// Hjälpfunktion för att generera bilder med DALL-E 3
async function generateSlideImage(prompt: string, colors: any): Promise<Buffer | null> {
  try {
    const colorScheme = colors ? 
      `using ${colors.primary}, ${colors.secondary}, and ${colors.accent} color scheme` : 
      'using professional blue and white color scheme';
      
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a modern, professional pitch deck slide background with visual elements for: ${prompt}. Style: clean corporate design, abstract geometric shapes, ${colorScheme}, full page design with subtle gradients and space for text overlay. No text in the image.`,
      n: 1,
      size: "1792x1024",
      quality: "standard",
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) return null;

    // Hämta bilden
    const imageResponse = await fetch(imageUrl);
    const buffer = await imageResponse.arrayBuffer();
    return Buffer.from(buffer);
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}

// Hjälpfunktion för att skapa grafer och diagram
function createChart(
  pdfDoc: PDFDocument,
  page: any,
  x: number,
  y: number,
  width: number,
  height: number,
  data: number[],
  colors: any
) {
  const maxValue = Math.max(...data);
  const barWidth = width / data.length;
  
  data.forEach((value, index) => {
    const barHeight = (value / maxValue) * height;
    const barX = x + (index * barWidth) + (barWidth * 0.1);
    const barY = y;
    
    page.drawRectangle({
      x: barX,
      y: barY,
      width: barWidth * 0.8,
      height: barHeight,
      color: rgb(
        parseInt(colors.primary.slice(1, 3), 16) / 255,
        parseInt(colors.primary.slice(3, 5), 16) / 255,
        parseInt(colors.primary.slice(5, 7), 16) / 255
      ),
      opacity: 0.8,
    });
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const answersStr = formData.get('answers') as string;
    const scoreStr = formData.get('score') as string;
    const logo = formData.get('logo') as File;
    const colorsStr = formData.get('colors') as string;
    const fontFamily = formData.get('fontFamily') as string || 'Helvetica';
    
    const answers = JSON.parse(answersStr);
    const score = parseInt(scoreStr);
    const colors = colorsStr ? JSON.parse(colorsStr) : {
      primary: '#16475b',
      secondary: '#7edcff',
      accent: '#ff6b6b'
    };

    // Konvertera logo till buffer om det finns
    let logoBuffer: Buffer | null = null;
    if (logo) {
      const arrayBuffer = await logo.arrayBuffer();
      logoBuffer = Buffer.from(arrayBuffer);
    }
    
    // Skapa ett nytt PDF-dokument
    const pdfDoc = await PDFDocument.create();
    
    // Ladda fonts baserat på val
    let titleFont: any;
    let bodyFont: any;
    
    try {
      switch (fontFamily) {
        case 'Times':
          titleFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
          bodyFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
          break;
        default:
          titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
          bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      }
    } catch (e) {
      titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    }
    
    // Färger från konfiguration
    const primaryColor = rgb(
      parseInt(colors.primary.slice(1, 3), 16) / 255,
      parseInt(colors.primary.slice(3, 5), 16) / 255,
      parseInt(colors.primary.slice(5, 7), 16) / 255
    );
    const secondaryColor = rgb(
      parseInt(colors.secondary.slice(1, 3), 16) / 255,
      parseInt(colors.secondary.slice(3, 5), 16) / 255,
      parseInt(colors.secondary.slice(5, 7), 16) / 255
    );
    const accentColor = rgb(
      parseInt(colors.accent.slice(1, 3), 16) / 255,
      parseInt(colors.accent.slice(3, 5), 16) / 255,
      parseInt(colors.accent.slice(5, 7), 16) / 255
    );
    
    // Slide 1: Titelslide
    const page1 = pdfDoc.addPage([1024, 768]);
    const { width, height } = page1.getSize();
    
    // Generera och lägg till bakgrundsbild
    const titleImage = await generateSlideImage(
      `Professional title slide for ${answers.company || 'startup'} company, modern corporate design`,
      colors
    );
    
    if (titleImage) {
      try {
        const embeddedImage = await pdfDoc.embedPng(titleImage);
        page1.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: width,
          height: height,
          opacity: 0.3,
        });
      } catch (e) {
        console.error('Could not embed title image:', e);
      }
    }
    
    // Lägg till semi-transparent overlay för bättre läsbarhet
    page1.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: height,
      color: rgb(1, 1, 1),
      opacity: 0.7,
    });
    
    // Logo om det finns
    if (logoBuffer) {
      try {
        const logo = await pdfDoc.embedPng(logoBuffer);
        const logoHeight = 80;
        const logoWidth = (logo.width / logo.height) * logoHeight;
        page1.drawImage(logo, {
          x: width - logoWidth - 50,
          y: height - logoHeight - 50,
          width: logoWidth,
          height: logoHeight,
        });
      } catch (e) {
        console.error('Could not embed logo:', e);
      }
    }
    
    // Titel
    page1.drawText(answers.company || 'Pitch Deck', {
      x: 50,
      y: height - 150,
      size: 48,
      font: titleFont,
      color: primaryColor,
    });
    
    // Score badge
    page1.drawRectangle({
      x: 50,
      y: height - 220,
      width: 150,
      height: 50,
      color: secondaryColor,
      opacity: 0.2,
    });
    page1.drawText(`Score: ${score}/100`, {
      x: 65,
      y: height - 205,
      size: 24,
      font: bodyFont,
      color: primaryColor,
    });
    
    // Tagline
    if (answers.company_value) {
      const taglineLines = answers.company_value.match(/.{1,80}/g) || [answers.company_value];
      let yPos = height - 280;
      taglineLines.slice(0, 2).forEach((line: string) => {
        page1.drawText(line, {
          x: 50,
          y: yPos,
          size: 20,
          font: bodyFont,
          color: primaryColor,
          opacity: 0.8,
        });
        yPos -= 30;
      });
    }
    
    // Datum
    page1.drawText(new Date().toLocaleDateString('sv-SE'), {
      x: 50,
      y: 50,
      size: 14,
      font: bodyFont,
      color: primaryColor,
      opacity: 0.6,
    });
    
    // Slide 2: Problem
    const page2 = pdfDoc.addPage([1024, 768]);
    
    const problemImage = await generateSlideImage(
      `Business problem visualization: ${answers.customer_problem || 'customer pain points'}, frustrated users, challenge illustration`,
      colors
    );
    
    if (problemImage) {
      try {
        const embeddedImage = await pdfDoc.embedPng(problemImage);
        page2.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: width,
          height: height,
          opacity: 0.3,
        });
      } catch (e) {
        console.error('Could not embed problem image:', e);
      }
    }
    
    // Overlay
    page2.drawRectangle({
      x: 0,
      y: height / 2,
      width: width,
      height: height / 2,
      color: rgb(1, 1, 1),
      opacity: 0.8,
    });
    
    page2.drawText('Problem', {
      x: 50,
      y: height - 80,
      size: 36,
      font: titleFont,
      color: primaryColor,
    });
    
    // Problem text with better formatting
    if (answers.customer_problem) {
      const problemLines = answers.customer_problem.match(/.{1,90}/g) || [answers.customer_problem];
      let yPosition = height - 150;
      
      problemLines.slice(0, 8).forEach((line: string) => {
        page2.drawText(line, {
          x: 50,
          y: yPosition,
          size: 18,
          font: bodyFont,
          color: primaryColor,
        });
        yPosition -= 28;
      });
    }
    
    // Add visual elements - pain point icons
    const iconY = 150;
    const iconSize = 60;
    const iconSpacing = (width - 100) / 3;
    
    for (let i = 0; i < 3; i++) {
      page2.drawCircle({
        x: 50 + (i * iconSpacing) + iconSize / 2,
        y: iconY,
        size: iconSize / 2,
        color: accentColor,
        opacity: 0.2,
      });
    }
    
    // Continue with more slides...
    // Slide 3: Solution
    const page3 = pdfDoc.addPage([1024, 768]);
    
    const solutionImage = await generateSlideImage(
      `Innovative solution visualization: ${answers.solution || 'technology solution'}, happy customers, success metrics`,
      colors
    );
    
    if (solutionImage) {
      try {
        const embeddedImage = await pdfDoc.embedPng(solutionImage);
        page3.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: width,
          height: height,
          opacity: 0.3,
        });
      } catch (e) {
        console.error('Could not embed solution image:', e);
      }
    }
    
    // Content overlay with gradient effect
    page3.drawRectangle({
      x: 0,
      y: 0,
      width: width * 0.6,
      height: height,
      color: rgb(1, 1, 1),
      opacity: 0.85,
    });
    
    page3.drawText('Lösning', {
      x: 50,
      y: height - 80,
      size: 36,
      font: titleFont,
      color: primaryColor,
    });
    
    if (answers.solution) {
      const solutionLines = answers.solution.match(/.{1,60}/g) || [answers.solution];
      let yPosition = height - 150;
      
      solutionLines.slice(0, 6).forEach((line: string) => {
        page3.drawText(line, {
          x: 50,
          y: yPosition,
          size: 18,
          font: bodyFont,
          color: primaryColor,
        });
        yPosition -= 28;
      });
    }
    
    // Slide 4: Market
    const page4 = pdfDoc.addPage([1024, 768]);
    
    const marketImage = await generateSlideImage(
      'Market opportunity visualization with growth charts, global expansion, market size representation',
      colors
    );
    
    if (marketImage) {
      try {
        const embeddedImage = await pdfDoc.embedPng(marketImage);
        page4.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: width,
          height: height,
          opacity: 0.3,
        });
      } catch (e) {
        console.error('Could not embed market image:', e);
      }
    }
    
    page4.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: height,
      color: rgb(1, 1, 1),
      opacity: 0.8,
    });
    
    page4.drawText('Marknad', {
      x: 50,
      y: height - 80,
      size: 36,
      font: titleFont,
      color: primaryColor,
    });
    
    // TAM/SAM/SOM visualization
    const centerX = width / 2;
    const centerY = height / 2;
    
    // TAM circle
    page4.drawCircle({
      x: centerX,
      y: centerY,
      size: 150,
      color: secondaryColor,
      opacity: 0.3,
    });
    
    // SAM circle
    page4.drawCircle({
      x: centerX,
      y: centerY,
      size: 100,
      color: secondaryColor,
      opacity: 0.5,
    });
    
    // SOM circle
    page4.drawCircle({
      x: centerX,
      y: centerY,
      size: 50,
      color: primaryColor,
      opacity: 0.8,
    });
    
    // Market labels
    page4.drawText('TAM', {
      x: centerX + 160,
      y: centerY,
      size: 20,
      font: titleFont,
      color: primaryColor,
    });
    
    page4.drawText('SAM', {
      x: centerX + 110,
      y: centerY - 50,
      size: 20,
      font: titleFont,
      color: primaryColor,
    });
    
    page4.drawText('SOM', {
      x: centerX - 20,
      y: centerY - 10,
      size: 20,
      font: titleFont,
      color: rgb(1, 1, 1),
    });
    
    if (answers.market_size) {
      const marketLines = answers.market_size.match(/.{1,70}/g) || [answers.market_size];
      let yPosition = 150;
      
      marketLines.slice(0, 3).forEach((line: string) => {
        page4.drawText(line, {
          x: 50,
          y: yPosition,
          size: 16,
          font: bodyFont,
          color: primaryColor,
        });
        yPosition -= 25;
      });
    }
    
    // Generera PDF
    const pdfBytes = await pdfDoc.save();
    
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="pitch-deck.pdf"',
        'Content-Length': pdfBytes.length.toString(),
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