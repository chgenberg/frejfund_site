import { NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb, PageSizes, PDFPage } from 'pdf-lib';

interface AnalysisData {
  score: number;
  answers: any;
  insights?: any[];
  premiumAnalysis?: any;
  subscriptionLevel?: string;
  actionItems?: any[];
  scoreInfo?: any;
}

export async function POST(request: Request) {
  try {
    console.log('Starting PDF generation...');
    
    const data: AnalysisData = await request.json();
    const { score, answers, insights, actionItems, scoreInfo } = data;
    
    // Extract premiumAnalysis from inside answers
    const premiumAnalysis = answers?.premiumAnalysis || data.premiumAnalysis;
    const subscriptionLevel = data.subscriptionLevel || (premiumAnalysis ? 'premium' : 'standard');
    
    console.log('PDF Generation - Premium Analysis:', premiumAnalysis ? 'Found' : 'Not found');
    console.log('PDF Generation - Subscription Level:', subscriptionLevel);
    console.log('PDF Generation - Score:', score);

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    // Colors - Professional palette
    const primaryColor = rgb(0.016, 0.067, 0.114); // #04111d
    const accentColor = rgb(0.58, 0.19, 0.92); // Purple
    const textColor = rgb(0.2, 0.2, 0.2);
    const lightGray = rgb(0.95, 0.95, 0.95);
    const mediumGray = rgb(0.7, 0.7, 0.7);
    const white = rgb(1, 1, 1);
    const greenColor = rgb(0.2, 0.8, 0.2);
    const redColor = rgb(0.8, 0.2, 0.2);
    const blueColor = rgb(0.2, 0.4, 0.8);
    const orangeColor = rgb(1, 0.5, 0);

    // Helper functions
    const drawHeader = (page: any, title: string, subtitle?: string) => {
      const { width, height } = page.getSize();
      
      // Header background with gradient effect - multiple layers for gradient simulation
      page.drawRectangle({
        x: 0,
        y: height - 120,
        width: width,
        height: 120,
        color: primaryColor,
      });
      
      // Gradient overlay effect
      page.drawRectangle({
        x: 0,
        y: height - 120,
        width: width / 2,
        height: 120,
        color: rgb(0.016, 0.067, 0.114),
        opacity: 0.7,
      });

      // Accent line - purple gradient effect
      page.drawRectangle({
        x: 0,
        y: height - 122,
        width: width,
        height: 4,
        color: accentColor,
      });
      
      // Decorative element
      page.drawRectangle({
        x: width - 150,
        y: height - 100,
        width: 100,
        height: 60,
        color: accentColor,
        opacity: 0.1,
      });

      // Title with better positioning
      page.drawText(title.toUpperCase(), {
        x: 50,
        y: height - 65,
        size: 24,
        font: helveticaBold,
        color: white,
      });

      if (subtitle) {
        page.drawText(subtitle, {
          x: 50,
          y: height - 90,
          size: 14,
          font: helveticaFont,
          color: rgb(0.8, 0.8, 0.8),
        });
      }
      
      // Page decoration - modern geometric shape
      page.drawRectangle({
        x: 50,
        y: height - 150,
        width: 60,
        height: 2,
        color: accentColor,
      });

      // Return Y position for content
      return height - 170;
    };

    const wrapText = (text: string, maxWidth: number, fontSize: number, font: any): string[] => {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        
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

    const drawWrappedText = (
      page: any, 
      text: string, 
      x: number, 
      y: number, 
      maxWidth: number, 
      fontSize: number, 
      font: any, 
      color: any,
      lineHeight: number = 1.5
    ): number => {
      const lines = wrapText(text, maxWidth, fontSize, font);
      let currentY = y;
      
      lines.forEach(line => {
        page.drawText(line, {
          x,
          y: currentY,
          size: fontSize,
          font,
          color,
        });
        currentY -= fontSize * lineHeight;
      });
      
      return currentY;
    };

    const addPageNumber = (page: any, pageNum: number, totalPages: number) => {
      const { width } = page.getSize();
      page.drawText(`${pageNum} / ${totalPages}`, {
        x: width - 70,
        y: 30,
        size: 10,
        font: helveticaFont,
        color: mediumGray,
      });
    };

    // Track pages for numbering
    const pages: PDFPage[] = [];

    // ===== COVER PAGE =====
    const coverPage = pdfDoc.addPage(PageSizes.A4);
    const { width, height } = coverPage.getSize();
    pages.push(coverPage);

    // Background gradient effect
    coverPage.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: height,
      color: primaryColor,
    });

    // Top accent
    coverPage.drawRectangle({
      x: 0,
      y: height - 50,
      width: width,
      height: 50,
      color: rgb(0.02, 0.08, 0.15),
    });

    // Logo/Brand
    coverPage.drawText('FREJFUND', {
      x: 50,
      y: height - 80,
      size: 32,
      font: helveticaBold,
      color: white,
    });

    coverPage.drawText('AI-DRIVEN AFFÄRSANALYS', {
      x: 50,
      y: height - 105,
      size: 14,
      font: helveticaFont,
      color: accentColor,
    });

    // Main content area with modern card design
    const cardY = height / 2 + 50;
    const cardHeight = 280;
    
    // Card background
    coverPage.drawRectangle({
      x: 50,
      y: cardY - cardHeight,
      width: width - 100,
      height: cardHeight,
      color: rgb(0.02, 0.08, 0.15),
    });

    // Score circle background
    const scoreX = width / 2;
    const scoreY = cardY - 100;
    
    // Score background
    coverPage.drawRectangle({
      x: scoreX - 80,
      y: scoreY - 80,
      width: 160,
      height: 160,
      color: primaryColor,
    });

    // Score ring effect
    coverPage.drawRectangle({
      x: scoreX - 75,
      y: scoreY - 75,
      width: 150,
      height: 150,
      color: rgb(0.05, 0.1, 0.18),
    });

    // Inner score area
    coverPage.drawRectangle({
      x: scoreX - 65,
      y: scoreY - 65,
      width: 130,
      height: 130,
      color: primaryColor,
    });

    // Score value
    const scoreSize = score >= 100 ? 48 : 56;
    const scoreOffset = score >= 100 ? 40 : 30;
    coverPage.drawText(score.toString(), {
      x: scoreX - scoreOffset,
      y: scoreY - 15,
      size: scoreSize,
      font: helveticaBold,
      color: white,
    });

    coverPage.drawText('POÄNG', {
      x: scoreX - 25,
      y: scoreY - 45,
      size: 12,
      font: helveticaFont,
      color: accentColor,
    });

    // Score interpretation
    let scoreLabel = '';
    let scoreColor = greenColor;
    if (score >= 85) {
      scoreLabel = 'INVESTOR READY';
      scoreColor = greenColor;
    } else if (score >= 70) {
      scoreLabel = 'STARK POTENTIAL';
      scoreColor = orangeColor;
    } else if (score >= 50) {
      scoreLabel = 'LOVANDE START';
      scoreColor = orangeColor;
    } else {
      scoreLabel = 'TIDIGT STADIUM';
      scoreColor = redColor;
    }

    coverPage.drawText(scoreLabel, {
      x: width / 2 - helveticaBold.widthOfTextAtSize(scoreLabel, 18) / 2,
      y: cardY - 220,
      size: 18,
      font: helveticaBold,
      color: scoreColor,
    });

    // Company info section
    const companyName = answers.company_name || answers.company || 'Företagsnamn';
    const industry = answers.industry || answers.bransch || 'Bransch';
    
    coverPage.drawRectangle({
      x: 50,
      y: 120,
      width: width - 100,
      height: 100,
      color: rgb(0.02, 0.08, 0.15),
    });

    coverPage.drawText(companyName.toUpperCase(), {
      x: 70,
      y: 180,
      size: 20,
      font: helveticaBold,
      color: white,
    });

    coverPage.drawText(industry, {
      x: 70,
      y: 155,
      size: 14,
      font: helveticaFont,
      color: accentColor,
    });

    // Date and report type
    const date = new Date().toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    coverPage.drawText(date, {
      x: 70,
      y: 130,
      size: 12,
      font: helveticaFont,
      color: mediumGray,
    });

    if (subscriptionLevel === 'premium') {
      coverPage.drawRectangle({
        x: width - 150,
        y: 140,
        width: 100,
        height: 30,
        color: accentColor,
      });

      coverPage.drawText('PREMIUM', {
        x: width - 130,
        y: 150,
        size: 12,
        font: helveticaBold,
        color: white,
      });
    }

    // ===== INNEHÅLLSFÖRTECKNING =====
    const tocPage = pdfDoc.addPage(PageSizes.A4);
    pages.push(tocPage);
    let yPos = drawHeader(tocPage, 'Innehållsförteckning', 'Komplett översikt av er affärsanalys');

    // Dynamically build sections based on actual content
    const sections: { title: string; page: number; type: string }[] = [
      { title: 'Sammanfattning', page: 3, type: 'standard' },
      { title: 'Affärspoäng & Bedömning', page: 4, type: 'standard' },
      { title: 'Problem & Lösning', page: 5, type: 'standard' },
      { title: 'Marknadsanalys', page: 6, type: 'standard' },
      { title: 'Affärsmodell & Intäkter', page: 7, type: 'standard' },
      { title: 'Team & Kompetens', page: 8, type: 'standard' },
      { title: 'Traction & Bevis', page: 9, type: 'standard' },
      { title: 'Finansiell Plan', page: 10, type: 'standard' },
      { title: 'Risker & Möjligheter', page: 11, type: 'standard' },
      { title: 'Åtgärdsplan', page: 12, type: 'standard' },
    ];

    // Only add premium sections if we have premium data
    if (subscriptionLevel === 'premium' && premiumAnalysis) {
      let nextPage = 13;
      sections.push({ title: 'PREMIUM INNEHÅLL', page: nextPage++, type: 'header' });
      
      if (premiumAnalysis.swot) {
        sections.push({ title: 'SWOT-Analys', page: nextPage++, type: 'premium' });
      }
      if (premiumAnalysis.financialProjections) {
        sections.push({ title: 'Finansiella Projektioner (3 år)', page: nextPage++, type: 'premium' });
      }
      if (premiumAnalysis.detailedRecommendations) {
        sections.push({ title: 'Detaljerade Rekommendationer', page: nextPage++, type: 'premium' });
      }
      if (premiumAnalysis.benchmarkAnalysis) {
        sections.push({ title: 'Benchmark-Analys', page: nextPage++, type: 'premium' });
      }
      if (premiumAnalysis.investmentProposal) {
        sections.push({ title: 'Investeringsförslag', page: nextPage++, type: 'premium' });
      }
      if (premiumAnalysis.marketInsights) {
        sections.push({ title: 'Marknadsinsikter', page: nextPage++, type: 'premium' });
      }
      if (premiumAnalysis.investorFilm) {
        sections.push({ title: 'Investerarfilm - Koncept & Guide', page: nextPage++, type: 'premium' });
      }
      if (premiumAnalysis.aiImagePrompts) {
        sections.push({ title: 'AI Bildprompts', page: nextPage++, type: 'premium' });
      }
    }

    // Draw TOC sections
    sections.forEach((section, index) => {
      if (section.type === 'header') {
        // Premium header
        yPos -= 15;
        tocPage.drawRectangle({
          x: 50,
          y: yPos - 5,
          width: width - 100,
          height: 30,
          color: accentColor,
        });
        tocPage.drawText(section.title, {
          x: 70,
          y: yPos + 5,
          size: 14,
          font: helveticaBold,
          color: white,
        });
        yPos -= 40;
      } else {
        // Regular sections
        const isPremium = section.type === 'premium';
        const bulletColor = isPremium ? accentColor : primaryColor;
        
        // Bullet
        tocPage.drawRectangle({
          x: 60,
          y: yPos + 5,
          width: 6,
          height: 6,
          color: bulletColor,
        });

        // Section title
        tocPage.drawText(section.title, {
          x: 80,
          y: yPos,
          size: 12,
          font: isPremium ? helveticaBold : helveticaFont,
          color: textColor,
        });

        // Page number with dots
        const titleWidth = (isPremium ? helveticaBold : helveticaFont).widthOfTextAtSize(section.title, 12);
        const dotsStart = 85 + titleWidth;
        const dotsEnd = width - 100;
        const dotSpacing = 8;
        
        for (let x = dotsStart; x < dotsEnd - 50; x += dotSpacing) {
          tocPage.drawText('.', {
            x,
            y: yPos,
            size: 12,
            font: helveticaFont,
            color: lightGray,
          });
        }

        // Page number
        tocPage.drawText(section.page.toString(), {
          x: width - 80,
          y: yPos,
          size: 12,
          font: helveticaBold,
          color: bulletColor,
        });

        yPos -= 25;
      }
      
      // Check if we need a new page
      if (yPos < 100 && index < sections.length - 1) {
        const newTocPage = pdfDoc.addPage(PageSizes.A4);
        pages.push(newTocPage);
        yPos = drawHeader(newTocPage, 'Innehållsförteckning', 'Fortsättning');
      }
    });

    // ===== SAMMANFATTNING =====
    const summaryPage = pdfDoc.addPage(PageSizes.A4);
    pages.push(summaryPage);
    yPos = drawHeader(summaryPage, 'Sammanfattning', 'Executive Summary');

    // Key metrics cards
    const metricCardWidth = (width - 140) / 3;
    const metricCardHeight = 80;
    const metricCardY = yPos - 20;

    // Score card
    summaryPage.drawRectangle({
      x: 50,
      y: metricCardY - metricCardHeight,
      width: metricCardWidth,
      height: metricCardHeight,
      color: rgb(0.02, 0.08, 0.15),
    });
    
    summaryPage.drawText('TOTALPOÄNG', {
      x: 60,
      y: metricCardY - 25,
      size: 10,
      font: helveticaFont,
      color: mediumGray,
    });
    
    summaryPage.drawText(`${score}/100`, {
      x: 60,
      y: metricCardY - 50,
      size: 24,
      font: helveticaBold,
      color: score >= 70 ? greenColor : orangeColor,
    });

    // Status card
    summaryPage.drawRectangle({
      x: 60 + metricCardWidth,
      y: metricCardY - metricCardHeight,
      width: metricCardWidth,
      height: metricCardHeight,
      color: rgb(0.02, 0.08, 0.15),
    });
    
    summaryPage.drawText('STATUS', {
      x: 70 + metricCardWidth,
      y: metricCardY - 25,
      size: 10,
      font: helveticaFont,
      color: mediumGray,
    });
    
    summaryPage.drawText(scoreLabel, {
      x: 70 + metricCardWidth,
      y: metricCardY - 50,
      size: 14,
      font: helveticaBold,
      color: score >= 70 ? greenColor : orangeColor,
    });

    // Insights card
    summaryPage.drawRectangle({
      x: 70 + metricCardWidth * 2,
      y: metricCardY - metricCardHeight,
      width: metricCardWidth,
      height: metricCardHeight,
      color: rgb(0.02, 0.08, 0.15),
    });
    
    summaryPage.drawText('ANALYSERADE', {
      x: 80 + metricCardWidth * 2,
      y: metricCardY - 25,
      size: 10,
      font: helveticaFont,
      color: mediumGray,
    });
    
    summaryPage.drawText(`${Object.keys(answers).length} områden`, {
      x: 80 + metricCardWidth * 2,
      y: metricCardY - 50,
      size: 16,
      font: helveticaBold,
      color: blueColor,
    });

    yPos = metricCardY - metricCardHeight - 40;

    // Executive Summary text
    summaryPage.drawText('ÖVERSIKT', {
      x: 50,
      y: yPos,
      size: 14,
      font: helveticaBold,
      color: primaryColor,
    });
    yPos -= 25;

    const summaryText = score >= 85 
      ? `Er affärsplan visar exceptionell mognad och är redo för investerare. Ni har tydligt definierat problem och lösning, stark marknadsförståelse och en skalbar affärsmodell. Fokusera nu på att accelerera tillväxten och säkra finansiering.`
      : score >= 70
      ? `Er affärsplan visar stark potential med solid grund. Några områden behöver förstärkas innan ni är helt redo för större investeringar. Prioritera de åtgärder som identifierats för att nå nästa nivå.`
      : score >= 50
      ? `Er affärsidé har lovande element men behöver vidareutveckling på flera områden. Fokusera på att validera er affärsmodell, bevisa traction och stärka teamet innan ni söker extern finansiering.`
      : `Er affärsplan är i tidigt stadium och behöver betydande utveckling. Börja med att tydligt definiera problemet ni löser, validera efterfrågan och bygga en MVP innan ni går vidare.`;

    yPos = drawWrappedText(
      summaryPage,
      summaryText,
      50,
      yPos,
      width - 100,
      12,
      helveticaFont,
      textColor
    );

    yPos -= 30;

    // Strengths and weaknesses in columns
    const columnWidth = (width - 120) / 2;

    // Strengths
    summaryPage.drawRectangle({
      x: 50,
      y: yPos - 5,
      width: columnWidth,
      height: 30,
      color: rgb(0.9, 0.98, 0.9),
    });

    summaryPage.drawText('STYRKOR', {
      x: 60,
      y: yPos + 5,
      size: 12,
      font: helveticaBold,
      color: greenColor,
    });
    yPos -= 40;

    const strengths = [
      answers.customer_problem ? 'Tydlig problemidentifiering' : null,
      answers.solution ? 'Väldefinierad lösning' : null,
      answers.team ? 'Erfaret team' : null,
      answers.market_size ? 'Stor marknadspotential' : null,
      answers.revenue_model ? 'Tydlig intäktsmodell' : null,
      answers.traction ? 'Bevisad traction' : null,
    ].filter(Boolean);

    strengths.slice(0, 5).forEach(strength => {
      summaryPage.drawRectangle({
        x: 55,
        y: yPos + 4,
        width: 4,
        height: 4,
        color: greenColor,
      });

      summaryPage.drawText(strength!, {
        x: 65,
        y: yPos,
        size: 11,
        font: helveticaFont,
        color: textColor,
      });
      yPos -= 20;
    });

    // Weaknesses - same Y position as strengths
    let weakY = yPos + (strengths.length * 20) + 40;
    
    summaryPage.drawRectangle({
      x: 60 + columnWidth,
      y: weakY - 5,
      width: columnWidth,
      height: 30,
      color: rgb(0.98, 0.9, 0.9),
    });

    summaryPage.drawText('FÖRBÄTTRINGSOMRÅDEN', {
      x: 70 + columnWidth,
      y: weakY + 5,
      size: 12,
      font: helveticaBold,
      color: redColor,
    });
    weakY -= 40;

    const improvements = [
      !answers.traction ? 'Bevisa traction' : null,
      !answers.unit_economics ? 'Dokumentera enhetsekonomi' : null,
      !answers.financial_projections ? 'Finansiella prognoser saknas' : null,
      score < 70 ? 'Stärk investeringspropositionen' : null,
      !answers.exit_strategy ? 'Utveckla exit-strategi' : null,
    ].filter(Boolean);

    improvements.slice(0, 5).forEach(improvement => {
      summaryPage.drawRectangle({
        x: 65 + columnWidth,
        y: weakY + 4,
        width: 4,
        height: 4,
        color: redColor,
      });

      summaryPage.drawText(improvement!, {
        x: 75 + columnWidth,
        y: weakY,
        size: 11,
        font: helveticaFont,
        color: textColor,
      });
      weakY -= 20;
    });

    // ===== AFFÄRSPOÄNG & BEDÖMNING =====
    const scorePage = pdfDoc.addPage(PageSizes.A4);
    pages.push(scorePage);
    yPos = drawHeader(scorePage, 'Affärspoäng & Bedömning', 'Detaljerad poängfördelning');

    // Score visualization
    const centerX = width / 2;
    const scoreVisualizationY = yPos - 30;

    // Main score display
    scorePage.drawRectangle({
      x: centerX - 100,
      y: scoreVisualizationY - 120,
      width: 200,
      height: 120,
      color: rgb(0.02, 0.08, 0.15),
    });

    // Inner score box
    scorePage.drawRectangle({
      x: centerX - 90,
      y: scoreVisualizationY - 110,
      width: 180,
      height: 100,
      color: primaryColor,
    });

    scorePage.drawText(score.toString(), {
      x: centerX - (score >= 100 ? 45 : 35),
      y: scoreVisualizationY - 60,
      size: 56,
      font: helveticaBold,
      color: white,
    });

    scorePage.drawText('av 100 möjliga', {
      x: centerX - 40,
      y: scoreVisualizationY - 85,
      size: 12,
      font: helveticaFont,
      color: accentColor,
    });

    yPos = scoreVisualizationY - 150;

    // Score breakdown by category
    scorePage.drawText('POÄNGFÖRDELNING PER KATEGORI', {
      x: 50,
      y: yPos,
      size: 14,
      font: helveticaBold,
      color: primaryColor,
    });
    yPos -= 30;

    const categories = [
      { name: 'Problem & Lösning', max: 20, actual: answers.customer_problem && answers.solution ? 18 : 5 },
      { name: 'Marknadsanalys', max: 15, actual: answers.market_size ? 12 : 3 },
      { name: 'Affärsmodell', max: 15, actual: answers.revenue_model ? 13 : 4 },
      { name: 'Team', max: 15, actual: answers.team ? 14 : 5 },
      { name: 'Traction', max: 10, actual: answers.traction ? 8 : 2 },
      { name: 'Finansiell plan', max: 15, actual: answers.runway ? 10 : 3 },
      { name: 'Risker & Strategi', max: 10, actual: answers.risks ? 7 : 2 },
    ];

    categories.forEach(category => {
      // Category name
      scorePage.drawText(category.name, {
        x: 50,
        y: yPos,
        size: 11,
        font: helveticaFont,
        color: textColor,
      });

      // Score bar background
      const barWidth = width - 300;
      const barX = 200;
      
      scorePage.drawRectangle({
        x: barX,
        y: yPos - 5,
        width: barWidth,
        height: 15,
        color: lightGray,
      });

      // Score bar fill
      const fillWidth = (category.actual / category.max) * barWidth;
      const barColor = category.actual / category.max >= 0.7 ? greenColor : 
                      category.actual / category.max >= 0.5 ? orangeColor : redColor;
      
      scorePage.drawRectangle({
        x: barX,
        y: yPos - 5,
        width: fillWidth,
        height: 15,
        color: barColor,
      });

      // Score text
      scorePage.drawText(`${category.actual}/${category.max}`, {
        x: barX + barWidth + 10,
        y: yPos - 2,
        size: 10,
        font: helveticaBold,
        color: textColor,
      });

      yPos -= 30;
    });

    yPos -= 20;

    // Interpretation
    scorePage.drawText('VAD BETYDER POÄNGEN?', {
      x: 50,
      y: yPos,
      size: 14,
      font: helveticaBold,
      color: primaryColor,
    });
    yPos -= 25;

    const interpretations = [
      { range: '85-100', label: 'Investor Ready', desc: 'Er affärsplan är mogen och redo för investerare.' },
      { range: '70-84', label: 'Stark Potential', desc: 'Nära investeringsnivå med vissa förbättringar.' },
      { range: '50-69', label: 'Lovande Start', desc: 'Bra grund som behöver vidareutveckling.' },
      { range: '0-49', label: 'Tidigt Stadium', desc: 'Fokusera på att bygga grunderna.' },
    ];

    interpretations.forEach(interp => {
      const isActive = (score >= 85 && interp.range === '85-100') ||
                      (score >= 70 && score < 85 && interp.range === '70-84') ||
                      (score >= 50 && score < 70 && interp.range === '50-69') ||
                      (score < 50 && interp.range === '0-49');

      if (isActive) {
        scorePage.drawRectangle({
          x: 45,
          y: yPos - 18,
          width: width - 90,
          height: 35,
          color: rgb(0.95, 0.98, 1),
        });
      }

      scorePage.drawText(interp.range, {
        x: 55,
        y: yPos,
        size: 11,
        font: helveticaBold,
        color: isActive ? accentColor : textColor,
      });

      scorePage.drawText(interp.label, {
        x: 120,
        y: yPos,
        size: 11,
        font: helveticaBold,
        color: isActive ? primaryColor : textColor,
      });

      scorePage.drawText(interp.desc, {
        x: 240,
        y: yPos,
        size: 10,
        font: helveticaFont,
        color: isActive ? textColor : mediumGray,
      });

      yPos -= 40;
    });

    // ===== DETAILED SECTIONS =====
    
    // Problem & Solution
    if (answers.customer_problem || answers.solution) {
      const psPage = pdfDoc.addPage(PageSizes.A4);
      pages.push(psPage);
      yPos = drawHeader(psPage, 'Problem & Lösning', 'Problem-Solution Fit');
      
      if (answers.customer_problem) {
        psPage.drawText('IDENTIFIERAT PROBLEM', {
          x: 50,
          y: yPos,
          size: 14,
          font: helveticaBold,
          color: primaryColor,
        });
        yPos -= 25;
        
        yPos = drawWrappedText(
          psPage,
          answers.customer_problem,
          50,
          yPos,
          width - 100,
          12,
          helveticaFont,
          textColor
        );
        yPos -= 30;
      }
      
      if (answers.solution) {
        psPage.drawText('VÅR LÖSNING', {
          x: 50,
          y: yPos,
          size: 14,
          font: helveticaBold,
          color: primaryColor,
        });
        yPos -= 25;
        
        yPos = drawWrappedText(
          psPage,
          answers.solution,
          50,
          yPos,
          width - 100,
          12,
          helveticaFont,
          textColor
        );
      }
    }

    // ===== MARKNADSANALYS =====
    const marketPage = pdfDoc.addPage(PageSizes.A4);
    pages.push(marketPage);
    yPos = drawHeader(marketPage, 'Marknadsanalys', 'Marknadspotential & Positionering');

    // Market size visualization
    if (answers.market_size) {
      // Market size card
      marketPage.drawRectangle({
        x: 50,
        y: yPos - 80,
        width: width - 100,
        height: 80,
        color: rgb(0.02, 0.08, 0.15),
      });

      marketPage.drawText('MARKNADSSTORLEK', {
        x: 70,
        y: yPos - 30,
        size: 12,
        font: helveticaBold,
        color: accentColor,
      });

      yPos = drawWrappedText(
        marketPage,
        answers.market_size,
        70,
        yPos - 50,
        width - 140,
        11,
        helveticaFont,
        white
      );
      
      yPos -= 40;
    }

    // Target customer
    if (answers.target_customer) {
      marketPage.drawText('MÅLGRUPP', {
        x: 50,
        y: yPos,
        size: 14,
        font: helveticaBold,
        color: primaryColor,
      });
      yPos -= 25;
      
      yPos = drawWrappedText(
        marketPage,
        answers.target_customer,
        50,
        yPos,
        width - 100,
        12,
        helveticaFont,
        textColor
      );
      yPos -= 30;
    }

    // Market trends
    if (answers.market_trends) {
      marketPage.drawText('MARKNADSTRENDER', {
        x: 50,
        y: yPos,
        size: 14,
        font: helveticaBold,
        color: primaryColor,
      });
      yPos -= 25;
      
      yPos = drawWrappedText(
        marketPage,
        answers.market_trends,
        50,
        yPos,
        width - 100,
        12,
        helveticaFont,
        textColor
      );
    }

    // ===== AFFÄRSMODELL & INTÄKTER =====
    const bizModelPage = pdfDoc.addPage(PageSizes.A4);
    pages.push(bizModelPage);
    yPos = drawHeader(bizModelPage, 'Affärsmodell & Intäkter', 'Hur ni tjänar pengar');

    if (answers.revenue_block || answers.revenue_model) {
      const revenueText = answers.revenue_block || answers.revenue_model || '';
      
      // Revenue model visualization
      bizModelPage.drawRectangle({
        x: 50,
        y: yPos - 100,
        width: width - 100,
        height: 100,
        color: rgb(0.02, 0.08, 0.15),
      });

      bizModelPage.drawText('INTÄKTSMODELL', {
        x: 70,
        y: yPos - 30,
        size: 14,
        font: helveticaBold,
        color: greenColor,
      });

      yPos = drawWrappedText(
        bizModelPage,
        revenueText,
        70,
        yPos - 55,
        width - 140,
        11,
        helveticaFont,
        white
      );
      
      yPos -= 60;
    }

    // Unit economics if available
    if (answers.unit_economics) {
      bizModelPage.drawText('ENHETSEKONOMI', {
        x: 50,
        y: yPos,
        size: 14,
        font: helveticaBold,
        color: primaryColor,
      });
      yPos -= 25;
      
      yPos = drawWrappedText(
        bizModelPage,
        answers.unit_economics,
        50,
        yPos,
        width - 100,
        12,
        helveticaFont,
        textColor
      );
    }

    // ===== TEAM & KOMPETENS =====
    const teamPage = pdfDoc.addPage(PageSizes.A4);
    pages.push(teamPage);
    yPos = drawHeader(teamPage, 'Team & Kompetens', 'Människorna bakom visionen');

    if (answers.team) {
      // Team background card
      teamPage.drawRectangle({
        x: 50,
        y: yPos - 20,
        width: width - 100,
        height: 20,
        color: accentColor,
      });

      teamPage.drawText('TEAMET', {
        x: 60,
        y: yPos - 15,
        size: 12,
        font: helveticaBold,
        color: white,
      });
      
      yPos -= 40;

      yPos = drawWrappedText(
        teamPage,
        answers.team,
        50,
        yPos,
        width - 100,
        12,
        helveticaFont,
        textColor
      );
      yPos -= 30;
    }

    // Founder equity
    if (answers.founder_equity) {
      teamPage.drawText('GRUNDARÄGARSKAP', {
        x: 50,
        y: yPos,
        size: 14,
        font: helveticaBold,
        color: primaryColor,
      });
      yPos -= 25;
      
      teamPage.drawText(`Grundarteamet behåller ${answers.founder_equity}% efter denna runda`, {
        x: 50,
        y: yPos,
        size: 12,
        font: helveticaFont,
        color: textColor,
      });
      yPos -= 30;
    }

    // Skills & gaps
    if (answers.team_skills) {
      teamPage.drawText('KOMPETENSER', {
        x: 50,
        y: yPos,
        size: 14,
        font: helveticaBold,
        color: primaryColor,
      });
      yPos -= 25;
      
      yPos = drawWrappedText(
        teamPage,
        answers.team_skills,
        50,
        yPos,
        width - 100,
        12,
        helveticaFont,
        textColor
      );
    }

    // ===== TRACTION & BEVIS =====
    const tractionPage = pdfDoc.addPage(PageSizes.A4);
    pages.push(tractionPage);
    yPos = drawHeader(tractionPage, 'Traction & Bevis', 'Vad ni uppnått hittills');

    if (answers.traction) {
      // Traction highlight box
      tractionPage.drawRectangle({
        x: 50,
        y: yPos - 80,
        width: width - 100,
        height: 80,
        color: rgb(0.9, 0.98, 0.9),
      });

      tractionPage.drawText('NUVARANDE TRACTION', {
        x: 70,
        y: yPos - 30,
        size: 12,
        font: helveticaBold,
        color: greenColor,
      });

      yPos = drawWrappedText(
        tractionPage,
        answers.traction,
        70,
        yPos - 50,
        width - 140,
        11,
        helveticaFont,
        textColor
      );
      
      yPos -= 40;
    }

    // Milestones
    if (answers.milestones) {
      tractionPage.drawText('PLANERADE MILSTOLPAR', {
        x: 50,
        y: yPos,
        size: 14,
        font: helveticaBold,
        color: primaryColor,
      });
      yPos -= 25;
      
      try {
        const milestones = JSON.parse(answers.milestones);
        milestones.forEach((milestone: any, index: number) => {
          // Milestone box
          tractionPage.drawRectangle({
            x: 50,
            y: yPos - 35,
            width: width - 100,
            height: 35,
            color: index % 2 === 0 ? lightGray : white,
          });

          tractionPage.drawText(`${index + 1}. ${milestone.milestone}`, {
            x: 60,
            y: yPos - 15,
            size: 11,
            font: helveticaBold,
            color: primaryColor,
          });

          tractionPage.drawText(milestone.date, {
            x: width - 150,
            y: yPos - 15,
            size: 11,
            font: helveticaFont,
            color: blueColor,
          });

          yPos -= 40;
        });
      } catch (e) {
        // If milestones is not JSON, just display as text
        yPos = drawWrappedText(
          tractionPage,
          answers.milestones,
          50,
          yPos,
          width - 100,
          12,
          helveticaFont,
          textColor
        );
      }
    }

    // ===== FINANSIELL PLAN =====
    const financialPage = pdfDoc.addPage(PageSizes.A4);
    pages.push(financialPage);
    yPos = drawHeader(financialPage, 'Finansiell Plan', 'Ekonomisk översikt');

    // Runway
    if (answers.runway) {
      // Runway visualization
      const runwayMonths = parseInt(answers.runway) || 12;
      const runwayColor = runwayMonths >= 18 ? greenColor : 
                         runwayMonths >= 12 ? orangeColor : redColor;

      financialPage.drawRectangle({
        x: 50,
        y: yPos - 100,
        width: width - 100,
        height: 100,
        color: rgb(0.02, 0.08, 0.15),
      });

      financialPage.drawText('RUNWAY', {
        x: 70,
        y: yPos - 30,
        size: 14,
        font: helveticaBold,
        color: accentColor,
      });

      financialPage.drawText(`${runwayMonths}`, {
        x: 70,
        y: yPos - 65,
        size: 36,
        font: helveticaBold,
        color: runwayColor,
      });

      financialPage.drawText('månader', {
        x: 120,
        y: yPos - 65,
        size: 14,
        font: helveticaFont,
        color: white,
      });

      yPos -= 120;
    }

    // Capital needs
    if (answers.capital_block) {
      try {
        const capital = JSON.parse(answers.capital_block);
        
        financialPage.drawText('KAPITALBEHOV', {
          x: 50,
          y: yPos,
          size: 14,
          font: helveticaBold,
          color: primaryColor,
        });
        yPos -= 25;

        // Amount needed
        financialPage.drawText(`Söker: ${capital.amount} MSEK`, {
          x: 50,
          y: yPos,
          size: 16,
          font: helveticaBold,
          color: accentColor,
        });
        yPos -= 30;

        // Use of funds
        financialPage.drawText('ANVÄNDNING AV KAPITAL', {
          x: 50,
          y: yPos,
          size: 12,
          font: helveticaBold,
          color: primaryColor,
        });
        yPos -= 25;

        const useOfFunds = [
          { label: 'Produktutveckling', value: capital.product },
          { label: 'Försäljning & Marknad', value: capital.sales },
          { label: 'Personal & Rekrytering', value: capital.team },
          { label: 'Övrigt', value: capital.other }
        ];

        useOfFunds.forEach(fund => {
          if (fund.value && parseInt(fund.value) > 0) {
            // Fund bar
            const barWidth = (parseInt(fund.value) / 100) * (width - 200);
            
            financialPage.drawRectangle({
              x: 50,
              y: yPos - 15,
              width: barWidth,
              height: 15,
              color: blueColor,
            });

            financialPage.drawText(`${fund.label}: ${fund.value}%`, {
              x: 60,
              y: yPos - 12,
              size: 10,
              font: helveticaFont,
              color: white,
            });

            yPos -= 25;
          }
        });
      } catch (e) {
        // Fallback if not JSON
        yPos = drawWrappedText(
          financialPage,
          answers.capital_block,
          50,
          yPos,
          width - 100,
          12,
          helveticaFont,
          textColor
        );
      }
    }

    // ===== RISKER & MÖJLIGHETER =====
    const risksPage = pdfDoc.addPage(PageSizes.A4);
    pages.push(risksPage);
    yPos = drawHeader(risksPage, 'Risker & Möjligheter', 'Riskhantering & Potential');

    if (answers.main_risks) {
      risksPage.drawText('HUVUDSAKLIGA RISKER', {
        x: 50,
        y: yPos,
        size: 14,
        font: helveticaBold,
        color: redColor,
      });
      yPos -= 25;
      
      yPos = drawWrappedText(
        risksPage,
        answers.main_risks,
        50,
        yPos,
        width - 100,
        12,
        helveticaFont,
        textColor
      );
      yPos -= 30;
    }

    // Exit strategy
    if (answers.exit_strategy) {
      risksPage.drawText('EXIT-STRATEGI', {
        x: 50,
        y: yPos,
        size: 14,
        font: helveticaBold,
        color: greenColor,
      });
      yPos -= 25;
      
      yPos = drawWrappedText(
        risksPage,
        answers.exit_strategy,
        50,
        yPos,
        width - 100,
        12,
        helveticaFont,
        textColor
      );
    }

    // ===== ÅTGÄRDSPLAN =====
    const actionPage = pdfDoc.addPage(PageSizes.A4);
    pages.push(actionPage);
    yPos = drawHeader(actionPage, 'Åtgärdsplan', 'Nästa steg för framgång');

    // Action items from insights or generated
    if (actionItems && actionItems.length > 0) {
      actionItems.forEach((item: any, index: number) => {
        // Priority indicator
        const priorityColor = item.priority === 'high' ? redColor :
                            item.priority === 'medium' ? orangeColor : greenColor;
        
        // Action item card
        actionPage.drawRectangle({
          x: 50,
          y: yPos - 60,
          width: width - 100,
          height: 60,
          color: index % 2 === 0 ? rgb(0.98, 0.98, 0.98) : white,
        });

        // Priority badge
        actionPage.drawRectangle({
          x: 55,
          y: yPos - 25,
          width: 8,
          height: 20,
          color: priorityColor,
        });

        actionPage.drawText(item.title || 'Åtgärd', {
          x: 70,
          y: yPos - 20,
          size: 12,
          font: helveticaBold,
          color: primaryColor,
        });

        if (item.description) {
          drawWrappedText(
            actionPage,
            item.description,
            70,
            yPos - 35,
            width - 170,
            10,
            helveticaFont,
            textColor,
            1.3
          );
        }

        if (item.timeframe) {
          actionPage.drawText(item.timeframe, {
            x: width - 120,
            y: yPos - 35,
            size: 10,
            font: helveticaFont,
            color: blueColor,
          });
        }

        yPos -= 70;
        
        // Check if we need a new page
        if (yPos < 150 && index < actionItems.length - 1) {
          const newActionPage = pdfDoc.addPage(PageSizes.A4);
          pages.push(newActionPage);
          yPos = drawHeader(newActionPage, 'Åtgärdsplan', 'Fortsättning');
        }
      });
    } else {
      // Default recommendations if no action items
      const defaultActions = [
        { 
          title: 'Validera affärsmodellen', 
          desc: 'Genomför kundintervjuer och marknadsvalidering',
          priority: 'high' 
        },
        { 
          title: 'Säkra initial finansiering', 
          desc: 'Förbered pitch deck och börja investerardialog',
          priority: 'medium' 
        },
        { 
          title: 'Bygg MVP', 
          desc: 'Utveckla en minimal viable product för att testa marknaden',
          priority: 'high' 
        }
      ];

      defaultActions.forEach((action, index) => {
        const priorityColor = action.priority === 'high' ? redColor : orangeColor;
        
        actionPage.drawRectangle({
          x: 50,
          y: yPos - 50,
          width: width - 100,
          height: 50,
          color: index % 2 === 0 ? rgb(0.98, 0.98, 0.98) : white,
        });

        actionPage.drawRectangle({
          x: 55,
          y: yPos - 20,
          width: 8,
          height: 15,
          color: priorityColor,
        });

        actionPage.drawText(action.title, {
          x: 70,
          y: yPos - 15,
          size: 12,
          font: helveticaBold,
          color: primaryColor,
        });

        actionPage.drawText(action.desc, {
          x: 70,
          y: yPos - 30,
          size: 10,
          font: helveticaFont,
          color: textColor,
        });

        yPos -= 60;
      });
    }

    // ===== PREMIUM SECTIONS =====
    if (subscriptionLevel === 'premium' && premiumAnalysis) {
      
      // SWOT Analysis
      if (premiumAnalysis.swot) {
        const swotPage = pdfDoc.addPage(PageSizes.A4);
        pages.push(swotPage);
        yPos = drawHeader(swotPage, 'SWOT-Analys', 'Strategisk översikt');
        
        // Create 2x2 grid for SWOT
        const boxWidth = (width - 120) / 2;
        const boxHeight = 150;
        const startY = yPos - 20;
        
        // Strengths
        swotPage.drawRectangle({
          x: 50,
          y: startY - boxHeight,
          width: boxWidth,
          height: boxHeight,
          color: rgb(0.9, 0.98, 0.9),
        });
        
        swotPage.drawText('STYRKOR', {
          x: 60,
          y: startY - 20,
          size: 12,
          font: helveticaBold,
          color: greenColor,
        });
        
        let strengthY = startY - 40;
        premiumAnalysis.swot.strengths.slice(0, 4).forEach((strength: string) => {
          strengthY = drawWrappedText(
            swotPage,
            `• ${strength}`,
            65,
            strengthY,
            boxWidth - 30,
            10,
            helveticaFont,
            textColor
          );
          strengthY -= 10;
        });
        
        // Weaknesses
        swotPage.drawRectangle({
          x: 60 + boxWidth,
          y: startY - boxHeight,
          width: boxWidth,
          height: boxHeight,
          color: rgb(0.98, 0.9, 0.9),
        });
        
        swotPage.drawText('SVAGHETER', {
          x: 70 + boxWidth,
          y: startY - 20,
          size: 12,
          font: helveticaBold,
          color: redColor,
        });
        
        let weakY = startY - 40;
        premiumAnalysis.swot.weaknesses.slice(0, 4).forEach((weakness: string) => {
          weakY = drawWrappedText(
            swotPage,
            `• ${weakness}`,
            75 + boxWidth,
            weakY,
            boxWidth - 30,
            10,
            helveticaFont,
            textColor
          );
          weakY -= 10;
        });
        
        // Opportunities
        const lowerY = startY - boxHeight - 20;
        swotPage.drawRectangle({
          x: 50,
          y: lowerY - boxHeight,
          width: boxWidth,
          height: boxHeight,
          color: rgb(0.9, 0.9, 0.98),
        });
        
        swotPage.drawText('MÖJLIGHETER', {
          x: 60,
          y: lowerY - 20,
          size: 12,
          font: helveticaBold,
          color: blueColor,
        });
        
        let oppY = lowerY - 40;
        premiumAnalysis.swot.opportunities.slice(0, 4).forEach((opp: string) => {
          oppY = drawWrappedText(
            swotPage,
            `• ${opp}`,
            65,
            oppY,
            boxWidth - 30,
            10,
            helveticaFont,
            textColor
          );
          oppY -= 10;
        });
        
        // Threats
        swotPage.drawRectangle({
          x: 60 + boxWidth,
          y: lowerY - boxHeight,
          width: boxWidth,
          height: boxHeight,
          color: rgb(0.98, 0.95, 0.9),
        });
        
        swotPage.drawText('HOT', {
          x: 70 + boxWidth,
          y: lowerY - 20,
          size: 12,
          font: helveticaBold,
          color: orangeColor,
        });
        
        let threatY = lowerY - 40;
        premiumAnalysis.swot.threats.slice(0, 4).forEach((threat: string) => {
          threatY = drawWrappedText(
            swotPage,
            `• ${threat}`,
            75 + boxWidth,
            threatY,
            boxWidth - 30,
            10,
            helveticaFont,
            textColor
          );
          threatY -= 10;
        });
      }

      // Financial Projections
      if (premiumAnalysis.financialProjections || answers.financial_projections) {
        const finPage = pdfDoc.addPage(PageSizes.A4);
        pages.push(finPage);
        yPos = drawHeader(finPage, 'Finansiella Projektioner', '3-årsprognos');
        
        finPage.drawText('INTÄKTS- OCH KOSTNADSPROGNOS', {
          x: 50,
          y: yPos,
          size: 14,
          font: helveticaBold,
          color: primaryColor,
        });
        yPos -= 30;
        
        // Table header
        const tableX = 50;
        const columnWidth = (width - 100) / 4;
        
        // Header background
        finPage.drawRectangle({
          x: tableX,
          y: yPos - 25,
          width: width - 100,
          height: 25,
          color: primaryColor,
        });
        
        // Headers
        finPage.drawText('Metrics', {
          x: tableX + 10,
          y: yPos - 18,
          size: 11,
          font: helveticaBold,
          color: white,
        });
        
        ['År 1', 'År 2', 'År 3'].forEach((year, i) => {
          finPage.drawText(year, {
            x: tableX + columnWidth * (i + 1) + 10,
            y: yPos - 18,
            size: 11,
            font: helveticaBold,
            color: white,
          });
        });
        
        yPos -= 30;
        
        // Financial data
        if (premiumAnalysis.financialProjections) {
          const projections = premiumAnalysis.financialProjections;
          const metrics = [
            { label: 'Intäkter (MSEK)', key: 'revenue' },
            { label: 'Kostnader (MSEK)', key: 'costs' },
            { label: 'EBITDA (MSEK)', key: 'ebitda' },
            { label: 'Antal kunder', key: 'customers' }
          ];
          
          metrics.forEach((metric, idx) => {
            // Row background
            if (idx % 2 === 1) {
              finPage.drawRectangle({
                x: tableX,
                y: yPos - 20,
                width: width - 100,
                height: 20,
                color: lightGray,
              });
            }
            
            finPage.drawText(metric.label, {
              x: tableX + 10,
              y: yPos - 15,
              size: 10,
              font: helveticaFont,
              color: textColor,
            });
            
            ['year1', 'year2', 'year3'].forEach((year, i) => {
              const value = projections[year]?.[metric.key] || 0;
              const color = metric.key === 'ebitda' && value < 0 ? redColor : textColor;
              
              finPage.drawText(value.toString(), {
                x: tableX + columnWidth * (i + 1) + 10,
                y: yPos - 15,
                size: 10,
                font: helveticaBold,
                color: color,
              });
            });
            
            yPos -= 25;
          });
        }
        
        // Growth chart visualization
        yPos -= 20;
        finPage.drawText('TILLVÄXTKURVA', {
          x: 50,
          y: yPos,
          size: 12,
          font: helveticaBold,
          color: primaryColor,
        });
        yPos -= 30;
        
        // Simple growth visualization
        const chartHeight = 100;
        const chartWidth = width - 100;
        
        finPage.drawRectangle({
          x: 50,
          y: yPos - chartHeight,
          width: chartWidth,
          height: chartHeight,
          color: rgb(0.98, 0.98, 0.98),
        });
      }

      // Detailed Recommendations
      if (premiumAnalysis.detailedRecommendations) {
        let recPage = pdfDoc.addPage(PageSizes.A4);
        pages.push(recPage);
        yPos = drawHeader(recPage, 'Detaljerade Rekommendationer', 'Konkreta åtgärder för framgång');
        
        // Immediate actions
        if (premiumAnalysis.detailedRecommendations.immediate) {
          recPage.drawText('OMEDELBARA ÅTGÄRDER (1-2 månader)', {
            x: 50,
            y: yPos,
            size: 14,
            font: helveticaBold,
            color: redColor,
          });
          yPos -= 25;
          
          premiumAnalysis.detailedRecommendations.immediate.forEach((rec: any, index: number) => {
            // Recommendation card
            const cardHeight = 120;
            
            recPage.drawRectangle({
              x: 50,
              y: yPos - cardHeight,
              width: width - 100,
              height: cardHeight,
              color: index % 2 === 0 ? white : rgb(0.98, 0.98, 0.98),
            });
            
            // Priority indicator
            recPage.drawRectangle({
              x: 55,
              y: yPos - 20,
              width: 5,
              height: cardHeight - 10,
              color: redColor,
            });
            
            // Action title
            recPage.drawText(rec.action, {
              x: 70,
              y: yPos - 20,
              size: 12,
              font: helveticaBold,
              color: primaryColor,
            });
            
            // Details
            const detailY = yPos - 40;
            
            recPage.drawText('Varför:', {
              x: 70,
              y: detailY,
              size: 10,
              font: helveticaBold,
              color: textColor,
            });
            
            drawWrappedText(
              recPage,
              rec.why,
              120,
              detailY,
              width - 170,
              9,
              helveticaFont,
              textColor,
              1.2
            );
            
            recPage.drawText('Hur:', {
              x: 70,
              y: detailY - 20,
              size: 10,
              font: helveticaBold,
              color: textColor,
            });
            
            drawWrappedText(
              recPage,
              rec.how,
              120,
              detailY - 20,
              width - 170,
              9,
              helveticaFont,
              textColor,
              1.2
            );
            
            recPage.drawText('Förväntad effekt:', {
              x: 70,
              y: detailY - 40,
              size: 10,
              font: helveticaBold,
              color: textColor,
            });
            
            recPage.drawText(rec.impact, {
              x: 170,
              y: detailY - 40,
              size: 9,
              font: helveticaFont,
              color: greenColor,
            });
            
            recPage.drawText('Tidsram:', {
              x: 70,
              y: detailY - 55,
              size: 10,
              font: helveticaBold,
              color: textColor,
            });
            
            recPage.drawText(rec.timeline, {
              x: 120,
              y: detailY - 55,
              size: 9,
              font: helveticaFont,
              color: blueColor,
            });
            
            yPos -= cardHeight + 10;
            
            // Check if we need a new page
            if (yPos < 200 && index < premiumAnalysis.detailedRecommendations.immediate.length - 1) {
              recPage = pdfDoc.addPage(PageSizes.A4);
              pages.push(recPage);
              yPos = drawHeader(recPage, 'Detaljerade Rekommendationer', 'Fortsättning');
            }
          });
        }
        
        // Short-term actions
        if (premiumAnalysis.detailedRecommendations.shortTerm && yPos > 200) {
          yPos -= 20;
          recPage.drawText('KORTSIKTIGA ÅTGÄRDER (3-6 månader)', {
            x: 50,
            y: yPos,
            size: 14,
            font: helveticaBold,
            color: orangeColor,
          });
          yPos -= 25;
          
          // Similar structure for short-term recommendations
        }
      }

      // Benchmark Analysis
      if (premiumAnalysis.benchmarkAnalysis) {
        const benchPage = pdfDoc.addPage(PageSizes.A4);
        pages.push(benchPage);
        yPos = drawHeader(benchPage, 'Benchmark-Analys', 'Jämförelse med branschstandard');
        
        // Industry comparison
        if (premiumAnalysis.benchmarkAnalysis.industryComparison) {
          benchPage.drawText('NYCKELTAL VS BRANSCHSNITT', {
            x: 50,
            y: yPos,
            size: 14,
            font: helveticaBold,
            color: primaryColor,
          });
          yPos -= 30;
          
          const comparisons = premiumAnalysis.benchmarkAnalysis.industryComparison;
          const metrics = ['grossMargin', 'cacPayback', 'growthRate', 'churnRate'];
          const labels = {
            grossMargin: 'Bruttomarginal',
            cacPayback: 'CAC Payback',
            growthRate: 'Tillväxttakt',
            churnRate: 'Churn Rate'
          };
          
          metrics.forEach((metric, index) => {
            if (comparisons[metric]) {
              const comp = comparisons[metric];
              
              // Metric card
              benchPage.drawRectangle({
                x: 50,
                y: yPos - 60,
                width: width - 100,
                height: 60,
                color: index % 2 === 0 ? white : rgb(0.98, 0.98, 0.98),
              });
              
              benchPage.drawText(labels[metric as keyof typeof labels], {
                x: 60,
                y: yPos - 20,
                size: 12,
                font: helveticaBold,
                color: primaryColor,
              });
              
              // Values
              benchPage.drawText(`Ni: ${comp.us}`, {
                x: 60,
                y: yPos - 40,
                size: 11,
                font: helveticaFont,
                color: textColor,
              });
              
              benchPage.drawText(`Bransch: ${comp.industry}`, {
                x: 200,
                y: yPos - 40,
                size: 11,
                font: helveticaFont,
                color: textColor,
              });
              
              // Verdict with color
              const verdictColor = comp.verdict.includes('bättre') || comp.verdict.includes('Bra') 
                ? greenColor 
                : comp.verdict.includes('sämre') || comp.verdict.includes('Högt')
                ? redColor
                : orangeColor;
              
              benchPage.drawText(comp.verdict, {
                x: 350,
                y: yPos - 40,
                size: 10,
                font: helveticaBold,
                color: verdictColor,
              });
              
              yPos -= 70;
            }
          });
        }
        
        // Peer comparison table
        if (premiumAnalysis.benchmarkAnalysis.peerComparison) {
          yPos -= 20;
          benchPage.drawText('JÄMFÖRELSE MED LIKNANDE BOLAG', {
            x: 50,
            y: yPos,
            size: 14,
            font: helveticaBold,
            color: primaryColor,
          });
          yPos -= 30;
          
          // Table header
          benchPage.drawRectangle({
            x: 50,
            y: yPos - 25,
            width: width - 100,
            height: 25,
            color: primaryColor,
          });
          
          const colWidth = (width - 100) / 4;
          ['Företag', 'Funding', 'Revenue', 'Värdering'].forEach((header, i) => {
            benchPage.drawText(header, {
              x: 60 + colWidth * i,
              y: yPos - 18,
              size: 10,
              font: helveticaBold,
              color: white,
            });
          });
          
          yPos -= 30;
          
          // Peer data
          premiumAnalysis.benchmarkAnalysis.peerComparison.forEach((peer: any, idx: number) => {
            if (idx % 2 === 1) {
              benchPage.drawRectangle({
                x: 50,
                y: yPos - 20,
                width: width - 100,
                height: 20,
                color: lightGray,
              });
            }
            
            benchPage.drawText(peer.company, {
              x: 60,
              y: yPos - 15,
              size: 10,
              font: helveticaFont,
              color: textColor,
            });
            
            benchPage.drawText(peer.funding, {
              x: 60 + colWidth,
              y: yPos - 15,
              size: 10,
              font: helveticaFont,
              color: textColor,
            });
            
            benchPage.drawText(peer.revenue, {
              x: 60 + colWidth * 2,
              y: yPos - 15,
              size: 10,
              font: helveticaFont,
              color: textColor,
            });
            
            benchPage.drawText(peer.valuation, {
              x: 60 + colWidth * 3,
              y: yPos - 15,
              size: 10,
              font: helveticaFont,
              color: textColor,
            });
            
            yPos -= 25;
          });
        }
      }

      // Investment Proposal
      if (premiumAnalysis.investmentProposal) {
        const invPage = pdfDoc.addPage(PageSizes.A4);
        pages.push(invPage);
        yPos = drawHeader(invPage, 'Investeringsförslag', 'Er kapitalanskaffning');
        
        const proposal = premiumAnalysis.investmentProposal;
        
        // Investment ask card
        invPage.drawRectangle({
          x: 50,
          y: yPos - 120,
          width: width - 100,
          height: 120,
          color: rgb(0.02, 0.08, 0.15),
        });
        
        invPage.drawText('INVESTERINGSRUNDA', {
          x: 70,
          y: yPos - 30,
          size: 14,
          font: helveticaBold,
          color: accentColor,
        });
        
        invPage.drawText(`Söker: ${proposal.askAmount}`, {
          x: 70,
          y: yPos - 60,
          size: 24,
          font: helveticaBold,
          color: white,
        });
        
        invPage.drawText(`Värdering: ${proposal.valuation}`, {
          x: 70,
          y: yPos - 85,
          size: 16,
          font: helveticaFont,
          color: accentColor,
        });
        
        yPos -= 140;
        
        // Use of funds
        invPage.drawText('ANVÄNDNING AV KAPITAL', {
          x: 50,
          y: yPos,
          size: 14,
          font: helveticaBold,
          color: primaryColor,
        });
        yPos -= 30;
        
        if (proposal.useOfFunds) {
          const funds = proposal.useOfFunds;
          const fundItems = [
            { label: 'Produktutveckling', value: funds.productDevelopment, color: blueColor },
            { label: 'Försäljning & Marknadsföring', value: funds.salesMarketing, color: greenColor },
            { label: 'Teamutbyggnad', value: funds.teamExpansion, color: accentColor },
            { label: 'Övrigt', value: funds.other, color: orangeColor }
          ];
          
          fundItems.forEach(item => {
            if (item.value) {
              const barWidth = (parseInt(item.value) / 100) * (width - 200);
              
              invPage.drawRectangle({
                x: 50,
                y: yPos - 20,
                width: barWidth,
                height: 20,
                color: item.color,
              });
              
              invPage.drawText(`${item.label}: ${item.value}`, {
                x: 60,
                y: yPos - 15,
                size: 10,
                font: helveticaFont,
                color: white,
              });
              
              yPos -= 30;
            }
          });
        }
        
        // Key metrics
        if (proposal.keyMetrics) {
          yPos -= 20;
          invPage.drawText('NYCKELTAL', {
            x: 50,
            y: yPos,
            size: 14,
            font: helveticaBold,
            color: primaryColor,
          });
          yPos -= 30;
          
          const metricsGrid = [
            { label: 'Nuvarande MRR', value: proposal.keyMetrics.currentMRR },
            { label: 'Mål MRR (12 mån)', value: proposal.keyMetrics.targetMRR12Months },
            { label: 'Nuvarande kunder', value: proposal.keyMetrics.currentCustomers },
            { label: 'Mål kunder (12 mån)', value: proposal.keyMetrics.targetCustomers12Months },
            { label: 'Burn rate', value: proposal.keyMetrics.burnRate },
            { label: 'Månader runway', value: proposal.keyMetrics.monthsRunway }
          ];
          
          // Create 2x3 grid
          metricsGrid.forEach((metric, index) => {
            const col = index % 2;
            const row = Math.floor(index / 2);
            const x = 50 + col * (width - 100) / 2;
            const y = yPos - row * 50;
            
            invPage.drawRectangle({
              x: x,
              y: y - 40,
              width: (width - 110) / 2,
              height: 40,
              color: rgb(0.98, 0.98, 0.98),
            });
            
            invPage.drawText(metric.label, {
              x: x + 10,
              y: y - 15,
              size: 10,
              font: helveticaFont,
              color: textColor,
            });
            
            invPage.drawText(metric.value?.toString() || 'N/A', {
              x: x + 10,
              y: y - 30,
              size: 12,
              font: helveticaBold,
              color: primaryColor,
            });
          });
          
          yPos -= 160;
        }
        
        // Investor benefits
        if (proposal.investorBenefits) {
          invPage.drawText('FÖRDELAR FÖR INVESTERARE', {
            x: 50,
            y: yPos,
            size: 14,
            font: helveticaBold,
            color: greenColor,
          });
          yPos -= 25;
          
          proposal.investorBenefits.forEach((benefit: string, index: number) => {
            invPage.drawRectangle({
              x: 55,
              y: yPos + 3,
              width: 6,
              height: 6,
              color: greenColor,
            });
            
            yPos = drawWrappedText(
              invPage,
              benefit,
              70,
              yPos,
              width - 120,
              11,
              helveticaFont,
              textColor
            );
            yPos -= 10;
          });
        }
      }

      // Market Insights
      if (premiumAnalysis.marketInsights) {
        const marketInsightsPage = pdfDoc.addPage(PageSizes.A4);
        pages.push(marketInsightsPage);
        yPos = drawHeader(marketInsightsPage, 'Marknadsinsikter', 'Djupgående marknadsanalys');
        
        const insights = premiumAnalysis.marketInsights;
        
        // Market size
        if (insights.marketSize) {
          const ms = insights.marketSize;
          
          marketInsightsPage.drawRectangle({
            x: 50,
            y: yPos - 80,
            width: width - 100,
            height: 80,
            color: rgb(0.02, 0.08, 0.15),
          });
          
          marketInsightsPage.drawText('MARKNADSSTORLEK', {
            x: 70,
            y: yPos - 25,
            size: 12,
            font: helveticaBold,
            color: accentColor,
          });
          
          marketInsightsPage.drawText(ms.current, {
            x: 70,
            y: yPos - 45,
            size: 18,
            font: helveticaBold,
            color: white,
          });
          
          marketInsightsPage.drawText(`${ms.growth} årlig tillväxt`, {
            x: 70,
            y: yPos - 65,
            size: 12,
            font: helveticaFont,
            color: greenColor,
          });
          
          marketInsightsPage.drawText(`Prognos: ${ms.projected}`, {
            x: 300,
            y: yPos - 45,
            size: 14,
            font: helveticaFont,
            color: white,
          });
          
          yPos -= 100;
        }
        
        // Key trends
        if (insights.keyTrends) {
          marketInsightsPage.drawText('VIKTIGA TRENDER', {
            x: 50,
            y: yPos,
            size: 14,
            font: helveticaBold,
            color: primaryColor,
          });
          yPos -= 25;
          
          insights.keyTrends.forEach((trend: any, index: number) => {
            const trendColor = trend.impact === 'Hög' ? redColor : 
                              trend.impact === 'Medium' ? orangeColor : greenColor;
            
            marketInsightsPage.drawRectangle({
              x: 50,
              y: yPos - 50,
              width: width - 100,
              height: 50,
              color: index % 2 === 0 ? white : rgb(0.98, 0.98, 0.98),
            });
            
            marketInsightsPage.drawText(trend.icon, {
              x: 60,
              y: yPos - 25,
              size: 20,
              font: helveticaFont,
              color: textColor,
            });
            
            marketInsightsPage.drawText(trend.name, {
              x: 90,
              y: yPos - 20,
              size: 11,
              font: helveticaBold,
              color: primaryColor,
            });
            
            drawWrappedText(
              marketInsightsPage,
              trend.description,
              90,
              yPos - 35,
              width - 250,
              9,
              helveticaFont,
              textColor,
              1.2
            );
            
            marketInsightsPage.drawText(`Impact: ${trend.impact}`, {
              x: width - 150,
              y: yPos - 25,
              size: 10,
              font: helveticaBold,
              color: trendColor,
            });
            
            yPos -= 60;
          });
        }
      }

      // Investor Film
      if (premiumAnalysis.investorFilm) {
        const filmPage = pdfDoc.addPage(PageSizes.A4);
        pages.push(filmPage);
        yPos = drawHeader(filmPage, 'Investerarfilm', 'Koncept & Produktionsguide');
        
        const film = premiumAnalysis.investorFilm;
        
        // WHY statement
        if (film.whyStatement) {
          filmPage.drawRectangle({
            x: 50,
            y: yPos - 80,
            width: width - 100,
            height: 80,
            color: accentColor,
          });
          
          filmPage.drawText('VARFÖR VI FINNS', {
            x: 70,
            y: yPos - 25,
            size: 12,
            font: helveticaBold,
            color: white,
          });
          
          yPos = drawWrappedText(
            filmPage,
            film.whyStatement,
            70,
            yPos - 45,
            width - 140,
            12,
            helveticaFont,
            white,
            1.5
          );
          
          yPos -= 50;
        }
        
        // SORA AI Prompt
        if (film.soraPrompt) {
          filmPage.drawText('SORA AI PROMPT', {
            x: 50,
            y: yPos,
            size: 14,
            font: helveticaBold,
            color: primaryColor,
          });
          yPos -= 25;
          
          filmPage.drawRectangle({
            x: 50,
            y: yPos - 100,
            width: width - 100,
            height: 100,
            color: rgb(0.98, 0.98, 1),
          });
          
          yPos = drawWrappedText(
            filmPage,
            film.soraPrompt,
            60,
            yPos - 20,
            width - 120,
            10,
            helveticaFont,
            textColor,
            1.3
          );
          
          yPos -= 80;
        }
        
        // Script structure
        if (film.scriptStructure) {
          filmPage.drawText('MANUS STRUKTUR', {
            x: 50,
            y: yPos,
            size: 14,
            font: helveticaBold,
            color: primaryColor,
          });
          yPos -= 25;
          
          film.scriptStructure.forEach((scene: any, index: number) => {
            filmPage.drawRectangle({
              x: 50,
              y: yPos - 40,
              width: width - 100,
              height: 40,
              color: index % 2 === 0 ? white : lightGray,
            });
            
            filmPage.drawText(scene.timeframe, {
              x: 60,
              y: yPos - 20,
              size: 10,
              font: helveticaBold,
              color: blueColor,
            });
            
            filmPage.drawText(scene.content, {
              x: 140,
              y: yPos - 20,
              size: 10,
              font: helveticaFont,
              color: textColor,
            });
            
            filmPage.drawText(scene.emotion, {
              x: width - 150,
              y: yPos - 20,
              size: 10,
              font: helveticaFont,
              color: accentColor,
            });
            
            yPos -= 45;
          });
        }
      }

      // AI Image Prompts - ny sektion
      if (premiumAnalysis.aiImagePrompts) {
        const imagePage = pdfDoc.addPage(PageSizes.A4);
        pages.push(imagePage);
        yPos = drawHeader(imagePage, 'AI Bildprompts', '10 bilder för marknadsföring');
        
        imagePage.drawText('BILDGENERERING MED AI', {
          x: 50,
          y: yPos,
          size: 14,
          font: helveticaBold,
          color: primaryColor,
        });
        yPos -= 20;
        
        imagePage.drawText('Använd dessa prompts i ChatGPT eller Midjourney för att skapa professionella bilder.', {
          x: 50,
          y: yPos,
          size: 11,
          font: helveticaFont,
          color: textColor,
        });
        yPos -= 30;
        
        if (premiumAnalysis.aiImagePrompts.prompts) {
          premiumAnalysis.aiImagePrompts.prompts.forEach((prompt: any, index: number) => {
            // Check if we need a new page
            if (yPos < 200) {
              const newImagePage = pdfDoc.addPage(PageSizes.A4);
              pages.push(newImagePage);
              yPos = drawHeader(newImagePage, 'AI Bildprompts', 'Fortsättning');
            }
            
            // Prompt card
            const cardHeight = 100;
            imagePage.drawRectangle({
              x: 50,
              y: yPos - cardHeight,
              width: width - 100,
              height: cardHeight,
              color: index % 2 === 0 ? white : rgb(0.98, 0.98, 0.98),
            });
            
            // Icon and title
            imagePage.drawText(prompt.icon, {
              x: 60,
              y: yPos - 25,
              size: 24,
              font: helveticaFont,
              color: textColor,
            });
            
            imagePage.drawText(prompt.title, {
              x: 90,
              y: yPos - 25,
              size: 12,
              font: helveticaBold,
              color: primaryColor,
            });
            
            // Usage
            imagePage.drawText(`Användning: ${prompt.usage}`, {
              x: 90,
              y: yPos - 40,
              size: 10,
              font: helveticaFont,
              color: blueColor,
            });
            
            // Prompt text
            imagePage.drawText('Prompt:', {
              x: 60,
              y: yPos - 55,
              size: 10,
              font: helveticaBold,
              color: textColor,
            });
            
            drawWrappedText(
              imagePage,
              prompt.prompt,
              60,
              yPos - 70,
              width - 120,
              9,
              helveticaFont,
              textColor,
              1.2
            );
            
            yPos -= cardHeight + 10;
          });
        }
      }
    }

    // Add page numbers to all pages
    const totalPages = pages.length;
    pages.forEach((page, index) => {
      if (index > 0) { // Skip cover page
        addPageNumber(page, index + 1, totalPages);
      }
    });

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