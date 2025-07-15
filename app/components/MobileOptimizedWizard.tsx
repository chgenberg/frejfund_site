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
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

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
  const totalPages = Math.ceil(allQuestions.length / questionsPerPage);
  const currentPage = Math.floor(currentQuestionIndex / questionsPerPage);
  const questionsOnCurrentPage = allQuestions.slice(
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
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const isPageValid = () => {
    return questionsOnCurrentPage.every(q => {
      if (!q.required) return true;
      const answer = answers[q.id];
      return answer && (typeof answer === 'object' ? Object.values(answer).every(v => v) : true);
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex + questionsPerPage < allQuestions.length) {
      setCurrentQuestionIndex(prev => prev + questionsPerPage);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => Math.max(0, prev - questionsPerPage));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setStatusMessage('Förbereder analys...');
    
    try {
      // Calculate initial score
      let score = 0;
      const totalQuestions = allQuestions.filter(q => q.required).length;
      const answeredQuestions = allQuestions.filter(q => q.required && answers[q.id]).length;
      score = Math.round((answeredQuestions / totalQuestions) * 100);

      // Save to localStorage for result page
      localStorage.setItem('businessPlanAnswers', JSON.stringify(answers));
      localStorage.setItem('businessPlanScore', score.toString());
      
      // Check if user is logged in
      const supabase = getSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Save to database if logged in
        const { error } = await supabase
          .from('analyses')
          .insert({
            user_id: user.id,
            score: score,
            answers: answers,
            created_at: new Date().toISOString()
          });
          
        if (error) {
          console.error('Error saving analysis:', error);
        }
      }
      
      // Navigate to result page
      router.push(`/result?score=${score}`);
    } catch (error) {
      console.error('Error submitting:', error);
      setStatusMessage('Ett fel uppstod. Försök igen.');
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: any) => (
    <div key={question.id} className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 animate-fadeIn">
      <label className="block text-white/90 font-medium mb-3 text-sm md:text-base">
        {question.label}
        {question.required && <span className="text-pink-400 ml-1">*</span>}
      </label>
      
      {question.type === 'text' && (
        <input
          type="text"
          value={answers[question.id] || ''}
          onChange={(e) => handleAnswer(question.id, e.target.value)}
          placeholder={question.placeholder}
          maxLength={question.max}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all"
        />
      )}

      {question.type === 'textarea' && (
        <textarea
          value={answers[question.id] || ''}
          onChange={(e) => handleAnswer(question.id, e.target.value)}
          placeholder={question.placeholder}
          rows={isMobile ? 3 : 4}
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

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
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
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="h-full flex flex-col">
        {/* Header with progress */}
        <div className="bg-slate-900/50 backdrop-blur-md border-b border-white/10 px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-lg font-bold text-white">Investeringsanalys</h2>
              <p className="text-white/60 text-xs mt-0.5">
                {questionsOnCurrentPage[0]?.sectionTitle || 'Frågor'}
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="text-white/60 hover:text-white p-1 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="relative">
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
              </div>
            </div>
            <p className="text-white/60 text-xs mt-1 text-center">
              Sida {currentPage + 1} av {totalPages}
            </p>
          </div>
        </div>

        {/* Questions container - no scroll */}
        <div className="flex-1 px-4 py-4 flex flex-col justify-center overflow-hidden"
             onTouchStart={handleTouchStart}
             onTouchMove={handleTouchMove}
             onTouchEnd={handleTouchEnd}
             ref={containerRef}
        >
          <div className="space-y-3 max-w-lg mx-auto w-full">
            {questionsOnCurrentPage.map(renderQuestion)}
          </div>
        </div>

        {/* Navigation buttons - sticky at bottom */}
        <div className="bg-slate-900/50 backdrop-blur-md border-t border-white/10 px-4 py-4 safe-area-inset-bottom">
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