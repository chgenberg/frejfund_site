import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { companyName, contactEmail, contactName, score, analysisData } = await request.json();

    // Validate required fields
    if (!companyName || !contactEmail || !contactName || !score) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Only process high scores
    if (score < 80) {
      return NextResponse.json({ error: 'Score too low for referral' }, { status: 400 });
    }

    // Create email content
    const emailContent = `
New High-Scoring Startup Referral from FrejFund

Company: ${companyName}
Contact: ${contactName} (${contactEmail})
Investment Score: ${score}/100

Key Highlights:
${analysisData?.categories ? Object.entries(analysisData.categories).map(([key, cat]: [string, any]) => 
  `- ${cat.label}: ${cat.score}/100`
).join('\n') : 'N/A'}

Top Insights:
${analysisData?.actionableInsights ? analysisData.actionableInsights.slice(0, 3).map((insight: any) => 
  `- ${insight.title}`
).join('\n') : 'N/A'}

This startup scored exceptionally well on our AI-driven investment analysis and has expressed interest in connecting with angel investors.

Full analysis available at: https://frejfund.com/result/${analysisData?.id || 'latest'}

---
FrejFund - AI-Powered Investment Analysis
    `.trim();

    // Log the referral (in production, this would send actual emails)
    console.log('🚀 Investor Referral Request:', {
      to: ['angels@swedishinvestors.com', 'network@angelinvest.se'], // Example addresses
      subject: `High-Scoring Startup: ${companyName} (${score}/100)`,
      content: emailContent
    });

    // In production, you would integrate with an email service like SendGrid, Postmark, etc.
    // For now, we'll just return success
    
    return NextResponse.json({ 
      success: true, 
      message: 'Referral sent successfully to investor networks' 
    });

  } catch (error) {
    console.error('Investor referral error:', error);
    return NextResponse.json({ error: 'Failed to send referral' }, { status: 500 });
  }
} 