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

// Hjälpfunktion för att generera bilder
async function generateImage(prompt: string): Promise<Buffer | null> {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Modern, professional business illustration for a pitch deck slide: ${prompt}. Style: minimalist, clean, corporate, blue and white color scheme, flat design, no text`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) return null;

    // Hämta bilden
    const imageResponse = await fetch(imageUrl);
    const buffer = await imageResponse.buffer();
    return buffer;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { answers, score } = await request.json();
    
    // Skapa ett nytt PDF-dokument
    const pdfDoc = await PDFDocument.create();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Färger
    const primaryColor = rgb(22/255, 71/255, 91/255); // #16475b
    const secondaryColor = rgb(126/255, 220/255, 255/255); // #7edcff
    const textColor = rgb(4/255, 18/255, 29/255); // #04121d
    const bgColor = rgb(245/255, 247/255, 250/255); // #f5f7fa
    
    // Slide 1: Omslag
    const page1 = pdfDoc.addPage();
    const { width, height } = page1.getSize();
    page1.drawRectangle({ x: 0, y: 0, width, height, color: bgColor });
    
    // Generera och lägg till bild för omslaget
    const coverImagePrompt = `${answers.company || 'startup'} company logo and brand identity, modern tech company`;
    const coverImage = await generateImage(coverImagePrompt);
    if (coverImage) {
      try {
        const embeddedImage = await pdfDoc.embedPng(coverImage);
        const imageSize = 200;
        page1.drawImage(embeddedImage, {
          x: width - imageSize - 50,
          y: height - imageSize - 100,
          width: imageSize,
          height: imageSize,
        });
      } catch (e) {
        console.error('Could not embed cover image:', e);
      }
    }
    
    // Rubrik
    page1.drawText(answers.company || 'FrejFund Pitch Deck', {
      x: 50,
      y: height - 100,
      size: 36,
      font: helveticaBoldFont,
      color: primaryColor,
    });
    
    // Score
    page1.drawText(`Score: ${score}/100`, {
      x: 50,
      y: height - 150,
      size: 24,
      font: helveticaFont,
      color: secondaryColor,
    });
    
    // Undertitel
    const tagline = answers.company_value || 'Din affärsidé analyserad av AI';
    const taglineLines = tagline.match(/.{1,60}/g) || [tagline];
    let yPosition = height - 200;
    taglineLines.forEach((line: string) => {
      page1.drawText(line, {
        x: 50,
        y: yPosition,
        size: 18,
        font: helveticaFont,
        color: textColor,
      });
      yPosition -= 25;
    });
    
    // Slide 2: Problem
    const page2 = pdfDoc.addPage();
    page2.drawRectangle({ x: 0, y: 0, width, height, color: bgColor });
    
    // Generera och lägg till bild för problem
    const problemImagePrompt = `illustration of ${answers.customer_problem || 'business problem'}, frustrated customer, pain point`;
    const problemImage = await generateImage(problemImagePrompt);
    if (problemImage) {
      try {
        const embeddedImage = await pdfDoc.embedPng(problemImage);
        const imageSize = 180;
        page2.drawImage(embeddedImage, {
          x: width - imageSize - 50,
          y: height/2 - imageSize/2,
          width: imageSize,
          height: imageSize,
        });
      } catch (e) {
        console.error('Could not embed problem image:', e);
      }
    }
    
    page2.drawText('Problem', {
      x: 50,
      y: height - 80,
      size: 32,
      font: helveticaBoldFont,
      color: primaryColor,
    });
    
    const problem = answers.customer_problem || 'Problemet definierat av teamet';
    const problemLines = problem.match(/.{1,50}/g) || [problem];
    yPosition = height - 140;
    problemLines.forEach((line: string) => {
      page2.drawText(line, {
        x: 50,
        y: yPosition,
        size: 14,
        font: helveticaFont,
        color: textColor,
      });
      yPosition -= 20;
    });
    
    // Slide 3: Lösning
    const page3 = pdfDoc.addPage();
    page3.drawRectangle({ x: 0, y: 0, width, height, color: bgColor });
    
    // Generera och lägg till bild för lösning
    const solutionImagePrompt = `innovative solution for ${answers.solution || 'tech solution'}, happy customer, success`;
    const solutionImage = await generateImage(solutionImagePrompt);
    if (solutionImage) {
      try {
        const embeddedImage = await pdfDoc.embedPng(solutionImage);
        const imageSize = 180;
        page3.drawImage(embeddedImage, {
          x: width - imageSize - 50,
          y: height/2 - imageSize/2,
          width: imageSize,
          height: imageSize,
        });
      } catch (e) {
        console.error('Could not embed solution image:', e);
      }
    }
    
    page3.drawText('Lösning', {
      x: 50,
      y: height - 80,
      size: 32,
      font: helveticaBoldFont,
      color: primaryColor,
    });
    
    const solution = answers.solution || 'Lösningen presenterad';
    const solutionLines = solution.match(/.{1,50}/g) || [solution];
    yPosition = height - 140;
    solutionLines.forEach((line: string) => {
      page3.drawText(line, {
        x: 50,
        y: yPosition,
        size: 14,
        font: helveticaFont,
        color: textColor,
      });
      yPosition -= 20;
    });
    
    // Slide 4: Marknad
    const page4 = pdfDoc.addPage();
    page4.drawRectangle({ x: 0, y: 0, width, height, color: bgColor });
    
    // Generera och lägg till bild för marknad
    const marketImagePrompt = `market growth chart, business expansion, global market opportunity`;
    const marketImage = await generateImage(marketImagePrompt);
    if (marketImage) {
      try {
        const embeddedImage = await pdfDoc.embedPng(marketImage);
        const imageSize = 180;
        page4.drawImage(embeddedImage, {
          x: width - imageSize - 50,
          y: height/2 - imageSize/2,
          width: imageSize,
          height: imageSize,
        });
      } catch (e) {
        console.error('Could not embed market image:', e);
      }
    }
    
    page4.drawText('Marknad', {
      x: 50,
      y: height - 80,
      size: 32,
      font: helveticaBoldFont,
      color: primaryColor,
    });
    
    const market = answers.market_size || 'TAM: Ej angivet\nSAM: Ej angivet\nSOM: Ej angivet';
    const marketLines = market.match(/.{1,50}/g) || [market];
    yPosition = height - 140;
    marketLines.forEach((line: string) => {
      page4.drawText(line, {
        x: 50,
        y: yPosition,
        size: 14,
        font: helveticaFont,
        color: textColor,
      });
      yPosition -= 20;
    });
    
    // Slide 5: Team
    const page5 = pdfDoc.addPage();
    page5.drawRectangle({ x: 0, y: 0, width, height, color: bgColor });
    
    // Generera och lägg till bild för team
    const teamImagePrompt = `diverse professional business team, collaboration, expertise, leadership`;
    const teamImage = await generateImage(teamImagePrompt);
    if (teamImage) {
      try {
        const embeddedImage = await pdfDoc.embedPng(teamImage);
        const imageSize = 180;
        page5.drawImage(embeddedImage, {
          x: width - imageSize - 50,
          y: height/2 - imageSize/2,
          width: imageSize,
          height: imageSize,
        });
      } catch (e) {
        console.error('Could not embed team image:', e);
      }
    }
    
    page5.drawText('Team', {
      x: 50,
      y: height - 80,
      size: 32,
      font: helveticaBoldFont,
      color: primaryColor,
    });
    
    const team = answers.team || 'Teamet presenterat';
    const teamLines = team.match(/.{1,50}/g) || [team];
    yPosition = height - 140;
    teamLines.forEach((line: string) => {
      page5.drawText(line, {
        x: 50,
        y: yPosition,
        size: 14,
        font: helveticaFont,
        color: textColor,
      });
      yPosition -= 20;
    });
    
    // Slide 6: Traction
    const page6 = pdfDoc.addPage();
    page6.drawRectangle({ x: 0, y: 0, width, height, color: bgColor });
    
    page6.drawText('Traction & Milstolpar', {
      x: 50,
      y: height - 80,
      size: 32,
      font: helveticaBoldFont,
      color: primaryColor,
    });
    
    const traction = answers.traction || 'Ingen traction angiven';
    const tractionLines = traction.match(/.{1,50}/g) || [traction];
    yPosition = height - 140;
    tractionLines.forEach((line: string) => {
      page6.drawText(line, {
        x: 50,
        y: yPosition,
        size: 14,
        font: helveticaFont,
        color: textColor,
      });
      yPosition -= 20;
    });
    
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