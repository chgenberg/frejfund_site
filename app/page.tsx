"use client";
import Image from "next/image";
import { useState } from "react";
import BusinessPlanWizard from "./components/BusinessPlanWizard";

export default function Home() {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#04121d]">
      {/* bakgrundsbild */}
      <Image
        src="/brain.png"
        alt="Brain"
        fill
        className="object-cover object-center z-0"
        priority
      />

      {/* centrala knappen */}
      <button
        className="z-10 rounded-full bg-[#16475b] px-8 py-4 font-bold uppercase tracking-widest text-white shadow-lg transition-colors hover:bg-[#7edcff] hover:text-[#04121d]"
        onClick={() => setShowWizard(true)}
      >
        Starta analys
      </button>

      <BusinessPlanWizard open={showWizard} onClose={() => setShowWizard(false)} />
    </div>
  );
}