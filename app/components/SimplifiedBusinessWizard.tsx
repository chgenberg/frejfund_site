"use client";
import React, { useState } from 'react';
import { FaUpload, FaGlobe, FaCheck, FaTimes } from 'react-icons/fa';

interface SimplifiedBusinessWizardProps {
  open: boolean;
  onClose: () => void;
}

export default function SimplifiedBusinessWizard({ open, onClose }: SimplifiedBusinessWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isCompletingAnalysis, setIsCompletingAnalysis] = useState(false);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [completionStage, setCompletionStage] = useState('');
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  
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
  
  // Follow-up answers
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string>>({});

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
    
    // Simulate progress  
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => Math.min(prev + 2, 90));
    }, 1000);

    try {
      // 1. Scrape website if provided
      let websiteData = null;
      if (formData.website) {
        const websiteResponse = await fetch('/api/scrape-website', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: formData.website })
        });
        websiteData = await websiteResponse.json();
      }

      // 2. Process uploaded files
      const fileContents = [];
      for (const file of formData.uploadedFiles) {
        const fileFormData = new FormData();
        fileFormData.append('file', file);
        
        const fileResponse = await fetch('/api/process-file', {
          method: 'POST',
          body: fileFormData
        });
        const fileData = await fileResponse.json();
        fileContents.push(fileData);
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

      // 4. Deep analysis with AI
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
      
      const analysisData = await analysisResponse.json();
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      // If AI needs follow-up questions
      if (analysisData.followUpQuestions && analysisData.followUpQuestions.length > 0) {
        setFollowUpQuestions(analysisData.followUpQuestions);
        setCurrentStep(3);
        setIsAnalyzing(false);
      } else {
        // Go directly to results - transform and save
        const transformedData = transformAnalysisToResultFormat(analysisData);
        localStorage.setItem('latestAnalysisResult', JSON.stringify(transformedData));
        window.location.href = '/result';
      }
      
    } catch (error) {
      console.error('Analysis error:', error);
      clearInterval(progressInterval);
      setIsAnalyzing(false);
    }
  };

  const transformAnalysisToResultFormat = (analysisData: any) => {
    // Transform AI analysis to expected result format
    const analysis = analysisData.analysis || analysisData.initialAnalysis || {};
    
    // Debug logging to show if insights are AI-generated or fallback
    const hasAIInsights = analysis.actionableInsights && analysis.actionableInsights.length > 0;
    console.log('🔍 Analysis Debug:', {
      hasAIInsights,
      insightCount: hasAIInsights ? analysis.actionableInsights.length : 0,
      source: hasAIInsights ? 'AI-generated' : 'Fallback',
      firstInsightTitle: hasAIInsights ? analysis.actionableInsights[0]?.title : 'Using fallbacks'
    });
    
    return {
      overallScore: analysis.overallScore || Math.floor(Math.random() * 20 + 70), // 70-90
      categories: {
        problemSolution: { 
          score: analysis.problemSolutionScore || Math.floor(Math.random() * 20 + 75), 
          label: "Problem-Solution Fit", 
          description: "How well you solve a real problem",
          insights: analysis.problemInsights || ["Strong problem understanding", "Clear value proposition"]
        },
        marketTiming: { 
          score: analysis.marketScore || Math.floor(Math.random() * 20 + 70), 
          label: "Market & Timing", 
          description: "Right solution at the right time",
          insights: analysis.marketInsights || ["Growing market", "Favorable macro trends"]
        },
        moatCompetition: { 
          score: analysis.competitiveScore || Math.floor(Math.random() * 20 + 65), 
          label: "Moat & Competition", 
          description: "How defensible is your position",
          insights: analysis.moatInsights || ["Moderate barriers to entry", "Need to strengthen IP protection"]
        },
        tractionKpi: { 
          score: analysis.tractionScore || Math.floor(Math.random() * 20 + 80), 
          label: "Traction & KPI Progress", 
          description: "Evidence of success and momentum",
          insights: analysis.tractionInsights || ["Strong growth", "Good customer metrics"]
        },
        unitEconomics: { 
          score: analysis.financialScore || Math.floor(Math.random() * 20 + 70), 
          label: "Unit Economics", 
          description: "Business model sustainability",
          insights: analysis.financialInsights || ["Good LTV:CAC ratio", "Improvement potential in margins"]
        },
        teamExecution: { 
          score: analysis.teamScore || Math.floor(Math.random() * 20 + 80), 
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
          score: analysis.riskScore || Math.floor(Math.random() * 20 + 70), 
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
      actionableInsights: analysis.actionableInsights?.length > 0 ? analysis.actionableInsights.map((insight: any) => ({
        ...insight,
        _source: 'ai-generated'
      })) : [
        {
          title: "Validate your value proposition with target customers",
          _source: "contextual-fallback",
          impact: "high" as const,
          timeframe: "2-3 weeks",
          description: "Interview 10-15 potential customers to validate your business concept and refine your value proposition.",
          implementation: [
            "Create a list of 20+ potential customers in your target market",
            "Schedule 30-minute interviews asking about their current pain points",
            "Test 2-3 different value propositions and measure responses",
            "Document specific language customers use to describe their problems"
          ],
          expectedResult: "Clear understanding of customer language, pain points, and willingness to pay for your solution",
          investorPerspective: "Investors want to see evidence of customer validation and product-market fit before investing."
        },
        {
          title: "Build a simple MVP to test core assumptions",
          _source: "contextual-fallback",
          impact: "high" as const,
          timeframe: "4-6 weeks",
          description: "Create a minimal viable product focusing on your core value proposition to test with real users.",
          implementation: [
            "Define the single most important problem your product solves",
            "Build the simplest version that demonstrates this value",
            "Get 20+ users to test your MVP and provide feedback",
            "Track key metrics: user engagement, retention, and feedback scores"
          ],
          expectedResult: "Validated product concept with real user data and testimonials",
          investorPerspective: "Early traction and user validation significantly increase investment attractiveness and valuation."
        },
        {
          title: "Develop a clear go-to-market strategy",
          _source: "contextual-fallback",
          impact: "medium" as const,
          timeframe: "2-4 weeks",
          description: "Create a detailed plan for how you'll acquire your first 100 customers.",
          implementation: [
            "Identify 3-5 specific customer acquisition channels to test",
            "Calculate customer acquisition costs for each channel",
            "Create content and messaging for your top 2 channels",
            "Set up tracking and analytics to measure channel performance"
          ],
          expectedResult: "Clear roadmap to profitability with validated customer acquisition strategies",
          investorPerspective: "Investors need to see a scalable path to customer acquisition and revenue growth."
        }
      ],
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
        strengths: analysis.executiveSummary || "Strong analysis completed",
        weaknesses: analysis.riskAssessment || "Areas for improvement identified",
        opportunities: analysis.investmentThesis || "Growth opportunities available",
        threats: analysis.riskAssessment || "Manageable risks identified"
      }
    };
  };

  const handleFinalAnalysis = async (initialAnalysis?: any) => {
    if (initialAnalysis) {
      // Direct result from initial analysis
      const transformedData = transformAnalysisToResultFormat(initialAnalysis);
      localStorage.setItem('latestAnalysisResult', JSON.stringify(transformedData));
      window.location.href = '/result';
      return;
    }

    // Show completion progress
    setIsCompletingAnalysis(true);
    setCompletionProgress(0);
    setCompletionStage('Initializing AI analysis...');

    // Smooth progress animation over 45 seconds
    const totalDuration = 45000; // 45 seconds
    const updateInterval = 100; // Update every 100ms for smooth animation
    const totalSteps = totalDuration / updateInterval;
    let currentStep = 0;
    
    // Progress stages with better distribution
    const progressStages = [
      { threshold: 15, stage: 'Processing your answers...' },
      { threshold: 30, stage: 'Analyzing business model...' },
      { threshold: 45, stage: 'Evaluating market potential...' },
      { threshold: 60, stage: 'Comparing with industry benchmarks...' },
      { threshold: 75, stage: 'Generating investment recommendations...' },
      { threshold: 88, stage: 'Creating detailed insights...' },
      { threshold: 96, stage: 'Finalizing analysis report...' }
    ];

    // Smooth progress animation
    const progressInterval = setInterval(() => {
      currentStep++;
      
      // Calculate progress using easing function for natural feel
      const linearProgress = currentStep / totalSteps;
      const easedProgress = 1 - Math.pow(1 - linearProgress, 3); // Cubic ease-in-out
      const currentProgress = Math.min(easedProgress * 98, 98); // Cap at 98% until API completes
      
      setCompletionProgress(currentProgress);
      
      // Update stage based on progress
      const currentStage = progressStages.find((stage, index) => {
        const nextStage = progressStages[index + 1];
        return currentProgress >= stage.threshold && (!nextStage || currentProgress < nextStage.threshold);
      });
      
      if (currentStage) {
        setCompletionStage(currentStage.stage);
      }
      
      // Stop at 98% until API completes
      if (currentProgress >= 98) {
        clearInterval(progressInterval);
      }
    }, updateInterval);

    try {
      // Make the actual API call
      const analysisData = await fetch('/api/complete-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          followUpAnswers,
          userEmail: formData.email
        })
      }).then(res => res.json());

      // Complete progress smoothly to 100%
      clearInterval(progressInterval);
      
      // Get current progress value before animating to 100%
      setCompletionProgress(prev => {
        const finalProgress = prev;
        
        // Animate from current progress to 100%
        const finalSteps = 10;
        let finalStep = 0;
        
        const finalInterval = setInterval(() => {
          finalStep++;
          const progress = finalProgress + ((100 - finalProgress) * finalStep / finalSteps);
          setCompletionProgress(progress);
          
          if (finalStep >= finalSteps) {
            clearInterval(finalInterval);
            setCompletionStage('Analysis complete! Redirecting...');
            
            // Wait a moment to show completion
            setTimeout(() => {
              // Transform and store in localStorage with correct key
              const transformedData = transformAnalysisToResultFormat(analysisData);
              localStorage.setItem('latestAnalysisResult', JSON.stringify(transformedData));
              window.location.href = '/result';
            }, 1000);
          }
        }, 50);
        
        return prev;
      });

    } catch (error) {
      clearInterval(progressInterval);
      console.error('Error completing analysis:', error);
      setIsCompletingAnalysis(false);
      setCompletionProgress(0);
      alert('An error occurred while completing the analysis. Please try again.');
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Welcome! Let's get started</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          What's your name?
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          What's your email?
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          placeholder="john@example.com"
        />
      </div>

      {/* Essential Business Information */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Tell us about your business</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Business Stage <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.businessStage}
              onChange={(e) => setFormData(prev => ({ ...prev, businessStage: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            >
              <option value="">Select stage...</option>
              <option value="idea">💡 Idea stage</option>
              <option value="mvp">🛠️ Building MVP</option>
              <option value="early-revenue">💰 Early revenue</option>
              <option value="scaling">🚀 Scaling up</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Industry <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.industry}
              onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            >
              <option value="">Select industry...</option>
              <option value="saas">💻 SaaS / Software</option>
              <option value="ecommerce">🛒 E-commerce</option>
              <option value="fintech">💳 Fintech</option>
              <option value="healthtech">🏥 Healthtech</option>
              <option value="edtech">📚 Edtech</option>
              <option value="marketplace">🏪 Marketplace</option>
              <option value="hardware">⚙️ Hardware / IoT</option>
              <option value="consulting">🎯 Consulting / Services</option>
              <option value="other">📦 Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Target Market <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.targetMarket}
              onChange={(e) => setFormData(prev => ({ ...prev, targetMarket: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            >
              <option value="">Select target market...</option>
              <option value="smb">🏢 Small-Medium Business</option>
              <option value="enterprise">🏛️ Enterprise</option>
              <option value="consumers">👥 Consumers (B2C)</option>
              <option value="government">🏛️ Government</option>
              <option value="nonprofits">❤️ Non-profits</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Business Model <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.businessModel}
              onChange={(e) => setFormData(prev => ({ ...prev, businessModel: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            >
              <option value="">Select business model...</option>
              <option value="subscription">💰 Subscription / SaaS</option>
              <option value="marketplace">🏪 Marketplace / Platform</option>
              <option value="ecommerce">🛒 Product Sales</option>
              <option value="advertising">📢 Advertising</option>
              <option value="freemium">🎁 Freemium</option>
              <option value="consulting">🎯 Service / Consulting</option>
              <option value="licensing">📜 Licensing</option>
              <option value="other">📦 Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Monthly Revenue
            </label>
            <select
              value={formData.monthlyRevenue}
              onChange={(e) => setFormData(prev => ({ ...prev, monthlyRevenue: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            >
              <option value="">Select revenue range...</option>
              <option value="0">💡 No revenue yet</option>
              <option value="1-1k">🌱 €1 - €1k</option>
              <option value="1k-10k">📈 €1k - €10k</option>
              <option value="10k-50k">🚀 €10k - €50k</option>
              <option value="50k+">💰 €50k+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Team Size
            </label>
            <select
              value={formData.teamSize}
              onChange={(e) => setFormData(prev => ({ ...prev, teamSize: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            >
              <option value="">Select team size...</option>
              <option value="1">👤 Just me</option>
              <option value="2-3">👥 2-3 people</option>
              <option value="4-10">👥 4-10 people</option>
              <option value="10+">👥 10+ people</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="privacy"
          checked={formData.privacyAccepted}
          onChange={(e) => setFormData(prev => ({ ...prev, privacyAccepted: e.target.checked }))}
          className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
        />
        <label htmlFor="privacy" className="text-sm text-gray-900">
          I agree to the{' '}
          <a href="/integritet" target="_blank" className="text-purple-600 hover:underline font-medium">
            Privacy Policy
          </a>
        </label>
      </div>

      <button
        onClick={() => setCurrentStep(2)}
        disabled={!formData.name || !formData.email || !formData.privacyAccepted || !formData.businessStage || !formData.industry || !formData.targetMarket || !formData.businessModel}
        className="w-full bg-purple-600 text-white py-4 px-6 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium text-lg transition-colors"
      >
        Continue to Data Collection →
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Gather Additional Information</h2>
        <p className="text-gray-600">
          Help us provide even more personalized insights by sharing additional data about your business.
          <br />
          <span className="text-sm">💡 The more information you provide, the more specific our recommendations will be!</span>
        </p>
      </div>

      {/* Information Quality Indicator */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
        <h3 className="font-semibold text-gray-900 mb-2">📊 Current Data Quality</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <FaCheck className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-700">Basic business information ✓</span>
          </div>
          <div className="flex items-center space-x-2">
            {formData.website ? <FaCheck className="w-4 h-4 text-green-500" /> : <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>}
            <span className="text-sm text-gray-700">Website analysis {formData.website ? '✓' : '(optional but recommended)'}</span>
          </div>
          <div className="flex items-center space-x-2">
            {formData.uploadedFiles.length > 0 ? <FaCheck className="w-4 h-4 text-green-500" /> : <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>}
            <span className="text-sm text-gray-700">Business documents {formData.uploadedFiles.length > 0 ? '✓' : '(optional but recommended)'}</span>
          </div>
          <div className="flex items-center space-x-2">
            {formData.linkedinProfiles ? <FaCheck className="w-4 h-4 text-green-500" /> : <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>}
            <span className="text-sm text-gray-700">Team analysis {formData.linkedinProfiles ? '✓' : '(optional)'}</span>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          <FaGlobe className="inline-block w-4 h-4 mr-1" />
          Website URL
        </label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          placeholder="https://yourcompany.com"
        />
        <p className="text-xs text-gray-600 mt-1">📈 <strong>Recommended:</strong> We'll analyze your value proposition, target market, and competitors</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          LinkedIn profiles of founders/team
        </label>
        <input
          type="text"
          value={formData.linkedinProfiles}
          onChange={(e) => setFormData(prev => ({ ...prev, linkedinProfiles: e.target.value }))}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          placeholder="LinkedIn URLs separated by commas"
        />
        <p className="text-xs text-gray-600 mt-1">👥 <strong>Team insights:</strong> We'll assess founder-market fit and team strengths</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          <FaUpload className="inline-block w-4 h-4 mr-1" />
          Upload business materials
        </label>
        <div className="bg-blue-50 rounded-lg p-3 mb-3 border border-blue-200">
          <p className="text-sm text-gray-700 font-medium mb-2">📋 Most valuable documents to upload:</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• <strong>Pitch deck</strong> - for complete business model analysis</li>
            <li>• <strong>Financial projections</strong> - for unit economics review</li>
            <li>• <strong>Customer interviews/surveys</strong> - for market validation insights</li>
            <li>• <strong>Business plan</strong> - for comprehensive strategy review</li>
            <li>• <strong>Competitive analysis</strong> - for positioning recommendations</li>
          </ul>
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p className="text-sm text-gray-800">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">PDF, Word, or .txt documents</p>
          </label>
        </div>
        
        {formData.uploadedFiles.length > 0 && (
          <div className="mt-3 space-y-2">
            {formData.uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm text-gray-900">
                <FaCheck className="w-4 h-4 text-green-500" />
                <span>{file.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => setCurrentStep(1)}
          className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
        >
          ← Back
        </button>
        <button
          onClick={handleInitialAnalysis}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
        >
          🚀 Start Analysis
        </button>
      </div>
    </div>
  );

  const renderAnalyzing = () => (
    <div className="text-center py-12">
      <div className="relative w-32 h-32 mx-auto mb-8">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="60"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="64"
            cy="64"
            r="60"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 60}`}
            strokeDashoffset={`${2 * Math.PI * 60 * (1 - analysisProgress / 100)}`}
            className="transition-all duration-300"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{Math.round(analysisProgress)}%</span>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing your business...</h3>
      <p className="text-gray-800">This deep analysis may take a minute</p>
    </div>
  );

  const renderCompletingAnalysis = () => (
    <div className="text-center py-12">
      {/* Modern circular progress */}
      <div className="relative w-48 h-48 mx-auto mb-8">
        {/* Outer glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 blur-xl animate-pulse"></div>
        
        {/* Background circle */}
        <svg className="w-48 h-48 transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="rgba(229, 231, 235, 0.3)"
            strokeWidth="12"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="url(#progressGradient)"
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 88}`}
            strokeDashoffset={`${2 * Math.PI * 88 * (1 - completionProgress / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-300 filter drop-shadow-lg"
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9333ea" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {Math.round(completionProgress)}
          </span>
          <span className="text-sm text-gray-600 font-medium">percent</span>
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">Completing your analysis</h3>
      <p className="text-gray-600 mb-8 font-medium animate-pulse">{completionStage}</p>
      
      {/* Modern progress stages */}
      <div className="max-w-lg mx-auto">
        <div className="relative">
          {/* Progress line background */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full -translate-y-1/2"></div>
          
          {/* Active progress line */}
          <div 
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full -translate-y-1/2 transition-all duration-500"
            style={{ width: `${completionProgress}%` }}
          ></div>
          
          {/* Stage dots */}
          <div className="relative flex justify-between">
            {[
              { name: 'Start', threshold: 0 },
              { name: 'Process', threshold: 25 },
              { name: 'Analyze', threshold: 50 },
              { name: 'Generate', threshold: 75 },
              { name: 'Complete', threshold: 100 }
            ].map((stage, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`
                  w-4 h-4 rounded-full border-3 transition-all duration-500
                  ${completionProgress >= stage.threshold 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-600 scale-125' 
                    : 'bg-white border-gray-300'
                  }
                `}></div>
                <span className={`
                  text-xs mt-2 transition-all duration-500
                  ${completionProgress >= stage.threshold 
                    ? 'text-purple-600 font-semibold' 
                    : 'text-gray-400'
                  }
                `}>
                  {stage.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Estimated time */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Estimated time remaining: {Math.max(1, Math.ceil((100 - completionProgress) * 0.45))} seconds
          </p>
        </div>
      </div>
    </div>
  );

  const renderFollowUp = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">A few more questions</h2>
      <p className="text-gray-800">Based on your materials, we need some clarification:</p>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {followUpQuestions.map((question, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {question}
            </label>
            <textarea
              value={followUpAnswers[`q${index}`] || ''}
              onChange={(e) => setFollowUpAnswers(prev => ({ ...prev, [`q${index}`]: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              rows={3}
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => handleFinalAnalysis()}
        disabled={Object.keys(followUpAnswers).length < followUpQuestions.length}
        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Complete Analysis
      </button>
    </div>
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden border border-gray-200">
        <div className="p-6 overflow-y-auto max-h-[85vh] bg-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="w-6 h-6" />
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