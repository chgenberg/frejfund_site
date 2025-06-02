"use client";
import { useEffect } from 'react';
import Image from 'next/image';

export default function LinkedInSharePage() {
  useEffect(() => {
    // Automatisk redirect till LinkedIn-delning efter 2 sekunder
    const timer = setTimeout(() => {
      const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://www.frejfund.com')}&title=${encodeURIComponent('Jag analyserade min affärsidé med AI!')}&summary=${encodeURIComponent('Testa att analysera din affärsidé du också! FrejFund hjälper startups att hitta rätt investerare med AI-driven analys. Få din investeringsscore på 10 minuter.')}`;
      window.location.href = shareUrl;
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] to-[#04111d] flex items-center justify-center p-4">
      <div className="text-center text-white max-w-2xl mx-auto">
        {/* Brain image */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <Image
            src="/brain.png"
            alt="FrejFund AI Brain"
            fill
            className="object-contain animate-float"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl -z-10"></div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          Analysera din affärsidé med AI
        </h1>
        
        <p className="text-xl text-white/80 mb-8">
          FrejFund hjälper startups att hitta rätt investerare
        </p>
        
        <div className="bg-white/5 rounded-2xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold mb-4">Vad får du?</h2>
          <ul className="space-y-3 text-left max-w-md mx-auto">
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <span>AI-driven analys av din affärsidé</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <span>Investeringsscore 0-100</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <span>Matchning med rätt investerare</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <span>Konkret feedback och förbättringsförslag</span>
            </li>
          </ul>
        </div>
        
        <p className="text-white/60 text-sm">
          Du omdirigeras till LinkedIn om några sekunder...
        </p>
      </div>
    </div>
  );
} 