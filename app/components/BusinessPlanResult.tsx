import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface ResultProps {
  score: number;
  answers: Record<string, unknown>;
  feedback?: Record<string, string>;
  subscriptionLevel?: 'standard' | 'premium';
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

// Helper to safely render values in JSX
function safeRender(value: any) {
  if (typeof value === 'string' || typeof value === 'number') return value;
  if (value === null || value === undefined) return '';
  if (Array.isArray(value) || typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export default function BusinessPlanResult({ score, answers, feedback = {}, subscriptionLevel }: ResultProps) {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState<'score' | 'insights' | 'actions' | 'premium'>('score');
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showActionModal, setShowActionModal] = useState<any>(null);
  const [showSoraInfo, setShowSoraInfo] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  
  const scoreInfo = getScoreInfo(score);
  const typedAnswers = answers as Record<string, any>;
  const isPremium = subscriptionLevel === 'premium';

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
              <h4 className="font-semibold text-gray-900 mb-2">Identifierat Problem</h4>
              <p className="text-gray-800">{safeRender(typedAnswers.customer_problem)}</p>
            </div>
          )}
          {typedAnswers.solution && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Er Lösning</h4>
              <p className="text-gray-800">{safeRender(typedAnswers.solution)}</p>
            </div>
          )}
          <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
            <p className="text-blue-700 font-medium">💡 AI Insikt</p>
            <p className="text-gray-900 text-sm mt-2">
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
              <h4 className="font-semibold text-gray-900 mb-2">Marknadsstorlek</h4>
              <p className="text-gray-800">{safeRender(typedAnswers.market_size)}</p>
            </div>
          )}
          {typedAnswers.target_customer && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Målgrupp</h4>
              <p className="text-gray-800">{safeRender(typedAnswers.target_customer)}</p>
            </div>
          )}
          {typedAnswers.competitors && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Konkurrenssituation</h4>
              <p className="text-gray-800">{safeRender(typedAnswers.competitors)}</p>
            </div>
          )}
          <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
            <p className="text-green-300 font-medium">💡 AI Insikt</p>
            <p className="text-gray-900 text-sm mt-2">
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
              <h4 className="font-semibold text-gray-900 mb-2">Intäktsmodell</h4>
              <p className="text-gray-800">{safeRender(typedAnswers.revenue_model)}</p>
            </div>
          )}
          {typedAnswers.pricing && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Prissättning</h4>
              <p className="text-gray-800">{safeRender(typedAnswers.pricing)}</p>
            </div>
          )}
          {typedAnswers.unit_economics && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Enhetsekonomi</h4>
              <p className="text-gray-800">{safeRender(typedAnswers.unit_economics)}</p>
            </div>
          )}
          <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
            <p className="text-yellow-300 font-medium">💡 AI Insikt</p>
            <p className="text-gray-900 text-sm mt-2">
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
              <h4 className="font-semibold text-gray-900 mb-2">Nuvarande Traction</h4>
              <p className="text-gray-800">{safeRender(typedAnswers.traction)}</p>
            </div>
          )}
          {Array.isArray(milestones) && milestones.length > 0 && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Milestolpar</h4>
              <div className="space-y-2">
                {milestones.map((milestone: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-800">{safeRender(milestone.milestone)}</span>
                    <span className="text-gray-600 text-sm">{safeRender(milestone.date)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="p-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30">
            <p className="text-indigo-300 font-medium">💡 AI Insikt</p>
            <p className="text-gray-900 text-sm mt-2">
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
              <h4 className="font-semibold text-gray-900 mb-2">Teamet</h4>
              <p className="text-gray-900">{safeRender(typedAnswers.team)}</p>
            </div>
          )}
          {founderFit.score && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Founder-Market Fit</h4>
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-2xl ${i < founderFit.score ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-900">{safeRender(founderFit.text)}</p>
            </div>
          )}
          <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
            <p className="text-purple-300 font-medium">💡 AI Insikt</p>
            <p className="text-gray-900 text-sm mt-2">
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
              <h4 className="font-semibold text-gray-900 mb-2">Kapitalbehov: {safeRender(capitalBlock.amount)} MSEK</h4>
              <div className="space-y-2 mt-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Produktutveckling</span>
                  <span className="text-gray-900">{safeRender(capitalBlock.product)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Försäljning & Marketing</span>
                  <span className="text-gray-900">{safeRender(capitalBlock.sales)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Team</span>
                  <span className="text-gray-900">{safeRender(capitalBlock.team)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Övrigt</span>
                  <span className="text-gray-900">{safeRender(capitalBlock.other)}%</span>
                </div>
              </div>
            </div>
          )}
          {typedAnswers.runway && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Runway</h4>
              <p className="text-gray-800">{safeRender(typedAnswers.runway)} månader med nuvarande burn rate</p>
            </div>
          )}
          <div className="p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl border border-red-500/30">
            <p className="text-red-300 font-medium">💡 AI Insikt</p>
            <p className="text-gray-900 text-sm mt-2">
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
              <h4 className="font-semibold text-gray-900 mb-2">Identifierade Risker</h4>
              <p className="text-gray-800">{safeRender(typedAnswers.risks)}</p>
            </div>
          )}
          {typedAnswers.moat && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Konkurrensfördel (Moat)</h4>
              <p className="text-gray-800">{safeRender(typedAnswers.moat)}</p>
            </div>
          )}
          <div className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl border border-orange-500/30">
            <p className="text-orange-300 font-medium">💡 AI Insikt</p>
            <p className="text-gray-900 text-sm mt-2">
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
              <h4 className="font-semibold text-gray-900 mb-2">Exit Plan</h4>
              <p className="text-gray-800">{safeRender(typedAnswers.exit_strategy)}</p>
            </div>
          )}
          {typedAnswers.exit_potential && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Potentiella Köpare</h4>
              <p className="text-gray-800">{safeRender(typedAnswers.exit_potential)}</p>
            </div>
          )}
          <div className="p-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-xl border border-emerald-500/30">
            <p className="text-emerald-300 font-medium">💡 AI Insikt</p>
            <p className="text-gray-900 text-sm mt-2">
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
          answers: typedAnswers,
          insights: insights.map(i => ({
            title: i.title,
            strength: i.strength,
            content: i.content
          })),
          premiumAnalysis: typedAnswers.premiumAnalysis,
          subscriptionLevel: subscriptionLevel || 'standard',
          actionItems,
          scoreInfo
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'frejfund-affarsanalys.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('PDF generation failed');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const handleUpgrade = () => {
    // Spara analysdata för användning efter betalning
    localStorage.setItem('pendingPremiumAnalysis', JSON.stringify({
      score,
      answers,
      feedback,
      timestamp: new Date().toISOString()
    }));
    
    // Navigera till betalningssidan
    router.push('/kassa/checkout');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      {/* Bakgrundsbild */}
      <Image
        src="/bakgrund.png"
        alt="Bakgrund"
        fill
        className="object-cover -z-10"
        priority
      />
      <div className="max-w-4xl w-full flex items-center justify-center mx-auto">
        <div className={`bg-white/5 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/10 ${scoreInfo.glow} transition-all duration-1000 w-full`}>
          {currentSection === 'score' ? (
            <>
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
                {isPremium && (
                  <button
                    onClick={() => setCurrentSection('premium')}
                    className="px-8 py-4 bg-gradient-to-r from-gold-500 to-yellow-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all animate-pulse"
                  >
                    🌟 Premium Analys →
                  </button>
                )}
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

              {/* Only show upgrade CTA if NOT premium */}
              {!isPremium && (
                <div className="mt-12 p-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl border border-purple-500/30">
                  <h3 className="text-2xl font-bold text-white mb-4">🚀 Få Premium AI-Analys</h3>
                  <p className="text-white/80 mb-6">
                    Lås upp 50+ sidor djupgående analys med AI-genererade insikter speciellt anpassade för ditt företag!
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      { icon: '📊', text: 'Marknadsinsikter' },
                      { icon: '🎯', text: 'SWOT-analys' },
                      { icon: '🎬', text: 'Investerarfilm' },
                      { icon: '💎', text: 'Benchmarking' }
                    ].map((feature, i) => (
                      <div key={i} className="text-center">
                        <div className="text-3xl mb-2">{feature.icon}</div>
                        <div className="text-white/70 text-sm">{feature.text}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6 text-left">
                    <div className="space-y-2">
                      <p className="text-white/90 font-semibold">✅ Inkluderat:</p>
                      <ul className="text-white/70 text-sm space-y-1">
                        <li>• 3-års finansiella projektioner</li>
                        <li>• Detaljerade rekommendationer</li>
                        <li>• Investeringsförslag</li>
                        <li>• Riskanalys & mitigering</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p className="text-white/90 font-semibold">🎁 Bonus:</p>
                      <ul className="text-white/70 text-sm space-y-1">
                        <li>• SORA AI filmprompt</li>
                        <li>• Branschspecifika trender</li>
                        <li>• Konkurrensdynamik</li>
                        <li>• Regulatorisk översikt</li>
                      </ul>
                    </div>
                  </div>
                  <button
                    onClick={handleUpgrade}
                    className="px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-full hover:shadow-xl hover:scale-105 transition-all"
                  >
                    Uppgradera för 197 kr →
                  </button>
                </div>
              )}
            </>
          ) : currentSection === 'insights' ? (
            <>
              <h1 className="text-3xl font-bold text-white mb-8">Detaljerad Analys</h1>
              <div className="space-y-6">
                {insights.map((insight) => (
                  <InsightCard
                    key={insight.id}
                    title={insight.title}
                    content={insight.content}
                    icon={insight.icon}
                    priority={insight.strength as "high" | "medium" | "low" | undefined}
                    isExpanded={expandedInsight === insight.id}
                    onToggle={() => setExpandedInsight(expandedInsight === insight.id ? null : insight.id)}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentSection('score')}
                className="mt-8 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all"
              >
                Tillbaka
              </button>
            </>
          ) : currentSection === 'premium' ? (
            <>
              {/* Premium content section */}
              <h1 className="text-3xl font-bold text-white mb-8">🌟 Premium AI-Analys</h1>
              
              {/* Premium Success Message - ändrat för demo */}
              {isPremium && (
                <div className="mb-8 p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🌟</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">Premium-analys</h3>
                      <p className="text-white/70">Detta är en demo av vad som ingår i premium-analysen för 197 kr.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Premium Tabs */}
              <div className="mb-8 flex flex-wrap gap-2 justify-center">
                {['swot', 'finansiell', 'rekommendationer', 'benchmark', 'investeringsförslag', 'investerarfilm', 'marknadsinsikter'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setExpandedInsight(tab)}
                    className={`px-6 py-3 rounded-full font-semibold transition-all ${
                      expandedInsight === tab 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {tab === 'investerarfilm' ? '🎬 ' : tab === 'marknadsinsikter' ? '📊 ' : ''}{tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* SWOT Analysis - förbättrad design */}
              {expandedInsight === 'swot' && typedAnswers.premiumAnalysis?.swot && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">SWOT-Analys</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-500/30">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-start gap-2">
                        <span className="text-2xl">💪</span> 
                        <span>Styrkor</span>
                      </h3>
                      <ul className="space-y-3">
                        {typedAnswers.premiumAnalysis.swot.strengths.map((strength: string, i: number) => (
                          <li key={i} className="text-gray-900 flex items-start gap-3 text-left">
                            <span className="text-green-600 mt-1">•</span>
                            <span className="flex-1">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl p-6 border border-red-500/30">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-start gap-2">
                        <span className="text-2xl">⚠️</span> 
                        <span>Svagheter</span>
                      </h3>
                      <ul className="space-y-3">
                        {typedAnswers.premiumAnalysis.swot.weaknesses.map((weakness: string, i: number) => (
                          <li key={i} className="text-gray-900 flex items-start gap-3 text-left">
                            <span className="text-orange-600 mt-1">•</span>
                            <span className="flex-1">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-500/30">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-start gap-2">
                        <span className="text-2xl">🎯</span> 
                        <span>Möjligheter</span>
                      </h3>
                      <ul className="space-y-3">
                        {typedAnswers.premiumAnalysis.swot.opportunities.map((opportunity: string, i: number) => (
                          <li key={i} className="text-gray-900 flex items-start gap-3 text-left">
                            <span className="text-blue-600 mt-1">•</span>
                            <span className="flex-1">{opportunity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-2xl p-6 border border-yellow-500/30">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-start gap-2">
                        <span className="text-2xl">🌪️</span> 
                        <span>Hot</span>
                      </h3>
                      <ul className="space-y-3">
                        {typedAnswers.premiumAnalysis.swot.threats.map((threat: string, i: number) => (
                          <li key={i} className="text-gray-900 flex items-start gap-3 text-left">
                            <span className="text-yellow-600 mt-1">•</span>
                            <span className="flex-1">{threat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Benchmark Analysis - ny sektion */}
              {expandedInsight === 'benchmark' && typedAnswers.premiumAnalysis?.benchmarkAnalysis && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Benchmark-Analys</h2>
                  
                  {/* Industry Comparison */}
                  <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">Branschjämförelse</h3>
                    <div className="space-y-4">
                      {Object.entries(typedAnswers.premiumAnalysis.benchmarkAnalysis.industryComparison).map(([key, data]: [string, any]) => {
                        if (key === 'metric') return null;
                        return (
                          <div key={key} className="grid grid-cols-4 gap-4 items-center p-3 bg-white/5 rounded-xl">
                            <div className="text-gray-900 font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                            <div className="text-gray-800">Ert bolag: {data.us}</div>
                            <div className="text-gray-700">Branschsnitt: {data.industry}</div>
                            <div className={`font-bold ${data.verdict === 'Excellent' || data.verdict === 'Top quartile' || data.verdict === 'Best in class' ? 'text-green-600' : 'text-yellow-600'}`}>
                              {data.verdict}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Peer Comparison */}
                  <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">Jämförelse med konkurrenter</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-gray-900">
                        <thead>
                          <tr className="border-b border-gray-300">
                            <th className="text-left py-3">Företag</th>
                            <th className="text-right py-3">Finansiering</th>
                            <th className="text-right py-3">ARR</th>
                            <th className="text-right py-3">Värdering</th>
                          </tr>
                        </thead>
                        <tbody>
                          {typedAnswers.premiumAnalysis.benchmarkAnalysis.peerComparison.map((peer: any, i: number) => (
                            <tr key={i} className="border-b border-gray-200">
                              <td className="py-3">{peer.company}</td>
                              <td className="text-right">{peer.funding}</td>
                              <td className="text-right">{peer.revenue}</td>
                              <td className="text-right">{peer.valuation}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Investment Proposal - ny sektion */}
              {expandedInsight === 'investeringsförslag' && typedAnswers.premiumAnalysis?.investmentProposal && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Investeringsförslag</h2>
                  
                  {/* Investment Ask */}
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">Investeringsbehov</h3>
                        <p className="text-3xl font-bold text-white">{typedAnswers.premiumAnalysis.investmentProposal.askAmount}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">Pre-money värdering</h3>
                        <p className="text-3xl font-bold text-white">{typedAnswers.premiumAnalysis.investmentProposal.valuation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Use of Funds */}
                  <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">Användning av kapital</h3>
                    <div className="space-y-3">
                      {Object.entries(typedAnswers.premiumAnalysis.investmentProposal.useOfFunds).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-gray-800 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="text-gray-900 font-semibold">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">Nyckeltal</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(typedAnswers.premiumAnalysis.investmentProposal.keyMetrics).map(([key, value]: [string, any]) => (
                        <div key={key} className="bg-white/5 rounded-xl p-4">
                          <p className="text-gray-700 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                          <p className="text-gray-900 text-xl font-bold">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Investor Benefits */}
                  <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">Fördelar för investerare</h3>
                    <ul className="space-y-2">
                      {typedAnswers.premiumAnalysis.investmentProposal.investorBenefits.map((benefit: string, i: number) => (
                        <li key={i} className="text-gray-900 flex items-start gap-3">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Detailed Recommendations */}
              {expandedInsight === 'rekommendationer' && typedAnswers.premiumAnalysis?.detailedRecommendations && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Detaljerade Rekommendationer</h2>
                  
                  {/* Immediate Actions */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">🚀 Omedelbart (1-2 månader)</h3>
                    <div className="space-y-4">
                      {typedAnswers.premiumAnalysis.detailedRecommendations.immediate.map((rec: any, i: number) => (
                        <div key={i} className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                          <h4 className="text-lg font-bold text-gray-900 mb-2">{rec.action}</h4>
                          <div className="space-y-2 text-gray-800">
                            <p><strong className="text-gray-900">Varför:</strong> {rec.why}</p>
                            <p><strong className="text-gray-900">Hur:</strong> {rec.how}</p>
                            <p><strong className="text-gray-900">Förväntad effekt:</strong> {rec.impact}</p>
                            <p><strong className="text-gray-900">Resurser:</strong> {rec.resources}</p>
                            <p><strong className="text-gray-900">Tidsram:</strong> {rec.timeline}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Short Term Actions */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">📈 Kort sikt (3-6 månader)</h3>
                    <div className="space-y-4">
                      {typedAnswers.premiumAnalysis.detailedRecommendations.shortTerm.map((rec: any, i: number) => (
                        <div key={i} className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                          <h4 className="text-lg font-bold text-gray-900 mb-2">{rec.action}</h4>
                          <div className="space-y-2 text-gray-800">
                            <p><strong className="text-gray-900">Varför:</strong> {rec.why}</p>
                            <p><strong className="text-gray-900">Hur:</strong> {rec.how}</p>
                            <p><strong className="text-gray-900">Förväntad effekt:</strong> {rec.impact}</p>
                            <p><strong className="text-gray-900">Resurser:</strong> {rec.resources}</p>
                            <p><strong className="text-gray-900">Tidsram:</strong> {rec.timeline}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Financial Projections */}
              {expandedInsight === 'finansiell' && typedAnswers.financial_projections && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Finansiella Projektioner (3 år)</h2>
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-300">
                            <th className="text-left py-3 text-gray-900 font-bold">Metrik</th>
                            <th className="text-right py-3 text-gray-900 font-bold">År 1</th>
                            <th className="text-right py-3 text-gray-900 font-bold">År 2</th>
                            <th className="text-right py-3 text-gray-900 font-bold">År 3</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const projections = parseJsonSafely(typedAnswers.financial_projections);
                            return (
                              <>
                                <tr className="border-b border-gray-200">
                                  <td className="py-3 text-gray-800 font-medium">Intäkter</td>
                                  <td className="text-right text-gray-900">{(projections.year1?.revenue / 1000000).toFixed(1)} MSEK</td>
                                  <td className="text-right text-gray-900">{(projections.year2?.revenue / 1000000).toFixed(1)} MSEK</td>
                                  <td className="text-right text-gray-900">{(projections.year3?.revenue / 1000000).toFixed(1)} MSEK</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                  <td className="py-3 text-gray-800 font-medium">Kostnader</td>
                                  <td className="text-right text-gray-900">{(projections.year1?.costs / 1000000).toFixed(1)} MSEK</td>
                                  <td className="text-right text-gray-900">{(projections.year2?.costs / 1000000).toFixed(1)} MSEK</td>
                                  <td className="text-right text-gray-900">{(projections.year3?.costs / 1000000).toFixed(1)} MSEK</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                  <td className="py-3 text-gray-800 font-medium">EBITDA</td>
                                  <td className="text-right text-red-600 font-bold">{(projections.year1?.ebitda / 1000000).toFixed(1)} MSEK</td>
                                  <td className="text-right text-green-600 font-bold">{(projections.year2?.ebitda / 1000000).toFixed(1)} MSEK</td>
                                  <td className="text-right text-green-600 font-bold">{(projections.year3?.ebitda / 1000000).toFixed(1)} MSEK</td>
                                </tr>
                                <tr>
                                  <td className="py-3 text-gray-800 font-medium">Antal kunder</td>
                                  <td className="text-right text-gray-900">{projections.year1?.customers}</td>
                                  <td className="text-right text-gray-900">{projections.year2?.customers}</td>
                                  <td className="text-right text-gray-900">{projections.year3?.customers}</td>
                                </tr>
                              </>
                            );
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Investor Film Section - NY */}
              {expandedInsight === 'investerarfilm' && typedAnswers.premiumAnalysis?.investorFilm && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-white">Emotionell Investerarfilm</h2>
                    <button
                      onClick={() => setShowSoraInfo(true)}
                      className="text-white/70 hover:text-white transition-colors"
                      title="Vad är SORA AI?"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* SORA Info Modal */}
                  {showSoraInfo && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSoraInfo(false)}>
                      <div className="bg-white rounded-2xl p-6 max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">🎬 Om SORA AI</h3>
                        <p className="text-gray-700 mb-4">
                          SORA AI är OpenAIs revolutionerande video-genereringsmodell som kan skapa realistiska och fantasifulla videor från textbeskrivningar. 
                          Perfekt för att skapa professionella investerarfilmer utan dyra produktionskostnader.
                        </p>
                        <p className="text-gray-700 mb-4">
                          Kopiera prompten nedan och använd den i SORA AI när den blir tillgänglig, eller använd den som guide för egen inspelning.
                        </p>
                        <button
                          onClick={() => setShowSoraInfo(false)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Stäng
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Film Concept */}
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
                    <h3 className="text-xl font-bold text-white mb-4">🎯 Filmkoncept - Känslodriven berättelse</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Företagets WHY</h4>
                        <p className="text-gray-900">{typedAnswers.premiumAnalysis.investorFilm.whyStatement}</p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Emotionell krok</h4>
                        <p className="text-gray-900">{typedAnswers.premiumAnalysis.investorFilm.emotionalHook}</p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Målgruppens känsla</h4>
                        <p className="text-gray-900">{typedAnswers.premiumAnalysis.investorFilm.targetEmotion}</p>
                      </div>
                    </div>
                  </div>

                  {/* SORA AI Prompt */}
                  <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">🤖 SORA AI Prompt (30 sekunder)</h3>
                    <div className="bg-black/20 rounded-xl p-4 mb-4">
                      <code className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                        {typedAnswers.premiumAnalysis.investorFilm.soraPrompt}
                      </code>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(typedAnswers.premiumAnalysis.investorFilm.soraPrompt);
                        setCopiedPrompt(true);
                        setTimeout(() => setCopiedPrompt(false), 2000);
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                      {copiedPrompt ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Kopierad!
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Kopiera prompt
                        </>
                      )}
                    </button>
                  </div>

                  {/* DIY Film Guide */}
                  <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">🎥 Gör-det-själv Guide</h3>
                    <div className="space-y-6">
                      {/* Script Structure */}
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Manuskriptstruktur (30 sek)</h4>
                        <div className="space-y-3">
                          {typedAnswers.premiumAnalysis.investorFilm.scriptStructure.map((section: any, i: number) => (
                            <div key={i} className="bg-white/5 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-purple-400 font-semibold">{section.timeframe}</span>
                                <span className="text-gray-500 text-sm">{section.duration}</span>
                              </div>
                              <p className="text-gray-900 mb-2">{section.content}</p>
                              <p className="text-gray-700 text-sm italic">Känsla: {section.emotion}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Production Tips */}
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Produktionstips</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white/5 rounded-lg p-4">
                            <h5 className="text-white font-semibold mb-2">📹 Visuellt</h5>
                            <ul className="space-y-2 text-gray-800 text-sm">
                              {typedAnswers.premiumAnalysis.investorFilm.productionTips.visual.map((tip: string, i: number) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-purple-400 mt-0.5">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-white/5 rounded-lg p-4">
                            <h5 className="text-white font-semibold mb-2">🎵 Ljud & Musik</h5>
                            <ul className="space-y-2 text-gray-800 text-sm">
                              {typedAnswers.premiumAnalysis.investorFilm.productionTips.audio.map((tip: string, i: number) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-purple-400 mt-0.5">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Storyboard */}
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">📐 Storyboard-förslag</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {typedAnswers.premiumAnalysis.investorFilm.storyboard.map((scene: any, i: number) => (
                            <div key={i} className="bg-white/5 rounded-lg p-3 text-center">
                              <div className="text-3xl mb-2">{scene.icon}</div>
                              <p className="text-gray-900 text-sm font-medium">{scene.shot}</p>
                              <p className="text-gray-700 text-xs mt-1">{scene.duration}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Market Insights Section - NY */}
              {expandedInsight === 'marknadsinsikter' && typedAnswers.premiumAnalysis?.marketInsights && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">📊 Djupgående Marknadsinsikter</h2>
                  
                  {/* Market Size Evolution */}
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-500/30">
                    <h3 className="text-xl font-bold text-white mb-4">Marknadsstorlek & Tillväxt</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-white">{typedAnswers.premiumAnalysis.marketInsights.marketSize.current}</p>
                        <p className="text-gray-300 text-sm">Nuvarande marknad</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-400">{typedAnswers.premiumAnalysis.marketInsights.marketSize.growth}</p>
                        <p className="text-gray-300 text-sm">Årlig tillväxt</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-400">{typedAnswers.premiumAnalysis.marketInsights.marketSize.projected}</p>
                        <p className="text-gray-300 text-sm">Prognos 2027</p>
                      </div>
                    </div>
                    <div className="bg-black/20 rounded-xl p-4">
                      <p className="text-gray-300 text-sm italic">{typedAnswers.premiumAnalysis.marketInsights.marketSize.source}</p>
                    </div>
                  </div>

                  {/* Key Trends */}
                  <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">🔮 Viktiga Marknadstrender</h3>
                    <div className="space-y-4">
                      {typedAnswers.premiumAnalysis.marketInsights.keyTrends.map((trend: any, i: number) => (
                        <div key={i} className="bg-white/5 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{trend.icon}</span>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-white mb-2">{trend.name}</h4>
                              <p className="text-gray-300 mb-2">{trend.description}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-green-400">Impact: {trend.impact}</span>
                                <span className="text-blue-400">Tidshorisont: {trend.timeframe}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Regulatory Landscape */}
                  <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">⚖️ Regulatorisk Översikt</h3>
                    <div className="space-y-3">
                      {typedAnswers.premiumAnalysis.marketInsights.regulatory.map((reg: any, i: number) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            reg.impact === 'Positive' ? 'bg-green-500/20 text-green-300' : 
                            reg.impact === 'Neutral' ? 'bg-blue-500/20 text-blue-300' : 
                            'bg-red-500/20 text-red-300'
                          }`}>
                            {reg.impact}
                          </span>
                          <div className="flex-1">
                            <h4 className="text-white font-semibold">{reg.name}</h4>
                            <p className="text-gray-400 text-sm">{reg.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Insights */}
                  <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">🎯 Kundinsikter</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Köpbeteende</h4>
                        <ul className="space-y-2">
                          {typedAnswers.premiumAnalysis.marketInsights.customerBehavior.map((behavior: string, i: number) => (
                            <li key={i} className="text-gray-300 flex items-start gap-2">
                              <span className="text-purple-400 mt-0.5">•</span>
                              <span>{behavior}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Beslutsfattare</h4>
                        <div className="space-y-3">
                          {typedAnswers.premiumAnalysis.marketInsights.decisionMakers.map((dm: any, i: number) => (
                            <div key={i} className="bg-white/5 rounded-lg p-3">
                              <p className="text-white font-medium">{dm.role}</p>
                              <p className="text-gray-400 text-sm">{dm.priority}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Competitive Dynamics */}
                  <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">🏆 Konkurrensdynamik</h3>
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-white mb-2">Marknadsledare</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {typedAnswers.premiumAnalysis.marketInsights.competitiveLandscape.leaders.map((leader: any, i: number) => (
                          <div key={i} className="bg-white/5 rounded-lg p-3 text-center">
                            <p className="text-white font-medium">{leader.name}</p>
                            <p className="text-purple-400 text-sm">{leader.share}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Vår Konkurrensfördel</h4>
                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
                        <p className="text-gray-300">{typedAnswers.premiumAnalysis.marketInsights.competitiveLandscape.ourAdvantage}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Back button */}
              <button
                onClick={() => setCurrentSection('score')}
                className="mt-8 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all"
              >
                Tillbaka
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
} 