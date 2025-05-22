"use client";

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function BlackOrder() {
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
      <div className="max-w-2xl w-full bg-black/95 rounded-3xl shadow-xl border border-[#7edcff] p-8 mt-8">
        <h1 className="text-3xl font-extrabold text-[#7edcff] mb-6 text-center uppercase tracking-widest">Beställ Black</h1>
        <p className="text-lg text-[#7edcff] text-center mb-6">Förbered detta innan du beställer Black-paketet:</p>
        <ul className="mb-8 space-y-3">
          <li className="flex items-center gap-3"><span className="inline-block w-5 h-5 bg-[#7edcff] rounded-full text-black font-bold flex items-center justify-center">1</span> Din affärsidé och pitch (kort beskrivning)</li>
          <li className="flex items-center gap-3"><span className="inline-block w-5 h-5 bg-[#7edcff] rounded-full text-black font-bold flex items-center justify-center">2</span> Kontaktuppgifter till dig och ev. team</li>
          <li className="flex items-center gap-3"><span className="inline-block w-5 h-5 bg-[#7edcff] rounded-full text-black font-bold flex items-center justify-center">3</span> Eventuella frågor till coachen</li>
          <li className="flex items-center gap-3"><span className="inline-block w-5 h-5 bg-[#7edcff] rounded-full text-black font-bold flex items-center justify-center">4</span> Ev. due diligence-bilagor (om du har)</li>
        </ul>
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
          <button
            className="bg-[#7edcff] text-black font-bold rounded-full px-8 py-3 shadow hover:bg-black hover:text-[#7edcff] transition-colors text-lg tracking-widest uppercase"
            onClick={scrollToOrder}
          >
            JAG ÄR REDO
          </button>
        </div>
        <div ref={bestallRef} className="mt-8 pt-8 border-t border-[#7edcff]/30">
          <h2 className="text-2xl font-bold text-[#7edcff] mb-4 text-center">Beställ Black</h2>
          <div className="bg-[#181818] rounded-xl p-6 mb-6 text-[#7edcff] text-center">
            <p className="mb-2 font-semibold">Black-paketet</p>
            <p className="mb-2">Pris: <span className="font-bold">24 900 kr / år</span> + <span className="font-bold">2 % success-fee</span></p>
            <ul className="text-left mx-auto max-w-xs list-disc list-inside text-sm mt-2 mb-2">
              <li>Fullt AI-formulär + due diligence-modul</li>
              <li>PDF full, deck-export, dataroom-länk</li>
              <li>Obegränsat Pitch-Pingvinen + TTS-svar</li>
              <li>Internationella benchmarks & simuleringar</li>
              <li>Dedikerad CSM & partner-rabatter</li>
            </ul>
          </div>
          <button
            className="bg-black text-[#7edcff] font-bold rounded-full px-8 py-3 shadow border border-[#7edcff] hover:bg-[#7edcff] hover:text-black transition-colors text-lg tracking-widest uppercase w-full"
            onClick={() => router.push('/kassa?paket=black')}
          >
            BESTÄLL
          </button>
        </div>
      </div>
    </div>
  );
} 