'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { INVESTOR_QUESTION_SECTIONS } from './InvestorQuestions';
import { getSupabaseClient } from '../../lib/supabase';

interface MobileOptimizedWizardProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileOptimizedWizard({ open, onClose }: MobileOptimizedWizardProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isScrapingWebsite, setIsScrapingWebsite] = useState(false);
  const [scrapingProgress, setScrapingProgress] = useState(0);
  const [showHelpFor, setShowHelpFor] = useState<string | null>(null);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Hide navbar when wizard opens
  useEffect(() => {
    if (open) {
      const navbar = document.querySelector('[data-navbar]') as HTMLElement;
      const main = document.querySelector('main') as HTMLElement;
      
      if (navbar) {
        navbar.style.display = 'none';
      }
      
      if (main) {
        main.style.paddingTop = '0';
      }

      // Prevent mobile zoom on input focus
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }

      // Prevent body scroll when wizard is open
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    }
    
    // Cleanup when wizard closes
    return () => {
      const navbar = document.querySelector('[data-navbar]') as HTMLElement;
      const main = document.querySelector('main') as HTMLElement;
      
      if (navbar) {
        navbar.style.display = '';
      }
      if (main) {
        main.style.paddingTop = '';
      }

      // Restore viewport and body styles
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
      
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [open]);

  // Flatten all questions into a single array with section info
  const allQuestions = INVESTOR_QUESTION_SECTIONS.flatMap(section => 
    section.questions.map(q => ({
      ...q,
      sectionTitle: section.title,
      sectionIcon: section.icon,
      sectionId: section.id
    }))
  );

  // Group questions into pages (2 per page for mobile, 3 for desktop)
  const questionsPerPage = isMobile ? 2 : 3;
  
  // No filtering - show all questions
  const filteredQuestions = allQuestions;
  
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const currentPage = Math.floor(currentQuestionIndex / questionsPerPage);
  const questionsOnCurrentPage = filteredQuestions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!open) return null;

  const handleAnswer = (questionId: string, value: any) => {
    // Prevent unnecessary updates if value hasn't changed
    if (answers[questionId] === value) return;
    
    console.log('📝 Answer updated:', questionId, '=', value);
    
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    
    // No automatic scraping - will be triggered on Next button
  };

  const scrapeWebsite = async (url: string) => {
    console.log('🔍 Starting website scraping for URL:', url);
    setIsScrapingWebsite(true);
    setScrapingProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setScrapingProgress(prev => Math.min(prev + 10, 90));
    }, 500);
    
    try {
      const response = await fetch('/api/scrape-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      const data = await response.json();
      
      if (data.success && data.data) {
        // Pre-fill the answers with scraped data
        setAnswers(prev => ({
          ...prev,
          customer_pain_points: data.data.customer_pain || prev.customer_pain_points || '',
          solution_description: data.data.solution || prev.solution_description || '',
          elevator_pitch: data.data.elevator_pitch || prev.elevator_pitch || '',
          target_customer: data.data.target_customer || prev.target_customer || '',
          unique_tech: data.data.unique_tech || prev.unique_tech || '',
          team_overview: data.data.team || prev.team_overview || '',
          revenue_model: data.data.revenue_model || prev.revenue_model || '',
          traction_overview: data.data.traction || prev.traction_overview || '',
          company_value: data.data.company_value || prev.company_value || ''
        }));
        
        setScrapingProgress(100);
        setTimeout(() => {
          setIsScrapingWebsite(false);
          setScrapingProgress(0);
        }, 1000);
      }
    } catch (error) {
      console.error('Error scraping website:', error);
      setIsScrapingWebsite(false);
      setScrapingProgress(0);
    } finally {
      clearInterval(progressInterval);
    }
  };

  const isPageValid = () => {
    return questionsOnCurrentPage.every(q => {
      // Special handling for website_url - only required if has_website is "Ja"
      if (q.id === 'website_url') {
        if (answers.has_website === 'Ja') {
          return answers.website_url && answers.website_url.trim() !== '';
        }
        return true; // Not required if no website
      }
      
      // Regular validation for other questions
      if (!q.required) return true;
      const answer = answers[q.id];
      return answer && (typeof answer === 'object' ? Object.values(answer).every(v => v) : true);
    });
  };

  const handleNext = () => {
    // Check if we should start website scraping before moving to next page
    const currentPageQuestions = questionsOnCurrentPage.map(q => q.id);
    const hasWebsiteQuestionOnPage = currentPageQuestions.includes('has_website');
    const hasUrlQuestionOnPage = currentPageQuestions.includes('website_url');
    
    // If this page contains website questions and user has website with URL
    if ((hasWebsiteQuestionOnPage || hasUrlQuestionOnPage) && 
        answers.has_website === 'Ja' && 
        answers.website_url && 
        answers.website_url.trim() !== '') {
      
      console.log('🚀 Starting website scraping on Next button click');
      
      // Validate URL format before scraping
      try {
        const url = answers.website_url;
        const urlToScrape = url.startsWith('http') ? url : `https://${url}`;
        new URL(urlToScrape); // This will throw if invalid
        
        if (url.includes('.') && url.length > 4) {
          scrapeWebsite(url);
        } else {
          console.log('❌ Invalid URL format, skipping scraping');
        }
      } catch (error) {
        console.log('❌ URL validation failed, skipping scraping:', error);
      }
    }
    
    // Proceed to next page
    const nextPage = currentPage + 1;
    if (nextPage < totalPages) {
      setCurrentQuestionIndex(nextPage * questionsPerPage);
    }
  };

  const handleBack = () => {
    const prevPage = currentPage - 1;
    if (prevPage >= 0) {
      setCurrentQuestionIndex(prevPage * questionsPerPage);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setStatusMessage('Genererar investeringsanalys...');
    
    try {
      // Generate analysis
      const analysisResponse = await fetch('/api/generate-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });
      
      const analysisData = await analysisResponse.json();
      
      if (analysisData.success && analysisData.analysis) {
        // Save complete analysis to localStorage
        const resultData = {
          ...analysisData.analysis,
          answers: answers,
          timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('latestAnalysisResult', JSON.stringify(resultData));
        
        // Check if user is logged in and save to database
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { error } = await supabase
            .from('analyses')
            .insert({
              user_id: user.id,
              company_name: answers.company_name,
              score: analysisData.analysis.overallScore,
              analysis_data: resultData,
              answers: answers,
              created_at: new Date().toISOString()
            });
            
          if (error) {
            console.error('Error saving analysis:', error);
          }
        }
        
        // Navigate to enhanced result page
        router.push('/result');
      } else {
        throw new Error('Failed to generate analysis');
      }
    } catch (error) {
      console.error('Error submitting:', error);
      setStatusMessage('Ett fel uppstod. Försök igen.');
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: any) => (
    <div key={question.id} className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-4 border border-white/30 animate-fadeIn shadow-xl relative"
         onClick={(e) => e.stopPropagation()}>
      <div className="flex items-start justify-between mb-3">
        <label className="block text-white font-medium text-sm md:text-base flex-1">
          {question.label}
          {question.required && <span className="text-pink-400 ml-1">*</span>}
        </label>
        {question.exampleAnswers && question.exampleAnswers.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowHelpFor(showHelpFor === question.id ? null : question.id);
            }}
            className="ml-2 p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Help popup */}
      {showHelpFor === question.id && question.exampleAnswers && (
        <div className="absolute top-12 right-4 z-50 bg-slate-700 text-white p-4 rounded-xl shadow-2xl max-w-sm w-80 border border-purple-500/30 animate-fadeIn">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-sm text-purple-300">Exempelsvar:</h4>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowHelpFor(null);
              }}
              className="text-white/60 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-2">
            {question.exampleAnswers.map((example: string, index: number) => (
              <p key={index} className="text-sm text-white/90 italic">"{example}"</p>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-xs text-white/60">Klicka för att stänga</p>
          </div>
        </div>
      )}
      
      {question.type === 'text' && (
        <input
          type="text"
          value={answers[question.id] || ''}
          onChange={(e) => handleAnswer(question.id, e.target.value)}
          placeholder={question.placeholder}
          maxLength={question.max}
          onFocus={(e) => {
            // Ensure input is visible when focused
            setTimeout(() => {
              e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
          }}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all"
        />
      )}

      {question.type === 'textarea' && (
        <textarea
          value={answers[question.id] || ''}
          onChange={(e) => handleAnswer(question.id, e.target.value)}
          placeholder={question.placeholder}
          rows={isMobile ? 3 : 4}
          onFocus={(e) => {
            // Ensure textarea is visible when focused
            setTimeout(() => {
              e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
          }}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm transition-all"
        />
      )}

      {question.type === 'scale' && (
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleAnswer(question.id, value)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all text-sm transform hover:scale-105 ${
                answers[question.id] === value
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      )}

      {question.type === 'number' && (
        <input
          type="number"
          value={answers[question.id] || ''}
          onChange={(e) => handleAnswer(question.id, e.target.value)}
          placeholder={question.placeholder}
          min={question.min}
          max={question.max}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all"
        />
      )}

      {question.type === 'select' && (
        <select
          value={answers[question.id] || ''}
          onChange={(e) => handleAnswer(question.id, e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all appearance-none"
          style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
        >
          <option value="">Välj...</option>
          {question.options?.map((option: string) => (
            <option key={option} value={option} className="bg-slate-800">
              {option}
            </option>
          ))}
        </select>
      )}

      {question.type === 'percentage' && (
        <div className="relative">
          <input
            type="number"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder={question.placeholder}
            min={0}
            max={100}
            className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none">%</span>
        </div>
      )}

      {question.type === 'multi_input' && (
        <div className="space-y-3">
          {question.multiInputs?.map((input: any) => (
            <div key={input.id} className="relative">
              <label className="text-xs text-white/60 mb-1 block">{input.label}</label>
              <input
                type={input.type === 'percentage' ? 'number' : input.type}
                value={answers[question.id]?.[input.id] || ''}
                onChange={(e) => handleAnswer(question.id, {
                  ...answers[question.id],
                  [input.id]: e.target.value
                })}
                placeholder={input.placeholder}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all"
              />
              {input.type === 'percentage' && (
                <span className="absolute right-3 bottom-2 text-white/60 pointer-events-none text-sm">%</span>
              )}
            </div>
          ))}
        </div>
      )}

      {question.help && (
        <p className="text-xs text-white/60 mt-2 italic">{question.help}</p>
      )}
    </div>
  );

  const progress = ((currentPage + 1) / totalPages) * 100;

  // Handle swipe gestures - but not when user is interacting with form elements
  const handleTouchStart = (e: React.TouchEvent) => {
    // Don't handle swipes if user is touching an input, button, or interactive element
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'BUTTON' || target.closest('button') || target.closest('input') || target.closest('textarea')) {
      return;
    }
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Don't handle swipes if user is touching an input or interactive element
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'BUTTON' || target.closest('button') || target.closest('input') || target.closest('textarea')) {
      return;
    }
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentPage < totalPages - 1 && isPageValid()) {
      handleNext();
    }
    if (isRightSwipe && currentPage > 0) {
      handleBack();
    }
    
    // Reset touch state
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900" data-wizard-open="true">
      <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900">
        {/* Loading overlay for website scraping */}
        {isScrapingWebsite && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-slate-800 rounded-3xl p-8 max-w-md w-full mx-4 border border-purple-500/50 shadow-2xl">
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-24 h-24 mx-auto relative">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="44"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-white/10"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="44"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-purple-500"
                        strokeDasharray={`${2 * Math.PI * 44}`}
                        strokeDashoffset={`${2 * Math.PI * 44 * (1 - scrapingProgress / 100)}`}
                        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{scrapingProgress}%</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">Analyserar din hemsida</h3>
                <p className="text-white/70 mb-4">
                  Vi använder AI för att extrahera relevant information från din hemsida...
                </p>
                
                <div className="space-y-2 text-left">
                  <div className={`flex items-center gap-2 ${scrapingProgress > 0 ? 'text-green-400' : 'text-white/40'}`}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">Hämtar hemsidedata</span>
                  </div>
                  <div className={`flex items-center gap-2 ${scrapingProgress > 30 ? 'text-green-400' : 'text-white/40'}`}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">Analyserar innehåll</span>
                  </div>
                  <div className={`flex items-center gap-2 ${scrapingProgress > 60 ? 'text-green-400' : 'text-white/40'}`}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">Förifyllningsinformation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header with progress */}
        <div className="bg-slate-900/90 backdrop-blur-md border-b border-white/20 px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-lg font-bold text-white">Investeringsanalys</h2>
              <p className="text-white/70 text-xs mt-0.5">
                {questionsOnCurrentPage[0]?.sectionTitle || 'Frågor'}
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="text-white/70 hover:text-white p-1 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="relative">
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
              </div>
            </div>
            <p className="text-white/70 text-xs mt-1 text-center">
              Sida {currentPage + 1} av {totalPages}
            </p>
          </div>
        </div>

        {/* Questions container - no scroll */}
        <div className="flex-1 px-4 py-4 flex flex-col justify-center overflow-hidden bg-slate-900/40"
             onTouchStart={handleTouchStart}
             onTouchMove={handleTouchMove}
             onTouchEnd={handleTouchEnd}
             ref={containerRef}
        >
          <div className="space-y-3 max-w-lg mx-auto w-full" 
               style={{ touchAction: 'pan-y' }}>
            {questionsOnCurrentPage.map(renderQuestion)}
          </div>
        </div>

        {/* Navigation buttons - sticky at bottom */}
        <div className="bg-slate-900/90 backdrop-blur-md border-t border-white/20 px-4 py-4 safe-area-inset-bottom">
          <div className="flex justify-between gap-4 max-w-lg mx-auto">
            <button
              onClick={handleBack}
              disabled={currentPage === 0}
              className="flex-1 px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transform hover:scale-105 disabled:hover:scale-100"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Tillbaka
              </span>
            </button>
            
            {currentPage === totalPages - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={!isPageValid() || isSubmitting}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm transform hover:scale-105 disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyserar...
                  </span>
                ) : (
                  'Analysera'
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isPageValid()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm transform hover:scale-105 disabled:hover:scale-100"
              >
                <span className="flex items-center justify-center gap-2">
                  Nästa
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .safe-area-inset-bottom {
          padding-bottom: env(safe-area-inset-bottom, 1rem);
        }
      `}</style>
    </div>
  );
} 