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
  const [showImagePromptsInfo, setShowImagePromptsInfo] = useState(false);
  const [copiedImagePrompt, setCopiedImagePrompt] = useState<number | null>(null);
  
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
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  Se Detaljerad Analys →
                </button>
                {isPremium && (
                  <>
                    <button
                      onClick={() => setCurrentSection('premium')}
                      className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
                    >
                      🌟 Premium Analys →
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
                  </>
                )}
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
                      { icon: '📄', text: 'PDF Export' }
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
                        <li>• 50+ sidor PDF-rapport</li>
                        <li>• 3-års finansiella projektioner</li>
                        <li>• Detaljerade rekommendationer</li>
                        <li>• Investeringsförslag</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p className="text-white/90 font-semibold">🎁 Bonus:</p>
                      <ul className="text-white/70 text-sm space-y-1">
                        <li>• SORA AI filmprompt</li>
                        <li>• 10 AI bildprompts</li>
                        <li>• Konkurrensdynamik</li>
                        <li>• Professionell PDF</li>
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
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8">
                ✨ Premium AI-Analys
              </h1>
              
              {/* Premium Success Message - ändrat för demo */}
              {isPremium && (
                <div className="mb-8 p-6 bg-gradient-to-br from-purple-600/30 via-pink-600/20 to-purple-600/30 rounded-3xl border border-purple-500/40 backdrop-blur-lg shadow-2xl">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg">
                      <span className="text-4xl">🌟</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-1">Premium-analys Aktiverad</h3>
                      <p className="text-white/80">Detta är en demo av vad som ingår i premium-analysen för 197 kr.</p>
                    </div>
                    <button
                      onClick={handleDownloadPDF}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 group"
                    >
                      <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Ladda ner PDF</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Premium Tabs - Enhanced Design */}
              <div className="mb-10">
                {/* Tab Navigation Container */}
                <div className="bg-gradient-to-r from-purple-900/20 via-pink-900/10 to-purple-900/20 backdrop-blur-xl rounded-3xl p-2 border border-white/20 shadow-2xl">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { id: 'swot', label: 'SWOT', icon: '💪', description: 'Styrkor & Svagheter' },
                      { id: 'finansiell', label: 'Finansiell', icon: '📈', description: '3-års projektioner' },
                      { id: 'rekommendationer', label: 'Rekommendationer', icon: '🎯', description: 'Åtgärdsplan' },
                      { id: 'benchmark', label: 'Benchmark', icon: '📊', description: 'Branschjämförelse' },
                      { id: 'investeringsförslag', label: 'Investering', icon: '💰', description: 'Förslag & Villkor' },
                      { id: 'investerarfilm', label: 'Film', icon: '🎬', description: 'SORA AI Script' },
                      { id: 'marknadsinsikter', label: 'Marknad', icon: '🔍', description: 'Trender & Analys' },
                      { id: 'ai-bildprompts', label: 'AI Bilder', icon: '🎨', description: '10 Prompter' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setExpandedInsight(tab.id)}
                        className={`group relative p-4 rounded-2xl transition-all duration-300 transform ${
                          expandedInsight === tab.id 
                            ? 'bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 text-white shadow-2xl scale-[1.02] ring-2 ring-purple-400/50' 
                            : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white hover:scale-[1.01]'
                        }`}
                      >
                        {/* Glowing effect for active tab */}
                        {expandedInsight === tab.id && (
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 opacity-30 blur-xl"></div>
                        )}
                        
                        {/* Content */}
                        <div className="relative z-10">
                          <div className="flex flex-col items-center gap-2">
                            <span className={`text-3xl transition-transform duration-300 ${
                              expandedInsight === tab.id ? 'scale-125' : 'group-hover:scale-110'
                            }`}>
                              {tab.icon}
                            </span>
                            <div className="text-center">
                              <p className={`font-bold text-sm ${
                                expandedInsight === tab.id ? 'text-white' : 'text-white/90'
                              }`}>
                                {tab.label}
                              </p>
                              <p className={`text-xs mt-0.5 ${
                                expandedInsight === tab.id ? 'text-white/90' : 'text-white/60'
                              }`}>
                                {tab.description}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Active indicator */}
                        {expandedInsight === tab.id && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 rounded-full animate-pulse"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Tab Content Indicator */}
                {expandedInsight && (
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-2 text-white/60 text-sm">
                      <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      <span>Scrolla för att se innehåll</span>
                    </div>
                  </div>
                )}
              </div>

              {/* SWOT Analysis - förbättrad design */}
              {expandedInsight === 'swot' && typedAnswers.premiumAnalysis?.swot && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-8 backdrop-blur-lg border border-purple-500/20">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">SWOT-Analys</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Strengths */}
                      <div className="bg-gradient-to-br from-green-600/30 to-emerald-600/20 rounded-2xl p-6 border border-green-500/40 backdrop-blur-md transform hover:scale-105 transition-all">
                        <h3 className="text-2xl font-bold text-white mb-5 flex items-center gap-3">
                          <div className="p-2 bg-green-500 rounded-lg shadow-lg">
                            <span className="text-2xl">💪</span>
                          </div>
                          <span>Styrkor</span>
                        </h3>
                        <ul className="space-y-3">
                          {typedAnswers.premiumAnalysis.swot.strengths.map((strength: string, i: number) => (
                            <li key={i} className="text-white/90 flex items-start gap-3 text-left bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
                              <span className="text-green-400 mt-1 text-xl">✓</span>
                              <span className="flex-1">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Weaknesses */}
                      <div className="bg-gradient-to-br from-red-600/30 to-orange-600/20 rounded-2xl p-6 border border-red-500/40 backdrop-blur-md transform hover:scale-105 transition-all">
                        <h3 className="text-2xl font-bold text-white mb-5 flex items-center gap-3">
                          <div className="p-2 bg-red-500 rounded-lg shadow-lg">
                            <span className="text-2xl">⚠️</span>
                          </div>
                          <span>Svagheter</span>
                        </h3>
                        <ul className="space-y-3">
                          {typedAnswers.premiumAnalysis.swot.weaknesses.map((weakness: string, i: number) => (
                            <li key={i} className="text-white/90 flex items-start gap-3 text-left bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
                              <span className="text-red-400 mt-1 text-xl">!</span>
                              <span className="flex-1">{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Opportunities */}
                      <div className="bg-gradient-to-br from-blue-600/30 to-purple-600/20 rounded-2xl p-6 border border-blue-500/40 backdrop-blur-md transform hover:scale-105 transition-all">
                        <h3 className="text-2xl font-bold text-white mb-5 flex items-center gap-3">
                          <div className="p-2 bg-blue-500 rounded-lg shadow-lg">
                            <span className="text-2xl">🎯</span>
                          </div>
                          <span>Möjligheter</span>
                        </h3>
                        <ul className="space-y-3">
                          {typedAnswers.premiumAnalysis.swot.opportunities.map((opportunity: string, i: number) => (
                            <li key={i} className="text-white/90 flex items-start gap-3 text-left bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
                              <span className="text-blue-400 mt-1 text-xl">→</span>
                              <span className="flex-1">{opportunity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Threats */}
                      <div className="bg-gradient-to-br from-yellow-600/30 to-amber-600/20 rounded-2xl p-6 border border-yellow-500/40 backdrop-blur-md transform hover:scale-105 transition-all">
                        <h3 className="text-2xl font-bold text-white mb-5 flex items-center gap-3">
                          <div className="p-2 bg-yellow-500 rounded-lg shadow-lg">
                            <span className="text-2xl">🌪️</span>
                          </div>
                          <span>Hot</span>
                        </h3>
                        <ul className="space-y-3">
                          {typedAnswers.premiumAnalysis.swot.threats.map((threat: string, i: number) => (
                            <li key={i} className="text-white/90 flex items-start gap-3 text-left bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
                              <span className="text-yellow-400 mt-1 text-xl">⚡</span>
                              <span className="flex-1">{threat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Financial Projections Section */}
              {expandedInsight === 'finansiell' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-8 backdrop-blur-lg border border-purple-500/20">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Finansiella Projektioner (3 år)</h2>
                    
                    {typedAnswers.premiumAnalysis?.financialProjections ? (
                      <>
                        {/* Revenue Projections */}
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6">
                          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-2xl">💰</span>
                            Omsättningsprognoser (MSEK)
                          </h3>
                          <div className="grid grid-cols-3 gap-4">
                            {['year1', 'year2', 'year3'].map((year, i) => (
                              <div key={year} className="bg-black/30 rounded-xl p-4 text-center">
                                <p className="text-white/60 text-sm mb-1">År {i + 1}</p>
                                <p className="text-3xl font-bold text-green-400">
                                  {typedAnswers.premiumAnalysis.financialProjections.revenue[year]}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Costs & EBITDA */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-4">Kostnader (MSEK)</h3>
                            <div className="space-y-3">
                              {['year1', 'year2', 'year3'].map((year, i) => (
                                <div key={year} className="flex justify-between items-center">
                                  <span className="text-white/70">År {i + 1}</span>
                                  <span className="text-xl font-semibold text-red-400">
                                    {typedAnswers.premiumAnalysis.financialProjections.costs[year]}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-4">EBITDA (MSEK)</h3>
                            <div className="space-y-3">
                              {['year1', 'year2', 'year3'].map((year, i) => (
                                <div key={year} className="flex justify-between items-center">
                                  <span className="text-white/70">År {i + 1}</span>
                                  <span className={`text-xl font-semibold ${
                                    typedAnswers.premiumAnalysis.financialProjections.ebitda[year].startsWith('-') 
                                      ? 'text-red-400' 
                                      : 'text-green-400'
                                  }`}>
                                    {typedAnswers.premiumAnalysis.financialProjections.ebitda[year]}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Customer Projections */}
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                          <h3 className="text-xl font-bold text-white mb-4">Kundtillväxt</h3>
                          <div className="grid grid-cols-3 gap-4">
                            {['year1', 'year2', 'year3'].map((year, i) => (
                              <div key={year} className="text-center">
                                <p className="text-white/60 text-sm mb-1">År {i + 1}</p>
                                <p className="text-2xl font-bold text-blue-400">
                                  {typedAnswers.premiumAnalysis.financialProjections.customerProjections[year]}
                                </p>
                                <p className="text-white/60 text-sm">kunder</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <span className="text-6xl mb-4 block">📊</span>
                        <p className="text-white/60 text-lg">Finansiella projektioner genereras när du uppgraderar till Premium</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recommendations Section */}
              {expandedInsight === 'rekommendationer' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-8 backdrop-blur-lg border border-purple-500/20">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Detaljerade Rekommendationer</h2>
                    
                    {typedAnswers.premiumAnalysis?.detailedRecommendations ? (
                      <>
                        {/* Immediate Actions */}
                        <div className="mb-8">
                          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-3xl">🚀</span>
                            Omedelbara Åtgärder (1-2 månader)
                          </h3>
                          <div className="space-y-4">
                            {typedAnswers.premiumAnalysis.detailedRecommendations.immediate.map((action: any, i: number) => (
                              <div key={i} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all">
                                <h4 className="text-lg font-bold text-white mb-3">{action.action}</h4>
                                <div className="space-y-3 text-white/80">
                                  <div>
                                    <span className="font-semibold text-purple-400">Varför:</span> {action.why}
                                  </div>
                                  <div>
                                    <span className="font-semibold text-blue-400">Hur:</span> {action.how}
                                  </div>
                                  <div>
                                    <span className="font-semibold text-green-400">Förväntad effekt:</span> {action.expectedImpact}
                                  </div>
                                  <div className="flex items-center gap-4 mt-4">
                                    <span className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 text-sm">
                                      {action.resources}
                                    </span>
                                    <span className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-sm">
                                      {action.timeline}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Short-term Actions */}
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-3xl">📈</span>
                            Kortsiktiga Åtgärder (3-6 månader)
                          </h3>
                          <div className="space-y-4">
                            {typedAnswers.premiumAnalysis.detailedRecommendations.shortTerm.map((action: any, i: number) => (
                              <div key={i} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all">
                                <h4 className="text-lg font-bold text-white mb-3">{action.action}</h4>
                                <div className="space-y-3 text-white/80">
                                  <div>
                                    <span className="font-semibold text-purple-400">Varför:</span> {action.why}
                                  </div>
                                  <div>
                                    <span className="font-semibold text-blue-400">Hur:</span> {action.how}
                                  </div>
                                  <div>
                                    <span className="font-semibold text-green-400">Förväntad effekt:</span> {action.expectedImpact}
                                  </div>
                                  <div className="flex items-center gap-4 mt-4">
                                    <span className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 text-sm">
                                      {action.resources}
                                    </span>
                                    <span className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-sm">
                                      {action.timeline}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <span className="text-6xl mb-4 block">🎯</span>
                        <p className="text-white/60 text-lg">Detaljerade rekommendationer genereras när du uppgraderar till Premium</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Benchmark Section */}
              {expandedInsight === 'benchmark' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-8 backdrop-blur-lg border border-purple-500/20">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Benchmark-Analys</h2>
                    
                    {typedAnswers.premiumAnalysis?.benchmarkAnalysis ? (
                      <>
                        {/* Industry Comparison */}
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6">
                          <h3 className="text-xl font-bold text-white mb-4">Branschjämförelse</h3>
                          {typedAnswers.premiumAnalysis.benchmarkAnalysis.industryComparison.map((metric: any, i: number) => (
                            <div key={i} className="mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-white/80">{metric.metric}</span>
                                <span className={`font-bold ${
                                  metric.position === 'Över genomsnitt' ? 'text-green-400' :
                                  metric.position === 'Under genomsnitt' ? 'text-red-400' :
                                  'text-yellow-400'
                                }`}>
                                  {metric.position}
                                </span>
                              </div>
                              <div className="bg-black/30 rounded-full h-4 overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-1000 ${
                                    metric.position === 'Över genomsnitt' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                    metric.position === 'Under genomsnitt' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                                    'bg-gradient-to-r from-yellow-500 to-amber-500'
                                  }`}
                                  style={{ width: `${metric.percentile}%` }}
                                />
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="text-white/60 text-sm">Er: {metric.yourValue}</span>
                                <span className="text-white/60 text-sm">Bransch: {metric.industryAverage}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Peer Comparison */}
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                          <h3 className="text-xl font-bold text-white mb-4">Konkurrentjämförelse</h3>
                          <div className="overflow-x-auto">
                            <table className="w-full text-white/80">
                              <thead>
                                <tr className="border-b border-white/20">
                                  <th className="text-left py-3">Företag</th>
                                  <th className="text-center py-3">Omsättning</th>
                                  <th className="text-center py-3">Tillväxt</th>
                                  <th className="text-center py-3">Marknadsandel</th>
                                </tr>
                              </thead>
                              <tbody>
                                {typedAnswers.premiumAnalysis.benchmarkAnalysis.peerComparison.map((peer: any, i: number) => (
                                  <tr key={i} className={`border-b border-white/10 ${peer.isYou ? 'bg-purple-500/20' : ''}`}>
                                    <td className="py-3">
                                      {peer.company}
                                      {peer.isYou && <span className="ml-2 text-purple-400">(Ni)</span>}
                                    </td>
                                    <td className="text-center py-3">{peer.revenue}</td>
                                    <td className="text-center py-3">
                                      <span className={peer.growth.includes('+') ? 'text-green-400' : 'text-red-400'}>
                                        {peer.growth}
                                      </span>
                                    </td>
                                    <td className="text-center py-3">{peer.marketShare}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <span className="text-6xl mb-4 block">📊</span>
                        <p className="text-white/60 text-lg">Benchmark-analys genereras när du uppgraderar till Premium</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Investment Proposal Section */}
              {expandedInsight === 'investeringsförslag' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-8 backdrop-blur-lg border border-purple-500/20">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Investeringsförslag</h2>
                    
                    {typedAnswers.premiumAnalysis?.investmentProposal ? (
                      <>
                        {/* Investment Ask */}
                        <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-2xl p-6 border border-purple-500/40 mb-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-lg font-bold text-white mb-2">Investeringsbehov</h3>
                              <p className="text-4xl font-bold text-white">
                                {typedAnswers.premiumAnalysis.investmentProposal.askAmount} MSEK
                              </p>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white mb-2">Värdering</h3>
                              <p className="text-4xl font-bold text-white">
                                {typedAnswers.premiumAnalysis.investmentProposal.valuation} MSEK
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Use of Funds */}
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6">
                          <h3 className="text-xl font-bold text-white mb-4">Användning av Kapital</h3>
                          <div className="space-y-4">
                            {Object.entries(typedAnswers.premiumAnalysis.investmentProposal.useOfFunds).map(([key, value]) => {
                              const labels: any = {
                                productDevelopment: 'Produktutveckling',
                                salesMarketing: 'Försäljning & Marknadsföring',
                                teamExpansion: 'Teamutbyggnad',
                                other: 'Övrigt'
                              };
                              return (
                                <div key={key}>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-white/80">{labels[key]}</span>
                                    <span className="text-white font-bold">{value as string}%</span>
                                  </div>
                                  <div className="bg-black/30 rounded-full h-3 overflow-hidden">
                                    <div 
                                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                                      style={{ width: `${value}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                          {Object.entries(typedAnswers.premiumAnalysis.investmentProposal.keyMetrics).map(([key, value]) => {
                            const labels: any = {
                              currentMRR: 'Nuvarande MRR',
                              targetMRR12Months: 'Mål MRR (12 mån)',
                              currentCustomers: 'Nuvarande kunder',
                              targetCustomers12Months: 'Mål kunder (12 mån)',
                              burnRate: 'Burn rate',
                              monthsRunway: 'Månader runway'
                            };
                            return (
                              <div key={key} className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
                                <p className="text-white/60 text-sm mb-1">{labels[key]}</p>
                                <p className="text-2xl font-bold text-white">{value as string}</p>
                              </div>
                            );
                          })}
                        </div>

                        {/* Investor Benefits */}
                        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl p-6 border border-green-500/40">
                          <h3 className="text-xl font-bold text-white mb-4">Fördelar för Investerare</h3>
                          <ul className="space-y-3">
                            {typedAnswers.premiumAnalysis.investmentProposal.investorBenefits.map((benefit: string, i: number) => (
                              <li key={i} className="flex items-start gap-3 text-white/90">
                                <span className="text-green-400 text-xl mt-0.5">✓</span>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <span className="text-6xl mb-4 block">💰</span>
                        <p className="text-white/60 text-lg">Investeringsförslag genereras när du uppgraderar till Premium</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Investor Film Section */}
              {expandedInsight === 'investerarfilm' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-8 backdrop-blur-lg border border-purple-500/20">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-3xl font-bold text-white">Investerarfilm - Koncept & Guide</h2>
                      <button
                        onClick={() => setShowSoraInfo(true)}
                        className="text-white/70 hover:text-white transition-colors"
                        title="Om SORA AI"
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
                            SORA är OpenAI:s avancerade AI-modell för videogenerering. Med en textprompt kan SORA skapa 
                            realistiska och kreativa videor upp till 60 sekunder långa.
                          </p>
                          <p className="text-gray-700 mb-4">
                            Perfekt för att skapa en professionell investerarfilm utan dyra produktionskostnader!
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
                    
                    {typedAnswers.premiumAnalysis?.investorFilm ? (
                      <>
                        {/* WHY Statement */}
                        <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-2xl p-6 border border-purple-500/40 mb-6">
                          <h3 className="text-xl font-bold text-white mb-3">🎯 Ert "Varför"</h3>
                          <p className="text-xl text-white/90 italic">"{typedAnswers.premiumAnalysis.investorFilm.whyStatement}"</p>
                        </div>

                        {/* SORA AI Prompt */}
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6">
                          <h3 className="text-xl font-bold text-white mb-4">🤖 SORA AI Prompt (30 sekunder)</h3>
                          <div className="bg-black/30 rounded-xl p-4 mb-4">
                            <p className="text-green-400 font-mono text-sm leading-relaxed">
                              {typedAnswers.premiumAnalysis.investorFilm.soraPrompt}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(typedAnswers.premiumAnalysis.investorFilm.soraPrompt);
                              setCopiedPrompt(true);
                              setTimeout(() => setCopiedPrompt(false), 2000);
                            }}
                            className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg transition-colors flex items-center gap-2"
                          >
                            {copiedPrompt ? (
                              <>
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-green-400">Kopierad!</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span className="text-white/70">Kopiera prompt</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Script Structure */}
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6">
                          <h3 className="text-xl font-bold text-white mb-4">📝 Manusstruktur</h3>
                          <div className="space-y-3">
                            {typedAnswers.premiumAnalysis.investorFilm.scriptStructure.map((scene: any, i: number) => (
                              <div key={i} className="flex items-start gap-4 bg-black/20 rounded-lg p-4">
                                <div className="bg-purple-500/20 rounded-full px-3 py-1 text-sm font-bold text-purple-300">
                                  {scene.timeframe}
                                </div>
                                <div className="flex-1">
                                  <p className="text-white/90">{scene.content}</p>
                                  <p className="text-white/60 text-sm mt-1">Känsla: {scene.emotion}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Production Tips */}
                        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl p-6 border border-blue-500/40">
                          <h3 className="text-xl font-bold text-white mb-4">🎥 Produktionstips</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {typedAnswers.premiumAnalysis.investorFilm.productionTips.map((tip: any, i: number) => (
                              <div key={i} className="flex items-start gap-3">
                                <span className="text-blue-400 text-xl">{tip.icon}</span>
                                <div>
                                  <h4 className="text-white font-semibold">{tip.category}</h4>
                                  <p className="text-white/70 text-sm">{tip.tip}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <span className="text-6xl mb-4 block">🎬</span>
                        <p className="text-white/60 text-lg">Investerarfilm-koncept genereras när du uppgraderar till Premium</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Market Insights Section */}
              {expandedInsight === 'marknadsinsikter' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-8 backdrop-blur-lg border border-purple-500/20">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Marknadsinsikter</h2>
                    
                    {typedAnswers.premiumAnalysis?.marketInsights ? (
                      <>
                        {/* Market Size */}
                        <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-2xl p-6 border border-blue-500/40 mb-6">
                          <h3 className="text-xl font-bold text-white mb-4">Marknadsstorlek & Tillväxt</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                              <p className="text-white/60 text-sm mb-1">Nuvarande marknad</p>
                              <p className="text-3xl font-bold text-white">{typedAnswers.premiumAnalysis.marketInsights.marketSize.current}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-white/60 text-sm mb-1">Årlig tillväxt</p>
                              <p className="text-3xl font-bold text-green-400">{typedAnswers.premiumAnalysis.marketInsights.marketSize.growth}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-white/60 text-sm mb-1">Prognos 2027</p>
                              <p className="text-3xl font-bold text-blue-400">{typedAnswers.premiumAnalysis.marketInsights.marketSize.projected}</p>
                            </div>
                          </div>
                        </div>

                        {/* Key Trends */}
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6">
                          <h3 className="text-xl font-bold text-white mb-4">Viktiga Trender</h3>
                          <div className="space-y-4">
                            {typedAnswers.premiumAnalysis.marketInsights.keyTrends.map((trend: any, i: number) => (
                              <div key={i} className="bg-black/20 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                  <span className="text-3xl">{trend.icon}</span>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="text-lg font-bold text-white">{trend.name}</h4>
                                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        trend.impact === 'Hög' ? 'bg-red-500/20 text-red-300' :
                                        trend.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                        'bg-green-500/20 text-green-300'
                                      }`}>
                                        Impact: {trend.impact}
                                      </span>
                                    </div>
                                    <p className="text-white/80">{trend.description}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Competitive Dynamics */}
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                          <h3 className="text-xl font-bold text-white mb-4">Konkurrensdynamik</h3>
                          <div className="bg-black/20 rounded-xl p-4">
                            <p className="text-white/80 mb-4">{typedAnswers.premiumAnalysis.marketInsights.competitiveDynamics.overview}</p>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-white font-semibold mb-2">Marknadsledare:</h4>
                                <ul className="space-y-1">
                                  {typedAnswers.premiumAnalysis.marketInsights.competitiveDynamics.marketLeaders.map((leader: string, i: number) => (
                                    <li key={i} className="text-white/70 text-sm">• {leader}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="text-white font-semibold mb-2">Er positionering:</h4>
                                <p className="text-white/70 text-sm">{typedAnswers.premiumAnalysis.marketInsights.competitiveDynamics.yourPosition}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <span className="text-6xl mb-4 block">🔍</span>
                        <p className="text-white/60 text-lg">Marknadsinsikter genereras när du uppgraderar till Premium</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* AI Image Prompts Section - NEW */}
              {expandedInsight === 'ai-bildprompts' && typedAnswers.premiumAnalysis?.aiImagePrompts && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-8 backdrop-blur-lg border border-purple-500/20">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-3xl font-bold text-white">AI Bildgenerering för Marknadsföring</h2>
                      <button
                        onClick={() => setShowImagePromptsInfo(true)}
                        className="text-white/70 hover:text-white transition-colors"
                        title="Om AI bildgenerering"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>

                    {/* Info Modal */}
                    {showImagePromptsInfo && (
                      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowImagePromptsInfo(false)}>
                        <div className="bg-white rounded-2xl p-6 max-w-md" onClick={(e) => e.stopPropagation()}>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">🎨 Om AI Bildgenerering</h3>
                          <p className="text-gray-700 mb-4">
                            Använd ChatGPT DALL-E 3 eller Midjourney för att skapa professionella bilder för ert företag. 
                            Bilderna är designade för att förmedla rätt känsla till det limbiska systemet - utan text i bilderna.
                          </p>
                          <p className="text-gray-700 mb-4">
                            Perfekt för sociala medier, hemsidan, presentationer och marknadsföringsmaterial.
                          </p>
                          <button
                            onClick={() => setShowImagePromptsInfo(false)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Stäng
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Introduction */}
                    <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-6 border border-purple-500/30 mb-8">
                      <h3 className="text-xl font-bold text-white mb-3">🌟 Känslodriven Visuell Kommunikation</h3>
                      <p className="text-white/90 mb-3">
                        10 professionella AI-bildprompts anpassade för {typedAnswers.company_name || 'ert företag'}. 
                        Varje bild är noggrant utformad för att väcka rätt känslor hos er målgrupp och stärka ert varumärke.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-purple-500/30 rounded-full text-white/90 text-sm">Utan text i bilderna</span>
                        <span className="px-3 py-1 bg-pink-500/30 rounded-full text-white/90 text-sm">Limbiska systemet</span>
                        <span className="px-3 py-1 bg-blue-500/30 rounded-full text-white/90 text-sm">Sociala medier</span>
                        <span className="px-3 py-1 bg-green-500/30 rounded-full text-white/90 text-sm">Hemsida</span>
                      </div>
                    </div>

                    {/* Image Prompts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {typedAnswers.premiumAnalysis.aiImagePrompts.prompts.map((prompt: any, i: number) => (
                        <div key={i} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg">
                                <span className="text-2xl">{prompt.icon}</span>
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-white">{prompt.title}</h4>
                                <p className="text-white/60 text-sm">{prompt.usage}</p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              prompt.emotion === 'trust' ? 'bg-blue-500/20 text-blue-300' :
                              prompt.emotion === 'excitement' ? 'bg-orange-500/20 text-orange-300' :
                              prompt.emotion === 'innovation' ? 'bg-purple-500/20 text-purple-300' :
                              prompt.emotion === 'security' ? 'bg-green-500/20 text-green-300' :
                              'bg-pink-500/20 text-pink-300'
                            }`}>
                              {prompt.emotion}
                            </span>
                          </div>
                          
                          <div className="bg-black/30 rounded-xl p-4 mb-4">
                            <p className="text-green-400 text-sm font-mono leading-relaxed">
                              {prompt.prompt}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {prompt.keywords.map((keyword: string, j: number) => (
                                <span key={j} className="text-xs text-white/60 bg-white/5 px-2 py-1 rounded">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(prompt.prompt);
                                setCopiedImagePrompt(i);
                                setTimeout(() => setCopiedImagePrompt(null), 2000);
                              }}
                              className="p-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 transition-colors"
                              title="Kopiera prompt"
                            >
                              {copiedImagePrompt === i ? (
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Usage Guide */}
                    <div className="mt-8 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                      <h3 className="text-xl font-bold text-white mb-4">📚 Användningsguide</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/5 rounded-lg p-4">
                          <h4 className="text-white font-semibold mb-2">1. Kopiera Prompt</h4>
                          <p className="text-white/70 text-sm">Klicka på kopiera-ikonen för att kopiera en prompt till urklipp.</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <h4 className="text-white font-semibold mb-2">2. Använd AI-verktyg</h4>
                          <p className="text-white/70 text-sm">Klistra in i ChatGPT DALL-E 3, Midjourney eller liknande.</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <h4 className="text-white font-semibold mb-2">3. Publicera</h4>
                          <p className="text-white/70 text-sm">Använd bilderna på sociala medier, hemsida och i marknadsföring.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
      {/* Back button */}
      <button
        onClick={() => setCurrentSection('score')}
        className="mt-8 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all"
      >
        Tillbaka
      </button>
    </div>
  );
} 