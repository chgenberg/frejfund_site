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
          content: `You are an expert investment analyst. Analyze the provided business information comprehensively. Your analysis should cover:

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

Pay special attention to team analysis if LinkedIn profiles are provided - assess founder backgrounds, relevant experience, industry expertise, previous entrepreneurial success, education, and overall team complementarity.

After analysis, determine if you need additional information to provide a complete investment assessment. If yes, generate 3-10 specific, targeted questions that would help complete the analysis.

Return a JSON object with:
{
  "initialAnalysis": {
    "executiveSummary": "string",
    "investmentThesis": "string",
    "marketOpportunity": "string",
    "productAnalysis": "string",
    "competitivePosition": "string",
    "teamAssessment": "string",
    "financialAnalysis": "string",
    "riskAssessment": "string",
    "growthStrategy": "string",
    "fundingAnalysis": "string"
  },
  "followUpQuestions": ["question1", "question2", ...] // Empty array if no questions needed
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