'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface DeepAnalysisAnswers {
  current_main_challenge: string;
  specific_customer_segments: string;
  revenue_and_metrics: string;
  biggest_competitor_weakness: string;
  current_sales_process: string;
  next_6_months_goal: string;
  team_biggest_gap: string;
  customer_retention_issue: string;
}

const DEEP_QUESTIONS = [
  {
    id: 'current_main_challenge',
    title: 'What is your #1 business challenge right now?',
    subtitle: 'Be specific about what keeps you up at night',
    placeholder: 'e.g., "We close only 15% of qualified leads because our demo-to-decision takes 3 months and prospects lose interest"',
    type: 'textarea'
  },
  {
    id: 'specific_customer_segments', 
    title: 'Describe your 3 most profitable customer types',
    subtitle: 'Include company size, industry, and what they pay you',
    placeholder: 'e.g., "1) Mid-size law firms (50-200 employees) pay $2,400/month for compliance automation, 2) Accounting firms..."',
    type: 'textarea'
  },
  {
    id: 'revenue_and_metrics',
    title: 'Share your current business metrics',
    subtitle: 'Revenue, growth rate, customers, anything you can quantify',
    placeholder: 'e.g., "$45K MRR, 12% month-over-month growth, 180 paying customers, $250 average deal size, 15-day sales cycle"',
    type: 'textarea'
  },
  {
    id: 'biggest_competitor_weakness',
    title: 'What do customers hate about your main competitor?',
    subtitle: 'Specific pain points you hear repeatedly',
    placeholder: 'e.g., "Salesforce is too complex - takes 3 months to set up, requires dedicated admin, and costs 2x our price"',
    type: 'textarea'
  },
  {
    id: 'current_sales_process',
    title: 'Walk me through your current sales process',
    subtitle: 'From first contact to signed contract - be detailed',
    placeholder: 'e.g., "1) Inbound lead from website, 2) 30-min discovery call, 3) Custom demo, 4) Proposal sent, 5) 2-week decision period..."',
    type: 'textarea'
  },
  {
    id: 'next_6_months_goal',
    title: 'What specific goal do you want to achieve in 6 months?',
    subtitle: 'Something measurable that would significantly impact your business',
    placeholder: 'e.g., "Increase MRR from $45K to $120K by closing 3 enterprise deals worth $25K+ each"',
    type: 'textarea'
  },
  {
    id: 'team_biggest_gap',
    title: 'What is your team\'s biggest capability gap?',
    subtitle: 'What expertise do you need but don\'t have?',
    placeholder: 'e.g., "We have great developers but no one who has sold to enterprise. Need VP Sales with 10+ years SaaS experience"',
    type: 'textarea'
  },
  {
    id: 'customer_retention_issue',
    title: 'Why do customers leave or not renew?',
    subtitle: 'Specific reasons from churned customers',
    placeholder: 'e.g., "Customers churn after 8 months because our onboarding takes too long and they don\'t see value quickly enough"',
    type: 'textarea'
  }
];

export default function DeepAnalysisWizard() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<DeepAnalysisAnswers>({} as DeepAnalysisAnswers);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [personalizedQuestions, setPersonalizedQuestions] = useState<any[]>(DEEP_QUESTIONS);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  useEffect(() => {
    setProgress(((currentQuestion + 1) / personalizedQuestions.length) * 100);
  }, [currentQuestion, personalizedQuestions]);

  // Load previous analysis and generate personalized questions
  useEffect(() => {
    const generatePersonalizedQuestions = async () => {
      try {
        const previousAnalysis = localStorage.getItem('latestAnalysisResult');
        
        if (previousAnalysis) {
          const response = await fetch('/api/generate-deep-questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ previousAnalysis: JSON.parse(previousAnalysis) })
          });

          if (response.ok) {
            const result = await response.json();
            if (result.questions && result.questions.length > 0) {
              setPersonalizedQuestions(result.questions);
            }
          }
        }
      } catch (error) {
        console.error('Error generating personalized questions:', error);
        // Fallback to default questions
      } finally {
        setLoadingQuestions(false);
      }
    };

    generatePersonalizedQuestions();
  }, []);

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [personalizedQuestions[currentQuestion].id]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < personalizedQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Get previous analysis from localStorage
      const previousAnalysis = localStorage.getItem('latestAnalysisResult');
      
      const response = await fetch('/api/ultra-deep-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deepAnswers: answers,
          previousAnalysis: previousAnalysis ? JSON.parse(previousAnalysis) : null
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      
      // Store the ultra-deep analysis result
      localStorage.setItem('ultraDeepAnalysisResult', JSON.stringify(result));

      // Attempt to persist to DB by updating existing analysis
      try {
        const prev = previousAnalysis ? JSON.parse(previousAnalysis) : null
        const localId = typeof window !== 'undefined' ? localStorage.getItem('analysisId') : null
        const analysisId = prev?.id || localId
        if (analysisId) {
          await fetch(`/api/analyses/${analysisId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ultraDeepAnalysis: result,
              insightCount: Array.isArray(result?.insights) ? result.insights.length : undefined
            })
          })
        } else {
          console.warn('No analysisId found; skipping DB update')
        }
      } catch (e) {
        console.warn('Could not persist ultra-deep analysis (user may be anonymous):', e);
      }
      
      // Redirect to ultra-deep results page
      window.location.href = '/ultra-deep-result';
      
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentQuestionData = personalizedQuestions[currentQuestion];
  const currentAnswer = answers[currentQuestionData?.id as keyof DeepAnalysisAnswers] || '';
  const isLastQuestion = currentQuestion === personalizedQuestions.length - 1;

  if (loadingQuestions) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <Image
          src="/bakgrund.png"
          alt="Background"
          fill
          className="object-cover -z-10"
          priority
        />
        
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 text-center max-w-lg">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-4">Preparing Your Personalized Questions...</h2>
          <p className="text-white/70">Analyzing your previous responses to create targeted follow-up questions...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <Image
          src="/bakgrund.png"
          alt="Background"
          fill
          className="object-cover -z-10"
          priority
        />
        
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 text-center max-w-lg">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-4">Generating Ultra-Deep Analysis...</h2>
          <p className="text-white/70">Creating personalized recommendations based on your detailed answers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <Image
        src="/bakgrund.png"
        alt="Background"
        fill
        className="object-cover -z-10"
        priority
      />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/60 text-sm">Question {currentQuestion + 1} of {personalizedQuestions.length}</span>
              <span className="text-white/60 text-sm">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          {currentQuestionData && (
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-3">
                  {currentQuestionData.title}
                </h1>
                <p className="text-xl text-white/70">
                  {currentQuestionData.subtitle}
                </p>
              </div>

              {/* Answer Input */}
              <div className="mb-8">
                <textarea
                  value={currentAnswer}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder={currentQuestionData.placeholder}
                  className="w-full h-32 bg-white/5 border border-white/20 rounded-xl p-4 text-white placeholder-white/50 resize-none focus:outline-none focus:border-blue-500 transition-colors"
                  autoFocus
                />
              </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={handleBack}
                disabled={currentQuestion === 0}
                className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Back
              </button>

              <div className="text-center">
                <p className="text-white/60 text-sm mb-2">
                  {isLastQuestion ? 'Ready to generate your analysis!' : 'Keep going...'}
                </p>
              </div>

              <button
                onClick={handleNext}
                disabled={!currentAnswer.trim()}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                {isLastQuestion ? '🚀 Generate Analysis' : 'Next →'}
              </button>
            </div>
          </div>
          )}

          {/* Tips */}
          <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 text-center">
            <p className="text-blue-200 text-sm">
              💡 <strong>Pro tip:</strong> The more specific you are, the more valuable your recommendations will be. 
              Include numbers, names, and concrete examples whenever possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 