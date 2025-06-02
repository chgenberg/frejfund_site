"use client";
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BusinessPlanResult from '../components/BusinessPlanResult';

export default function ResultPage() {
  const [resultData, setResultData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  
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
        const storedResult = localStorage.getItem('latestAnalysisResult');
        if (storedResult) {
          const parsed = JSON.parse(storedResult);
          setResultData(parsed);
          setLoading(false);
          return;
        }
        
        // 3. Om ingen data finns, redirect till startsidan
        setLoading(false);
        router.push('/');
      } catch (error) {
        console.error('Error loading result data:', error);
        setLoading(false);
        router.push('/');
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
  
  if (!resultData) {
    return (
      <div className="min-h-screen bg-[#04111d] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">Ingen analys hittades</p>
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