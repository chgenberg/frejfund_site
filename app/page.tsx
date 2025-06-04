"use client";
export const dynamic = 'force-dynamic';

import Image from "next/image";
import { useState } from "react";
import BusinessPlanWizard from "./components/BusinessPlanWizard";
import Link from 'next/link'

export default function Home() {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <>
      <main className="relative min-h-screen flex flex-col items-center justify-center p-4 pt-20 w-full h-full">
        {/* Bakgrundsbild */}
        <Image
          src="/bakgrund.png"
          alt="Bakgrund"
          fill
          className="object-cover -z-10 fixed inset-0 w-full h-full"
          priority
        />

        {/* centrala knappen */}
        <div className="flex flex-col items-center justify-center w-full h-full z-10">
          <button
            className="rounded-full bg-[#16475b] px-8 py-4 font-bold uppercase tracking-widest text-white shadow-lg transition-colors hover:bg-[#7edcff] hover:text-[#04121d] text-lg sm:text-xl mb-6"
            onClick={() => setShowWizard(true)}
          >
            Starta analys
          </button>
          {/* Brain image under knappen */}
          <Image src="/brain.png" alt="Brain" width={120} height={80} className="opacity-90" />
        </div>

        <BusinessPlanWizard open={showWizard} onClose={() => setShowWizard(false)} />
      </main>
    </>
  );
}