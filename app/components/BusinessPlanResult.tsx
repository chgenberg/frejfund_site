"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import AuthModal from './AuthModal';
import { supabase } from '../../lib/supabase';

interface ResultProps {
  score: number;
  answers: Record<string, unknown>;
  feedback?: Record<string, string>;
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
  const [currentSection, setCurrentSection] = useState<'score' | 'insights' | 'actions' | 'market' | 'financial' | 'ai'>('score');
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showActionModal, setShowActionModal] = useState<any>(null);
  const [showSoraInfo, setShowSoraInfo] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [showImagePromptsInfo, setShowImagePromptsInfo] = useState(false);
  const [copiedImagePrompt, setCopiedImagePrompt] = useState<number | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [user, setUser] = useState<any>(null);
  const [saveMessage, setSaveMessage] = useState<string>('');
  
  const scoreInfo = getScoreInfo(score);
  const typedAnswers = answers as Record<string, any>;

  // Check if user is logged in
  useEffect(() => {
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

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

  const handleSaveAnalysis = async () => {
    // Check if user is logged in
    if (!user) {
      setAuthMode('signup');
      setShowAuthModal(true);
      return;
    }

    try {
      const response = await fetch('/api/save-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: typedAnswers.company_name || typedAnswers.company || 'Företag',
          industry: typedAnswers.industry || typedAnswers.bransch || 'Bransch',
          score,
          answers: typedAnswers,
          insights: insights.map(i => ({
            title: i.title,
            strength: i.strength,
            content: i.content
          })),
          actionItems,
          isPremium: false,
          premiumAnalysis: typedAnswers.premiumAnalysis
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Show success message
        console.log('Analysis saved successfully');
        setSaveMessage('✅ Analysen har sparats');
      } else {
        console.error('Error saving analysis');
        setSaveMessage('❌ Det gick inte att spara analysen');
      }
    } catch (error) {
      console.error('Error saving analysis:', error);
      setSaveMessage('❌ Det gick inte att spara analysen');
    }
  };

  return (
    <div className="min-h-screen bg-[#04111d] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentSection === 'score' ? (
          <>
            {/* Score Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Din Affärsplan</h1>
              <div className="inline-block">
                <div className="w-48 h-48 mx-auto">
                  <CircularProgressbar
                    value={animatedScore}
                    text={`${animatedScore}%`}
                    styles={buildStyles({
                      pathColor: scoreInfo.color,
                      textColor: scoreInfo.color,
                      trailColor: 'rgba(255, 255, 255, 0.1)',
                    })}
                  />
                </div>
                <p className="text-xl font-semibold mt-4">{scoreInfo.label}</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setCurrentSection('score')}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
              >
                📊 Poäng & Analys
              </button>
              <button
                onClick={() => setCurrentSection('insights')}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
              >
                💡 Insikter & Rekommendationer
              </button>
              <button
                onClick={() => setCurrentSection('actions')}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
              >
                🎯 Nästa Steg
              </button>
              <button
                onClick={() => setCurrentSection('market')}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
              >
                📈 Marknadsanalys
              </button>
              <button
                onClick={() => setCurrentSection('financial')}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
              >
                💰 Finansiell Analys
              </button>
              <button
                onClick={() => setCurrentSection('ai')}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
              >
                🎨 AI Bildgenerering
              </button>
            </div>

            {/* Save Message */}
            {saveMessage && (
              <div className={`mt-4 px-6 py-3 rounded-full text-white font-medium animate-fadeIn ${
                saveMessage.includes('✅') 
                  ? 'bg-green-500/30 border border-green-500/50' 
                  : 'bg-red-500/30 border border-red-500/50'
              }`}>
                {saveMessage}
              </div>
            )}

            {/* Smart CTA for creating account if not logged in */}
            {!user && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl border border-blue-500/30">
                <h3 className="text-xl font-bold text-white mb-3">💾 Spara din analys</h3>
                <p className="text-white/80 mb-4">
                  Skapa ett gratis konto för att spara din analys och få tillgång till din personliga dashboard.
                </p>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setShowAuthModal(true);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
                >
                  Skapa konto & spara analys
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
        ) : currentSection === 'actions' ? (
          <>
            {/* Action Items Section */}
            <h1 className="text-3xl font-bold text-white mb-8">Nästa Steg</h1>
            <div className="space-y-6">
              {actionItems.map((item) => (
                <div key={item.title} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/80">{item.description}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setCurrentSection('score')}
              className="mt-8 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all"
            >
              Tillbaka
            </button>
          </>
        ) : currentSection === 'market' ? (
          <>
            {/* Market Analysis Section */}
            <h1 className="text-3xl font-bold text-white mb-8">Marknadsanalys</h1>
            <div className="space-y-6">
              {/* Market Size */}
              <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-2xl p-6 border border-blue-500/40 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Marknadsstorlek & Tillväxt</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-white/60 text-sm mb-1">Nuvarande marknad</p>
                    <p className="text-3xl font-bold text-white">{typedAnswers.market_size}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/60 text-sm mb-1">Årlig tillväxt</p>
                    <p className="text-3xl font-bold text-green-400">15%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/60 text-sm mb-1">Prognos 2027</p>
                    <p className="text-3xl font-bold text-blue-400">{typedAnswers.market_size * 1.75}</p>
                  </div>
                </div>
              </div>

              {/* Key Trends */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Viktiga Trender</h3>
                <div className="space-y-4">
                  {[
                    { icon: '🚀', name: 'Digital Transformation', impact: 'Hög', description: 'Snabb övergång till digitala lösningar' },
                    { icon: '🌍', name: 'Globalisering', impact: 'Medium', description: 'Ökad internationell konkurrens' },
                    { icon: '🤖', name: 'AI & Automatisering', impact: 'Hög', description: 'AI-drivna lösningar blir standard' }
                  ].map((trend, i) => (
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

              {/* Competitive Analysis */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Konkurrensdynamik</h3>
                <div className="bg-black/20 rounded-xl p-4">
                  <p className="text-white/80 mb-4">
                    Marknaden är i en fas av snabb tillväxt med flera nyckelspelare som konkurrerar om marknadsandelar.
                    Er positionering fokuserar på unika värdeerbjudanden och teknologisk innovation.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-white font-semibold mb-2">Marknadsledare:</h4>
                      <ul className="space-y-1">
                        <li className="text-white/70 text-sm">• Etablerade företag med stor marknadsandel</li>
                        <li className="text-white/70 text-sm">• Tech-jättar som expanderar</li>
                        <li className="text-white/70 text-sm">• Innovativa startups</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Er positionering:</h4>
                      <p className="text-white/70 text-sm">
                        Unik kombination av teknologisk innovation och kundfokus, med potential att ta marknadsandelar från etablerade spelare.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : currentSection === 'financial' ? (
          <>
            {/* Financial Analysis Section */}
            <h1 className="text-3xl font-bold text-white mb-8">Finansiell Analys</h1>
            <div className="space-y-6">
              {/* Financial Projections */}
              <div className="bg-gradient-to-r from-green-600/30 to-blue-600/30 rounded-2xl p-6 border border-green-500/40 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">3-års Finansiell Prognos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-white/60 text-sm mb-1">År 1</p>
                    <p className="text-3xl font-bold text-white">5 MSEK</p>
                    <p className="text-white/60 text-sm">Intäkter</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/60 text-sm mb-1">År 2</p>
                    <p className="text-3xl font-bold text-white">25 MSEK</p>
                    <p className="text-white/60 text-sm">Intäkter</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/60 text-sm mb-1">År 3</p>
                    <p className="text-3xl font-bold text-white">75 MSEK</p>
                    <p className="text-white/60 text-sm">Intäkter</p>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Viktiga Finansiella Nyckeltal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-black/20 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-2">Lönsamhet</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-white/70">Bruttomarginal</span>
                        <span className="text-white font-semibold">65%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-white/70">EBITDA-marginal</span>
                        <span className="text-white font-semibold">25%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-white/70">Rörelsemarginal</span>
                        <span className="text-white font-semibold">20%</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-black/20 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-2">Efficiency</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-white/70">CAC</span>
                        <span className="text-white font-semibold">15 000 SEK</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-white/70">LTV</span>
                        <span className="text-white font-semibold">75 000 SEK</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-white/70">LTV:CAC Ratio</span>
                        <span className="text-white font-semibold">5:1</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : currentSection === 'ai' ? (
          <>
            {/* AI Image Generation Section */}
            <h1 className="text-3xl font-bold text-white mb-8">AI Bildgenerering för Marknadsföring</h1>
            <div className="space-y-6">
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
                {[
                  {
                    icon: '🎯',
                    title: 'Vision & Mål',
                    usage: 'Hemsida & Presentationer',
                    emotion: 'trust',
                    prompt: 'Professional business visualization showing growth and success, minimalist design, corporate colors, high-end photography style',
                    keywords: ['professional', 'growth', 'success', 'minimalist']
                  },
                  {
                    icon: '💡',
                    title: 'Innovation',
                    usage: 'Sociala Medier',
                    emotion: 'excitement',
                    prompt: 'Cutting-edge technology visualization, abstract representation of innovation, modern design, vibrant colors',
                    keywords: ['innovation', 'technology', 'modern', 'vibrant']
                  }
                ].map((prompt, i) => (
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
          </>
        ) : null}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
        onSuccess={handleSaveAnalysis}
      />
    </div>
  );
} 