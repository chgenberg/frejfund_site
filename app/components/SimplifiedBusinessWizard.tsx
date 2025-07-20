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
        // Go directly to results
        handleFinalAnalysis(analysisData);
      }
      
    } catch (error) {
      console.error('Analysis error:', error);
      clearInterval(progressInterval);
      setIsAnalyzing(false);
    }
  };

  const handleFinalAnalysis = async (initialAnalysis?: any) => {
    // Navigate to results page with all data
    const analysisData = initialAnalysis || await fetch('/api/complete-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        followUpAnswers,
        userEmail: formData.email
      })
    }).then(res => res.json());

    // Store in session and navigate
    sessionStorage.setItem('analysisResults', JSON.stringify(analysisData));
    window.location.href = '/result';
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

          {isAnalyzing ? renderAnalyzing() : (
            currentStep === 1 ? renderStep1() :
            currentStep === 2 ? renderStep2() :
            renderFollowUp()
          )}
        </div>
      </div>
    </div>
  );
} 