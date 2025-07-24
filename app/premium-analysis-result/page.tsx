"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function PremiumAnalysisResultPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('executive-summary');
  const [isGenerating, setIsGenerating] = useState(true);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [deepAnalysis, setDeepAnalysis] = useState<any>(null);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [pdfGenerating, setPDFGenerating] = useState(false);
  const [pdfProgress, setPDFProgress] = useState(0);
  
  useEffect(() => {
    // Hämta analysdata från localStorage
    const storedData = localStorage.getItem('pendingPremiumAnalysis');
    if (!storedData) {
      // Om ingen data finns, gå tillbaka till startsidan
      router.push('/');
      return;
    }
    
    const data = JSON.parse(storedData);
    setAnalysisData(data);
    
    // Generera djupgående analys
    generateDeepAnalysis(data);
  }, [router]);
  
  const generateDeepAnalysis = async (data: any) => {
    try {
      const response = await fetch('/api/generate-premium-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          existingAnalysis: data
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setDeepAnalysis(result);
        // Spara premium-analysen i localStorage för att kunna visa den i ResultContent
        localStorage.setItem('latestAnalysisResult', JSON.stringify(result));
        // Redirect till resultat-sidan som nu visar premium-innehåll
        setTimeout(() => {
          router.push('/result');
        }, 1000);
      }
    } catch (error) {
      console.error('Error generating premium analysis:', error);
    } finally {
      setTimeout(() => setIsGenerating(false), 2000);
    }
  };

  const sections = [
    { id: 'executive-summary', title: 'Executive Summary', icon: '📋' },
    { id: 'market-deep-dive', title: 'Market Analysis Deep Dive', icon: '📊' },
    { id: 'competitive-landscape', title: 'Competitive Landscape', icon: '🏆' },
    { id: 'business-model-analysis', title: 'Business Model Analysis', icon: '💰' },
    { id: 'financial-projections', title: 'Financial Projections', icon: '📈' },
    { id: 'risk-assessment', title: 'Risk Assessment', icon: '⚠️' },
    { id: 'growth-strategy', title: 'Growth Strategy', icon: '🚀' },
    { id: 'investor-readiness', title: 'Investor Readiness', icon: '💼' },
    { id: 'action-plan', title: 'Action Plan', icon: '✅' },
    { id: 'benchmarks', title: 'Industry Benchmarks', icon: '📏' }
  ];

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-[#04111d] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-transparent border-t-pink-500 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
            <div className="absolute inset-4 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">AI is generating your premium analysis...</h2>
          <p className="text-white/60">This takes approximately 30 seconds</p>
                      <div className="mt-8 space-y-2">
              <p className="text-white/40 text-sm animate-pulse">Analyzing market potential...</p>
              <p className="text-white/40 text-sm animate-pulse" style={{ animationDelay: '0.5s' }}>Comparing with 100+ successful startups...</p>
              <p className="text-white/40 text-sm animate-pulse" style={{ animationDelay: '1s' }}>Generating financial projections...</p>
            </div>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return null;
  }

  const score = analysisData.score || 0;
  const answers = analysisData.answers || {};

  // Dynamiska insikter baserat på användarens data
  const marketPotential = answers.market_size ? 
    Math.min(95, 70 + (answers.market_size.length / 10)) : 60;
  const investorReadiness = score;
  const scalability = answers.revenue_model ? 85 : 65;

  const handleDownloadPDF = async () => {
    setPDFGenerating(true);
    setPDFProgress(0);
    
    // Simulera PDF-generering med progress
    const interval = setInterval(() => {
      setPDFProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    try {
      const response = await fetch('/api/generate-deep-analysis-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisData,
          deepAnalysis,
          sections: sections.map(s => s.id)
        })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `premium-analys-${answers.company_name || 'frejfund'}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setTimeout(() => {
        setPDFGenerating(false);
        setPDFProgress(0);
        setShowPDFModal(false);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#04111d]">
      {/* Premium header */}
      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">👑</span> Premium AI Analysis - {answers.company_name || 'Your Company'}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white/5 backdrop-blur-xl border-r border-white/10 min-h-screen p-6">
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
                  activeSection === section.id 
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30' 
                    : 'text-white/60 hover:bg-white/10'
                }`}
              >
                <span className="text-xl">{section.icon}</span>
                <span className="text-sm font-medium">{section.title}</span>
              </button>
            ))}
          </div>

          {/* PDF Download Button */}
          <div className="mt-6">
            <button 
              onClick={() => setShowPDFModal(true)}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Premium PDF
            </button>
          </div>

          {/* Progress overview */}
          <div className="mt-8 bg-white/5 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3">Analysöversikt</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/60">Marknadspotential</span>
                  <span className="text-green-400">{marketPotential}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-green-500" style={{ width: `${marketPotential}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/60">Investerarberedskap</span>
                  <span className="text-yellow-400">{investorReadiness}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500" style={{ width: `${investorReadiness}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/60">Skalbarhet</span>
                  <span className="text-blue-400">{scalability}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500" style={{ width: `${scalability}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {activeSection === 'executive-summary' && (
              <div className="animate-fadeIn">
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <span className="text-4xl">📋</span> Executive Summary
                </h2>
                
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Key Strengths</h3>
                  <div className="grid gap-4">
                    {[
                      {
                        title: answers.market_size ? 'Strong Market Potential' : 'Market Opportunity',
                        desc: answers.market_size || 'Your market shows potential for growth.',
                        score: marketPotential
                      },
                      {
                        title: answers.team ? 'Experienced Team' : 'Team Competence',
                        desc: answers.team || 'The team has relevant background to drive the company forward.',
                        score: 88
                      },
                      {
                        title: answers.revenue_model ? 'Validated Business Model' : 'Business Model',
                        desc: answers.revenue_model || 'Your business model has potential to generate sustainable revenue.',
                        score: scalability
                      }
                    ].map((strength, index) => (
                      <div key={index} className="bg-white/5 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-white">{strength.title}</h4>
                          <span className="text-green-400 font-bold">{strength.score}%</span>
                        </div>
                        <p className="text-white/70 text-sm">{strength.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Critical Success Factors</h3>
                  <div className="space-y-6">
                    {[
                      {
                        factor: 'Customer Validation',
                        current: answers.traction ? `You have ${answers.traction}` : 'Limited traction so far',
                        needed: 'Need 10+ paying customers for proof of concept',
                        action: 'Focus on pilot projects with early adopters'
                      },
                      {
                        factor: 'Financing',
                        current: answers.capital_block ? 'Capital needs identified' : 'Financing strategy needed',
                        needed: 'Secure 6-12 months runway',
                        action: 'Prepare pitch deck and start investor dialogue'
                      },
                      {
                        factor: 'Market Position',
                        current: answers.competitors ? 'Competitors identified' : 'Competitive situation unclear',
                        needed: 'Clear differentiation and USP',
                        action: 'Conduct deeper competitor analysis'
                      }
                    ].map((factor, index) => (
                      <div key={index} className="border-l-4 border-purple-500/50 pl-6">
                        <h4 className="font-semibold text-white mb-2">{factor.factor}</h4>
                        <div className="space-y-1 text-sm">
                          <p className="text-green-400">✓ {factor.current}</p>
                          <p className="text-yellow-400">→ {factor.needed}</p>
                          <p className="text-blue-400">⚡ {factor.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-3xl p-8 border border-green-500/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Investeringsrekommendation</h3>
                  <div className="flex items-center gap-8 mb-6">
                    <div className="w-32 h-32">
                      <CircularProgressbar
                        value={score}
                        text={score.toString()}
                        styles={buildStyles({
                          pathColor: score >= 70 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444',
                          textColor: '#ffffff',
                          trailColor: 'rgba(255,255,255,0.1)',
                        })}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-white mb-2">
                        {score >= 70 ? 'Stark Investeringskandidat' : score >= 50 ? 'Lovande med Förbättringspotential' : 'Tidig Fas - Fortsätt Utveckla'}
                      </h4>
                      <p className="text-white/70">
                        Baserat på vår analys bedömer vi {answers.company_name || 'ert företag'} som {
                          score >= 70 ? 'en stark kandidat för investering med hög potential för tillväxt.' :
                          score >= 50 ? 'lovande men med vissa områden som behöver stärkas innan investering.' :
                          'i tidig fas med behov av ytterligare validering innan investeringsmognad.'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-2xl font-bold text-white">
                        {answers.capital_block ? JSON.parse(answers.capital_block).amount : '5-10'} MSEK
                      </div>
                      <div className="text-white/60 text-sm">Rekommenderad funding</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-2xl font-bold text-white">
                        {answers.runway || '12-18'} mån
                      </div>
                      <div className="text-white/60 text-sm">Förväntad runway</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-2xl font-bold text-white">
                        {score >= 70 ? '10-20x' : score >= 50 ? '5-10x' : '3-5x'}
                      </div>
                      <div className="text-white/60 text-sm">Potentiell avkastning</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Lägg till fler sektioner här baserat på activeSection... */}

          </div>
        </div>
      </div>

      {/* Premium PDF Modal */}
      {showPDFModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-[#0a1628] to-[#04111d] rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn border border-purple-500/30">
            {!pdfGenerating ? (
              <>
                <button
                  onClick={() => setShowPDFModal(false)}
                  className="absolute top-4 right-4 text-white/40 hover:text-white text-2xl transition-colors"
                >
                  ×
                </button>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Download Premium Report</h2>
                                      <p className="text-white/60 mb-6">Your complete 50+ page analysis is ready to download.</p>
                  
                  <button
                    onClick={handleDownloadPDF}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Download PDF
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 relative">
                  <CircularProgressbar
                    value={pdfProgress}
                    text={`${pdfProgress}%`}
                    styles={buildStyles({
                      pathColor: 'url(#gradient)',
                      textColor: '#ffffff',
                      trailColor: 'rgba(255,255,255,0.1)',
                    })}
                  />
                  <svg style={{ height: 0 }}>
                    <defs>
                      <linearGradient id="gradient">
                        <stop offset="0%" stopColor="#9333EA" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Genererar din Premium PDF...</h3>
                <p className="text-white/60 text-sm">Detta tar bara några sekunder</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
} 