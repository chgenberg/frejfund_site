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
}

const impactColors = {
  high: 'from-red-500 to-orange-500',
  medium: 'from-yellow-500 to-amber-500',
  low: 'from-blue-500 to-cyan-500'
};

const impactLabels = {
  high: 'Hög påverkan',
  medium: 'Medel påverkan',
  low: 'Låg påverkan'
};

export default function ActionableInsights({ insights }: { insights: ActionableInsight[] }) {
  return (
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <div 
          key={index}
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500/50 transition-all duration-300"
        >
          {/* Header */}
          <div className="p-4 md:p-6 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <h3 className="text-lg md:text-xl font-bold text-white">{insight.title}</h3>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${impactColors[insight.impact]} text-white`}>
                  {impactLabels[insight.impact]}
                </span>
                <span className="text-sm text-white/60">{insight.timeframe}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6 space-y-4">
            {/* Description */}
            <div>
              <h4 className="text-sm font-semibold text-white/60 mb-2">Utmaning</h4>
              <p className="text-white/90">{insight.description}</p>
            </div>

            {/* Implementation Steps */}
            <div>
              <h4 className="text-sm font-semibold text-white/60 mb-2">Så här gör du</h4>
              <ol className="space-y-2">
                {insight.implementation.map((step, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs text-purple-400">
                      {idx + 1}
                    </span>
                    <span className="text-white/80 text-sm">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Expected Result */}
            <div className="bg-green-500/10 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-green-400 mb-1">Förväntat resultat</h4>
              <p className="text-white/80 text-sm">{insight.expectedResult}</p>
            </div>

            {/* Investor Perspective */}
            <div className="bg-purple-500/10 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-purple-400 mb-1">💡 Investerarperspektiv</h4>
              <p className="text-white/80 text-sm italic">"{insight.investorPerspective}"</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 