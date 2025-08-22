"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BusinessPlanResult from '../components/BusinessPlanResult';
import InteractiveBusinessResult from '../components/InteractiveBusinessResult';
import EnhancedBusinessResult from '../components/EnhancedBusinessResult';
import { testData } from './testData';
import { premiumTestData } from './premiumTestData';

export default function ResultContent() {
  const [resultData, setResultData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  // Funktion för att sätta test-data
  const setTestData = () => {
    if (typeof window !== 'undefined') {
      // Create enhanced test data structure
      const enhancedTestData = {
        overallScore: testData.score,
        categories: {
          problemSolution: { score: 85, label: "Problem-Lösning Fit", description: "Hur väl löser ni ett verkligt problem", insights: ["Stark problemförståelse", "Tydlig värdeproposition"] },
          marketTiming: { score: 82, label: "Marknad & Timing", description: "Rätt lösning vid rätt tidpunkt", insights: ["Växande marknad", "Gynnsamma makrotrender"] },
          moatCompetition: { score: 72, label: "Moat & Konkurrens", description: "Hur försvarbar är er position", insights: ["Måttliga inträdesbarriärer", "Behöver stärka IP-skydd"] },
          tractionKpi: { score: 91, label: "Traction & KPI-progress", description: "Bevis på framgång och momentum", insights: ["Stark tillväxt", "Goda kundmetriker"] },
          unitEconomics: { score: 78, label: "Unit Economics", description: "Affärsmodellens hållbarhet", insights: ["Bra LTV:CAC ratio", "Förbättringspotential i marginaler"] },
          teamExecution: { score: 88, label: "Team & Execution", description: "Rätt team för uppgiften", insights: ["Erfaret team", "Kompletterande kompetenser"] },
          financialHealth: { score: 75, label: "Finansiell hälsa", description: "Runway och burn rate", insights: ["18 månaders runway", "Kontrollerad burn rate"] },
          riskCompliance: { score: 70, label: "Risk & Compliance", description: "Riskhantering och regelefterlevnad", insights: ["Identifierade huvudrisker", "Mitigationsplaner på plats"] },
          storytellingDeck: { score: 80, label: "Storytelling & Pitch", description: "Förmåga att sälja visionen", insights: ["Engagerande story", "Professionell presentation"] }
        },
        actionableInsights: [
          {
            title: "Kvantifiera kundens smärta i kronor",
            impact: "high" as const,
            timeframe: "1-2 veckor",
            description: "Er lösning adresserar ett problem men saknar konkret data om vad det kostar kunden idag.",
            implementation: [
              "Intervjua 10 befintliga kunder om deras tidsåtgång",
              "Beräkna timkostnad × antal timmar = årlig kostnad",
              "Dokumentera 3-5 konkreta exempel med företagsnamn"
            ],
            expectedResult: "Increase conversion by 30-40% by showing 'Save $50,000/year' instead of 'Save time'",
            investorPerspective: "Investerare vill se att ni förstår kundens ekonomi på djupet. Siffror > känslor."
          }
        ],
        answers: testData.answers
      };
      
      localStorage.setItem('latestAnalysisResult', JSON.stringify(enhancedTestData));
      setResultData(enhancedTestData);
      setLoading(false);
    }
  };
  
  // Similar function for premium test data...
  
  useEffect(() => {
    // Försök hämta data från olika källor
    const loadResultData = async () => {
      try {
        // 1. Kolla query params (om vi har ett result ID)
        const resultId = searchParams.get('id');
        if (resultId) {
          // Här skulle vi hämta från backend via ID
          // För nu, använd localStorage
        }
        
        // 2. Kolla localStorage för senaste resultatet
        if (typeof window !== 'undefined') {
          const storedResult = localStorage.getItem('latestAnalysisResult');
          if (storedResult) {
            try {
              const parsed = JSON.parse(storedResult);
              setResultData(parsed);
              setLoading(false);
              return;
            } catch (e) {
              console.error('Error parsing stored result:', e);
              setError('Could not load analysis result');
            }
          }
        }
        
        // 3. Om ingen data finns, visa test-knapp istället för att redirecta
        setLoading(false);
      } catch (error) {
        console.error('Error loading result data:', error);
        setError('An error occurred while loading the analysis result');
        setLoading(false);
      }
    };
    
    loadResultData();
  }, [searchParams, router]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/60">Loading analysis results...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all"
          >
            Create new analysis
          </button>
        </div>
      </div>
    );
  }
  
  if (!resultData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">No analysis found</p>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all"
            >
              Create new analysis
            </button>
            <div className="mt-4">
              <p className="text-white/40 mb-2">For development:</p>
              <button
                onClick={setTestData}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all"
              >
                Load test data
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Check if we have the new enhanced structure
  if (resultData.categories && resultData.overallScore !== undefined) {
    return (
      <div className="min-h-screen">
        <EnhancedBusinessResult data={resultData} />
      </div>
    );
  }
  
  // Fallback to old structure
  return (
    <div className="min-h-screen">
      <BusinessPlanResult 
        score={resultData.score || 0}
        answers={resultData.answers || {}}
        feedback={resultData.feedback}
        subscriptionLevel={resultData.subscriptionLevel}
      />
    </div>
  );
} 