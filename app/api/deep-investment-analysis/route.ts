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

    const { websiteData, fileContents, linkedinData, userInfo, businessInfo } = await request.json();
    
    // Combine all content for analysis
    let combinedContent = `Business Analysis for ${userInfo.name} (${userInfo.email})\n\n`;
    
    // Add essential business information first for better context
    if (businessInfo) {
      combinedContent += `BUSINESS OVERVIEW:\n`;
      combinedContent += `Business Stage: ${businessInfo.stage || 'Not specified'}\n`;
      combinedContent += `Industry: ${businessInfo.industry || 'Not specified'}\n`;
      combinedContent += `Target Market: ${businessInfo.targetMarket || 'Not specified'}\n`;
      combinedContent += `Business Model: ${businessInfo.businessModel || 'Not specified'}\n`;
      combinedContent += `Monthly Revenue: ${businessInfo.monthlyRevenue || 'Not specified'}\n`;
      combinedContent += `Team Size: ${businessInfo.teamSize || 'Not specified'}\n\n`;
    }
    
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
- REFERENCE their specific business stage, industry, target market, and business model
- USE their revenue level and team size to tailor recommendations appropriately
- MENTION their actual business model or industry specifics
- INCLUDE stage-appropriate recommendations (different advice for idea vs scaling)
- REFERENCE specific details from their website content
- USE any team/founder information provided
- AVOID generic advice like "Quantify customer pain" or "Build partnerships"

INDUSTRY & STAGE-SPECIFIC GUIDANCE:
- For SaaS businesses: Focus on MRR, churn, CAC/LTV ratios
- For E-commerce: Focus on conversion rates, AOV, inventory management
- For Marketplaces: Focus on network effects, supply/demand balance
- For Idea stage: Focus on validation, MVP, customer interviews
- For MVP stage: Focus on product-market fit, user feedback, iterations
- For Early revenue: Focus on growth, scalability, unit economics
- For Scaling: Focus on operational efficiency, team building, fundraising

QUALITY STANDARDS FOR INSIGHTS:
Each insight must be:
- Tailored to their specific context (stage + industry + business model)
- Include concrete next steps with timeframes
- Reference specific tools, strategies, or approaches relevant to their industry
- Show clear business impact/ROI appropriate for their stage
- Be immediately actionable for their current situation

EXAMPLES OF IMPROVED PERSONALIZED INSIGHTS:
- "As a SaaS business in early revenue stage targeting SMBs, implement a customer success program within 30 days - SaaS companies with dedicated CS see 25% lower churn and 15% higher expansion revenue"
- "Your marketplace model with €1k-10k monthly revenue suggests strong early traction - focus on supply-side growth by recruiting 50+ new sellers in the next 60 days to improve selection and reduce customer acquisition costs"
- "As an idea-stage fintech targeting enterprises, partner with an established financial services company for pilot testing - 70% of successful fintech startups validate with enterprise partners before building full product"

FOLLOW-UP QUESTIONS (Optional):
Generate follow-up questions only if you need specific metrics or detailed business model information for more advanced insights.

DATA QUALITY CHECK - When to ask follow-up questions:
- If website data is minimal or missing key business information
- If no uploaded documents provide detailed business metrics
- If current revenue is unspecified and business model lacks pricing details
- If target customer details are too generic for specific recommendations
- If competitive landscape is unclear from provided materials

ALWAYS ask 3-5 follow-up questions if:
- You cannot provide specific, actionable recommendations with concrete metrics
- You lack information about customer pain points, pricing, or business metrics
- The business model or go-to-market strategy needs clarification

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