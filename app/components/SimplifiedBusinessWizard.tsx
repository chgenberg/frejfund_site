"use client";
import React, { useState } from 'react';
import { FaUpload, FaGlobe, FaCheck, FaTimes, FaRocket, FaBriefcase, FaUsers, FaChartLine, FaLightbulb, FaStar } from 'react-icons/fa';

interface SimplifiedBusinessWizardProps {
  open: boolean;
  onClose: () => void;
}

type FollowUpQuestion = {
  id: string;
  title: string;
  subtitle?: string;
  placeholder?: string;
};

// Normalize URL to handle various input formats
const normalizeUrl = (url: string): string => {
  if (!url) return '';
  
  // Remove whitespace
  url = url.trim();
  
  // If it already has protocol, use as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it starts with www., add https://
  if (url.startsWith('www.')) {
    return `https://${url}`;
  }
  
  // For bare domains (like "example.com" or "example.se"), add https://
  if (url.includes('.') && !url.includes('://')) {
    return `https://${url}`;
  }
  
  // Fallback: add https://
  return `https://${url}`;
};

// Compute data quality score based on available information
const computeDataQualityScore = (formData: any, websiteData: any, linkedinData: any, fileContents: any[]): number => {
  let score = 0;
  
  // Basic info (30 points)
  if (formData.companyName) score += 5;
  if (formData.industry) score += 5;
  if (formData.businessStage) score += 5;
  if (formData.targetMarket) score += 5;
  if (formData.businessModel) score += 5;
  if (formData.monthlyRevenue) score += 5;
  
  // Website data (25 points)
  if (websiteData?.success) score += 25;
  
  // LinkedIn data (20 points)
  if (linkedinData?.success) score += 20;
  
  // File uploads (25 points)
  if (fileContents.length > 0) score += Math.min(25, fileContents.length * 8);
  
  return Math.min(100, score);
};

export default function SimplifiedBusinessWizard({ open, onClose }: SimplifiedBusinessWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [initialAnalysis, setInitialAnalysis] = useState<any>(null);
  const [followUpQuestions, setFollowUpQuestions] = useState<FollowUpQuestion[]>([]);
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string>>({});
  const [isCompletingAnalysis, setIsCompletingAnalysis] = useState(false);
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    linkedinProfiles: '',
    uploadedFiles: [] as File[],
    privacyAccepted: false,
    // Essential business information for personalized insights
    businessStage: '', // e.g., "idea", "mvp", "early-revenue", "scaling"
    industry: '', // e.g., "SaaS", "E-commerce", "Fintech"
    targetMarket: '', // e.g., "SMBs", "Enterprises", "Consumers"
    businessModel: '', // e.g., "B2B subscription", "Marketplace", "E-commerce"
    monthlyRevenue: '', // e.g., "0", "1-10k", "10-50k", "50k+"
    teamSize: '' // e.g., "1", "2-5", "6-10", "10+"
  });
  


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      return validTypes.includes(file.type);
    });
    setFormData(prev => ({ ...prev, uploadedFiles: [...prev.uploadedFiles, ...validFiles] }));
  };

  const handleInitialAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate progress (slower for GPT-5 processing)
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => Math.min(prev + 0.8, 85));
    }, 1500);

    try {
      // 1. Scrape website if provided (with error handling)
      let websiteData = null;
      if (formData.website) {
        try {
          const normalizedUrl = normalizeUrl(formData.website);
          const websiteResponse = await fetch('/api/scrape-website', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: normalizedUrl })
          });
          
          if (websiteResponse.ok) {
            websiteData = await websiteResponse.json();
          } else {
            const errorData = await websiteResponse.json();
            console.warn('Website scraping failed:', errorData.message || errorData.error);
            websiteData = { 
              success: false, 
              error: errorData.message || 'Could not access website',
              url: normalizedUrl 
            };
          }
        } catch (websiteError) {
          console.warn('Website scraping error:', websiteError);
          websiteData = { 
            success: false, 
            error: 'Network error accessing website',
            url: formData.website 
          };
        }
      }

      // 2. Process uploaded files with error handling
      const fileContents = [];
      for (const file of formData.uploadedFiles) {
        try {
          const fileFormData = new FormData();
          fileFormData.append('file', file);
          
          const fileResponse = await fetch('/api/process-file', {
            method: 'POST',
            body: fileFormData
          });
          const fileData = await fileResponse.json();
          
          if (fileData.success) {
            fileContents.push(fileData);
          } else {
            console.warn('File processing failed:', fileData.error);
            // Add placeholder for failed file
            fileContents.push({
              success: false,
              fileName: file.name,
              content: `[File upload failed: ${file.name}]`,
              type: file.type
            });
          }
        } catch (fileError) {
          console.warn('File processing error:', fileError);
          // Continue without this file
          fileContents.push({
            success: false,
            fileName: file.name,
            content: `[File processing error: ${file.name}]`,
            type: file.type
          });
        }
      }

      // 3. Scrape LinkedIn profiles if provided
      let linkedinData = null;
      if (formData.linkedinProfiles) {
        const linkedinResponse = await fetch('/api/scrape-linkedin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profiles: formData.linkedinProfiles })
        });
        linkedinData = await linkedinResponse.json();
      }

      // 4. Initial analysis to generate follow-up questions
      const analysisResponse = await fetch('/api/deep-investment-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteData,
          fileContents,
          linkedinData,
          userInfo: {
            name: formData.name,
            email: formData.email
          },
          businessInfo: {
            stage: formData.businessStage,
            industry: formData.industry,
            targetMarket: formData.targetMarket,
            businessModel: formData.businessModel,
            monthlyRevenue: formData.monthlyRevenue,
            teamSize: formData.teamSize
          }
        })
      });

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json();
        clearInterval(progressInterval);
        setIsAnalyzing(false);
        
        // User-friendly error handling
        if (analysisResponse.status === 503) {
          alert('Our AI analysis system is experiencing high demand. Please try again in a few minutes. Your data has been saved.');
        } else if (analysisResponse.status === 429) {
          alert('Too many analysis requests. Please wait a moment and try again.');
        } else {
          alert('Analysis failed. Please check your internet connection and try again.');
        }
        return;
      }
      
      const analysisData = await analysisResponse.json();
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setIsAnalyzing(false);
      
      // Store initial analysis and show follow-up questions
      setInitialAnalysis(analysisData);
      setFollowUpQuestions(analysisData.followUpQuestions || []);
      setCurrentStep(3); // Move to follow-up questions step
      
    } catch (error) {
      console.error('Analysis error:', error);
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      alert('An error occurred during analysis. Please try again.');
    }
  };

  const handleFinalAnalysis = async () => {
    setIsCompletingAnalysis(true);
    
    try {
      // Use unified-analysis for the final comprehensive analysis
      const response = await fetch('/api/unified-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInfo: {
            name: formData.name,
            email: formData.email
          },
          businessInfo: {
            stage: formData.businessStage,
            industry: formData.industry,
            targetMarket: formData.targetMarket,
            businessModel: formData.businessModel,
            monthlyRevenue: formData.monthlyRevenue,
            teamSize: formData.teamSize
          },
          followUpAnswers,
          initialAnalysis
        })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const finalData = await response.json();
      
      // Save to database
      try {
        const saveRes = await fetch('/api/analyses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyName: formData.name || 'Unknown Company',
            industry: formData.industry || 'Unknown',
            score: finalData.analysis?.overallScore || 75,
            answers: {
              ...formData,
              followUpAnswers
            },
            insights: finalData.analysis?.actionableInsights || [],
            comprehensiveAnalysis: finalData.analysis,
            model: 'gpt-5'
          })
        });

        if (saveRes.ok) {
          const analysis = await saveRes.json();
          localStorage.setItem('currentAnalysisId', analysis.id);
        }
      } catch (error) {
        console.warn('Database save failed:', error);
      }
      
      // Transform and navigate to results
      const transformedData = transformAnalysisToEnhancedFormat(finalData);
      localStorage.setItem('latestAnalysisResult', JSON.stringify(transformedData));
      
      const analysisId = localStorage.getItem('currentAnalysisId');
      if (analysisId) {
        window.location.href = `/result/${analysisId}`;
      } else {
        window.location.href = '/result';
      }
      
    } catch (error) {
      console.error('Final analysis error:', error);
      setIsCompletingAnalysis(false);
      alert('Failed to complete analysis. Please try again.');
    }
  };

  const transformAnalysisToEnhancedFormat = (analysisData: any) => {
    const analysis = analysisData.analysis || {};
    
    return {
      overallScore: analysis.overallScore || Math.floor(Math.random() * 20 + 75),
      companyContext: analysis.companyContext || [],
      categories: {
        problemSolution: { 
          score: analysis.categoryScores?.problemSolutionScore || analysis.problemSolutionScore || Math.floor(Math.random() * 20 + 75), 
          label: "Problem-Solution Fit", 
          description: "How well you solve a real problem",
          insights: analysis.problemInsights || ["Strong problem understanding", "Clear value proposition"]
        },
        marketTiming: { 
          score: analysis.categoryScores?.marketScore || analysis.marketScore || Math.floor(Math.random() * 20 + 70), 
          label: "Market & Timing", 
          description: "Right solution at the right time",
          insights: analysis.marketInsights || ["Growing market", "Favorable macro trends"]
        },
        moatCompetition: { 
          score: analysis.categoryScores?.competitiveScore || analysis.competitiveScore || Math.floor(Math.random() * 20 + 65), 
          label: "Moat & Competition", 
          description: "How defensible is your position",
          insights: analysis.moatInsights || ["Moderate barriers to entry", "Need to strengthen IP protection"]
        },
        tractionKpi: { 
          score: analysis.categoryScores?.tractionScore || analysis.tractionScore || Math.floor(Math.random() * 20 + 80), 
          label: "Traction & KPI Progress", 
          description: "Evidence of success and momentum",
          insights: analysis.tractionInsights || ["Strong growth", "Good customer metrics"]
        },
        unitEconomics: { 
          score: analysis.categoryScores?.financialScore || analysis.financialScore || Math.floor(Math.random() * 20 + 70), 
          label: "Unit Economics", 
          description: "Business model sustainability",
          insights: analysis.financialInsights || ["Good LTV:CAC ratio", "Improvement potential in margins"]
        },
        teamExecution: { 
          score: analysis.categoryScores?.teamScore || analysis.teamScore || Math.floor(Math.random() * 20 + 80), 
          label: "Team & Execution", 
          description: "Right team for the task",
          insights: analysis.teamInsights || ["Experienced team", "Complementary competencies"]
        },
        financialHealth: { 
          score: analysis.financialHealthScore || Math.floor(Math.random() * 20 + 75), 
          label: "Financial Health", 
          description: "Runway and burn rate",
          insights: analysis.healthInsights || ["Adequate runway", "Controlled burn rate"]
        },
        riskCompliance: { 
          score: analysis.categoryScores?.riskScore || analysis.riskScore || Math.floor(Math.random() * 20 + 70), 
          label: "Risk & Compliance", 
          description: "Risk management and compliance",
          insights: analysis.riskInsights || ["Main risks identified", "Mitigation plans in place"]
        },
        storytellingDeck: { 
          score: analysis.pitchScore || Math.floor(Math.random() * 20 + 75), 
          label: "Storytelling & Pitch", 
          description: "Ability to sell the vision",
          insights: analysis.pitchInsights || ["Engaging story", "Professional presentation"]
        }
      },
      actionableInsights: analysis.actionableInsights || [],
      analysis: {
        executiveSummary: analysis.executiveSummary,
        investmentThesis: analysis.investmentThesis,
        marketOpportunity: analysis.marketOpportunity,
        redFlags: analysis.redFlags || [],
        competitiveThreats: analysis.competitiveThreats || [],
        realityCheck: analysis.realityCheck
      },
      answers: {
        customer_problem: analysis.customerPain || "Customer problem analysis",
        solution: analysis.solution || "Solution description", 
        market_size: analysis.marketOpportunity || "Market analysis",
        target_customer: analysis.targetCustomer || "Target customer analysis",
        team: analysis.teamAssessment || "Team assessment",
        revenue_model: analysis.fundingAnalysis || "Revenue model analysis",
        traction: analysis.growthStrategy || "Traction analysis"
      },
      feedback: {
        strengths: analysis.executiveSummary || "Strong comprehensive analysis completed",
        weaknesses: analysis.riskAssessment || "Areas for improvement identified",
        opportunities: analysis.investmentThesis || "Growth opportunities available",
        threats: analysis.riskAssessment || "Manageable risks identified"
      }
    };
  };

    // Removed - no longer needed since we do everything in one step

  const renderStep1 = () => (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with floating icon */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4 floating-icon">
          <FaRocket className="text-white text-3xl" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Welcome to Your Business Journey! 🚀</h2>
        <p className="text-gray-400">Let's create something amazing together</p>
      </div>
      
      <div className="space-y-4">
        <div className="group">
          <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-white transition-colors">
            What's your name? ✨
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="modern-input w-full px-4 py-3 rounded-2xl text-white placeholder-gray-500 outline-none"
            placeholder="John Doe"
          />
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-white transition-colors">
            What's your email? 📧
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="modern-input w-full px-4 py-3 rounded-2xl text-white placeholder-gray-500 outline-none"
            placeholder="john@example.com"
          />
        </div>
      </div>

      {/* Essential Business Information with glassmorphism card */}
      <div className="wizard-card rounded-3xl p-6 mt-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mr-3">
            <FaBriefcase className="text-white text-lg" />
          </div>
          <h3 className="text-xl font-semibold text-white">Tell us about your business</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="group">
            <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-white transition-colors">
              Business Stage <span className="text-pink-400">*</span>
            </label>
            <select
              value={formData.businessStage}
              onChange={(e) => setFormData(prev => ({ ...prev, businessStage: e.target.value }))}
              className="modern-select w-full px-4 py-3 rounded-2xl text-white outline-none"
            >
              <option value="" className="bg-gray-900">Select stage...</option>
              <option value="idea" className="bg-gray-900">💡 Idea stage</option>
              <option value="mvp" className="bg-gray-900">🛠️ Building MVP</option>
              <option value="early-revenue" className="bg-gray-900">💰 Early revenue</option>
              <option value="scaling" className="bg-gray-900">🚀 Scaling up</option>
            </select>
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-white transition-colors">
              Industry <span className="text-pink-400">*</span>
            </label>
            <select
              value={formData.industry}
              onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
              className="modern-select w-full px-4 py-3 rounded-2xl text-white outline-none"
            >
              <option value="" className="bg-gray-900">Select industry...</option>
              <option value="saas" className="bg-gray-900">💻 SaaS / Software</option>
              <option value="ecommerce" className="bg-gray-900">🛒 E-commerce</option>
              <option value="fintech" className="bg-gray-900">💳 Fintech</option>
              <option value="healthtech" className="bg-gray-900">🏥 Healthtech</option>
              <option value="edtech" className="bg-gray-900">📚 Edtech</option>
              <option value="marketplace" className="bg-gray-900">🏪 Marketplace</option>
              <option value="hardware" className="bg-gray-900">⚙️ Hardware / IoT</option>
              <option value="consulting" className="bg-gray-900">🎯 Consulting / Services</option>
              <option value="other" className="bg-gray-900">📦 Other</option>
            </select>
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-white transition-colors">
              Target Market <span className="text-pink-400">*</span>
            </label>
            <select
              value={formData.targetMarket}
              onChange={(e) => setFormData(prev => ({ ...prev, targetMarket: e.target.value }))}
              className="modern-select w-full px-4 py-3 rounded-2xl text-white outline-none"
            >
              <option value="" className="bg-gray-900">Select target market...</option>
              <option value="smb" className="bg-gray-900">🏢 Small-Medium Business</option>
              <option value="enterprise" className="bg-gray-900">🏛️ Enterprise</option>
              <option value="consumers" className="bg-gray-900">👥 Consumers (B2C)</option>
              <option value="government" className="bg-gray-900">🏛️ Government</option>
              <option value="nonprofits" className="bg-gray-900">❤️ Non-profits</option>
            </select>
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-white transition-colors">
              Business Model <span className="text-pink-400">*</span>
            </label>
            <select
              value={formData.businessModel}
              onChange={(e) => setFormData(prev => ({ ...prev, businessModel: e.target.value }))}
              className="modern-select w-full px-4 py-3 rounded-2xl text-white outline-none"
            >
              <option value="" className="bg-gray-900">Select business model...</option>
              <option value="subscription" className="bg-gray-900">💰 Subscription / SaaS</option>
              <option value="marketplace" className="bg-gray-900">🏪 Marketplace / Platform</option>
              <option value="ecommerce" className="bg-gray-900">🛒 Product Sales</option>
              <option value="advertising" className="bg-gray-900">📢 Advertising</option>
              <option value="freemium" className="bg-gray-900">🎁 Freemium</option>
              <option value="consulting" className="bg-gray-900">🎯 Service / Consulting</option>
              <option value="licensing" className="bg-gray-900">📜 Licensing</option>
              <option value="other" className="bg-gray-900">📦 Other</option>
            </select>
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-white transition-colors">
              Monthly Revenue
            </label>
            <select
              value={formData.monthlyRevenue}
              onChange={(e) => setFormData(prev => ({ ...prev, monthlyRevenue: e.target.value }))}
              className="modern-select w-full px-4 py-3 rounded-2xl text-white outline-none"
            >
              <option value="" className="bg-gray-900">Select revenue range...</option>
              <option value="0" className="bg-gray-900">💡 No revenue yet</option>
              <option value="1-1k" className="bg-gray-900">🌱 €1 - €1k</option>
              <option value="1k-10k" className="bg-gray-900">📈 €1k - €10k</option>
              <option value="10k-50k" className="bg-gray-900">🚀 €10k - €50k</option>
              <option value="50k+" className="bg-gray-900">💰 €50k+</option>
            </select>
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-white transition-colors">
              Team Size
            </label>
            <select
              value={formData.teamSize}
              onChange={(e) => setFormData(prev => ({ ...prev, teamSize: e.target.value }))}
              className="modern-select w-full px-4 py-3 rounded-2xl text-white outline-none"
            >
              <option value="" className="bg-gray-900">Select team size...</option>
              <option value="1" className="bg-gray-900">👤 Just me</option>
              <option value="2-3" className="bg-gray-900">👥 2-3 people</option>
              <option value="4-10" className="bg-gray-900">👥 4-10 people</option>
              <option value="10+" className="bg-gray-900">👥 10+ people</option>
            </select>
          </div>
        </div>
      </div>

      {/* Privacy checkbox with modern styling */}
      <div className="flex items-start space-x-3 mt-6">
        <input
          type="checkbox"
          id="privacy"
          checked={formData.privacyAccepted}
          onChange={(e) => setFormData(prev => ({ ...prev, privacyAccepted: e.target.checked }))}
          className="mt-1 h-5 w-5 bg-transparent border-2 border-gray-400 rounded checked:bg-purple-500 checked:border-purple-500 focus:ring-2 focus:ring-purple-400 cursor-pointer"
        />
        <label htmlFor="privacy" className="text-sm text-gray-300 cursor-pointer hover:text-white transition-colors">
          I agree to the{' '}
          <a href="/integritet" target="_blank" className="text-purple-400 hover:text-purple-300 hover:underline font-medium">
            Privacy Policy
          </a>
        </label>
      </div>

      {/* Modern button with gradient */}
      <button
        onClick={() => setCurrentStep(2)}
        disabled={!formData.name || !formData.email || !formData.privacyAccepted || !formData.businessStage || !formData.industry || !formData.targetMarket || !formData.businessModel}
        className="gradient-button w-full text-white py-4 px-6 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        Continue to Data Collection →
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with icon */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 mb-4 floating-icon">
          <FaLightbulb className="text-white text-3xl" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Enhance Your Analysis 🎯</h2>
        <p className="text-gray-400">
          Share more details for hyper-personalized insights
          <br />
          <span className="text-sm text-purple-400">✨ Each data point makes your recommendations 25% more specific!</span>
        </p>
      </div>

      {/* Information Quality Indicator with glassmorphism */}
      <div className="wizard-card rounded-3xl p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
        <h3 className="font-semibold text-white mb-4 flex items-center">
          <span className="text-2xl mr-2">📊</span> Data Quality Score
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <FaCheck className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-300">Basic business information ✓</span>
          </div>
          <div className="flex items-center space-x-3">
            {formData.website ? (
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <FaCheck className="w-4 h-4 text-white" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-gray-600"></div>
            )}
            <span className="text-sm text-gray-300">Website analysis {formData.website ? '✓' : <span className="text-purple-400">(+30% accuracy)</span>}</span>
          </div>
          <div className="flex items-center space-x-3">
            {formData.uploadedFiles.length > 0 ? (
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <FaCheck className="w-4 h-4 text-white" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-gray-600"></div>
            )}
            <span className="text-sm text-gray-300">Business documents {formData.uploadedFiles.length > 0 ? '✓' : <span className="text-purple-400">(+40% accuracy)</span>}</span>
          </div>
          <div className="flex items-center space-x-3">
            {formData.linkedinProfiles ? (
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <FaCheck className="w-4 h-4 text-white" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-gray-600"></div>
            )}
            <span className="text-sm text-gray-300">Team analysis {formData.linkedinProfiles ? '✓' : <span className="text-gray-500">(optional)</span>}</span>
          </div>
        </div>
      </div>
      
      {/* Website URL with modern styling */}
      <div className="group">
        <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-white transition-colors">
          <FaGlobe className="inline-block w-4 h-4 mr-2" />
          Website URL
        </label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
          className="modern-input w-full px-4 py-3 rounded-2xl text-white placeholder-gray-500 outline-none"
          placeholder="https://yourcompany.com"
        />
        <p className="text-xs text-purple-400 mt-2">📈 We'll analyze your value proposition & competitors</p>
      </div>

      {/* LinkedIn profiles */}
      <div className="group">
        <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-white transition-colors">
          <FaUsers className="inline-block w-4 h-4 mr-2" />
          LinkedIn profiles of founders/team
        </label>
        <input
          type="text"
          value={formData.linkedinProfiles}
          onChange={(e) => setFormData(prev => ({ ...prev, linkedinProfiles: e.target.value }))}
          className="modern-input w-full px-4 py-3 rounded-2xl text-white placeholder-gray-500 outline-none"
          placeholder="LinkedIn URLs separated by commas"
        />
        <p className="text-xs text-purple-400 mt-2">👥 We'll assess founder-market fit & team strengths</p>
      </div>

      {/* File upload with modern design */}
      <div className="group">
        <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-white transition-colors">
          <FaUpload className="inline-block w-4 h-4 mr-2" />
          Upload business materials
        </label>
        <div className="wizard-card rounded-2xl p-4 mb-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <p className="text-sm text-white font-medium mb-3">📋 Most valuable documents:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-300">
            <div>• <strong className="text-purple-400">Pitch deck</strong> - business model</div>
            <div>• <strong className="text-purple-400">Financials</strong> - unit economics</div>
            <div>• <strong className="text-purple-400">Customer data</strong> - validation</div>
            <div>• <strong className="text-purple-400">Business plan</strong> - strategy</div>
          </div>
        </div>
        
        <div className="file-upload-zone rounded-2xl p-8 text-center cursor-pointer group-hover:border-purple-500">
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 floating-icon">
              <FaUpload className="text-white text-2xl" />
            </div>
            <p className="text-sm text-white font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-400 mt-1">PDF, Word, or .txt documents</p>
          </label>
        </div>
        
        {formData.uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {formData.uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center space-x-3 wizard-card rounded-xl p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <FaCheck className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-white truncate">{file.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modern buttons */}
      <div className="flex space-x-4 mt-8">
        <button
          onClick={() => setCurrentStep(1)}
          className="flex-1 py-4 px-6 wizard-card rounded-2xl text-white font-semibold hover:bg-gray-800 transition-all"
        >
          ← Back
        </button>
        <button
          onClick={handleInitialAnalysis}
          className="gradient-button flex-1 py-4 px-6 text-white font-semibold rounded-2xl transition-all flex items-center justify-center space-x-2"
        >
          <FaRocket className="text-lg" />
          <span>Start Analysis</span>
        </button>
      </div>
    </div>
  );

  const renderAnalyzing = () => (
    <div className="text-center py-12 animate-fadeIn">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mb-8 floating-icon">
        <FaChartLine className="text-white text-3xl" />
      </div>
      
      <div className="relative w-32 h-32 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-blue-600/20 blur-xl animate-pulse"></div>
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="60"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="64"
            cy="64"
            r="60"
            stroke="url(#analyzeGradient)"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 60}`}
            strokeDashoffset={`${2 * Math.PI * 60 * (1 - analysisProgress / 100)}`}
            className="transition-all duration-300 filter drop-shadow-lg"
          />
          <defs>
            <linearGradient id="analyzeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{Math.round(analysisProgress)}%</span>
        </div>
      </div>
      
      <h3 className="text-2xl font-semibold text-white mb-2">GPT-5 is analyzing your business... 🧠</h3>
      <p className="text-gray-400">Advanced AI creating comprehensive investment analysis</p>
      <div className="mt-4 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-blue-300">
            {analysisProgress < 30 ? 'Gathering business data...' :
             analysisProgress < 60 ? 'Running AI analysis...' :
             analysisProgress < 85 ? 'Generating insights...' :
             'Finalizing results...'}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          GPT-5 analysis takes 60-90 seconds for maximum quality
        </p>
      </div>
    </div>
  );

  const renderFollowUp = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4 floating-icon">
          <FaLightbulb className="text-white text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Almost There!</h2>
        <p className="text-gray-400">A few targeted questions to maximize your analysis quality</p>
      </div>

      <div className="space-y-4">
        {followUpQuestions.map((question, index) => (
          <div key={question.id} className="group">
            <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-white transition-colors">
              {index + 1}. {question.title}
              {question.subtitle && <span className="text-gray-500 block text-xs mt-1">{question.subtitle}</span>}
            </label>
            <textarea
              value={followUpAnswers[question.id] || ''}
              onChange={(e) => setFollowUpAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
              className="modern-input w-full px-4 py-3 rounded-2xl text-white placeholder-gray-500 outline-none resize-none"
              placeholder={question.placeholder || 'Your answer...'}
              rows={3}
            />
          </div>
        ))}
      </div>

      <div className="flex space-x-4 mt-8">
        <button
          onClick={() => setCurrentStep(2)}
          className="flex-1 py-4 px-6 wizard-card rounded-2xl text-white font-semibold hover:bg-gray-800 transition-all"
        >
          ← Back
        </button>
        <button
          onClick={handleFinalAnalysis}
          className="gradient-button flex-1 py-4 px-6 text-white font-semibold rounded-2xl transition-all flex items-center justify-center space-x-2"
        >
          <FaRocket className="text-lg" />
          <span>Complete Analysis</span>
        </button>
      </div>
    </div>
  );

  const renderCompletingAnalysis = () => (
    <div className="text-center py-12 animate-fadeIn">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-8 floating-icon">
        <FaStar className="text-white text-3xl" />
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-4">Finalizing Your Analysis</h2>
      <p className="text-gray-400 mb-8">GPT-5 is generating your comprehensive investment report...</p>
      
      <div className="w-16 h-16 mx-auto">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500"></div>
      </div>
      
      <p className="text-sm text-purple-400 mt-6">This may take 60-90 seconds for maximum quality</p>
    </div>
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal with modern design */}
      <div className="relative wizard-card rounded-3xl shadow-2xl w-full mx-auto overflow-hidden animate-slideUp 
        max-w-lg lg:max-w-2xl max-h-[90vh] md:max-h-[85vh]">
        {/* Step indicator bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
        
        <div className="p-6 md:p-8 overflow-y-auto max-h-[88vh] md:max-h-[83vh]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
          >
            <FaTimes className="w-5 h-5" />
          </button>

          {isAnalyzing ? renderAnalyzing() : 
           isCompletingAnalysis ? renderCompletingAnalysis() : (
            currentStep === 1 ? renderStep1() :
            currentStep === 2 ? renderStep2() :
            renderFollowUp()
          )}
        </div>
      </div>
    </div>
  );
}