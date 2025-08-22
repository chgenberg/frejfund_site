'use client';
import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ActionableInsights from './ActionableInsights';
import EnhancedMobileResult from './EnhancedMobileResult';

// Modal component for high-score investor referral
const InvestorReferralModal = ({ isOpen, onClose, onAccept, companyName, score }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative max-w-lg w-full wizard-card rounded-3xl p-8 animate-slideUp">
        {/* Confetti effect */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <div className="text-6xl animate-bounce">🎉</div>
        </div>
        
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Congratulations!
          </h2>
          
          <div className="space-y-4">
            <p className="text-lg text-white">
              You scored an impressive <span className="font-bold text-2xl text-green-400">{score}/100</span>!
            </p>
            
            <p className="text-gray-300 leading-relaxed">
              Your business shows exceptional investment potential. Would you like us to share your contact information with Sweden's leading angel investor networks?
            </p>
            
            <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20">
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">It's completely free.</span> We'll send your analysis summary to our network partners. We can only guarantee they'll receive your information - the rest is up to you!
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-2xl bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-all"
            >
              No, thanks
            </button>
            <button
              onClick={onAccept}
              className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold transition-all shadow-lg shadow-green-500/25"
            >
              Yes, share my info! 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ActionableInsight {
  title: string;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  description: string;
  implementation: string[];
  expectedResult: string;
  investorPerspective: string;
}

interface CategoryScore {
  score: number;
  label: string;
  description: string;
  metrics?: Record<string, any>;
  insights?: string[];
}

interface ResultData {
  overallScore: number;
  companyContext?: string[];
  categories: {
    problemSolution: CategoryScore;
    marketTiming: CategoryScore;
    moatCompetition: CategoryScore;
    tractionKpi: CategoryScore;
    unitEconomics: CategoryScore;
    teamExecution: CategoryScore;
    financialHealth: CategoryScore;
    riskCompliance: CategoryScore;
    storytellingDeck: CategoryScore;
  };
  premiumAnalysis?: any;
  actionableInsights?: ActionableInsight[];
}

const getScoreEmoji = (score: number) => {
  if (score >= 75) return '🚀';
  if (score >= 50) return '⭐';
  if (score >= 25) return '💡';
  return '🔨';
};

const getScoreColor = (score: number) => {
  if (score >= 75) return '#10B981';
  if (score >= 50) return '#F59E0B';
  if (score >= 25) return '#EF4444';
  return '#6B7280';
};

const CategoryCard = ({ category, isActive, onClick }: any) => {
  const emoji = getScoreEmoji(category.score);
  const color = getScoreColor(category.score);

  return (
    <button
      onClick={onClick}
      className={`category-badge p-6 rounded-3xl transition-all duration-300 relative overflow-hidden group h-44 w-full ${
        isActive 
          ? 'scale-105 border-white/30' 
          : 'hover:scale-[1.02]'
      }`}
    >
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse"></div>
      )}
      
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">{emoji}</span>
          </div>
          <div className="w-14 h-14 flex-shrink-0">
            <CircularProgressbar
              value={category.score}
              text={`${category.score}`}
              styles={buildStyles({
                textSize: '26px',
                pathColor: color,
                textColor: '#fff',
                trailColor: 'rgba(255, 255, 255, 0.1)',
              })}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-start">
          <h3 className="text-lg font-semibold text-white mb-1 text-left line-clamp-1">{category.label}</h3>
          <p className="text-sm text-gray-400 text-left line-clamp-2">{category.description}</p>
        </div>
      </div>
    </button>
  );
};

const MetricDisplay = ({ label, value, type = 'text' }: any) => {
  const formatValue = () => {
    if (type === 'currency') return `€${value.toLocaleString()}`;
    if (type === 'percentage') return `${value}%`;
    if (type === 'number') return value.toLocaleString();
    return value;
  };

  return (
    <div className="score-card rounded-2xl p-5 group hover:scale-[1.02] transition-all">
      <p className="text-sm text-gray-400 mb-2 group-hover:text-gray-300">{label}</p>
      <p className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
        {formatValue()}
      </p>
    </div>
  );
};

export default function EnhancedBusinessResult({ data }: { data: ResultData }) {
  const [activeCategory, setActiveCategory] = useState('problemSolution');
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [hasShownReferral, setHasShownReferral] = useState(false);
  
  const categories = Object.entries(data.categories);
  const activeData = data.categories[activeCategory as keyof typeof data.categories];

  useEffect(() => {
    let start = 0;
    const increment = data.overallScore / 50;
    const timer = setInterval(() => {
      start += increment;
      if (start >= data.overallScore) {
        setAnimatedScore(data.overallScore);
        clearInterval(timer);
        
        // Show referral modal for high scores after animation completes
        if (data.overallScore >= 80 && !hasShownReferral) {
          setTimeout(() => {
            setIsReferralModalOpen(true);
            setHasShownReferral(true);
          }, 1500); // Wait 1.5 seconds after score animation
        }
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [data.overallScore, hasShownReferral]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hide navbar on result pages
  useEffect(() => {
    const navbar = document.querySelector('[data-navbar]') as HTMLElement;
    const main = document.querySelector('main') as HTMLElement;
    
    if (navbar) {
      navbar.style.display = 'none';
    }
    
    if (main) {
      main.style.paddingTop = '0';
    }
    
    // Cleanup - show navbar and restore padding when component unmounts
    return () => {
      if (navbar) {
        navbar.style.display = '';
      }
      if (main) {
        main.style.paddingTop = '';
      }
    };
  }, []);

  if (isMobile) {
    return <EnhancedMobileResult data={data} />;
  }

  const handleReferralAccept = async () => {
    try {
      // Get user data from localStorage or data prop
      const userInfo = JSON.parse(localStorage.getItem('latestUserInfo') || '{}');
      
      const response = await fetch('/api/investor-referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: userInfo.name || userInfo.companyName || 'Company',
          contactEmail: userInfo.email || '',
          contactName: userInfo.founderName || userInfo.name || '',
          score: data.overallScore,
          analysisData: data
        })
      });

      if (response.ok) {
        setIsReferralModalOpen(false);
        // Show success notification
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 z-50 p-4 bg-green-500 text-white rounded-2xl shadow-lg animate-slideUp';
        successDiv.innerHTML = '✅ Successfully shared with investor networks!';
        document.body.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 5000);
      } else {
        throw new Error('Failed to send referral');
      }
    } catch (error) {
      console.error('Referral error:', error);
      alert('Sorry, there was an error sending your referral. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Overall Score */}
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
            Investment Analysis! ✨
          </h1>
          
          {/* Company Context */}
          {data.companyContext && data.companyContext.length > 0 && (
            <div className="max-w-2xl mx-auto mb-8 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center justify-center">
                <span className="mr-2">🏢</span> Company Context
              </h2>
              <ul className="space-y-2 text-left">
                {data.companyContext.map((point: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-2"></span>
                    <span className="text-white/80 text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="inline-block">
            <div className="w-48 h-48 relative">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/30 to-pink-600/30 blur-2xl animate-pulse-soft"></div>
              
              <CircularProgressbar
                value={animatedScore}
                text={`${animatedScore}`}
                styles={buildStyles({
                  textSize: '28px',
                  pathColor: getScoreColor(data.overallScore),
                  textColor: '#fff',
                  trailColor: 'rgba(255, 255, 255, 0.1)',
                  pathTransitionDuration: 2,
                })}
              />
              <div className="absolute -bottom-16 left-0 right-0 text-center">
                <p className="text-2xl font-bold text-white mb-1">
                  {data.overallScore >= 75 ? '🚀 Investor Ready' :
                   data.overallScore >= 50 ? '⭐ Strong Potential' :
                   data.overallScore >= 25 ? '💡 Promising Start' : '🔨 Early Stage'}
                </p>
                <p className="text-sm text-gray-400">
                  Overall Investment Score
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 mt-20">
          {categories.map(([key, category], index) => (
            <div key={key} className={`animate-fadeInUp-delay-${index % 3 + 1}`}>
              <CategoryCard
                category={category}
                isActive={activeCategory === key}
                onClick={() => setActiveCategory(key)}
              />
            </div>
          ))}
        </div>

        {/* Active Category Details */}
        <div className="result-card rounded-3xl p-8 animate-fadeInUp">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse-soft">
              <span className="text-3xl">{getScoreEmoji(activeData.score)}</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">{activeData.label}</h2>
              <p className="text-gray-400 mt-1">{activeData.description}</p>
            </div>
          </div>

          {/* Metrics Grid */}
          {activeData.metrics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {Object.entries(activeData.metrics).map(([key, value]: [string, any]) => (
                <MetricDisplay
                  key={key}
                  label={key.replace(/([A-Z])/g, ' $1').trim()}
                  value={value.value}
                  type={value.type}
                />
              ))}
            </div>
          )}

          {/* Insights */}
          {activeData.insights && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">AI Insights 🧠</h3>
              {activeData.insights.map((insight, index) => (
                <div key={index} className="score-card rounded-2xl p-5 hover:scale-[1.02] transition-transform">
                  <p className="text-white/90 leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          )}

          {/* Premium Analysis Section */}
          {data.premiumAnalysis && activeCategory === 'problemSolution' && (
            <div className="mt-8 result-card rounded-3xl p-8 bg-gradient-to-r from-purple-600/10 to-pink-600/10 animate-fadeInUp">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">🎯</span> Premium Analysis Available
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="score-card rounded-2xl p-6 hover:scale-[1.02] transition-all">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h4 className="font-semibold text-white mb-2">SWOT Analysis</h4>
                  <p className="text-sm text-gray-400">Complete strategic analysis</p>
                </div>
                <div className="score-card rounded-2xl p-6 hover:scale-[1.02] transition-all">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                    <span className="text-2xl">📈</span>
                  </div>
                  <h4 className="font-semibold text-white mb-2">Industry Benchmarks</h4>
                  <p className="text-sm text-gray-400">Compare against competitors</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actionable Insights Section - Full Width */}
        {data.actionableInsights && (
          <div className="mt-16 animate-fadeInUp-delay-1">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                Action Plan for Higher Valuation 🎯
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Concrete actions that will significantly increase your chances of securing funding
              </p>
            </div>
            <ActionableInsights insights={data.actionableInsights} />
          </div>
        )}

        {/* Deep Analysis CTA */}
        <div className="mt-16 text-center animate-fadeInUp-delay-2">
          <div className="result-card rounded-3xl p-10 bg-gradient-to-r from-blue-600/10 to-purple-600/10 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mb-6 animate-pulse-soft">
              <span className="text-4xl">🧠</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Want Even More Specific Recommendations?</h3>
            <p className="text-lg text-gray-400 mb-8">
              Get ultra-personalized, actionable advice tailored to your exact business situation 
              <br />Answer 8 focused questions and receive actionable insights worth $1000s.
            </p>
            <button 
              onClick={() => window.location.href = '/deep-analysis-wizard'}
              className="gradient-button px-10 py-5 text-white font-bold rounded-2xl hover:scale-105 transition-all text-lg inline-flex items-center space-x-3"
            >
              <span className="text-2xl">🎯</span>
              <span>Get Deep Analysis</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-6 pb-8">
          <button className="gradient-button px-8 py-4 text-white font-semibold rounded-2xl hover:scale-105 transition-all inline-flex items-center space-x-2">
            <span>📄</span>
            <span>Download Report</span>
          </button>
          <button className="result-card px-8 py-4 text-white font-semibold rounded-2xl hover:scale-105 transition-all inline-flex items-center space-x-2">
            <span>🔗</span>
            <span>Share Results</span>
          </button>
        </div>
      </div>

      {/* Investor Referral Modal */}
      {data.overallScore >= 80 && (
        <InvestorReferralModal
          isOpen={isReferralModalOpen}
          onClose={() => setIsReferralModalOpen(false)}
                     onAccept={handleReferralAccept}
           companyName={JSON.parse(localStorage.getItem('latestUserInfo') || '{}').name || 'Your Company'}
           score={animatedScore}
        />
      )}
    </div>
  );
} 