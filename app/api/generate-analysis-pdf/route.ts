import { NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb, PageSizes } from 'pdf-lib';

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
    const data: AnalysisData = await request.json();
    const { score, answers, insights, actionItems, scoreInfo } = data;
    
    // Extract premiumAnalysis from inside answers
    const premiumAnalysis = answers?.premiumAnalysis;
    const subscriptionLevel = data.subscriptionLevel || (premiumAnalysis ? 'premium' : 'standard');

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
      
      // Header background with gradient effect
      page.drawRectangle({
        x: 0,
        y: height - 100,
        width: width,
        height: 100,
        color: primaryColor,
      });

      // Accent line
      page.drawRectangle({
        x: 0,
        y: height - 102,
        width: width,
        height: 2,
        color: accentColor,
      });

      // Title
      page.drawText(title.toUpperCase(), {
        x: 50,
        y: height - 60,
        size: 20,
        font: helveticaBold,
        color: white,
      });

      if (subtitle) {
        page.drawText(subtitle, {
          x: 50,
          y: height - 80,
          size: 12,
          font: helveticaFont,
          color: rgb(0.8, 0.8, 0.8),
        });
      }

      // Return Y position for content
      return height - 140;
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
    let pageCount = 0;
    const pages: any[] = [];

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

    const sections = [
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

    if (subscriptionLevel === 'premium' && premiumAnalysis) {
      sections.push(
        { title: 'PREMIUM INNEHÅLL', page: 13, type: 'header' },
        { title: 'SWOT-Analys', page: 14, type: 'premium' },
        { title: 'Finansiella Projektioner (3 år)', page: 15, type: 'premium' },
        { title: 'Detaljerade Rekommendationer', page: 17, type: 'premium' },
        { title: 'Benchmark-Analys', page: 19, type: 'premium' },
        { title: 'Investeringsförslag', page: 21, type: 'premium' },
        { title: 'Marknadsinsikter', page: 23, type: 'premium' },
        { title: 'Investerarfilm - Koncept & Guide', page: 25, type: 'premium' }
      );
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
    let scoreVisualizationY = yPos - 30;

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
        
        // Add financial projections content here
        finPage.drawText('INTÄKTS- OCH KOSTNADSPROGNOS', {
          x: 50,
          y: yPos,
          size: 14,
          font: helveticaBold,
          color: primaryColor,
        });
        yPos -= 30;
        
        // You would add the actual financial data table here
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