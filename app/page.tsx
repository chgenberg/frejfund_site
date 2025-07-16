"use client";
export const dynamic = 'force-dynamic';

import Image from "next/image";
import { useState } from "react";
import EnhancedBusinessWizard from "./components/EnhancedBusinessWizard";
import Link from 'next/link'

export default function Home() {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center w-full bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
        {/* Mobile optimized hero section */}
        <div className="relative flex items-center justify-center w-full h-screen px-4">
          {/* Brain image - responsive sizing */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30 md:opacity-95">
            <Image
              src="/brain.png"
              alt="Brain"
              width={1200}
              height={900}
              className="w-full h-auto max-w-[800px] md:max-w-[1200px] lg:max-w-[2400px] object-contain"
              priority
            />
          </div>
          
          {/* Content container - improved mobile layout */}
          <div className="relative z-10 text-center px-4 max-w-2xl w-full">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 tracking-tight">
              FrejFund
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-8 md:mb-12 px-4">
              AI-driven investment analysis for startups
            </p>
            
            {/* CTA buttons - mobile optimized */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 sm:px-0">
              <button
                onClick={() => setShowWizard(true)}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all text-base sm:text-lg shadow-lg"
              >
                Start analysis
              </button>
              <Link
                href="/our-packages"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/20 text-base sm:text-lg text-center"
              >
                View our packages
              </Link>
            </div>

            {/* Trust indicators - mobile friendly */}
            <div className="mt-12 md:mt-16 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8 px-4 sm:px-0">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">500+</div>
                <div className="text-xs sm:text-sm text-white/60">Analyses completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">4.8/5</div>
                <div className="text-xs sm:text-sm text-white/60">User rating</div>
              </div>
              <div className="text-center col-span-2 sm:col-span-1">
                <div className="text-2xl sm:text-3xl font-bold text-white">15 min</div>
                <div className="text-xs sm:text-sm text-white/60">To first results</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-friendly scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce md:hidden">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </main>

      {/* Wizard modal */}
      <EnhancedBusinessWizard 
        open={showWizard} 
        onClose={() => setShowWizard(false)} 
      />
    </>
  );
}