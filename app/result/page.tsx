"use client";

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamiskt ladda ResultContent för att undvika SSR/prerendering helt
const ResultContent = dynamic(() => import('./ResultContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#04111d] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white/60">Loading analysis results...</p>
      </div>
    </div>
  )
});

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#04111d] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/60">Loading page...</p>
        </div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
} 