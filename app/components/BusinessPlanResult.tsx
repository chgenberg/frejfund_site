import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface ResultProps {
  score: number;
  answers: Record<string, unknown>;
  feedback?: Record<string, string>;
  subscriptionLevel?: 'silver' | 'gold' | 'platinum';
}

const getScoreInfo = (score: number) => {
  if (score >= 85) return { 
    emoji: '🚀', 
    label: 'Investor Ready',
    description: 'Perfekt för investerare',
    color: '#10B981',
    glow: 'shadow-[0_0_60px_rgba(16,185,129,0.5)]'
  };
  if (score >= 70) return {
    emoji: '⭐', 
    label: 'Stark Potential',
    description: 'Nära investeringsnivå',
    color: '#F59E0B',
    glow: 'shadow-[0_0_60px_rgba(245,158,11,0.5)]'
  };
  if (score >= 50) return { 
    emoji: '💡',
    label: 'Lovande Start',
    description: 'Behöver mer utveckling',
    color: '#EF4444',
    glow: 'shadow-[0_0_60px_rgba(239,68,68,0.5)]'
  };
  return { 
    emoji: '🔨',
    label: 'Tidigt Stadium',
    description: 'Fokusera på grunderna',
    color: '#6B7280',
    glow: 'shadow-[0_0_60px_rgba(107,114,128,0.5)]'
  };
};

const InsightCard = ({ 
  title, 
  content, 
  icon, 
  priority = 'medium',
  isExpanded = false,
  onToggle 
}: {
  title: string;
  content: React.ReactNode;
  icon: string;
  priority?: 'high' | 'medium' | 'low';
  isExpanded?: boolean;
  onToggle?: () => void;
}) => {
  const priorityStyles = {
    high: 'ring-red-200 bg-red-50/50',
    medium: 'ring-blue-200 bg-blue-50/50',
    low: 'ring-gray-200 bg-gray-50/50'
  };

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-2xl ring-2 ${priorityStyles[priority]} transition-all duration-300 hover:shadow-lg ${isExpanded ? 'shadow-lg' : ''}`}>
      <button
        onClick={onToggle}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-white/50 transition-colors rounded-2xl"
      >
        <div className="flex items-center gap-4">
          <span className="text-3xl">{icon}</span>
          <div>
            <h3 className="text-xl font-bold text-[#16475b]">{title}</h3>
            {priority === 'high' && (
              <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded-full">Prioritet</span>
            )}
          </div>
        </div>
        <svg 
          className={`w-6 h-6 text-[#16475b] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="px-6 pb-6 animate-slideDown">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

export default function BusinessPlanResult({ score, answers, feedback = {} }: ResultProps) {
  const [currentSection, setCurrentSection] = useState<'score' | 'insights' | 'actions'>('score');
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showActionModal, setShowActionModal] = useState<any>(null);
  
  const scoreInfo = getScoreInfo(score);
  const typedAnswers = answers as Record<string, any>;

  // Parse JSON fields safely
  const parseJsonSafely = (value: any, fallback = {}) => {
    try {
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };

  const milestones = parseJsonSafely(typedAnswers.milestones, []);
  const capitalBlock = parseJsonSafely(typedAnswers.capital_block, {});
  const founderFit = parseJsonSafely(typedAnswers.founder_market_fit, {});

  useEffect(() => {
    let start = 0;
    const increment = score / 50;
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [score]);

  const insights = [
    {
      id: 'problem-solution',
      title: 'Problem & Lösning',
      icon: '🎯',
      strength: typedAnswers.customer_problem && typedAnswers.solution ? 'high' : 'low',
      content: (
        <div className="space-y-4">
          {typedAnswers.customer_problem && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Identifierat Problem</h4>
              <p className="text-white/70">{typedAnswers.customer_problem}</p>
            </div>
          )}
          {typedAnswers.solution && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Er Lösning</h4>
              <p className="text-white/70">{typedAnswers.solution}</p>
            </div>
          )}
          <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
            <p className="text-blue-300 font-medium">💡 AI Insikt</p>
            <p className="text-white/80 text-sm mt-2">
              {typedAnswers.customer_problem && typedAnswers.solution 
                ? "Stark koppling mellan problem och lösning. Överväg att kvantifiera problemets kostnad för kunderna för att göra värdeproposition tydligare."
                : "Definiera tydligt både problem och lösning för att skapa en övertygande berättelse."}
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'market',
      title: 'Marknadsanalys',
      icon: '📊',
      strength: typedAnswers.market_size ? 'high' : 'medium',
      content: (
        <div className="space-y-4">
          {typedAnswers.market_size && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Marknadsstorlek</h4>
              <p className="text-white/70">{typedAnswers.market_size}</p>
            </div>
          )}
          {typedAnswers.target_customer && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Målgrupp</h4>
              <p className="text-white/70">{typedAnswers.target_customer}</p>
            </div>
          )}
          {typedAnswers.competitors && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Konkurrenssituation</h4>
              <p className="text-white/70">{typedAnswers.competitors}</p>
            </div>
          )}
          <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
            <p className="text-green-300 font-medium">💡 AI Insikt</p>
            <p className="text-white/80 text-sm mt-2">
              Er TAM på 5 miljarder SEK visar på en betydande marknad. Fokusera på att visa hur ni kan ta 10% av SAM inom 3 år - det skulle ge 100 MSEK i årlig omsättning.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'business-model',
      title: 'Affärsmodell & Intäkter',
      icon: '💰',
      strength: typedAnswers.revenue_model || typedAnswers.pricing ? 'high' : 'low',
      content: (
        <div className="space-y-4">
          {typedAnswers.revenue_model && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Intäktsmodell</h4>
              <p className="text-white/70">{typedAnswers.revenue_model}</p>
            </div>
          )}
          {typedAnswers.pricing && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Prissättning</h4>
              <p className="text-white/70">{typedAnswers.pricing}</p>
            </div>
          )}
          {typedAnswers.unit_economics && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Enhetsekonomi</h4>
              <p className="text-white/70">{typedAnswers.unit_economics}</p>
            </div>
          )}
          <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
            <p className="text-yellow-300 font-medium">💡 AI Insikt</p>
            <p className="text-white/80 text-sm mt-2">
              SaaS-modell med 5000 kr/månad ger förutsägbara intäkter. Med 200 kunder når ni break-even. Fokusera på att minska churn under 5% månadsvis.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'traction',
      title: 'Traction & Bevis',
      icon: '📈',
      strength: typedAnswers.traction ? 'high' : 'low',
      content: (
        <div className="space-y-4">
          {typedAnswers.traction && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Nuvarande Traction</h4>
              <p className="text-white/70">{typedAnswers.traction}</p>
            </div>
          )}
          {Array.isArray(milestones) && milestones.length > 0 && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Milestolpar</h4>
              <div className="space-y-2">
                {milestones.map((milestone: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-white/70">{milestone.milestone}</span>
                    <span className="text-white/50 text-sm">{milestone.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="p-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30">
            <p className="text-indigo-300 font-medium">💡 AI Insikt</p>
            <p className="text-white/80 text-sm mt-2">
              20% månatlig tillväxt är imponerande! Dokumentera kundcase och testimonials. Visa retention rate och Net Promoter Score för att bevisa produktmarknadsanpassning.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'team',
      title: 'Team & Kompetens',
      icon: '👥',
      strength: typedAnswers.team || founderFit.score >= 4 ? 'high' : 'medium',
      content: (
        <div className="space-y-4">
          {typedAnswers.team && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Teamet</h4>
              <p className="text-white/70">{typedAnswers.team}</p>
            </div>
          )}
          {founderFit.score && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Founder-Market Fit</h4>
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-2xl ${i < founderFit.score ? 'text-yellow-400' : 'text-white/20'}`}>
                    ★
                  </span>
                ))}
              </div>
              <p className="text-white/70">{founderFit.text}</p>
            </div>
          )}
          <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
            <p className="text-purple-300 font-medium">💡 AI Insikt</p>
            <p className="text-white/80 text-sm mt-2">
              Excellent founder-market fit! VD:s investeringserfarenhet + CTO från Spotify = trovärdig kombination. Överväg att lägga till en säljchef med SaaS-erfarenhet.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'financials',
      title: 'Finansiell Plan',
      icon: '💸',
      strength: capitalBlock.amount || typedAnswers.runway ? 'medium' : 'low',
      content: (
        <div className="space-y-4">
          {capitalBlock.amount && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Kapitalbehov: {capitalBlock.amount} MSEK</h4>
              <div className="space-y-2 mt-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Produktutveckling</span>
                  <span className="text-white/90">{capitalBlock.product}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Försäljning & Marketing</span>
                  <span className="text-white/90">{capitalBlock.sales}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Team</span>
                  <span className="text-white/90">{capitalBlock.team}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Övrigt</span>
                  <span className="text-white/90">{capitalBlock.other}%</span>
                </div>
              </div>
            </div>
          )}
          {typedAnswers.runway && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Runway</h4>
              <p className="text-white/70">{typedAnswers.runway} månader med nuvarande burn rate</p>
            </div>
          )}
          <div className="p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl border border-red-500/30">
            <p className="text-red-300 font-medium">💡 AI Insikt</p>
            <p className="text-white/80 text-sm mt-2">
              15 MSEK ger er 18 månaders runway - perfekt för en seed-runda. Allokering ser bra ut, men överväg att öka sales/marketing till 40% för snabbare tillväxt.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'risks',
      title: 'Risker & Möjligheter',
      icon: '⚠️',
      strength: typedAnswers.risks || typedAnswers.moat ? 'medium' : 'low',
      content: (
        <div className="space-y-4">
          {typedAnswers.risks && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Identifierade Risker</h4>
              <p className="text-white/70">{typedAnswers.risks}</p>
            </div>
          )}
          {typedAnswers.moat && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Konkurrensfördel (Moat)</h4>
              <p className="text-white/70">{typedAnswers.moat}</p>
            </div>
          )}
          <div className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl border border-orange-500/30">
            <p className="text-orange-300 font-medium">💡 AI Insikt</p>
            <p className="text-white/80 text-sm mt-2">
              Att ni identifierat risker visar mognad. Fokusera på att bygga teknisk moat genom AI/ML och nätverkseffekter. Patent på kärnteknologi kan stärka positionen.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'exit',
      title: 'Exit-strategi',
      icon: '🎯',
      strength: typedAnswers.exit_strategy ? 'high' : 'low',
      content: (
        <div className="space-y-4">
          {typedAnswers.exit_strategy && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Exit Plan</h4>
              <p className="text-white/70">{typedAnswers.exit_strategy}</p>
            </div>
          )}
          {typedAnswers.exit_potential && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Potentiella Köpare</h4>
              <p className="text-white/70">{typedAnswers.exit_potential}</p>
            </div>
          )}
          <div className="p-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-xl border border-emerald-500/30">
            <p className="text-emerald-300 font-medium">💡 AI Insikt</p>
            <p className="text-white/80 text-sm mt-2">
              Trade sale till större fintech-bolag är realistiskt om ni når 100+ MSEK ARR. Bygg relationer tidigt med potentiella köpare som Klarna, Tink eller internationella aktörer.
            </p>
          </div>
        </div>
      )
    }
  ];

  const actionItems = [
    {
      priority: 'high',
      title: 'Säkra första 10 betalande kunderna',
      description: 'Erbjud pilot-priser till early adopters. Fokusera på att få testimonials och case studies.',
      timeframe: '1 månad',
      impact: 'Validerar affärsmodellen och ökar investerarnas förtroende'
    },
    {
      priority: 'high',
      title: 'Dokumentera unit economics',
      description: 'Visa tydligt CAC, LTV, churn rate och payback period med verklig data',
      timeframe: '2 veckor',
      impact: 'Kritiskt för investeringsbeslut - visar skalbarhet'
    },
    {
      priority: 'high',
      title: 'Bygg ut säljteamet',
      description: 'Rekrytera en erfaren B2B SaaS-säljare som kan bygga säljprocess',
      timeframe: '1 månad',
      impact: 'Accelererar tillväxt och professionaliserar säljprocessen'
    },
    {
      priority: 'medium',
      title: 'Skapa investerarmaterial',
      description: 'Pitch deck, financial model, due diligence data room',
      timeframe: '3 veckor',
      impact: 'Snabbare investeringsprocess'
    },
    {
      priority: 'medium',
      title: 'Implementera AI-funktioner',
      description: 'Bygg ut matchningsalgoritmen för bättre träffsäkerhet',
      timeframe: '2 månader',
      impact: 'Stärker konkurrensfördel och värdeproposition'
    },
    {
      priority: 'medium',
      title: 'Säkra strategiska partnerskap',
      description: 'Inled dialog med banker, riskkapitalföreningar och acceleratorer',
      timeframe: '6 veckor',
      impact: 'Ger kredibilitet och distributionskanaler'
    }
  ];

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch('/api/generate-analysis-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score,
          answers,
          insights: insights.map(i => ({
            title: i.title,
            strength: i.strength
          }))
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'affarsanalys.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-20 bg-[#04111d]">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 237, 255, 0.2) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(120, 237, 255, 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 40% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Main Container with glass effect */}
      <div className="w-full max-w-6xl relative z-10">
        
        {/* Score Section */}
        {currentSection === 'score' && (
          <div className="animate-fadeIn">
            <div className={`bg-white/5 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/10 ${scoreInfo.glow} transition-all duration-1000`}>
              {/* Score Circle */}
              <div className="w-64 h-64 mx-auto mb-8 relative">
                <CircularProgressbar
                  value={animatedScore}
                  text={`${animatedScore}`}
                  styles={buildStyles({
                    pathColor: scoreInfo.color,
                    textColor: '#ffffff',
                    trailColor: 'rgba(255,255,255,0.1)',
                    textSize: '28px',
                    pathTransitionDuration: 1.5,
                  })}
                />
              </div>

              {/* Score Label */}
              <h1 className="text-5xl font-bold text-white mb-4">{scoreInfo.label}</h1>
              <p className="text-xl text-white/70 mb-12">{scoreInfo.description}</p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 mb-12">
                <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                  <div className="text-3xl font-bold text-white">{insights.filter(i => i.strength === 'high').length}</div>
                  <div className="text-white/60">Starka områden</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                  <div className="text-3xl font-bold text-white">{Object.keys(answers).length}</div>
                  <div className="text-white/60">Analyserade fält</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                  <div className="text-3xl font-bold text-white">{actionItems.filter(a => a.priority === 'high').length}</div>
                  <div className="text-white/60">Kritiska åtgärder</div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-center gap-4 flex-wrap">
                <button
                  onClick={() => setCurrentSection('insights')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
                >
                  Se Detaljerad Analys →
                </button>
                <button
                  onClick={() => setCurrentSection('actions')}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all"
                >
                  Nästa Steg
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Ladda ner PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Insights Section */}
        {currentSection === 'insights' && (
          <div className="animate-fadeIn">
            {/* Back button */}
            <button
              onClick={() => setCurrentSection('score')}
              className="mb-6 text-white/60 hover:text-white flex items-center gap-2 transition-colors"
            >
              ← Tillbaka till översikt
            </button>

            <h2 className="text-4xl font-bold text-white mb-8">Detaljerad Analys</h2>
            
            <div className="space-y-4">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className={`bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:bg-white/10 ${
                    expandedInsight === insight.id ? 'ring-2 ring-white/30' : ''
                  }`}
                >
                  <button
                    onClick={() => setExpandedInsight(expandedInsight === insight.id ? null : insight.id)}
                    className="w-full p-6 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{insight.icon}</span>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{insight.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${
                            insight.strength === 'high' ? 'bg-green-400' : 
                            insight.strength === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                          }`} />
                          <span className="text-sm text-white/60">
                            {insight.strength === 'high' ? 'Starkt område' : 
                             insight.strength === 'medium' ? 'Kan förbättras' : 'Behöver utveckling'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <svg
                      className={`w-6 h-6 text-white/60 transition-transform ${
                        expandedInsight === insight.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {expandedInsight === insight.id && (
                    <div className="px-6 pb-6">
                      {insight.content}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => setCurrentSection('actions')}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
              >
                Se Rekommenderade Åtgärder →
              </button>
            </div>
          </div>
        )}

        {/* Actions Section */}
        {currentSection === 'actions' && (
          <div className="animate-fadeIn">
            {/* Back button */}
            <button
              onClick={() => setCurrentSection('insights')}
              className="mb-6 text-white/60 hover:text-white flex items-center gap-2 transition-colors"
            >
              ← Tillbaka till analys
            </button>

            <h2 className="text-4xl font-bold text-white mb-8">Rekommenderade Nästa Steg</h2>
            
            <div className="grid gap-4">
              {actionItems.map((action, index) => (
                <div
                  key={index}
                  className={`bg-white/5 backdrop-blur-xl rounded-2xl p-6 border ${
                    action.priority === 'high' 
                      ? 'border-red-500/30 bg-gradient-to-r from-red-500/10 to-transparent' 
                      : 'border-white/10'
                  } hover:bg-white/10 transition-all`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          action.priority === 'high' 
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        }`}>
                          {action.priority === 'high' ? 'Hög prioritet' : 'Medium prioritet'}
                        </span>
                        <span className="text-white/60 text-sm">{action.timeframe}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">{action.title}</h3>
                      <p className="text-white/70 mb-3">{action.description}</p>
                      <p className="text-sm text-green-400">✨ {action.impact}</p>
                    </div>
                    <div className="ml-4">
                      <button 
                        onClick={() => setShowActionModal(action)}
                        className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all group"
                      >
                        <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Premium CTA */}
            <div className="mt-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">🚀 Vill du ha en djupare analys?</h3>
              <p className="text-white/70 mb-6">
                Få en komplett AI-driven affärsanalys med branschspecifika insikter, 
                jämförelser med framgångsrika startups och en professionell PDF-rapport.
              </p>
              
              {/* Premium features grid */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl mb-2">📄</div>
                  <h4 className="font-semibold text-white mb-1">PDF-rapport</h4>
                  <p className="text-white/60 text-sm">Professionell rapport att dela med investerare</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl mb-2">📊</div>
                  <h4 className="font-semibold text-white mb-1">50+ sidor analys</h4>
                  <p className="text-white/60 text-sm">Djupgående insikter för varje område</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl mb-2">💬</div>
                  <h4 className="font-semibold text-white mb-1">Expertsamtal</h4>
                  <p className="text-white/60 text-sm">30 min strategisession ingår</p>
                </div>
              </div>
              
              <a href="/kassa?product=premium-analysis" className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all">
                Uppgradera för 197 kr
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Action Details Modal */}
      {showActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-[#0a1628] to-[#04111d] rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative animate-fadeIn border border-white/10 flex flex-col">
            <div className="p-8 pb-0">
              <button
                onClick={() => setShowActionModal(null)}
                className="absolute top-4 right-4 text-white/40 hover:text-white text-2xl transition-colors"
              >
                ×
              </button>
              
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{showActionModal.title}</h3>
                    <p className="text-white/60">{showActionModal.timeframe}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 px-8 pb-8">
              <div className="space-y-6">
                {/* Detaljerad beskrivning */}
                <div className="bg-white/5 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Vad behöver göras?</h4>
                  <p className="text-white/70 mb-4">{showActionModal.description}</p>
                  <div className="space-y-2">
                    <p className="text-white/60 text-sm">• Identifiera 20 potentiella early adopters</p>
                    <p className="text-white/60 text-sm">• Erbjud 50% rabatt första 3 månaderna</p>
                    <p className="text-white/60 text-sm">• Sätt upp strukturerad feedback-process</p>
                    <p className="text-white/60 text-sm">• Dokumentera alla insikter och case studies</p>
                  </div>
                </div>

                {/* Förväntade resultat */}
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/30">
                  <h4 className="text-lg font-semibold text-white mb-3">Förväntade resultat</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-green-400">3-5x</div>
                      <div className="text-white/60 text-sm">Ökad konvertering</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">+15p</div>
                      <div className="text-white/60 text-sm">Högre investerarscore</div>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm mt-4">{showActionModal.impact}</p>
                </div>

                {/* Exempel från andra startups */}
                <div className="bg-white/5 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Exempel från framgångsrika startups</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">🦄</span>
                      <div>
                        <p className="text-white font-medium">Klarna</p>
                        <p className="text-white/60 text-sm">Började med 10 pilotbutiker, idag värt 6.7 miljarder USD</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-xl">🎵</span>
                      <div>
                        <p className="text-white font-medium">Spotify</p>
                        <p className="text-white/60 text-sm">Första 1000 användare gav kritisk feedback för produktutveckling</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to action */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowActionModal(null)}
                    className="flex-1 px-6 py-3 bg-white/10 rounded-full text-white font-medium hover:bg-white/20 transition-all"
                  >
                    Stäng
                  </button>
                  <button className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-medium hover:shadow-lg hover:scale-105 transition-all">
                    Lägg till i min plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
} 