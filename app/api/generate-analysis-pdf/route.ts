import { NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb, PageSizes } from 'pdf-lib';

interface AnalysisData {
  score: number;
  answers: any;
  insights?: any[];
  premiumAnalysis?: any;
  subscriptionLevel?: string;
}

export async function POST(request: Request) {
  try {
    const data: AnalysisData = await request.json();
    const { score, answers, insights } = data;
    
    // Extract premiumAnalysis from inside answers
    const premiumAnalysis = answers?.premiumAnalysis;
    const subscriptionLevel = data.subscriptionLevel || (premiumAnalysis ? 'premium' : 'standard');

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    // Colors
    const primaryColor = rgb(0.016, 0.067, 0.114); // #04111d
    const accentColor = rgb(0.58, 0.19, 0.92); // Purple
    const textColor = rgb(0.2, 0.2, 0.2);
    const lightGray = rgb(0.9, 0.9, 0.9);
    const white = rgb(1, 1, 1);

    // Helper functions
    const drawHeader = (page: any, title: string, subtitle?: string) => {
      const { width, height } = page.getSize();
      
      // Header background
      page.drawRectangle({
        x: 0,
        y: height - 120,
        width: width,
        height: 120,
        color: primaryColor,
      });

      // Title
      page.drawText(title.toUpperCase(), {
        x: 50,
        y: height - 80,
        size: 24,
        font: helveticaBold,
        color: white,
      });

      if (subtitle) {
        page.drawText(subtitle, {
          x: 50,
          y: height - 105,
          size: 14,
          font: helveticaFont,
          color: rgb(0.8, 0.8, 0.8),
        });
      }

      // Page number placeholder
      return height - 150; // Return Y position for content
    };

    const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = helveticaFont.widthOfTextAtSize(testLine, fontSize);
        
        if (testWidth > maxWidth) {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      
      if (currentLine) lines.push(currentLine);
      return lines;
    };

    // ===== COVER PAGE =====
    const coverPage = pdfDoc.addPage(PageSizes.A4);
    const { width, height } = coverPage.getSize();

    // Background
    coverPage.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: height,
      color: primaryColor,
    });

    // Logo/Brand area (top)
    coverPage.drawText('FREJFUND', {
      x: 50,
      y: height - 80,
      size: 36,
      font: helveticaBold,
      color: white,
    });

    // Main title
    coverPage.drawText('AI-DRIVEN', {
      x: width / 2 - 80,
      y: height / 2 + 100,
      size: 36,
      font: helveticaFont,
      color: accentColor,
    });

    coverPage.drawText('AFFÄRSANALYS', {
      x: width / 2 - 120,
      y: height / 2 + 60,
      size: 42,
      font: helveticaBold,
      color: white,
    });

    // Score display with modern design
    const scoreX = width / 2;
    const scoreY = height / 2 - 50;

    // Score background rectangle
    coverPage.drawRectangle({
      x: scoreX - 70,
      y: scoreY - 70,
      width: 140,
      height: 140,
      color: rgb(0.1, 0.1, 0.15),
    });
    
    // Score value
    coverPage.drawText(score.toString(), {
      x: scoreX - (score >= 100 ? 35 : 25),
      y: scoreY - 20,
      size: 56,
      font: helveticaBold,
      color: white,
    });

    // Score label
    let scoreLabel = '';
    let scoreDescription = '';
    if (score >= 85) {
      scoreLabel = 'INVESTOR READY';
      scoreDescription = 'Er affärsplan är redo för investerare';
    } else if (score >= 70) {
      scoreLabel = 'STARK POTENTIAL';
      scoreDescription = 'Nära investeringsnivå med vissa förbättringar';
    } else if (score >= 50) {
      scoreLabel = 'LOVANDE START';
      scoreDescription = 'Bra grund som behöver vidareutveckling';
    } else {
      scoreLabel = 'TIDIGT STADIUM';
      scoreDescription = 'Fokusera på att stärka grunderna';
    }

    coverPage.drawText(scoreLabel, {
      x: width / 2 - helveticaBold.widthOfTextAtSize(scoreLabel, 18) / 2,
      y: scoreY - 80,
      size: 18,
      font: helveticaBold,
      color: accentColor,
    });

    coverPage.drawText(scoreDescription, {
      x: width / 2 - helveticaFont.widthOfTextAtSize(scoreDescription, 12) / 2,
      y: scoreY - 100,
      size: 12,
      font: helveticaOblique,
      color: rgb(0.7, 0.7, 0.7),
    });

    // Company info
    const companyName = answers.company_name || answers.company || 'Företagsnamn';
    coverPage.drawText(companyName, {
      x: 50,
      y: 80,
      size: 18,
      font: helveticaBold,
      color: white,
    });

    // Date
    const date = new Date().toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    coverPage.drawText(date, {
      x: 50,
      y: 50,
      size: 12,
      font: helveticaFont,
      color: rgb(0.6, 0.6, 0.6),
    });

    // ===== INNEHÅLLSFÖRTECKNING =====
    const tocPage = pdfDoc.addPage(PageSizes.A4);
    let yPos = drawHeader(tocPage, 'Innehållsförteckning');

    const sections = [
      { title: 'Sammanfattning', page: 3 },
      { title: 'Problem & Lösning', page: 4 },
      { title: 'Marknadsanalys', page: 5 },
      { title: 'Affärsmodell', page: 6 },
      { title: 'Team & Kompetens', page: 7 },
      { title: 'Finansiell Plan', page: 8 },
    ];

    if (subscriptionLevel === 'premium') {
      sections.push(
        { title: 'SWOT-Analys', page: 9 },
        { title: 'Finansiella Projektioner', page: 10 },
        { title: 'Detaljerade Rekommendationer', page: 11 },
        { title: 'Investeringsförslag', page: 12 }
      );
    }

    sections.forEach((section, index) => {
      // Section number
      tocPage.drawText(`${index + 1}.`, {
        x: 70,
        y: yPos,
        size: 14,
        font: helveticaBold,
        color: accentColor,
      });

      // Section title
      tocPage.drawText(section.title, {
        x: 100,
        y: yPos,
        size: 14,
        font: helveticaFont,
        color: textColor,
      });

      // Dotted line
      const dotsWidth = width - 250;
      const dotCount = Math.floor(dotsWidth / 5);
      for (let i = 0; i < dotCount; i++) {
        tocPage.drawText('.', {
          x: 220 + (i * 5),
          y: yPos,
          size: 14,
          font: helveticaFont,
          color: lightGray,
        });
      }

      // Page number
      tocPage.drawText(section.page.toString(), {
        x: width - 100,
        y: yPos,
        size: 14,
        font: helveticaFont,
        color: textColor,
      });

      yPos -= 35;
    });

    // ===== SAMMANFATTNING =====
    const summaryPage = pdfDoc.addPage(PageSizes.A4);
    yPos = drawHeader(summaryPage, 'Sammanfattning', 'Executive Summary');

    // Score section with visual indicator
    summaryPage.drawRectangle({
      x: 50,
      y: yPos - 60,
      width: width - 100,
      height: 50,
      color: lightGray,
    });

    summaryPage.drawText(`Totalpoäng: ${score}/100`, {
      x: 70,
      y: yPos - 40,
      size: 18,
      font: helveticaBold,
      color: primaryColor,
    });

    summaryPage.drawText(scoreLabel, {
      x: 250,
      y: yPos - 40,
      size: 18,
      font: helveticaBold,
      color: accentColor,
    });

    yPos -= 100;

    // Key strengths
    summaryPage.drawText('HUVUDSAKLIGA STYRKOR', {
      x: 50,
      y: yPos,
      size: 16,
      font: helveticaBold,
      color: primaryColor,
    });
    yPos -= 30;

    const strengths = [
      answers.customer_problem ? '[v] Tydlig problemidentifiering' : null,
      answers.solution ? '[v] Väldefinierad lösning' : null,
      answers.team ? '[v] Erfaret team' : null,
      answers.market_size ? '[v] Stor marknadspotential' : null,
    ].filter(Boolean);

    strengths.forEach(strength => {
      if (strength) {
        summaryPage.drawText(strength, {
          x: 70,
          y: yPos,
          size: 12,
          font: helveticaFont,
          color: textColor,
        });
        yPos -= 25;
      }
    });

    yPos -= 20;

    // Areas for improvement
    summaryPage.drawText('FÖRBÄTTRINGSOMRÅDEN', {
      x: 50,
      y: yPos,
      size: 16,
      font: helveticaBold,
      color: primaryColor,
    });
    yPos -= 30;

    const improvements = [
      !answers.traction ? '- Bevisa traction med första kunderna' : null,
      !answers.unit_economics ? '- Dokumentera enhetsekonomi' : null,
      score < 70 ? '- Stärka investeringspropositionen' : null,
    ].filter(Boolean);

    improvements.forEach(improvement => {
      if (improvement) {
        summaryPage.drawText(improvement, {
          x: 70,
          y: yPos,
          size: 12,
          font: helveticaFont,
          color: textColor,
        });
        yPos -= 25;
      }
    });

    // ===== DETAILED SECTIONS =====
    // Here you would add more pages for each section of the analysis
    // Problem & Solution, Market Analysis, Business Model, etc.

    // Add a helper to create section pages
    const createSectionPage = (title: string, subtitle: string, content: any) => {
      const page = pdfDoc.addPage(PageSizes.A4);
      const yPosition = drawHeader(page, title, subtitle);
      
      // Add content based on the section
      return page;
    };

    // Example: Problem & Solution page
    if (answers.customer_problem || answers.solution) {
      const psPage = createSectionPage('Problem & Lösning', 'Problem-Solution Fit', null);
      // Add content...
    }

    // Serialize the PDF
    const pdfBytes = await pdfDoc.save();

    // Return the PDF
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=frejfund-affarsanalys.pdf',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 