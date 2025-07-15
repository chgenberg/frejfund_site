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
          
          {/* Content container */}
          <div className="relative z-10 text-center px-4 max-w-2xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
              FrejFund
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 md:mb-12">
              AI-driven investeringsanalys för startups
            </p>
            <button
              className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 md:px-10 py-4 md:py-5 font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 text-lg md:text-2xl"
              onClick={() => setShowWizard(true)}
            >
              Starta analys
            </button>
          </div>
        </div>
        
        <EnhancedBusinessWizard open={showWizard} onClose={() => setShowWizard(false)} />
      </main>
    </>
  );
}