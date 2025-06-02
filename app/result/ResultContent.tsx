"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BusinessPlanResult from '../components/BusinessPlanResult';
import { testData } from './testData';

export default function ResultContent() {
  const [resultData, setResultData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Funktion för att sätta test-data
  const setTestData = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('latestAnalysisResult', JSON.stringify(testData));
      setResultData(testData);
      setLoading(false);
    }
  };
  
  // Funktion för att sätta premium-analys och simulera betalning
  const setPremiumTestData = () => {
    if (typeof window !== 'undefined') {
      const premiumData = { ...testData, subscriptionLevel: 'premium', paymentSuccess: true };
      localStorage.setItem('latestAnalysisResult', JSON.stringify(premiumData));
      setResultData(premiumData);
      setLoading(false);
    }
  };
  
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
              setError('Kunde inte läsa in analysresultatet');
            }
          }
        }
        
        // 3. Om ingen data finns, visa test-knapp istället för att redirecta
        setLoading(false);
      } catch (error) {
        console.error('Error loading result data:', error);
        setError('Ett fel uppstod vid laddning av analysresultatet');
        setLoading(false);
      }
    };
    
    loadResultData();
  }, [searchParams, router]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#04111d] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/60">Laddar analysresultat...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-[#04111d] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all"
          >
            Gör en ny analys
          </button>
        </div>
      </div>
    );
  }
  
  if (!resultData) {
    return (
      <div className="min-h-screen bg-[#04111d] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">Ingen analys hittades</p>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all"
            >
              Gör en ny analys
            </button>
            <div className="mt-4">
              <p className="text-white/40 mb-2">För utveckling:</p>
              <button
                onClick={setTestData}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all mr-2"
              >
                Ladda test-data (standard)
              </button>
              <button
                onClick={setPremiumTestData}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all"
              >
                Ladda test-data (premium/efter betalning)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
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