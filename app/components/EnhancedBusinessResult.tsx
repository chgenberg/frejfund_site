'use client';
import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ActionableInsights from './ActionableInsights';
import EnhancedMobileResult from './EnhancedMobileResult';

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
      className={`p-6 rounded-2xl transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500' 
          : 'bg-white/5 border border-white/10 hover:bg-white/10'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{emoji}</span>
        <div className="w-16 h-16">
          <CircularProgressbar
            value={category.score}
            text={`${category.score}`}
            styles={buildStyles({
              textSize: '28px',
              pathColor: color,
              textColor: '#fff',
              trailColor: 'rgba(255, 255, 255, 0.1)',
            })}
          />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{category.label}</h3>
      <p className="text-sm text-white/60">{category.description}</p>
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
    <div className="bg-white/5 rounded-xl p-4">
      <p className="text-sm text-white/60 mb-1">{label}</p>
      <p className="text-xl font-semibold text-white">{formatValue()}</p>
    </div>
  );
};

export default function EnhancedBusinessResult({ data }: { data: ResultData }) {
  const [activeCategory, setActiveCategory] = useState('problemSolution');
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
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
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [data.overallScore]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Overall Score */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-8">Investeringsanalys!</h1>
          
          <div className="inline-block">
            <div className="w-48 h-48 relative">
              <CircularProgressbar
                value={animatedScore}
                text={`${animatedScore}`}
                styles={buildStyles({
                  textSize: '24px',
                  pathColor: getScoreColor(data.overallScore),
                  textColor: '#fff',
                  trailColor: 'rgba(255, 255, 255, 0.1)',
                  pathTransitionDuration: 2,
                })}
              />
              <div className="absolute -bottom-8 left-0 right-0 text-center">
                <p className="text-xl font-semibold text-white">
                  {data.overallScore >= 75 ? 'Investor Ready' :
                   data.overallScore >= 50 ? 'Stark Potential' :
                   data.overallScore >= 25 ? 'Lovande Start' : 'Tidigt Stadium'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {categories.map(([key, category]) => (
            <CategoryCard
              key={key}
              category={category}
              isActive={activeCategory === key}
              onClick={() => setActiveCategory(key)}
            />
          ))}
        </div>

        {/* Active Category Details */}
        <div className="bg-white/5 rounded-3xl border border-white/10 p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">{getScoreEmoji(activeData.score)}</span>
            <h2 className="text-2xl font-bold text-white">{activeData.label}</h2>
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
              <h3 className="text-xl font-semibold text-white mb-4">AI Insikter</h3>
              {activeData.insights.map((insight, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-white/90">{insight}</p>
                </div>
              ))}
            </div>
          )}

          {/* Premium Analysis Section */}
          {data.premiumAnalysis && activeCategory === 'problemSolution' && (
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/50">
              <h3 className="text-xl font-semibold text-white mb-4">🎯 Premium Analys</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">SWOT-analys</h4>
                  <p className="text-sm text-white/70">Detaljerad analys tillgänglig</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Benchmark</h4>
                  <p className="text-sm text-white/70">Branschjämförelser inkluderade</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actionable Insights Section - Full Width */}
        {data.actionableInsights && (
          <div className="mt-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">🎯 Action Plan for Higher Valuation</h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Concrete actions based on your analysis that increase your chances of getting funding
              </p>
            </div>
            <ActionableInsights insights={data.actionableInsights} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
            Download report
          </button>
          <button className="px-8 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all">
            Dela resultat
          </button>
        </div>
      </div>
    </div>
  );
} 