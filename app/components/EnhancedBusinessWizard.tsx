'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { INVESTOR_QUESTION_SECTIONS } from './InvestorQuestions';
import { getSupabaseClient } from '../../lib/supabase';
import MobileOptimizedWizard from './MobileOptimizedWizard';

const EnhancedBusinessWizard = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    };
  }, [open]);

  if (!open) return null;

  // Use mobile-optimized wizard for mobile devices
  if (isMobile) {
    return <MobileOptimizedWizard open={open} onClose={onClose} />;
  }

  const section = INVESTOR_QUESTION_SECTIONS[currentSection];
  const totalSections = INVESTOR_QUESTION_SECTIONS.length;

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const isSectionValid = () => {
    return section.questions.every(q => {
      if (!q.required) return true;
      const answer = answers[q.id];
      return answer && (typeof answer === 'object' ? Object.values(answer).every(v => v) : true);
    });
  };

  const handleNext = () => {
    if (currentSection < totalSections - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Progress messages with timing
    const messages = [
      { text: 'Analyserar dina svar...', at: 0 },
      { text: 'Utvärderar marknadsposition...', at: 15 },
      { text: 'Granskar unit economics...', at: 25 },
      { text: 'Jämför med branschstandard...', at: 35 },
      { text: 'Genererar AI-insikter...', at: 45 },
      { text: 'Bygger investeringsrekommendationer...', at: 55 },
      { text: 'Skapar handlingsplan...', at: 65 },
      { text: 'Beräknar investeringspotential...', at: 75 },
      { text: 'Färdigställer rapporten...', at: 85 },
      { text: 'Nästan klar...', at: 95 }
    ];
    
    setStatusMessage(messages[0].text);
    
    // Start progress animation (90 seconds total)
    let currentMessageIndex = 0;
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 1.11, 100); // 1.11% per second = 90 seconds
        
        // Update message based on progress
        const nextMessage = messages.find((msg, idx) => 
          idx > currentMessageIndex && newProgress >= msg.at
        );
        
        if (nextMessage) {
          currentMessageIndex = messages.indexOf(nextMessage);
          setStatusMessage(nextMessage.text);
        }
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
        }
        
        return newProgress;
      });
    }, 1000);

    try {
      const response = await fetch('/api/analyze-businessplan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, isPremium: true })
      });
      
      const result = await response.json();
      
      // Wait for animation to complete
      await new Promise(resolve => {
        const checkComplete = setInterval(() => {
          if (progress >= 100) {
            clearInterval(checkComplete);
            resolve(true);
          }
        }, 100);
      });
      
      router.push(`/enhanced-result?data=${encodeURIComponent(JSON.stringify(result))}`);
    } catch (error) {
      console.error('Error:', error);
      clearInterval(progressInterval);
    }
  };

  const fillTestData = () => {
    const dummy: Record<string, any> = {};
    INVESTOR_QUESTION_SECTIONS.forEach(section => {
      section.questions.forEach(q => {
        switch (q.type) {
          case 'number':
            dummy[q.id] = 42;
            break;
          case 'scale':
            dummy[q.id] = 3;
            break;
          case 'percentage':
            dummy[q.id] = 50;
            break;
          case 'select':
            dummy[q.id] = q.options?.[0] || '';
            break;
          case 'multi_input':
            const multi: Record<string, any> = {};
            q.multiInputs?.forEach(mi => {
              multi[mi.id] = mi.type === 'percentage' ? 50 : 10;
            });
            dummy[q.id] = multi;
            break;
          default:
            dummy[q.id] = 'Testdata';
        }
      });
    });
    setAnswers(dummy);
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-auto bg-slate-900">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-3xl p-4 md:p-8 max-w-4xl w-full shadow-2xl border border-purple-500/20 max-h-[90vh] overflow-y-auto">
          {!isSubmitting ? (
            <>
              {/* Progress Bar */}
              <div className="mb-6 md:mb-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
                  <h2 className="text-xl md:text-2xl font-bold text-white">Investeringsanalys</h2>
                  <div className="flex items-center gap-2">
                    <button onClick={fillTestData} className="text-xs text-white/60 hover:text-white bg-white/10 px-3 py-1 rounded-lg">
                      Testdata
                    </button>
                    <button onClick={onClose} className="text-white/60 hover:text-white p-1">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentSection + 1) / totalSections) * 100}%` }}
                  />
                </div>
                <p className="text-white/60 text-sm mt-2">
                  Steg {currentSection + 1} av {totalSections}
                </p>
              </div>

              {/* Section Content */}
              <div className="mb-6 md:mb-8">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <span className="text-3xl md:text-4xl">{section.icon}</span>
                  <h3 className="text-lg md:text-xl font-semibold text-white">{section.title}</h3>
                </div>

                <div className="space-y-4 md:space-y-6">
                  {section.questions.map((question) => (
                    <div key={question.id} className="space-y-2">
                      <label className="block text-white/90 font-medium">
                        {question.label}
                      </label>
                      
                      {question.type === 'text' && (
                        <input
                          type="text"
                          value={answers[question.id] || ''}
                          onChange={(e) => handleAnswer(question.id, e.target.value)}
                          placeholder={question.placeholder}
                          maxLength={question.max}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      )}

                      {question.type === 'textarea' && (
                        <textarea
                          value={answers[question.id] || ''}
                          onChange={(e) => handleAnswer(question.id, e.target.value)}
                          placeholder={question.placeholder}
                          rows={3}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        />
                      )}

                      {question.type === 'number' && (
                        <input
                          type="number"
                          value={answers[question.id] || ''}
                          onChange={(e) => handleAnswer(question.id, e.target.value)}
                          placeholder={question.placeholder}
                          min={question.min}
                          max={question.max}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      )}

                      {question.type === 'scale' && (
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => handleAnswer(question.id, value)}
                              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                                answers[question.id] === value
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-white/10 text-white/60 hover:bg-white/20'
                              }`}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      )}

                      {question.type === 'select' && (
                        <select
                          value={answers[question.id] || ''}
                          onChange={(e) => handleAnswer(question.id, e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Välj...</option>
                          {question.options?.map((option) => (
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
                            className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60">%</span>
                        </div>
                      )}

                      {question.type === 'multi_input' && (
                        <div className="grid grid-cols-2 gap-4">
                          {question.multiInputs?.map((input) => (
                            <div key={input.id}>
                              <label className="text-sm text-white/60 mb-1">{input.label}</label>
                              <input
                                type={input.type === 'percentage' ? 'number' : input.type}
                                value={answers[question.id]?.[input.id] || ''}
                                onChange={(e) => handleAnswer(question.id, {
                                  ...answers[question.id],
                                  [input.id]: e.target.value
                                })}
                                placeholder={input.placeholder}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {question.help && (
                        <p className="text-sm text-white/60">{question.help}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentSection === 0}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tillbaka
                </button>
                
                {currentSection === totalSections - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!isSectionValid()}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Analysera
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={!isSectionValid()}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Nästa
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="mb-8">
                <div className="w-32 h-32 mx-auto relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-white/10"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 60}`}
                      strokeDashoffset={`${2 * Math.PI * 60 * (1 - progress / 100)}`}
                      className="text-purple-500 transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{progress}%</span>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Analyserar er affärsplan...</h3>
              <p className="text-white/60">{statusMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedBusinessWizard; 