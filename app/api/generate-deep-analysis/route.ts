import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { OpenAI } from 'openai';
import { getMarketData, getIndustryBenchmarks, getCompetitorAnalysis, getRegulatoryInfo, getInvestmentTrends } from '../../lib/externalDataSources';

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

    // Hämta externa data
    const [marketData, benchmarks, competitorAnalysis, regulations, investmentTrends] = await Promise.all([
      getMarketData(answers.bransch || 'SaaS', answers.omrade || 'Sverige'),
      getIndustryBenchmarks(answers.bransch || 'SaaS'),
      getCompetitorAnalysis(answers.competitors || '', answers.bransch || 'SaaS'),
      getRegulatoryInfo(answers.bransch || 'SaaS', answers.omrade || 'Sverige'),
      getInvestmentTrends(answers.bransch || 'SaaS')
    ]);

    // Generera djupgående analys med OpenAI (3x längre)
    const analysisPrompt = `
    Du är en erfaren affärsrådgivare och investerare. Analysera följande affärsplan mycket grundligt och ge konkreta, handlingsorienterade råd.

    FÖRETAGSDATA:
    ${JSON.stringify(answers, null, 2)}

    YTTERLIGARE BRANSCHSPECIFIK INFORMATION:
    ${JSON.stringify(additionalAnswers, null, 2)}

    SCORE: ${score}/100

    EXTERNA MARKNADSDATA:
    - Total marknadsstorlek: ${(marketData.totalMarketSize / 1000000000).toFixed(1)} miljarder SEK
    - Marknadstillväxt: ${marketData.growthRate}% årligen
    - Största aktörer: ${marketData.topPlayers.join(', ')}
    - Marknadstrender: ${marketData.marketTrends.join(', ')}
    - Källa: ${marketData.source}

    BRANSCHBENCHMARKS:
    - Genomsnittlig CAC: ${benchmarks.averageCAC} SEK
    - Genomsnittlig LTV: ${benchmarks.averageLTV} SEK
    - Genomsnittlig churn: ${benchmarks.averageChurnRate}% månadsvis
    - Genomsnittlig bruttomarginal: ${benchmarks.averageGrossMargin}%
    - Källa: ${benchmarks.source}

    KONKURRENTANALYS:
    ${competitorAnalysis.map(c => `
    - ${c.name}: ${c.marketShare.toFixed(1)}% marknadsandel, ${(c.funding/1000000).toFixed(1)}M SEK i finansiering
      Styrkor: ${c.strengths.join(', ')}
      Svagheter: ${c.weaknesses.join(', ')}
    `).join('')}

    REGULATORISKA KRAV:
    ${regulations.join('\n    - ')}

    INVESTERINGSTRENDER:
    - Genomsnittlig deal-storlek: ${(investmentTrends.averageDealSize/1000000).toFixed(1)}M SEK
    - Totalt antal investeringar: ${investmentTrends.totalInvestments}
    - Topp-investerare: ${investmentTrends.topInvestors.join(', ')}
    - Källa: ${investmentTrends.source}

    Skapa en MYCKET OMFATTANDE analys (minst 5000 ord) som ska fylla 30 sidor. Använd ovanstående externa data för att göra analysen konkret och datadrivet. Inkludera:

    1. EXECUTIVE SUMMARY (2 sidor)
    - Sammanfattning av hela analysen
    - Huvudsakliga styrkor och svagheter
    - Investeringspotential och rekommendation
    - Kritiska framgångsfaktorer

    2. FÖRETAGSÖVERSIKT & VISION (3 sidor)
    - Företagets historia och utveckling
    - Mission och vision
    - Värdegrund och företagskultur
    - Långsiktiga mål (5-10 år)

    3. AFFÄRSMODELLANALYS (4 sidor)
    - Detaljerad genomgång av affärsmodellen
    - Intäktsströmmar och kostnadsstruktur
    - Unit economics breakdown
    - Skalbarhet och operationell hävstång
    - Affärsmodell canvas

    4. MARKNADSANALYS & POSITION (5 sidor)
    - TAM/SAM/SOM djupanalys med källor
    - Marknadssegmentering
    - Tillväxttakt och drivkrafter
    - Porter's Five Forces analys
    - Konkurrenssituation och positionering
    - Marknadstrender nästa 5 år

    5. KUNDANALYS & GO-TO-MARKET (3 sidor)
    - Kundprofiler och personas
    - Customer journey mapping
    - Värdeproposition per segment
    - Försäljnings- och marknadsföringsstrategi
    - Distributionskanaler

    6. TEAMANALYS & ORGANISATION (3 sidor)
    - Founder-market fit djupanalys
    - Teamets styrkor och svagheter
    - Kompetensluckor och rekryteringsbehov
    - Organisationsstruktur och kultur
    - Advisory board och mentorer

    7. FINANSIELL ANALYS & PROJEKTIONER (4 sidor)
    - Historisk finansiell utveckling
    - 3-års finansiella projektioner
    - Olika scenarion (best/base/worst case)
    - Cash flow analys
    - Break-even analys
    - Kapitalbehov och användning

    8. RISKANALYS & MITIGATION (3 sidor)
    - SWOT-analys
    - Identifierade risker (marknads-, operations-, finansiella)
    - Riskmatris (sannolikhet x påverkan)
    - Riskminimeringsstrategier
    - Beredskapsplaner

    9. BRANSCHSPECIFIKA INSIKTER (2 sidor)
    - Regulatoriska överväganden
    - Branschspecifika KPIer och benchmarks
    - Best practices från framgångsrika bolag
    - Teknologiska trender och disruption

    10. INVESTERINGSBEDÖMNING (2 sidor)
    - Värdering och metodologi
    - Jämförelse med liknande bolag
    - Exit-möjligheter och strategier
    - ROI-potential för investerare
    - Term sheet rekommendationer

    11. STRATEGISKA REKOMMENDATIONER (2 sidor)
    - Prioriterade åtgärder (0-3 månader)
    - Medellångsiktiga initiativ (3-12 månader)
    - Långsiktig strategi (1-3 år)
    - Milstolpar och KPIer

    12. APPENDIX & KÄLLHÄNVISNINGAR (1 sida)
    - Referenser till marknadsstudier
    - Branschrapporter
    - Finansiella antaganden

    EXTERNA DATAKÄLLOR ATT REFERERA (simulerade):
    - SCB Branschstatistik ${new Date().getFullYear()}
    - McKinsey ${answers.bransch || 'Tech'} Report ${new Date().getFullYear()}
    - Gartner Market Analysis
    - CB Insights Industry Trends
    - PwC Nordic Startup Survey

    Var EXTREMT specifik och detaljerad. Använd konkreta exempel, siffror och jämförelser.
    Inkludera grafer och tabeller där relevant (beskriv dem i text).
    Skriv professionellt men tillgängligt på svenska.
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview', // Använd GPT-4 för premium
      messages: [
        { 
          role: 'system', 
          content: 'Du är en senior affärsrådgivare med 20+ års erfarenhet av investeringar och företagsutveckling. Ge extremt detaljerade, konkreta och handlingsorienterade råd baserat på best practice och aktuell marknadsinformation.'
        },
        { role: 'user', content: analysisPrompt }
      ],
      max_tokens: 8000, // Öka för längre analys
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