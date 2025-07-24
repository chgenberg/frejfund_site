'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface UltraDeepInsight {
  title: string;
  priority: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  expectedResult: string;
  implementation: {
    overview: string;
    steps: string[];
    tools: string[];
    metrics: string[];
    timeline: string;
    budget: string;
    commonPitfalls: string[];
  };
  whyThis: string;
  investorImpact: string;
}

interface UltraDeepAnalysis {
  insights: UltraDeepInsight[];
  summary: {
    keyTheme: string;
    expectedTimelineToResults: string;
    totalExpectedImpact: string;
  };
  rawResponse?: string;
}

export default function UltraDeepResult() {
  const [analysis, setAnalysis] = useState<UltraDeepAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'roadmap' | 'metrics'>('overview');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [hoveredInsight, setHoveredInsight] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Load analysis from localStorage
    const stored = localStorage.getItem('ultraDeepAnalysisResult');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAnalysis(parsed);
      } catch (error) {
        console.error('Error parsing ultra-deep analysis:', error);
      }
    }
    setLoading(false);
    
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high': 
        return {
          bg: 'bg-gradient-to-br from-red-500/20 to-orange-500/20',
          border: 'border-red-500/50',
          text: 'text-red-200',
          glow: 'hover:shadow-red-500/20'
        };
      case 'medium': 
        return {
          bg: 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20',
          border: 'border-yellow-500/50',
          text: 'text-yellow-200',
          glow: 'hover:shadow-yellow-500/20'
        };
      case 'low': 
        return {
          bg: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
          border: 'border-green-500/50',
          text: 'text-green-200',
          glow: 'hover:shadow-green-500/20'
        };
      default: 
        return {
          bg: 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20',
          border: 'border-blue-500/50',
          text: 'text-blue-200',
          glow: 'hover:shadow-blue-500/20'
        };
    }
  };

  const getImpactEmoji = (impact: string) => {
    switch (impact) {
      case 'high': return '🚀';
      case 'medium': return '📈';
      case 'low': return '🔧';
      default: return '💡';
    }
  };

  const calculateProgress = () => {
    if (!analysis) return 0;
    const totalSteps = analysis.insights.reduce((acc, insight) => 
      acc + insight.implementation.steps.length, 0
    );
    return totalSteps > 0 ? (completedSteps.size / totalSteps) * 100 : 0;
  };

  const toggleStepCompletion = (insightIndex: number, stepIndex: number) => {
    const stepId = `${insightIndex}-${stepIndex}`;
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
        <Image
          src="/bakgrund.png"
          alt="Background"
          fill
          className="object-cover -z-10"
          priority
        />
        
        {/* Animated loading state */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-purple-500/30 rounded-full"></div>
              <div className="absolute inset-2 border-4 border-t-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Preparing Your Strategic Blueprint...</h2>
            <p className="text-white/70">Crafting personalized recommendations worth $1000s</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <Image
          src="/bakgrund.png"
          alt="Background"
          fill
          className="object-cover -z-10"
          priority
        />
        <div className="text-center">
          <p className="text-white text-xl mb-4">No analysis found</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all"
          >
            Start New Analysis
          </button>
        </div>
      </div>
    );
  }

  const overallProgress = calculateProgress();

  return (
    <div className="min-h-screen relative overflow-hidden" ref={containerRef}>
      <Image
        src="/bakgrund.png"
        alt="Background"
        fill
        className="object-cover -z-10"
        priority
      />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className={`relative z-10 min-h-screen p-4 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto">
          
          {/* Header with animated gradient */}
          <div className="text-center mb-12 pt-8">
            <div className="inline-block relative">
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 animate-gradient">
                🎯 Your Strategic Blueprint
              </h1>
              <div className="absolute -inset-x-20 -inset-y-2 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl -z-10"></div>
            </div>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mt-4">
              {analysis.insights.length} battle-tested strategies to transform your business
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Implementation Progress</h3>
              <span className="text-2xl font-bold text-white">{Math.round(overallProgress)}%</span>
            </div>
            <div className="relative h-4 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${overallProgress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
              </div>
            </div>
            <p className="text-sm text-white/60 mt-2">
              {completedSteps.size} of {analysis.insights.reduce((acc, i) => acc + i.implementation.steps.length, 0)} steps completed
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-1 border border-white/20">
              {(['overview', 'roadmap', 'metrics'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab === 'overview' && '📊 Overview'}
                  {tab === 'roadmap' && '🗺️ Roadmap'}
                  {tab === 'metrics' && '📈 Metrics'}
                </button>
              ))}
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Executive Summary with glassmorphism */}
              <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/50 transform hover:scale-[1.02] transition-all duration-300">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-4xl">📊</span> Executive Summary
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/10 rounded-2xl p-6 backdrop-blur border border-white/20 hover:bg-white/15 transition-all">
                    <h3 className="font-semibold text-purple-200 mb-3 text-lg">Strategic Focus</h3>
                    <p className="text-white text-lg leading-relaxed">{analysis.summary.keyTheme}</p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-6 backdrop-blur border border-white/20 hover:bg-white/15 transition-all">
                    <h3 className="font-semibold text-blue-200 mb-3 text-lg">Expected Timeline</h3>
                    <p className="text-white text-lg leading-relaxed">{analysis.summary.expectedTimelineToResults}</p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-6 backdrop-blur border border-white/20 hover:bg-white/15 transition-all">
                    <h3 className="font-semibold text-green-200 mb-3 text-lg">Business Impact</h3>
                    <p className="text-white text-lg leading-relaxed">{analysis.summary.totalExpectedImpact}</p>
                  </div>
                </div>
              </div>

              {/* Insights Grid with animations */}
              <div className="space-y-6">
                {analysis.insights.map((insight, index) => {
                  const priorityStyles = getPriorityStyles(insight.priority);
                  const isExpanded = expandedInsight === index;
                  const isHovered = hoveredInsight === index;
                  
                  return (
                    <div
                      key={index}
                      className={`relative transform transition-all duration-500 ${
                        isExpanded ? 'scale-[1.02]' : isHovered ? 'scale-[1.01]' : ''
                      }`}
                      style={{
                        transitionDelay: `${index * 100}ms`,
                        opacity: isVisible ? 1 : 0,
                        transform: `translateY(${isVisible ? 0 : 20}px)`
                      }}
                      onMouseEnter={() => setHoveredInsight(index)}
                      onMouseLeave={() => setHoveredInsight(null)}
                    >
                      {/* Glow effect on hover */}
                      {isHovered && (
                        <div className={`absolute inset-0 ${priorityStyles.bg} blur-xl opacity-50 -z-10`}></div>
                      )}
                      
                      <div className={`bg-white/10 backdrop-blur-xl rounded-2xl border ${priorityStyles.border} overflow-hidden shadow-2xl ${priorityStyles.glow}`}>
                        {/* Header */}
                        <div 
                          className="p-6 cursor-pointer hover:bg-white/5 transition-all"
                          onClick={() => setExpandedInsight(isExpanded ? null : index)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-4">
                                <span className="text-4xl animate-bounce" style={{ animationDelay: `${index * 200}ms` }}>
                                  {getImpactEmoji(insight.impact)}
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  <span className={`px-4 py-2 rounded-full text-sm font-bold border ${priorityStyles.bg} ${priorityStyles.border} ${priorityStyles.text} backdrop-blur`}>
                                    {insight.priority.toUpperCase()} PRIORITY
                                  </span>
                                  <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/50 text-blue-200 backdrop-blur">
                                    {insight.impact.toUpperCase()} IMPACT
                                  </span>
                                </div>
                              </div>
                              <h3 className="text-2xl font-bold text-white mb-3">{insight.title}</h3>
                              <p className="text-white/90 text-lg leading-relaxed mb-4">{insight.whyThis}</p>
                              <div className="flex flex-wrap gap-6 text-sm">
                                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                                  <span className="text-xl">⏱️</span>
                                  <span className="text-white/80 font-medium">{insight.timeframe}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                                  <span className="text-xl">🎯</span>
                                  <span className="text-white/80 font-medium">{insight.expectedResult}</span>
                                </div>
                              </div>
                            </div>
                            <div className={`ml-4 text-2xl text-white/60 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                              ⌄
                            </div>
                          </div>
                        </div>

                        {/* Expanded Content with smooth animation */}
                        <div className={`transition-all duration-500 ease-in-out ${
                          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                        } overflow-hidden`}>
                          <div className="border-t border-white/10 p-8 bg-gradient-to-b from-white/5 to-transparent">
                            <div className="grid md:grid-cols-2 gap-8">
                              {/* Implementation Steps */}
                              <div>
                                <h4 className="font-bold text-white text-xl mb-4 flex items-center gap-2">
                                  <span className="text-2xl">📋</span> Implementation Roadmap
                                </h4>
                                <p className="text-white/80 mb-6 leading-relaxed">{insight.implementation.overview}</p>
                                
                                <div className="space-y-3">
                                  {insight.implementation.steps.map((step, stepIndex) => {
                                    const stepId = `${index}-${stepIndex}`;
                                    const isCompleted = completedSteps.has(stepId);
                                    
                                    return (
                                      <div
                                        key={stepIndex}
                                        className={`flex gap-4 p-4 rounded-xl transition-all cursor-pointer ${
                                          isCompleted 
                                            ? 'bg-green-500/20 border border-green-500/50' 
                                            : 'bg-white/5 border border-white/20 hover:bg-white/10'
                                        }`}
                                        onClick={() => toggleStepCompletion(index, stepIndex)}
                                      >
                                        <div className={`
                                          w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                                          ${isCompleted 
                                            ? 'bg-green-500 text-white' 
                                            : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                          }
                                        `}>
                                          {isCompleted ? '✓' : stepIndex + 1}
                                        </div>
                                        <span className={`text-white/90 leading-relaxed ${isCompleted ? 'line-through opacity-70' : ''}`}>
                                          {step}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Details Panel */}
                              <div className="space-y-6">
                                {/* Tools */}
                                <div className="bg-white/5 rounded-xl p-6 backdrop-blur border border-white/20">
                                  <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                                    <span className="text-xl">🛠️</span> Tools & Resources
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {insight.implementation.tools.map((tool, toolIndex) => (
                                      <span key={toolIndex} className="px-4 py-2 bg-blue-500/20 text-blue-200 rounded-lg text-sm font-medium border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
                                        {tool}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Metrics */}
                                <div className="bg-white/5 rounded-xl p-6 backdrop-blur border border-white/20">
                                  <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                                    <span className="text-xl">📊</span> Success Metrics
                                  </h4>
                                  <div className="space-y-2">
                                    {insight.implementation.metrics.map((metric, metricIndex) => (
                                      <div key={metricIndex} className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                        <span className="text-white/80">{metric}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Timeline & Budget */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-white/5 rounded-xl p-4 backdrop-blur border border-white/20">
                                    <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                      <span>⏰</span> Timeline
                                    </h4>
                                    <p className="text-white/80">{insight.implementation.timeline}</p>
                                  </div>
                                  <div className="bg-white/5 rounded-xl p-4 backdrop-blur border border-white/20">
                                    <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                      <span>💰</span> Investment
                                    </h4>
                                    <p className="text-white/80">{insight.implementation.budget}</p>
                                  </div>
                                </div>

                                {/* Pitfalls */}
                                <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 rounded-xl p-6 border border-red-500/50">
                                  <h4 className="font-bold text-red-200 mb-3 flex items-center gap-2">
                                    <span className="text-xl">⚠️</span> Common Pitfalls to Avoid
                                  </h4>
                                  <div className="space-y-2">
                                    {insight.implementation.commonPitfalls.map((pitfall, pitfallIndex) => (
                                      <div key={pitfallIndex} className="flex items-start gap-3">
                                        <span className="text-red-400 mt-1">•</span>
                                        <span className="text-red-100">{pitfall}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Investor Impact */}
                                <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl p-6 border border-green-500/50">
                                  <h4 className="font-bold text-green-200 mb-3 flex items-center gap-2">
                                    <span className="text-xl">💼</span> Investor Appeal
                                  </h4>
                                  <p className="text-green-100 leading-relaxed">{insight.investorImpact}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">📍 Implementation Roadmap</h2>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500"></div>
                
                {/* Timeline items */}
                <div className="space-y-8">
                  {analysis.insights.map((insight, index) => {
                    const priorityStyles = getPriorityStyles(insight.priority);
                    return (
                      <div key={index} className="relative flex items-start gap-6">
                        <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {index + 1}
                        </div>
                        <div className="flex-1 bg-white/5 rounded-2xl p-6 border border-white/20 hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold text-white">{insight.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${priorityStyles.bg} ${priorityStyles.border} ${priorityStyles.text}`}>
                              {insight.priority.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-white/70 mb-3">{insight.timeframe}</p>
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <span>📊 {insight.implementation.steps.length} steps</span>
                            <span>•</span>
                            <span>💰 {insight.implementation.budget}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Impact Distribution */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">📊 Impact Distribution</h3>
                <div className="space-y-4">
                  {['high', 'medium', 'low'].map((level) => {
                    const count = analysis.insights.filter(i => i.impact === level).length;
                    const percentage = (count / analysis.insights.length) * 100;
                    return (
                      <div key={level}>
                        <div className="flex justify-between mb-2">
                          <span className="text-white capitalize">{level} Impact</span>
                          <span className="text-white/60">{count} items</span>
                        </div>
                        <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${
                              level === 'high' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                              level === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                              'bg-gradient-to-r from-green-500 to-emerald-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Resource Requirements */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">💼 Resource Overview</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Total Steps</h4>
                    <p className="text-3xl font-bold text-white">
                      {analysis.insights.reduce((acc, i) => acc + i.implementation.steps.length, 0)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Unique Tools Required</h4>
                    <p className="text-3xl font-bold text-white">
                      {new Set(analysis.insights.flatMap(i => i.implementation.tools)).size}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Key Metrics to Track</h4>
                    <p className="text-3xl font-bold text-white">
                      {analysis.insights.reduce((acc, i) => acc + i.implementation.metrics.length, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-10 border border-purple-500/50 max-w-3xl mx-auto transform hover:scale-[1.02] transition-all">
              <h3 className="text-3xl font-bold text-white mb-6">🚀 Ready to Transform Your Business?</h3>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                You now have a strategic blueprint worth $10,000+ in consulting fees.
                <br />Start with the high-priority items and track your progress daily.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all text-lg group">
                  <span className="flex items-center gap-2">
                    📄 Download Strategic Plan
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur text-white font-bold rounded-xl hover:bg-white/20 transition-all text-lg border border-white/20">
                  <span className="flex items-center gap-2">
                    📤 Share with Team
                  </span>
                </button>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="px-8 py-4 bg-blue-500/20 backdrop-blur text-blue-200 font-bold rounded-xl hover:bg-blue-500/30 transition-all text-lg border border-blue-500/50"
                >
                  <span className="flex items-center gap-2">
                    🔄 New Analysis
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
      `}</style>
    </div>
  );
} 