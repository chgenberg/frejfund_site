"use client";
export const dynamic = 'force-dynamic';

import Image from "next/image";
import { useState } from "react";
import BusinessPlanWizard from "./components/BusinessPlanWizard";
import Link from 'next/link'
import Header from './components/Header'

export default function Home() {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <>
      <Header />
      <main className="relative min-h-screen flex items-center justify-center p-4 pt-20">
        {/* Bakgrundsbild */}
        <Image
          src="/bakgrund.png"
          alt="Bakgrund"
          fill
          className="object-cover -z-10"
          priority
        />

        {/* centrala knappen */}
        <button
          className="z-10 rounded-full bg-[#16475b] px-8 py-4 font-bold uppercase tracking-widest text-white shadow-lg transition-colors hover:bg-[#7edcff] hover:text-[#04121d] text-lg sm:text-xl"
          onClick={() => setShowWizard(true)}
        >
          Starta analys
        </button>

        <BusinessPlanWizard open={showWizard} onClose={() => setShowWizard(false)} />
      </main>
    </>
  );
}