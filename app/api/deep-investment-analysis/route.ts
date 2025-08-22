import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { initialAnalysisSchema, hasMinInsights } from '../_utils/aiSchemas';
import { aiConfig } from '../_utils/aiConfig';
import { rateLimit, getIp } from '../_utils/rateLimit';
import { ANGELHIVE_GUIDELINES } from '../_utils/angelhive_static';

export async function POST(request: Request) {
  try {
    // Rate limit: 10 requests per minute per IP
    const ip = getIp(request)
    if (!rateLimit(`deep:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        success: true,
        analysis: {
          overallScore: 75,
          executiveSummary: 'Local development mode - full analysis requires Railway deployment with API key',
          investmentThesis: 'API analysis skipped in local development',
          categoryScores: {
            problemSolutionScore: 70,
            marketScore: 75,
            competitiveScore: 65,
            tractionScore: 80,
            financialScore: 70,
            teamScore: 75,
            riskScore: 70
          },
          actionableInsights: [{
            title: 'Deploy to Railway for full analysis',
            impact: 'high',
            timeframe: 'immediate',
            description: 'Full AI analysis requires deployment to Railway with proper API key configuration.',
            implementation: ['Deploy to Railway', 'Configure API key in variables'],
            expectedResult: 'Complete GPT-5 powered analysis',
            investorPerspective: 'Essential for accurate assessment',
            _source: 'local-dev-fallback'
          }]
        },
        followUpQuestions: [
          {
            id: 'local_dev_1',
            title: 'What is your biggest challenge right now?',
            placeholder: 'Describe your main business challenge...'
          },
          {
            id: 'local_dev_2', 
            title: 'What makes you different from competitors?',
            placeholder: 'Explain your unique advantage...'
          }
        ]
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const bodyJson = await request.json();
    const { websiteData, fileContents, linkedinData } = bodyJson;
    const userInfo = bodyJson.userInfo || { name: 'Unknown', email: `anon-${Date.now()}@example.com` };
    const businessInfo = bodyJson.businessInfo || {};

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

    const safeParseJson = (txt: string) => {
      try {
        return JSON.parse(txt);
      } catch (e) {
        // Try to extract JSON object substring
        const first = txt.indexOf('{');
        const last = txt.lastIndexOf('}');
        if (first !== -1 && last !== -1 && last > first) {
          const sub = txt.slice(first, last + 1);
          try { return JSON.parse(sub); } catch {}
        }
        return null;
      }
    };

    async function generateOnce(promptContent: string, strict = false) {
      const fullSystem = `${promptContent}\n\nMANDATORY REFERENCE GUIDELINES (AngelHive-inspired):\n${ANGELHIVE_GUIDELINES}\n\nUse these guidelines to structure and evaluate, but DO NOT output a summary of the guidelines. Output only the requested JSON fields.`;
      const opts: any = {
        model: aiConfig.models.deep,
        messages: [
          { role: 'system', content: fullSystem + (strict ? '\nReturn ONLY valid minified JSON without markdown or extra text.' : '') },
          { role: 'user', content: combinedContent }
        ],
        temperature: strict ? aiConfig.temperature.strict : aiConfig.temperature.default,
        max_tokens: aiConfig.maxTokens
      };
      const res = await openai.chat.completions.create(opts);
      const txt = res.choices?.[0]?.message?.content || '{}';
      const parsed = safeParseJson(txt);
      if (!parsed) throw new Error('Failed to parse JSON from OpenAI');
      return parsed;
    }

    const basePrompt = `You are an expert investment analyst with deep experience in early-stage startups. Analyze the provided business information comprehensively and generate PERSONALIZED, SPECIFIC actionable insights.

Before analysis, briefly restate a 5-bullet "Company context" using stage, industry, target market, business model, revenue, team. Keep it concise.

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

PERSONALIZATION REQUIREMENTS (MANDATORY):
- REFERENCE their specific business stage, industry, target market, and business model
- USE their revenue level and team size to tailor recommendations appropriately
- MENTION their actual business model or industry specifics
- INCLUDE stage-appropriate recommendations (different advice for idea vs scaling)
- REFERENCE specific details from their website content and uploaded docs (cite short phrases with "from website/docs: ...")
- USE any team/founder information provided

FORBIDDEN GENERICS (DO NOT USE VERBATIM):
- "Quantify customer pain in monetary terms"
- "Build strategic partnerships early" 
- "Strengthen your competitive moat"
- "Implement data-driven growth tracking"
- Any advice that could apply to any company without referencing this company's specifics

INDUSTRY & STAGE-SPECIFIC GUIDANCE (APPLY IF RELEVANT):
- SaaS with revenue > 0: include churn, CAC, LTV, payback, expansion; propose concrete CS motions
- E-commerce: include conversion rate, AOV, CAC by channel, inventory turns; concrete CRO actions
- Marketplaces: supply/demand balance, chicken-egg tactics, take rate, repeat rate; concrete growth loops
- Idea stage: validation plan with exact interview/timeline/decision criteria
- MVP stage: instrument feedback loops, experiment cadence, success metrics
- Early revenue: unit economics improvement plan with numeric targets
- Scaling: org design, hiring plan, SLAs, process with KPIs

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

Return a JSON object with the specified structure including "initialAnalysis" and "followUpQuestions" and ALWAYS include at least 3 items in initialAnalysis.actionableInsights.`;

    let analysisData: any = null;
    let attempt = 0;
    let ok = false;
    let lastError: any = null;
    while (attempt < 3 && !ok) {
      try {
        analysisData = await generateOnce(basePrompt, attempt > 0);
        ok = true;
      } catch (e) {
        lastError = e;
        attempt++;
      }
    }
    if (!ok) {
      throw new Error(`OpenAI JSON parsing failed after retries: ${lastError?.message || lastError}`)
    }

    // Validate with Zod and check min insights
    let valid = false;
    try {
      initialAnalysisSchema.parse(analysisData);
      valid = hasMinInsights(analysisData, 'initialAnalysis', 3);
    } catch {}

    if (!valid) {
      // Retry once with stricter instruction and lower temperature for determinism
      try {
        analysisData = await generateOnce(basePrompt, true);
        initialAnalysisSchema.parse(analysisData);
        valid = hasMinInsights(analysisData, 'initialAnalysis', 3);
      } catch {}
    }

    if (!valid) {
      // Last resort: inject a minimal actionableInsights array
      analysisData.initialAnalysis = analysisData.initialAnalysis || {};
      analysisData.initialAnalysis.actionableInsights = analysisData.initialAnalysis.actionableInsights || [];
      while (analysisData.initialAnalysis.actionableInsights.length < 3) {
        analysisData.initialAnalysis.actionableInsights.push({
          title: 'Establish quantitative customer validation',
          impact: 'high',
          timeframe: '2-3 weeks',
          description: 'Interview customers, quantify ROI, and document case examples.',
          implementation: ['Recruit 10 customers', 'Conduct 30-min interviews', 'Compute ROI and write 3 case briefs'],
          expectedResult: 'Clear proof of value and pricing power',
          investorPerspective: 'Shows real customer economics and purchase intent'
        });
      }
    }

    // Store initial analysis in session for later use (always, questions may be generated client-side)
    await storeAnalysisContext({
      userInfo,
      initialAnalysis: analysisData.initialAnalysis,
      followUpQuestions: analysisData.followUpQuestions || [],
      combinedContent
    });
    
    return NextResponse.json({ success: true, ...analysisData });

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
  const globalAny = (global as any);
  globalAny.analysisContext = globalAny.analysisContext || {};
  globalAny.analysisContext[data.userInfo.email] = data;
} 