import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { OpenAI } from 'openai';

export const runtime = 'nodejs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    
    // Första sidan - Omslag
    let currentPage = pdfDoc.addPage([595, 842]); // A4
    const { width, height } = currentPage.getSize();
    
    // Bakgrundsfärg för header
    currentPage.drawRectangle({
      x: 0,
      y: height - 200,
      width: width,
      height: 200,
      color: primaryColor,
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
    
    // Score badge
    const scoreColor = score >= 80 ? rgb(0.49, 0.86, 0.48) : score >= 60 ? rgb(1, 0.84, 0) : rgb(1, 0.42, 0.42);
    currentPage.drawRectangle({
      x: width - 150,
      y: height - 350,
      width: 100,
      height: 40,
      color: scoreColor,
      opacity: 0.2,
    });
    currentPage.drawText(`Score: ${score}/100`, {
      x: width - 140,
      y: height - 335,
      size: 16,
      font: helveticaBoldFont,
      color: primaryColor,
    });
    
    // Innehåll - dela upp analysen i sektioner
    const sections = deepAnalysis.split(/\d+\.\s+[A-ZÅÄÖ\s]+\n/);
    let yPosition = height - 400;
    let pageNumber = 1;
    
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
    
    // Funktion för att skriva text med radbrytning
    const drawWrappedText = (text: string, x: number, fontSize: number, font: any, color: any, maxWidth: number = width - 100) => {
      const words = text.split(' ');
      let line = '';
      const lineHeight = fontSize * 1.5;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        
        if (testWidth > maxWidth && i > 0) {
          if (yPosition < 100) {
            addNewPage();
          }
          
          currentPage.drawText(line.trim(), {
            x,
            y: yPosition,
            size: fontSize,
            font,
            color,
          });
          
          line = words[i] + ' ';
          yPosition -= lineHeight;
        } else {
          line = testLine;
        }
      }
      
      if (line.trim()) {
        if (yPosition < 100) {
          addNewPage();
        }
        
        currentPage.drawText(line.trim(), {
          x,
          y: yPosition,
          size: fontSize,
          font,
          color,
        });
        yPosition -= lineHeight;
      }
    };
    
    // Rita analysen
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
    
    sections.forEach((section, index) => {
      if (section.trim() && index > 0) {
        // Sektionsrubrik
        if (yPosition < 150) {
          addNewPage();
        }
        
        yPosition -= 20; // Extra mellanrum före rubrik
        
        if (index - 1 < sectionTitles.length) {
          drawWrappedText(`${index}. ${sectionTitles[index - 1]}`, 50, 18, helveticaBoldFont, primaryColor);
          yPosition -= 15;
        }
        
        // Sektionsinnehåll
        const paragraphs = section.split('\n\n');
        paragraphs.forEach(paragraph => {
          if (paragraph.trim()) {
            // Hantera punktlistor
            if (paragraph.trim().startsWith('-') || paragraph.trim().startsWith('•')) {
              const items = paragraph.split('\n');
              items.forEach(item => {
                if (item.trim()) {
                  drawWrappedText(item.trim(), 70, 11, helveticaFont, textColor, width - 120);
                  yPosition -= 5;
                }
              });
            } else {
              drawWrappedText(paragraph.trim(), 50, 11, helveticaFont, textColor);
            }
            yPosition -= 10; // Mellanrum mellan stycken
          }
        });
        
        yPosition -= 20; // Extra mellanrum efter sektion
      }
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