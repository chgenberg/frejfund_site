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
      <main className="min-h-screen flex flex-col items-center justify-center w-full">
        {/* Brain med knapp centrerad ovanpå */}
        <div className="relative flex items-center justify-center w-full h-full z-10" style={{ minHeight: 900 }}>
          <Image
            src="/brain.png"
            alt="Brain"
            width={2400}
            height={1800}
            className="opacity-95 drop-shadow-lg"
            priority
          />
          <button
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#16475b] px-10 py-5 font-bold uppercase tracking-widest text-white shadow-lg transition-colors hover:bg-[#7edcff] hover:text-[#04121d] text-2xl sm:text-3xl"
            onClick={() => setShowWizard(true)}
            style={{ minWidth: 260 }}
          >
            Starta analys
          </button>
        </div>
        <BusinessPlanWizard open={showWizard} onClose={() => setShowWizard(false)} />
      </main>
    </>
  );
}