import { NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function POST(request: Request) {
  try {
    const { score, answers, insights } = await request.json();

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Add first page - Cover
    const coverPage = pdfDoc.addPage([595, 842]); // A4 size
    const { width, height } = coverPage.getSize();

    // Background gradient effect (simulated with rectangles)
    coverPage.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: height,
      color: rgb(0.016, 0.067, 0.114), // #04111d
    });

    // Title
    coverPage.drawText('AI-DRIVEN', {
      x: width / 2 - 100,
      y: height - 200,
      size: 40,
      font: helveticaBold,
      color: rgb(0.58, 0.19, 0.92), // Purple
    });

    coverPage.drawText('AFFÄRSANALYS', {
      x: width / 2 - 130,
      y: height - 250,
      size: 40,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });

    // Score circle
    const centerX = width / 2;
    const centerY = height / 2 + 50;
    const radius = 80;

    // Draw circle outline
    for (let i = 0; i < 360; i += 5) {
      const angle = (i * Math.PI) / 180;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      coverPage.drawCircle({
        x: x,
        y: y,
        size: 3,
        color: i < (360 * score / 100) ? rgb(0.96, 0.62, 0.05) : rgb(0.2, 0.2, 0.2),
      });
    }

    // Score text
    coverPage.drawText(score.toString(), {
      x: centerX - (score >= 100 ? 35 : 25),
      y: centerY - 20,
      size: 60,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });

    // Company name
    coverPage.drawText(answers.company_name || 'FrejFund Demo', {
      x: 50,
      y: 100,
      size: 20,
      font: helveticaFont,
      color: rgb(1, 1, 1),
    });

    // Date
    const date = new Date().toLocaleDateString('sv-SE');
    coverPage.drawText(date, {
      x: width - 150,
      y: 100,
      size: 14,
      font: helveticaFont,
      color: rgb(0.6, 0.6, 0.6),
    });

    // Add summary page
    const summaryPage = pdfDoc.addPage([595, 842]);
    
    // Header
    summaryPage.drawText('SAMMANFATTNING', {
      x: 50,
      y: height - 100,
      size: 24,
      font: helveticaBold,
      color: rgb(0.016, 0.067, 0.114),
    });

    // Score interpretation
    let scoreLabel = '';
    let scoreColor = rgb(0, 0, 0);
    if (score >= 85) {
      scoreLabel = 'INVESTOR READY';
      scoreColor = rgb(0.06, 0.73, 0.51);
    } else if (score >= 70) {
      scoreLabel = 'STARK POTENTIAL';
      scoreColor = rgb(0.96, 0.62, 0.05);
    } else if (score >= 50) {
      scoreLabel = 'LOVANDE START';
      scoreColor = rgb(0.94, 0.27, 0.27);
    } else {
      scoreLabel = 'TIDIGT STADIUM';
      scoreColor = rgb(0.42, 0.45, 0.5);
    }

    summaryPage.drawText(`Score: ${score} - ${scoreLabel}`, {
      x: 50,
      y: height - 150,
      size: 18,
      font: helveticaBold,
      color: scoreColor,
    });

    // Key insights
    let yPosition = height - 200;
    const insights_text = [
      'HUVUDSAKLIGA STYRKOR:',
      '• Tydlig problemidentifiering och lösning',
      '• Erfaret team med relevant bakgrund',
      '• Stor marknadspotential',
      '',
      'KRITISKA FÖRBÄTTRINGSOMRÅDEN:',
      '• Säkra första 10 betalande kunder',
      '• Dokumentera unit economics',
      '• Bygga ut säljteamet',
    ];

    for (const line of insights_text) {
      if (line.startsWith('HUVUDSAKLIGA') || line.startsWith('KRITISKA')) {
        summaryPage.drawText(line, {
          x: 50,
          y: yPosition,
          size: 14,
          font: helveticaBold,
          color: rgb(0.016, 0.067, 0.114),
        });
      } else {
        summaryPage.drawText(line, {
          x: 50,
          y: yPosition,
          size: 12,
          font: helveticaFont,
          color: rgb(0.3, 0.3, 0.3),
        });
      }
      yPosition -= 25;
    }

    // Add detailed analysis pages...
    // (This would continue with more pages for each section)

    // Serialize the PDF
    const pdfBytes = await pdfDoc.save();

    // Return the PDF
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=affarsanalys.pdf',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
} 