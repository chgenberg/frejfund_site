'use client';
import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ActionableInsights from './ActionableInsights';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChartBarIcon, 
  LightBulbIcon, 
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  SparklesIcon,
  DocumentTextIcon,
  BanknotesIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

// Define interfaces
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
  analysis?: {
    executiveSummary?: string;
    investmentThesis?: string;
    marketOpportunity?: string;
    redFlags?: string[];
    competitiveThreats?: string[];
    realityCheck?: string;
  };
  actionableInsights?: any[];
  userInfo?: {
    name?: string;
    email?: string;
  };
}

// Tab definitions
const tabs = [
  { id: 'overview', label: 'Overview', icon: ChartBarIcon },
  { id: 'insights', label: 'Action Plan', icon: LightBulbIcon },
  { id: 'scores', label: 'Score Breakdown', icon: ArrowTrendingUpIcon },
  { id: 'risks', label: 'Risks & Reality Check', icon: ExclamationTriangleIcon },
  { id: 'financials', label: 'Financial Analysis', icon: CurrencyDollarIcon },
];

// Score color function
const getScoreColor = (score: number) => {
  if (score >= 80) return 'from-green-400 to-emerald-500';
  if (score >= 60) return 'from-blue-400 to-cyan-500';
  if (score >= 40) return 'from-yellow-400 to-orange-500';
  return 'from-red-400 to-pink-500';
};

const getScoreEmoji = (score: number) => {
  if (score >= 80) return '🚀';
  if (score >= 60) return '💪';
  if (score >= 40) return '🔧';
  return '🚨';
};

// Category icons
const categoryIcons: Record<string, any> = {
  problemSolution: SparklesIcon,
  marketTiming: ArrowTrendingUpIcon,
  moatCompetition: ShieldCheckIcon,
  tractionKpi: ChartBarIcon,
  unitEconomics: BanknotesIcon,
  teamExecution: UserGroupIcon,
  financialHealth: CurrencyDollarIcon,
  riskCompliance: ShieldCheckIcon,
  storytellingDeck: DocumentTextIcon,
};

export default function InteractiveBusinessResult({ data, userInfo }: { data: ResultData; userInfo?: any }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleDetails = (key: string) => {
    setShowDetails(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Mobile tab navigation
  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  const canGoNext = currentTabIndex < tabs.length - 1;
  const canGoPrev = currentTabIndex > 0;

  const goToNextTab = () => {
    if (canGoNext) setActiveTab(tabs[currentTabIndex + 1].id);
  };

  const goToPrevTab = () => {
    if (canGoPrev) setActiveTab(tabs[currentTabIndex - 1].id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-gray-900/80 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Investment Analysis Report
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-4xl">{getScoreEmoji(data.overallScore)}</span>
              <div className="text-right">
                <div className="text-sm text-gray-400">Overall Score</div>
                <div className="text-3xl font-bold text-white">{data.overallScore}/100</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Desktop */}
      {!isMobile && (
        <div className="sticky top-[73px] z-30 backdrop-blur-xl bg-gray-900/60 border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex gap-1 py-2 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap
                      ${activeTab === tab.id 
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Tab Navigation - Mobile */}
      {isMobile && (
        <div className="sticky top-[73px] z-30 backdrop-blur-xl bg-gray-900/80 border-b border-purple-500/20">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={goToPrevTab}
              disabled={!canGoPrev}
              className={`p-2 rounded-lg ${canGoPrev ? 'text-purple-400' : 'text-gray-600'}`}
            >
              <ChevronRightIcon className="w-5 h-5 rotate-180" />
            </button>
            
            <div className="flex items-center gap-2">
              {tabs.map((tab, index) => (
                <div
                  key={tab.id}
                  className={`
                    h-2 rounded-full transition-all
                    ${index === currentTabIndex ? 'w-8 bg-purple-500' : 'w-2 bg-gray-600'}
                  `}
                />
              ))}
            </div>

            <button
              onClick={goToNextTab}
              disabled={!canGoNext}
              className={`p-2 rounded-lg ${canGoNext ? 'text-purple-400' : 'text-gray-600'}`}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="px-4 pb-3 text-center">
            <div className="flex items-center justify-center gap-2">
              {React.createElement(tabs[currentTabIndex].icon, { className: "w-5 h-5 text-purple-400" })}
              <span className="text-white font-medium">{tabs[currentTabIndex].label}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Company Context */}
                {data.companyContext && data.companyContext.length > 0 && (
                  <div className="wizard-card p-6 rounded-2xl">
                    <h2 className="text-xl font-bold text-white mb-4">Company Snapshot</h2>
                    <ul className="space-y-2">
                      {data.companyContext.map((point, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-purple-400 mt-1">•</span>
                          <span className="text-gray-300">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Executive Summary */}
                {data.analysis?.executiveSummary && (
                  <div className="wizard-card p-6 rounded-2xl">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <DocumentTextIcon className="w-6 h-6 text-purple-400" />
                      Executive Summary
                    </h2>
                    <p className="text-gray-300 leading-relaxed">{data.analysis.executiveSummary}</p>
                  </div>
                )}

                {/* Score Overview Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(data.categories).slice(0, 3).map(([key, category]) => {
                    const Icon = categoryIcons[key];
                    return (
                      <motion.div
                        key={key}
                        whileHover={{ scale: 1.02 }}
                        className="wizard-card p-6 rounded-2xl cursor-pointer"
                        onClick={() => setActiveTab('scores')}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <Icon className="w-8 h-8 text-purple-400" />
                          <span className={`text-2xl font-bold bg-gradient-to-r ${getScoreColor(category.score)} bg-clip-text text-transparent`}>
                            {category.score}
                          </span>
                        </div>
                        <h3 className="font-semibold text-white mb-1">{category.label}</h3>
                        <p className="text-sm text-gray-400 line-clamp-2">{category.description}</p>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Investment Thesis */}
                {data.analysis?.investmentThesis && (
                  <div className="wizard-card p-6 rounded-2xl border-2 border-purple-500/20">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <FireIcon className="w-6 h-6 text-orange-400" />
                      Investment Thesis
                    </h2>
                    <p className="text-gray-300 leading-relaxed">{data.analysis.investmentThesis}</p>
                  </div>
                )}
              </div>
            )}

            {/* Action Plan Tab */}
            {activeTab === 'insights' && (
              <div className="space-y-6">
                <div className="wizard-card p-6 rounded-2xl">
                  <h2 className="text-2xl font-bold text-white mb-2">Your Action Plan</h2>
                  <p className="text-gray-400 mb-6">Prioritized steps to maximize your investment potential</p>
                  
                  {data.actionableInsights && data.actionableInsights.length > 0 ? (
                    <ActionableInsights insights={data.actionableInsights} />
                  ) : (
                    <p className="text-gray-500">No actionable insights available.</p>
                  )}
                </div>
              </div>
            )}

            {/* Score Breakdown Tab */}
            {activeTab === 'scores' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(data.categories).map(([key, category]) => {
                    const Icon = categoryIcons[key];
                    const isExpanded = showDetails[key];
                    
                    return (
                      <motion.div
                        key={key}
                        layout
                        className="wizard-card p-6 rounded-2xl"
                      >
                        <div 
                          className="cursor-pointer"
                          onClick={() => toggleDetails(key)}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Icon className="w-8 h-8 text-purple-400" />
                              <div>
                                <h3 className="font-bold text-white text-lg">{category.label}</h3>
                                <div className={`text-3xl font-bold bg-gradient-to-r ${getScoreColor(category.score)} bg-clip-text text-transparent`}>
                                  {category.score}/100
                                </div>
                              </div>
                            </div>
                            <ChevronRightIcon 
                              className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                            />
                          </div>
                          
                          <p className="text-gray-300 text-sm">{category.description}</p>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-4 pt-4 border-t border-gray-700">
                                {category.insights && category.insights.length > 0 && (
                                  <div className="space-y-2">
                                    <h4 className="font-semibold text-white mb-2">Key Insights:</h4>
                                    {category.insights.map((insight, idx) => (
                                      <div key={idx} className="flex items-start gap-2">
                                        <span className="text-purple-400 mt-1">→</span>
                                        <span className="text-gray-300 text-sm">{insight}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {category.metrics && Object.keys(category.metrics).length > 0 && (
                                  <div className="mt-4">
                                    <h4 className="font-semibold text-white mb-2">Metrics:</h4>
                                    <div className="space-y-1">
                                      {Object.entries(category.metrics).map(([metric, value]) => (
                                        <div key={metric} className="flex justify-between text-sm">
                                          <span className="text-gray-400">{metric}:</span>
                                          <span className="text-white font-medium">{String(value)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Risks & Reality Check Tab */}
            {activeTab === 'risks' && (
              <div className="space-y-6">
                {/* Red Flags */}
                {data.analysis?.redFlags && data.analysis.redFlags.length > 0 && (
                  <div className="wizard-card p-6 rounded-2xl border-2 border-red-500/20">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
                      Critical Red Flags
                    </h2>
                    <div className="space-y-3">
                      {data.analysis.redFlags.map((flag, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg">
                          <span className="text-red-400 font-bold mt-0.5">{index + 1}.</span>
                          <span className="text-gray-300">{flag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Competitive Threats */}
                {data.analysis?.competitiveThreats && data.analysis.competitiveThreats.length > 0 && (
                  <div className="wizard-card p-6 rounded-2xl">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <ShieldCheckIcon className="w-6 h-6 text-orange-400" />
                      Competitive Threats
                    </h2>
                    <div className="space-y-3">
                      {data.analysis.competitiveThreats.map((threat, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <span className="text-orange-400 mt-1">⚠️</span>
                          <span className="text-gray-300">{threat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reality Check */}
                {data.analysis?.realityCheck && (
                  <div className="wizard-card p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-pink-900/20">
                    <h2 className="text-xl font-bold text-white mb-4">🔍 Reality Check</h2>
                    <p className="text-gray-300 leading-relaxed">{data.analysis.realityCheck}</p>
                  </div>
                )}
              </div>
            )}

            {/* Financial Analysis Tab */}
            {activeTab === 'financials' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Unit Economics */}
                  <div className="wizard-card p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <BanknotesIcon className="w-6 h-6 text-green-400" />
                      Unit Economics
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Score</span>
                        <span className={`text-2xl font-bold bg-gradient-to-r ${getScoreColor(data.categories.unitEconomics.score)} bg-clip-text text-transparent`}>
                          {data.categories.unitEconomics.score}/100
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{data.categories.unitEconomics.description}</p>
                      {data.categories.unitEconomics.insights && (
                        <div className="space-y-2 pt-4 border-t border-gray-700">
                          {data.categories.unitEconomics.insights.map((insight, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              <span className="text-gray-300 text-sm">{insight}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Financial Health */}
                  <div className="wizard-card p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <CurrencyDollarIcon className="w-6 h-6 text-blue-400" />
                      Financial Health
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Score</span>
                        <span className={`text-2xl font-bold bg-gradient-to-r ${getScoreColor(data.categories.financialHealth.score)} bg-clip-text text-transparent`}>
                          {data.categories.financialHealth.score}/100
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{data.categories.financialHealth.description}</p>
                      {data.categories.financialHealth.insights && (
                        <div className="space-y-2 pt-4 border-t border-gray-700">
                          {data.categories.financialHealth.insights.map((insight, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <span className="text-gray-300 text-sm">{insight}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Market Opportunity */}
                {data.analysis?.marketOpportunity && (
                  <div className="wizard-card p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <ArrowTrendingUpIcon className="w-6 h-6 text-purple-400" />
                      Market Opportunity
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{data.analysis.marketOpportunity}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 backdrop-blur-xl bg-gray-900/80 border-t border-purple-500/20 p-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between">
          <p className="text-gray-400 text-sm">
            Need help implementing these insights? Contact our expert advisors.
          </p>
          <div className="flex gap-3">
            <button className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-all">
              Download PDF
            </button>
            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium transition-all">
              Book Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 