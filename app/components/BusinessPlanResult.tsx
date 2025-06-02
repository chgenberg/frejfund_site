import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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

// Helper to safely render values in JSX
function safeRender(value: any) {
  if (typeof value === 'string' || typeof value === 'number') return value;
  if (value === null || value === undefined) return '';
  if (Array.isArray(value) || typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export default function BusinessPlanResult({ score, answers, feedback = {} }: ResultProps) {
  const router = useRouter();
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
              <p className="text-white/70">{safeRender(typedAnswers.customer_problem)}</p>
            </div>
          )}
          {typedAnswers.solution && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Er Lösning</h4>
              <p className="text-white/70">{safeRender(typedAnswers.solution)}</p>
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
              <h4 className="font-semibold text-white/90 mb-2">Marknadsstorlek</h4>
              <p className="text-white/70">{safeRender(typedAnswers.market_size)}</p>
            </div>
          )}
          {typedAnswers.target_customer && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Målgrupp</h4>
              <p className="text-white/70">{safeRender(typedAnswers.target_customer)}</p>
            </div>
          )}
          {typedAnswers.competitors && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Konkurrenssituation</h4>
              <p className="text-white/70">{safeRender(typedAnswers.competitors)}</p>
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
              <h4 className="font-semibold text-white/90 mb-2">Intäktsmodell</h4>
              <p className="text-white/70">{safeRender(typedAnswers.revenue_model)}</p>
            </div>
          )}
          {typedAnswers.pricing && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Prissättning</h4>
              <p className="text-white/70">{safeRender(typedAnswers.pricing)}</p>
            </div>
          )}
          {typedAnswers.unit_economics && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Enhetsekonomi</h4>
              <p className="text-white/70">{safeRender(typedAnswers.unit_economics)}</p>
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
              <h4 className="font-semibold text-white/90 mb-2">Nuvarande Traction</h4>
              <p className="text-white/70">{safeRender(typedAnswers.traction)}</p>
            </div>
          )}
          {Array.isArray(milestones) && milestones.length > 0 && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Milestolpar</h4>
              <div className="space-y-2">
                {milestones.map((milestone: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-white/70">{safeRender(milestone.milestone)}</span>
                    <span className="text-white/50 text-sm">{safeRender(milestone.date)}</span>
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
              <h4 className="font-semibold text-white/90 mb-2">Teamet</h4>
              <p className="text-white/70">{safeRender(typedAnswers.team)}</p>
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
              <p className="text-white/70">{safeRender(founderFit.text)}</p>
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
              <h4 className="font-semibold text-white/90 mb-2">Kapitalbehov: {safeRender(capitalBlock.amount)} MSEK</h4>
              <div className="space-y-2 mt-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Produktutveckling</span>
                  <span className="text-white/90">{safeRender(capitalBlock.product)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Försäljning & Marketing</span>
                  <span className="text-white/90">{safeRender(capitalBlock.sales)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Team</span>
                  <span className="text-white/90">{safeRender(capitalBlock.team)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Övrigt</span>
                  <span className="text-white/90">{safeRender(capitalBlock.other)}%</span>
                </div>
              </div>
            </div>
          )}
          {typedAnswers.runway && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Runway</h4>
              <p className="text-white/70">{safeRender(typedAnswers.runway)} månader med nuvarande burn rate</p>
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
              <h4 className="font-semibold text-white/90 mb-2">Identifierade Risker</h4>
              <p className="text-white/70">{safeRender(typedAnswers.risks)}</p>
            </div>
          )}
          {typedAnswers.moat && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Konkurrensfördel (Moat)</h4>
              <p className="text-white/70">{safeRender(typedAnswers.moat)}</p>
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
              <h4 className="font-semibold text-white/90 mb-2">Exit Plan</h4>
              <p className="text-white/70">{safeRender(typedAnswers.exit_strategy)}</p>
            </div>
          )}
          {typedAnswers.exit_potential && (
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-white/90 mb-2">Potentiella Köpare</h4>
              <p className="text-white/70">{safeRender(typedAnswers.exit_potential)}</p>
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

              {/* Upgrade CTA */}
              <div className="mt-12 p-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl border border-purple-500/30">
                <h3 className="text-2xl font-bold text-white mb-4">🚀 Få Premium AI-Analys</h3>
                <p className="text-white/80 mb-6">
                  Lås upp 50+ sidor djupgående analys, branschspecifika insikter, finansiella projektioner och mycket mer!
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { icon: '📊', text: '50+ sidor analys' },
                    { icon: '🎯', text: 'Branschjämförelser' },
                    { icon: '📈', text: '3-års prognos' },
                    { icon: '📞', text: 'Expertsamtal' }
                  ].map((feature, i) => (
                    <div key={i} className="text-center">
                      <div className="text-3xl mb-2">{feature.icon}</div>
                      <div className="text-white/70 text-sm">{feature.text}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleUpgrade}
                  className="px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-full hover:shadow-xl hover:scale-105 transition-all"
                >
                  Uppgradera för 197 kr →
                </button>
              </div>
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
          ) : null}
        </div>
      </div>
    </div>
  );
} 