'use client';
import React from 'react';

interface ActionableInsight {
  title: string;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  description: string;
  implementation: string[];
  expectedResult: string;
  investorPerspective: string;
  evidenceSource?: string;
  targetMetric?: string;
  industryBenchmark?: string;
  toolsRequired?: string[];
  potentialPitfalls?: string[];
  successIndicators?: string[];
  _source?: string;
}

const impactColors = {
  high: 'from-red-500 to-orange-500',
  medium: 'from-yellow-500 to-amber-500',
  low: 'from-blue-500 to-cyan-500'
};

const impactLabels = {
  high: 'High impact',
  medium: 'Medium impact',
  low: 'Low impact'
};

export default function ActionableInsights({ insights }: { insights: ActionableInsight[] }) {
  return (
    <div className="space-y-6">
      {insights.map((insight, index) => (
        <div 
          key={index}
          className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden hover:border-purple-500/50 transition-all duration-300"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-white">{insight.title}</h3>
                {insight._source === 'fallback' && (
                  <span className="px-3 py-1 text-xs bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-500/30">
                    General advice
                  </span>
                )}
                {insight._source === 'contextual-fallback' && (
                  <span className="px-3 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                    Context-based
                  </span>
                )}
                {insight._source === 'ai-generated' && (
                  <span className="px-3 py-1 text-xs bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
                    AI-personalized
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${impactColors[insight.impact]} text-white`}>
                  {impactLabels[insight.impact]}
                </span>
                <span className="text-sm text-white/60 font-medium">{insight.timeframe}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h4 className="text-sm font-semibold text-white/60 mb-3">🎯 Challenge & Opportunity</h4>
              <p className="text-white/90 leading-relaxed">{insight.description}</p>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Evidence Source */}
              {insight.evidenceSource && (
                <div className="bg-blue-500/10 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-blue-400 mb-2">📊 Based on</h4>
                  <p className="text-white/80 text-sm italic">{insight.evidenceSource}</p>
                </div>
              )}

              {/* Target Metric */}
              {insight.targetMetric && (
                <div className="bg-purple-500/10 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-purple-400 mb-2">🎯 Success metric</h4>
                  <p className="text-white/80 text-sm font-medium">{insight.targetMetric}</p>
                </div>
              )}
            </div>

            {/* Industry Benchmark */}
            {insight.industryBenchmark && (
              <div className="bg-cyan-500/10 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-cyan-400 mb-2">📈 Industry benchmark</h4>
                <p className="text-white/80 text-sm">{insight.industryBenchmark}</p>
              </div>
            )}

            {/* Implementation Steps */}
            <div>
              <h4 className="text-sm font-semibold text-white/60 mb-3">🛠️ Implementation plan</h4>
              <ol className="space-y-3">
                {insight.implementation.map((step, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-sm text-purple-400 font-semibold">
                      {idx + 1}
                    </span>
                    <span className="text-white/85 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tools Required */}
            {insight.toolsRequired && insight.toolsRequired.length > 0 && (
              <div className="bg-indigo-500/10 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-indigo-400 mb-3">🔧 Tools & resources needed</h4>
                <div className="flex flex-wrap gap-2">
                  {insight.toolsRequired.map((tool, idx) => (
                    <span key={idx} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm border border-indigo-500/30">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Success Indicators & Pitfalls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Success Indicators */}
              {insight.successIndicators && insight.successIndicators.length > 0 && (
                <div className="bg-green-500/10 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-green-400 mb-3">✅ Success indicators</h4>
                  <ul className="space-y-2">
                    {insight.successIndicators.map((indicator, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-400 mt-0.5">•</span>
                        <span className="text-white/80 text-sm">{indicator}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Potential Pitfalls */}
              {insight.potentialPitfalls && insight.potentialPitfalls.length > 0 && (
                <div className="bg-red-500/10 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-red-400 mb-3">⚠️ Avoid these pitfalls</h4>
                  <ul className="space-y-2">
                    {insight.potentialPitfalls.map((pitfall, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">•</span>
                        <span className="text-white/80 text-sm">{pitfall}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Expected Result */}
            <div className="bg-green-500/10 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-green-400 mb-2">🎉 Expected result</h4>
              <p className="text-white/85 leading-relaxed">{insight.expectedResult}</p>
            </div>

            {/* Investor Perspective */}
            <div className="bg-purple-500/10 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-purple-400 mb-2">💡 Investor perspective</h4>
              <p className="text-white/85 italic leading-relaxed">"{insight.investorPerspective}"</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 