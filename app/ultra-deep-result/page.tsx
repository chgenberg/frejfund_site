'use client';

import React, { useState, useEffect } from 'react';
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
  const [expandedInsight, setExpandedInsight] = useState<number | null>(0);

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
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 border-red-500/50 text-red-200';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200';
      case 'low': return 'bg-green-500/20 border-green-500/50 text-green-200';
      default: return 'bg-blue-500/20 border-blue-500/50 text-blue-200';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return '🚀';
      case 'medium': return '📈';
      case 'low': return '🔧';
      default: return '💡';
    }
  };

  if (loading) {
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white/60">Loading your personalized recommendations...</p>
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
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl"
          >
            Start New Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <Image
        src="/bakgrund.png"
        alt="Background"
        fill
        className="object-cover -z-10"
        priority
      />
      
      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 pt-8">
            <h1 className="text-5xl font-bold text-white mb-4">
              🎯 Your Ultra-Deep Analysis
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Personalized, hands-on recommendations specifically tailored to your business situation
            </p>
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl p-8 border border-purple-500/50 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">📊 Executive Summary</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-white mb-2">Key Theme</h3>
                <p className="text-white/80">{analysis.summary.keyTheme}</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Timeline to Results</h3>
                <p className="text-white/80">{analysis.summary.expectedTimelineToResults}</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Expected Impact</h3>
                <p className="text-white/80">{analysis.summary.totalExpectedImpact}</p>
              </div>
            </div>
          </div>

          {/* Insights Grid */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              🛠️ Your Action Plan ({analysis.insights.length} Recommendations)
            </h2>
            
            {analysis.insights.map((insight, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden"
              >
                {/* Header */}
                <div 
                  className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => setExpandedInsight(expandedInsight === index ? null : index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{getImpactIcon(insight.impact)}</span>
                        <div className="flex gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(insight.priority)}`}>
                            {insight.priority.toUpperCase()} PRIORITY
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 border border-blue-500/50 text-blue-200">
                            {insight.impact.toUpperCase()} IMPACT
                          </span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{insight.title}</h3>
                      <p className="text-white/80 mb-3">{insight.whyThis}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-white/60">
                        <span>⏱️ {insight.timeframe}</span>
                        <span>🎯 {insight.expectedResult}</span>
                      </div>
                    </div>
                    <div className="ml-4 text-white/60">
                      {expandedInsight === index ? '▼' : '▶️'}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedInsight === index && (
                  <div className="border-t border-white/10 p-6 bg-white/5">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Implementation */}
                      <div>
                        <h4 className="font-bold text-white mb-3">📋 Implementation Steps</h4>
                        <p className="text-white/80 mb-4">{insight.implementation.overview}</p>
                        <ol className="space-y-2">
                          {insight.implementation.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex gap-3">
                              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                                {stepIndex + 1}
                              </span>
                              <span className="text-white/90">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Details */}
                      <div className="space-y-6">
                        {/* Tools */}
                        <div>
                          <h4 className="font-bold text-white mb-2">🛠️ Tools Needed</h4>
                          <div className="flex flex-wrap gap-2">
                            {insight.implementation.tools.map((tool, toolIndex) => (
                              <span key={toolIndex} className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-lg text-sm">
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Metrics */}
                        <div>
                          <h4 className="font-bold text-white mb-2">📊 Key Metrics</h4>
                          <div className="space-y-1">
                            {insight.implementation.metrics.map((metric, metricIndex) => (
                              <div key={metricIndex} className="text-white/80 text-sm">• {metric}</div>
                            ))}
                          </div>
                        </div>

                        {/* Timeline & Budget */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-bold text-white mb-2">⏰ Timeline</h4>
                            <p className="text-white/80 text-sm">{insight.implementation.timeline}</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-white mb-2">💰 Budget</h4>
                            <p className="text-white/80 text-sm">{insight.implementation.budget}</p>
                          </div>
                        </div>

                        {/* Pitfalls */}
                        <div>
                          <h4 className="font-bold text-white mb-2">⚠️ Avoid These Pitfalls</h4>
                          <div className="space-y-1">
                            {insight.implementation.commonPitfalls.map((pitfall, pitfallIndex) => (
                              <div key={pitfallIndex} className="text-red-200 text-sm">• {pitfall}</div>
                            ))}
                          </div>
                        </div>

                        {/* Investor Impact */}
                        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl p-4 border border-green-500/50">
                          <h4 className="font-bold text-green-200 mb-2">💼 Investor Impact</h4>
                          <p className="text-green-100 text-sm">{insight.investorImpact}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-8 border border-purple-500/50 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">🚀 Ready to Execute?</h3>
              <p className="text-white/80 mb-6">
                These recommendations are worth $1000s in consulting fees. 
                Start with the highest priority items and track your progress.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all">
                  Download PDF Report
                </button>
                <button className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all">
                  Share with Team
                </button>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="px-6 py-3 bg-blue-500/20 text-blue-200 font-semibold rounded-xl hover:bg-blue-500/30 transition-all"
                >
                  Start New Analysis
                </button>
              </div>
            </div>
          </div>

          {/* Debug info (if available) */}
          {analysis.rawResponse && (
            <div className="mt-8 p-4 bg-gray-900/50 rounded-xl border border-gray-700">
              <details>
                <summary className="text-white cursor-pointer mb-2">Raw AI Response (Debug)</summary>
                <pre className="text-gray-300 text-xs overflow-auto max-h-40">
                  {analysis.rawResponse}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 