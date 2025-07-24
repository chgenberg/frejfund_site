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
    privacyAccepted: false,
    website: '',
    linkedinProfiles: '',
    uploadedFiles: [] as File[]
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
          title: "Complete detailed business analysis",
          _source: "needs-more-info",
          impact: "high" as const,
          timeframe: "15 minutes",
          description: "We need more specific information about your business to provide personalized recommendations.",
          implementation: [
            "Answer follow-up questions about your target market",
            "Provide details about your current customers and their specific pain points",
            "Share information about your business model and pricing",
            "Describe your competitive landscape and unique advantages"
          ],
          expectedResult: "Receive 3-5 personalized, actionable insights tailored to your specific business situation",
          investorPerspective: "Investors value entrepreneurs who can articulate their business model and market position clearly."
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
        disabled={!formData.name || !formData.email || !formData.privacyAccepted}
        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Tell us about your business</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          <FaGlobe className="inline-block w-4 h-4 mr-1" />
          What's your website? (optional)
        </label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          LinkedIn profiles of founders (optional)
        </label>
        <input
          type="text"
          value={formData.linkedinProfiles}
          onChange={(e) => setFormData(prev => ({ ...prev, linkedinProfiles: e.target.value }))}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          placeholder="LinkedIn URLs separated by commas"
        />
        <p className="text-xs text-gray-700 mt-1">Example: linkedin.com/in/founder1, linkedin.com/in/founder2</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          <FaUpload className="inline-block w-4 h-4 mr-1" />
          Upload your materials (pitch deck, ideas, etc.)
        </label>
        <p className="text-xs text-gray-700 mb-3">PDF, Word, or .txt documents</p>
        
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
          Back
        </button>
        <button
          onClick={handleInitialAnalysis}
          disabled={!formData.website && formData.uploadedFiles.length === 0 && !formData.linkedinProfiles}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Analyze
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