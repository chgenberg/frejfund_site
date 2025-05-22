"use client";

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function GoldOrder() {
  const bestallRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToOrder = () => {
    bestallRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Bakgrundsbild */}
      <Image
        src="/bakgrund.png"
        alt="Bakgrund"
        fill
        className="object-cover -z-10"
        priority
      />
      <div className="max-w-2xl w-full bg-white/95 rounded-3xl shadow-xl border border-[#7edcff] p-8 mt-8">
        <h1 className="text-3xl font-extrabold text-[#16475b] mb-6 text-center uppercase tracking-widest">Beställ Gold</h1>
        <p className="text-lg text-[#16475b] text-center mb-6">Förbered detta innan du beställer Gold-paketet:</p>
        <ul className="mb-8 space-y-3 text-black">
          <li className="flex items-center gap-3"><span className="inline-block w-5 h-5 bg-[#7edcff] rounded-full text-[#16475b] font-bold flex items-center justify-center">1</span> Din affärsidé och pitch (kort beskrivning)</li>
          <li className="flex items-center gap-3"><span className="inline-block w-5 h-5 bg-[#7edcff] rounded-full text-[#16475b] font-bold flex items-center justify-center">2</span> Kontaktuppgifter till dig och ev. team</li>
          <li className="flex items-center gap-3"><span className="inline-block w-5 h-5 bg-[#7edcff] rounded-full text-[#16475b] font-bold flex items-center justify-center">3</span> Eventuella frågor till coachen</li>
        </ul>
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
          <button
            className="bg-[#7edcff] text-[#16475b] font-bold rounded-full px-8 py-3 shadow hover:bg-[#16475b] hover:text-white transition-colors text-lg tracking-widest uppercase"
            onClick={scrollToOrder}
          >
            JAG ÄR REDO
          </button>
        </div>
        <div ref={bestallRef} className="mt-8 pt-8 border-t border-[#7edcff]/30">
          <h2 className="text-2xl font-bold text-[#16475b] mb-4 text-center">Beställ Gold</h2>
          <div className="bg-[#eaf6fa] rounded-xl p-6 mb-6 text-[#16475b] text-center">
            <p className="mb-2 font-semibold">Gold-paketet</p>
            <p className="mb-2">Pris: <span className="font-bold">990 kr / analys</span> eller <span className="font-bold">5 990 kr / år</span></p>
            <ul className="text-left mx-auto max-w-xs list-disc list-inside text-sm mt-2 mb-2">
              <li>Fullt AI-formulär (30 min)</li>
              <li>PDF full + interaktiv dashboard</li>
              <li>10 Pitch-Pingvinen-inspelningar/månad</li>
              <li>Branschspecifika benchmarks</li>
              <li>Investor radar & partner-rabatter</li>
            </ul>
          </div>
          <button
            className="bg-[#16475b] text-white font-bold rounded-full px-8 py-3 shadow hover:bg-[#7edcff] hover:text-[#16475b] transition-colors text-lg tracking-widest uppercase w-full"
            onClick={() => router.push('/kassa?paket=gold')}
          >
            BESTÄLL
          </button>
        </div>
      </div>
    </div>
  );
} 