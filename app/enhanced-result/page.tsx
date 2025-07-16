'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import EnhancedBusinessResult from '../components/EnhancedBusinessResult';

function ResultContent() {
  const searchParams = useSearchParams();
  const dataParam = searchParams.get('data');
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  if (!dataParam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
        <p className="text-white text-xl">Ingen data tillgänglig</p>
      </div>
    );
  }
  
  try {
    const data = JSON.parse(decodeURIComponent(dataParam));
    return <EnhancedBusinessResult data={data} />;
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
        <p className="text-white text-xl">Fel vid laddning av data</p>
      </div>
    );
  }
}

export default function EnhancedResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading results...</p>
        </div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
} 