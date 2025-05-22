"use client";
import Image from 'next/image';
import { useState } from "react";
import BusinessPlanWizard from "./components/BusinessPlanWizard";

export default function Home() {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-[#04121d]">
      {/* Bakgrundsbild */}
      <Image
        src="/brain.png"
        alt="Brain"
        fill
        className="object-cover"
        priority
      />

      {/* Mindre, molnformad knapp */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <button
          className="bg-[#16475b] text-white font-bold rounded-full px-8 py-4 shadow-lg hover:bg-[#7edcff] hover:text-[#04121d] transition-colors text-lg tracking-widest uppercase"
          onClick={() => setShowWizard(true)}
        >
          ANALYSERA DIN AFFÄRSPLAN
        </button>
      </div>

      <BusinessPlanWizard open={showWizard} onClose={() => setShowWizard(false)} />
    </div>
  );
}