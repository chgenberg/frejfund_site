import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { OpenAI } from 'openai';

export const runtime = 'nodejs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper to sanitize text for PDF (remove/replace unsupported chars)
function sanitizeText(text: string): string {
  // Replace smart quotes, dashes, and common Unicode with ASCII equivalents
  return text
    .replace(/[""«»„‟]/g, '"')
    .replace(/[''‚‛]/g, "'")
    .replace(/[–—−]/g, '-')
    .replace(/[•·‣⁃◦]/g, '-')
    .replace(/[…]/g, '...')
    .replace(/[ ]/g, ' ')
    // Remove ### and other markdown artifacts
    .replace(/###/g, '')
    .replace(/##/g, '')
    // Remove emojis but keep Swedish characters
    .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu, '');
}

// Helper to parse text with bold markers
function parseTextWithBold(text: string) {
  const parts = [];
  const regex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    // Add normal text before bold
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), bold: false });
    }
    // Add bold text
    parts.push({ text: match[1], bold: true });
    lastIndex = regex.lastIndex;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), bold: false });
  }
  
  return parts.length > 0 ? parts : [{ text, bold: false }];
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const answersStr = formData.get('answers') as string;
    const additionalAnswersStr = formData.get('additionalAnswers') as string;
    const scoreStr = formData.get('score') as string;
    const companyName = formData.get('company') as string;
    const logo = formData.get('logo') as File;
    
    const answers = JSON.parse(answersStr);
    const additionalAnswers = JSON.parse(additionalAnswersStr);
    const score = parseInt(scoreStr);

    // Konvertera logo till buffer om det finns
    let logoBuffer: Buffer | null = null;
    if (logo) {
      const arrayBuffer = await logo.arrayBuffer();
      logoBuffer = Buffer.from(arrayBuffer);
    }

    // Generera djupgående analys med OpenAI (3x längre)
    const analysisPrompt = `
    Du är en erfaren affärsrådgivare och investerare. Analysera följande affärsplan mycket grundligt och ge konkreta, handlingsorienterade råd.

    FÖRETAGSDATA:
    ${JSON.stringify(answers, null, 2)}

    YTTERLIGARE BRANSCHSPECIFIK INFORMATION:
    ${JSON.stringify(additionalAnswers, null, 2)}

    SCORE: ${score}/100

    Skapa en MYCKET OMFATTANDE analys (minst 3000 ord) som inkluderar:

    1. SAMMANFATTNING
    - Executive summary
    - Huvudsakliga styrkor och svagheter
    - Investeringspotential

    2. AFFÄRSMODELLANALYS
    - Detaljerad genomgång av affärsmodellen
    - Intäktsströmmar och kostnadsstruktur
    - Skalbarhet och tillväxtpotential
    - Unit economics

    3. MARKNADSANALYS
    - TAM/SAM/SOM validering
    - Marknadstrender och timing
    - Konkurrenssituation
    - Positionering och differentiering

    4. TEAMANALYS
    - Founder-market fit bedömning
    - Kompetensluckor
    - Organisationsstruktur
    - Rekryteringsbehov

    5. FINANSIELL ANALYS
    - Kapitalbehov och användning
    - Runway och burn rate
    - Finansiella prognoser
    - Exit-möjligheter

    6. RISKANALYS
    - Identifierade risker
    - Riskbedömning (låg/medel/hög)
    - Riskminimeringsstrategier

    7. KONKRETA FÖRBÄTTRINGSÅTGÄRDER
    - Prioriterade åtgärder (1-3 månader)
    - Medellångsiktiga åtgärder (3-12 månader)
    - Långsiktiga strategiska initiativ

    8. BRANSCHSPECIFIKA REKOMMENDATIONER
    - Regulatoriska aspekter
    - Go-to-market strategi
    - KPI:er och mätning
    - Prissättningsstrategi
    - Partnerskap och samarbeten

    9. INVESTERINGSBEDÖMNING
    - Investeringsredo eller ej
    - Värdering och villkor
    - Typ av investerare som passar
    - Förberedelser inför kapitalanskaffning

    10. NÄSTA STEG
    - Konkret handlingsplan
    - Milstolpar att uppnå
    - Resurser som behövs

    Var MYCKET specifik och ge konkreta exempel. Undvik generella råd. Basera analysen på den specifika branschen och affärsmodellen.
    Skriv på svenska och använd en professionell men tillgänglig ton.
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: 'Du är en expert på affärsanalys och investeringar. Ge djupgående, konkreta och handlingsorienterade råd.'
        },
        { role: 'user', content: analysisPrompt }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const deepAnalysis = completion.choices[0]?.message?.content || '';

    // Skapa PDF-dokument
    const pdfDoc = await PDFDocument.create();
    
    // Ladda typsnitt
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Färger
    const primaryColor = rgb(0.086, 0.278, 0.357); // #16475b
    const secondaryColor = rgb(0.494, 0.863, 1); // #7edcff
    const textColor = rgb(0.1, 0.1, 0.1);
    const lightGray = rgb(0.95, 0.95, 0.95);
    const mediumGray = rgb(0.6, 0.6, 0.6);
    
    // Första sidan - Omslag
    let currentPage = pdfDoc.addPage([595, 842]); // A4
    const { width, height } = currentPage.getSize();
    
    // Modern gradient-liknande bakgrund
    currentPage.drawRectangle({
      x: 0,
      y: height - 300,
      width: width,
      height: 300,
      color: primaryColor,
    });
    
    // Dekorativ linje
    currentPage.drawRectangle({
      x: 0,
      y: height - 305,
      width: width,
      height: 5,
      color: secondaryColor,
    });
    
    // Logo om det finns
    if (logoBuffer) {
      try {
        const logoImage = await pdfDoc.embedPng(logoBuffer);
        const logoHeight = 60;
        const logoWidth = (logoImage.width / logoImage.height) * logoHeight;
        currentPage.drawImage(logoImage, {
          x: (width - logoWidth) / 2,
          y: height - 100,
          width: logoWidth,
          height: logoHeight,
        });
      } catch (e) {
        console.error('Could not embed logo:', e);
      }
    }
    
    // Titel
    currentPage.drawText('AFFÄRSANALYS', {
      x: 50,
      y: height - 250,
      size: 36,
      font: helveticaBoldFont,
      color: primaryColor,
    });
    
    currentPage.drawText(companyName || 'Företagsnamn', {
      x: 50,
      y: height - 290,
      size: 24,
      font: helveticaFont,
      color: textColor,
    });
    
    // Datum
    currentPage.drawText(new Date().toLocaleDateString('sv-SE'), {
      x: 50,
      y: height - 330,
      size: 14,
      font: helveticaFont,
      color: textColor,
    });
    
    // Score sektion med förklaring
    const scoreX = width / 2 - 100;
    const scoreY = height - 400;
    
    // Score cirkel bakgrund
    const scoreColor = score >= 80 ? rgb(0.49, 0.86, 0.48) : score >= 60 ? rgb(1, 0.84, 0) : rgb(1, 0.42, 0.42);
    currentPage.drawCircle({
      x: width / 2,
      y: scoreY + 20,
      size: 80,
      color: lightGray,
      borderColor: scoreColor,
      borderWidth: 5,
    });
    
    // Score text
    currentPage.drawText(`${score}`, {
      x: width / 2 - (score >= 100 ? 30 : 20),
      y: scoreY + 5,
      size: 48,
      font: helveticaBoldFont,
      color: primaryColor,
    });
    
    currentPage.drawText('/100', {
      x: width / 2 + (score >= 100 ? 30 : 20),
      y: scoreY,
      size: 20,
      font: helveticaFont,
      color: mediumGray,
    });
    
    // Score förklaring
    const scoreExplanation = score >= 80 
      ? 'Utmärkt! Er affärsplan visar stark potential för investeringar.'
      : score >= 60 
      ? 'Bra! Er affärsplan är lovande men behöver vissa förbättringar.'
      : 'Grundläggande. Er affärsplan behöver betydande utveckling.';
    
    currentPage.drawText(scoreExplanation, {
      x: 50,
      y: scoreY - 80,
      size: 14,
      font: helveticaFont,
      color: textColor,
      maxWidth: width - 100,
    });
    
    // Innehåll - dela upp analysen i sektioner med förbättrad formatering
    const cleanedAnalysis = deepAnalysis
      .replace(/\*\*/g, '') // Ta bort markdown bold markers
      .replace(/###/g, '') // Ta bort ### 
      .replace(/##/g, ''); // Ta bort ##
    
    const sections = cleanedAnalysis.split(/\d+\.\s+[A-ZÅÄÖ\s]+\n/);
    let yPosition = scoreY - 150;
    let pageNumber = 1;
    
    // Lägg till horisontell linje efter score-sektionen
    currentPage.drawRectangle({
      x: 50,
      y: yPosition + 30,
      width: width - 100,
      height: 1,
      color: lightGray,
    });
    
    yPosition -= 20;
    
    // Funktion för att lägga till ny sida
    const addNewPage = () => {
      currentPage = pdfDoc.addPage([595, 842]);
      yPosition = height - 80;
      pageNumber++;
      
      // Sidfot
      currentPage.drawText(`Sida ${pageNumber}`, {
        x: width / 2 - 20,
        y: 30,
        size: 10,
        font: helveticaFont,
        color: textColor,
        opacity: 0.5,
      });
    };
    
    // Förbättrad drawWrappedText funktion
    const drawWrappedText = (text: string, x: number, fontSize: number, font: any, color: any, maxWidth: number = width - 100, isBold: boolean = false) => {
      const sanitized = sanitizeText(text);
      const parts = parseTextWithBold(sanitized);
      const currentX = x;
      let currentLine = '';
      const lineHeight = fontSize * 1.5;
      
      parts.forEach(part => {
        const words = part.text.split(' ');
        const currentFont = part.bold ? helveticaBoldFont : font;
        
        words.forEach((word, wordIndex) => {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const testWidth = currentFont.widthOfTextAtSize(testLine, fontSize);
          
          if (testWidth > maxWidth && currentLine) {
            // Rita nuvarande rad
            if (yPosition < 100) {
              addNewPage();
            }
            
            currentPage.drawText(currentLine.trim(), {
              x: currentX,
              y: yPosition,
              size: fontSize,
              font: currentFont,
              color,
            });
            
            currentLine = word;
            yPosition -= lineHeight;
          } else {
            currentLine = testLine;
          }
        });
      });
      
      // Rita sista raden
      if (currentLine.trim()) {
        if (yPosition < 100) {
          addNewPage();
        }
        
        currentPage.drawText(currentLine.trim(), {
          x: currentX,
          y: yPosition,
          size: fontSize,
          font: font,
          color,
        });
        yPosition -= lineHeight;
      }
    };
    
    // Rita analysen med förbättrad design
    const sectionTitles = [
      'SAMMANFATTNING',
      'AFFÄRSMODELLANALYS', 
      'MARKNADSANALYS',
      'TEAMANALYS',
      'FINANSIELL ANALYS',
      'RISKANALYS',
      'KONKRETA FÖRBÄTTRINGSÅTGÄRDER',
      'BRANSCHSPECIFIKA REKOMMENDATIONER',
      'INVESTERINGSBEDÖMNING',
      'NÄSTA STEG'
    ];
    
    // Förbättrad sektion för första sidan
    if (sections[0] && sections[0].trim()) {
      // Executive summary box
      currentPage.drawRectangle({
        x: 40,
        y: yPosition - 10,
        width: width - 80,
        height: 2,
        color: secondaryColor,
      });
      
      yPosition -= 30;
      
      // Sammanfattning med bättre formatering
      const summaryLines = sections[0].trim().split('\n');
      summaryLines.forEach(line => {
        if (line.trim()) {
          drawWrappedText(line.trim(), 50, 12, helveticaFont, textColor);
          yPosition -= 5;
        }
      });
    }
    
    // Starta med sektionerna på ny sida
    addNewPage();
    
    sections.forEach((section, index) => {
      if (section.trim() && index > 0) {
        // Sektionsrubrik med förbättrad design
        if (yPosition < 150) {
          addNewPage();
        }
        
        yPosition -= 30; // Extra mellanrum före rubrik
        
        // Bakgrundsfärg för rubrik
        if (index - 1 < sectionTitles.length) {
          currentPage.drawRectangle({
            x: 40,
            y: yPosition - 5,
            width: width - 80,
            height: 30,
            color: lightGray,
            opacity: 0.3,
          });
          
          currentPage.drawText(`${index}. ${sectionTitles[index - 1]}`, {
            x: 50,
            y: yPosition,
            size: 18,
            font: helveticaBoldFont,
            color: primaryColor,
          });
          
          yPosition -= 40;
        }
        
        // Sektionsinnehåll med förbättrad hantering
        const paragraphs = section.split('\n\n');
        paragraphs.forEach(paragraph => {
          if (paragraph.trim()) {
            // Hantera punktlistor med bättre indentering
            if (paragraph.trim().startsWith('-') || paragraph.trim().startsWith('•')) {
              const items = paragraph.split('\n');
              items.forEach(item => {
                if (item.trim()) {
                  // Rita bullet point
                  currentPage.drawCircle({
                    x: 60,
                    y: yPosition + 4,
                    size: 3,
                    color: secondaryColor,
                  });
                  
                  // Rita texten med indentering
                  drawWrappedText(item.trim().replace(/^[-•]\s*/, ''), 75, 11, helveticaFont, textColor, width - 125);
                  yPosition -= 8;
                }
              });
            } else if (paragraph.includes('**')) {
              // Hantera text med bold markers
              const parts = parseTextWithBold(paragraph);
              parts.forEach(part => {
                const font = part.bold ? helveticaBoldFont : helveticaFont;
                drawWrappedText(part.text, 50, 11, font, textColor);
              });
            } else {
              // Normal paragraf
              drawWrappedText(paragraph.trim(), 50, 11, helveticaFont, textColor);
            }
            yPosition -= 15; // Mellanrum mellan stycken
          }
        });
        
        yPosition -= 25; // Extra mellanrum efter sektion
      }
    });
    
    // Lägg till sidfot på sista sidan
    const lastPageIndex = pdfDoc.getPageCount() - 1;
    const lastPage = pdfDoc.getPage(lastPageIndex);
    
    // Footer med företagsinfo
    lastPage.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: 60,
      color: primaryColor,
    });
    
    lastPage.drawText('Genererad av FrejFund', {
      x: 50,
      y: 30,
      size: 10,
      font: helveticaFont,
      color: rgb(1, 1, 1),
    });
    
    lastPage.drawText(new Date().toLocaleDateString('sv-SE'), {
      x: width - 100,
      y: 30,
      size: 10,
      font: helveticaFont,
      color: rgb(1, 1, 1),
    });
    
    // Generera PDF
    const pdfBytes = await pdfDoc.save();
    
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="affarsanalys-rapport.pdf"',
        'Content-Length': pdfBytes.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating deep analysis:', error);
    return NextResponse.json({ error: 'Kunde inte generera analys' }, { status: 500 });
  }
} 