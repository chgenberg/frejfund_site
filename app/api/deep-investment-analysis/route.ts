import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { websiteData, fileContents, linkedinData, userInfo } = await request.json();
    
    // Combine all content for analysis
    let combinedContent = `Business Analysis for ${userInfo.name} (${userInfo.email})\n\n`;
    
    if (websiteData?.data) {
      combinedContent += `Website Analysis:\n`;
      Object.entries(websiteData.data).forEach(([key, value]) => {
        if (value) {
          combinedContent += `${key}: ${value}\n`;
        }
      });
      combinedContent += '\n';
    }
    
    if (fileContents?.length > 0) {
      combinedContent += `Uploaded Documents:\n`;
      fileContents.forEach((file: any) => {
        combinedContent += `\nFile: ${file.fileName}\n`;
        combinedContent += `Content: ${file.content}\n`;
      });
    }
    
    if (linkedinData?.data?.length > 0) {
      combinedContent += `\nFounder LinkedIn Profiles:\n`;
      linkedinData.data.forEach((profile: any) => {
        combinedContent += `\nFounder: ${profile.name || 'Unknown'}\n`;
        combinedContent += `Current Role: ${profile.currentTitle || 'N/A'} at ${profile.currentCompany || 'N/A'}\n`;
        if (profile.experience) {
          combinedContent += `Experience: ${Array.isArray(profile.experience) ? profile.experience.join(', ') : profile.experience}\n`;
        }
        if (profile.education) {
          combinedContent += `Education: ${Array.isArray(profile.education) ? profile.education.join(', ') : profile.education}\n`;
        }
        if (profile.skills) {
          combinedContent += `Skills: ${Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills}\n`;
        }
        if (profile.entrepreneurialBackground) {
          combinedContent += `Entrepreneurial Background: ${profile.entrepreneurialBackground}\n`;
        }
        combinedContent += `Profile URL: ${profile.profileUrl}\n`;
      });
    }

    // First pass: Deep analysis
    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an expert investment analyst with deep experience in early-stage startups. Analyze the provided business information comprehensively and generate PERSONALIZED, SPECIFIC actionable insights.

ANALYSIS FRAMEWORK:
1. Investment thesis and opportunity size
2. Problem/solution fit and market validation  
3. Business model and revenue potential
4. Competitive landscape and moat
5. Team assessment and execution capability (including LinkedIn profile analysis)
6. Traction and growth metrics
7. Risk factors and mitigation strategies
8. Financial projections and unit economics
9. Go-to-market strategy
10. Funding requirements and use of funds

CRITICAL REQUIREMENT - ALWAYS GENERATE INSIGHTS:
You MUST ALWAYS generate AT LEAST 3 actionable insights, even if you also need follow-up questions.

PERSONALIZATION REQUIREMENTS:
- REFERENCE specific details from their website content
- MENTION their actual business model or industry if identified
- USE any team/founder information provided
- INCLUDE specific recommendations based on their current situation
- AVOID generic advice like "Quantify customer pain" or "Build partnerships"

QUALITY STANDARDS FOR INSIGHTS:
Each insight must be:
- Tailored to their specific context (website, industry, team background)
- Include concrete next steps with timeframes
- Reference specific tools, strategies, or approaches
- Show clear business impact/ROI
- Be immediately actionable

EXAMPLES OF GOOD PERSONALIZED INSIGHTS:
- "Based on your SaaS platform mentioned on your website, implement a freemium model with 2-3 core features free and advanced analytics behind paywall - similar successful companies in your space see 15-25% conversion rates"
- "Your LinkedIn profile shows strong technical background but consider partnering with a sales-focused co-founder within 60 days - technical founders in B2B SaaS typically see 40% higher close rates with dedicated sales leadership"
- "Your website mentions SMB focus - create case studies from your first 5 customers showing specific ROI metrics (time saved, cost reduced) to support premium pricing of €2,000+ annually"

FOLLOW-UP QUESTIONS (Optional):
Generate follow-up questions only if you need specific metrics or detailed business model information for more advanced insights.

FOCUS FOLLOW-UP QUESTIONS ON:
1. Specific customer pain points and current solutions they use
2. Exact target market segments and customer characteristics  
3. Current business metrics (revenue, customers, growth rate)
4. Specific competitive challenges and differentiators
5. Current business model and pricing strategy
6. Specific goals and challenges in next 6-12 months
7. Existing partnerships or distribution channels
8. Team expertise and resource constraints

Return a JSON object with:
{
  "initialAnalysis": {
    "overallScore": 75, // Overall investment score 0-100
    "executiveSummary": "string",
    "investmentThesis": "string",
    "marketOpportunity": "string",
    "customerPain": "string",
    "solution": "string",
    "competitivePosition": "string",
    "teamAssessment": "string",
    "financialAnalysis": "string",
    "riskAssessment": "string",
    "growthStrategy": "string",
    "fundingAnalysis": "string",
    // Category scores 0-100
    "problemSolutionScore": 80,
    "marketScore": 75,
    "competitiveScore": 70,
    "tractionScore": 85,
    "financialScore": 78,
    "teamScore": 88,
    "financialHealthScore": 75,
    "riskScore": 70,
    "pitchScore": 80,
    // Insights arrays
    "problemInsights": ["insight1", "insight2"],
    "marketInsights": ["insight1", "insight2"],
    "moatInsights": ["insight1", "insight2"],
    "tractionInsights": ["insight1", "insight2"],
    "financialInsights": ["insight1", "insight2"],
    "teamInsights": ["insight1", "insight2"],
    "healthInsights": ["insight1", "insight2"],
    "riskInsights": ["insight1", "insight2"],
    "pitchInsights": ["insight1", "insight2"],
    // ALWAYS GENERATE 3-5 ACTIONABLE INSIGHTS (REQUIRED)
    "actionableInsights": [
      {
        "title": "Action title",
        "impact": "high/medium/low", 
        "timeframe": "1-2 weeks",
        "description": "What to do",
        "implementation": ["step1", "step2", "step3"],
        "expectedResult": "Expected outcome",
        "investorPerspective": "Why investors care"
      },
      {
        "title": "Second action",
        "impact": "high/medium/low",
        "timeframe": "timeframe", 
        "description": "description",
        "implementation": ["step1", "step2", "step3"],
        "expectedResult": "Expected outcome",
        "investorPerspective": "Why investors care"
      }
    ]
  },
  "followUpQuestions": ["question1", "question2", ...] // Can be empty array, but actionableInsights must ALWAYS be populated
}`
        },
        {
          role: "user",
          content: combinedContent
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });

    const analysisData = JSON.parse(analysisResponse.choices[0].message.content || '{}');
    
    // Store initial analysis in session for later use
    if (analysisData.followUpQuestions?.length > 0) {
      // Store context for follow-up
      await storeAnalysisContext({
        userInfo,
        initialAnalysis: analysisData.initialAnalysis,
        followUpQuestions: analysisData.followUpQuestions,
        combinedContent
      });
    }
    
    return NextResponse.json({
      success: true,
      ...analysisData
    });

  } catch (error) {
    console.error('Deep analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to complete analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper function to store analysis context (implement based on your storage solution)
async function storeAnalysisContext(data: any) {
  // Store in database, Redis, or session storage
  // For now, we'll use a simple in-memory store
  const globalAny = global as any;
  globalAny.analysisContext = globalAny.analysisContext || {};
  globalAny.analysisContext[data.userInfo.email] = data;
} 