"use client";
import { useState } from "react";

const AVERAGES = {
  none: 0.7,
  incubator: 2.0,
  frejfund: 3.0,
};

function getChance(requested: number, average: number) {
  // Enkel modell: om requested <= average => 80%, annars fallande logik
  if (requested <= average) return 80;
  if (requested > average * 2.5) return 5;
  if (requested > average * 2) return 15;
  if (requested > average * 1.5) return 30;
  if (requested > average * 1.2) return 50;
  return 65;
}

export default function CapitalChanceCalculator() {
  const [showPopup, setShowPopup] = useState(false);
  const [input, setInput] = useState(1500000);
  const requestedMSEK = input / 1_000_000;

  const chanceNone = getChance(requestedMSEK, AVERAGES.none);
  const chanceIncubator = getChance(requestedMSEK, AVERAGES.incubator);
  const chanceFrejfund = getChance(requestedMSEK, AVERAGES.frejfund);

  return (
    <div className="w-full flex flex-col items-center gap-4 mt-8">
      {/* Kapitaljämförelse-tabell */}
      <div className="bg-[#16475b] rounded-3xl shadow-xl border border-[#7edcff] px-6 py-8 max-w-2xl w-full text-center text-white relative overflow-hidden">
        <h3 className="text-2xl font-extrabold mb-4 tracking-wide">Så mycket mer kapital får du med rätt coachning</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* Ingen coachning */}
          <div className="bg-white/10 rounded-2xl p-4 flex flex-col items-center">
            <span className="text-lg font-bold text-[#7edcff] mb-2">Ingen coachning</span>
            <span className="text-3xl font-extrabold">0,7</span>
            <span className="text-sm text-white/70 mt-1">MSEK</span>
          </div>
          {/* Inkubator/extern coach */}
          <div className="bg-white/10 rounded-2xl p-4 flex flex-col items-center">
            <span className="text-lg font-bold text-[#7edcff] mb-2">Inkubator / extern coach</span>
            <span className="text-3xl font-extrabold">2,0</span>
            <span className="text-sm text-white/70 mt-1">MSEK</span>
          </div>
          {/* FrejFund-coaching */}
          <div className="bg-[#7edcff] rounded-2xl p-4 flex flex-col items-center shadow-lg border-2 border-white">
            <span className="text-lg font-bold text-[#16475b] mb-2">FrejFund-coaching</span>
            <span className="text-3xl font-extrabold text-[#16475b]">3,0</span>
            <span className="text-sm text-[#16475b]/80 mt-1">MSEK</span>
            <span className="mt-2 px-3 py-1 bg-[#16475b] text-[#7edcff] rounded-full text-xs font-bold uppercase tracking-wider">Bäst resultat</span>
          </div>
        </div>
        <div className="mt-6 text-white/80 text-sm">
          <span className="font-bold text-[#7edcff]">Källa:</span> Data från ALMI, Vinnova, investerarnätverk & FrejFund-användare 2021–2024
        </div>
      </div>
      {/* Liten ruta för kalkylatorn */}
      <button
        onClick={() => setShowPopup(true)}
        className="mt-4 bg-[#7edcff] hover:bg-[#5ec2e6] text-[#16475b] font-bold rounded-2xl shadow px-6 py-4 flex items-center gap-3 transition-colors focus:outline-none focus:ring-2 focus:ring-[#16475b]/40 text-lg max-w-xs w-full justify-center"
        aria-label="Öppna kalkylator för kapitalchans"
      >
        <svg width="24" height="24" fill="none" stroke="#16475b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
        Hur stor chans har du att få ditt önskade kapital?
      </button>
      {/* Pop-up med kalkylatorn */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#16475b] rounded-3xl shadow-xl border border-[#7edcff] p-8 max-w-xl w-full text-white relative animate-fade-in">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-[#7edcff] focus:outline-none"
              aria-label="Stäng kalkylator"
            >
              ×
            </button>
            <h4 className="text-xl font-bold mb-4 tracking-wide text-center">Hur stor chans har du att få ditt önskade kapital?</h4>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
              <label htmlFor="capital-input-popup" className="text-white/80 text-sm md:mb-0 mb-2">Jag vill resa</label>
              <input
                id="capital-input-popup"
                type="number"
                min={100000}
                step={10000}
                value={input}
                onChange={e => setInput(Number(e.target.value))}
                className="w-40 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-center font-bold text-lg focus:outline-none focus:border-[#7edcff]"
              />
              <span className="text-white/80 text-sm">kr</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Ingen coachning */}
              <div className="bg-white/10 rounded-2xl p-4 flex flex-col items-center">
                <span className="text-lg font-bold text-[#7edcff] mb-2">Ingen coachning</span>
                <span className="text-3xl font-extrabold">{chanceNone}%</span>
                <span className="text-sm text-white/70 mt-1">sannolikhet</span>
              </div>
              {/* Inkubator/extern coach */}
              <div className="bg-white/10 rounded-2xl p-4 flex flex-col items-center">
                <span className="text-lg font-bold text-[#7edcff] mb-2">Inkubator / extern coach</span>
                <span className="text-3xl font-extrabold">{chanceIncubator}%</span>
                <span className="text-sm text-white/70 mt-1">sannolikhet</span>
              </div>
              {/* FrejFund-coaching */}
              <div className="bg-[#7edcff] rounded-2xl p-4 flex flex-col items-center shadow-lg border-2 border-white">
                <span className="text-lg font-bold text-[#16475b] mb-2">FrejFund-coaching</span>
                <span className="text-3xl font-extrabold text-[#16475b]">{chanceFrejfund}%</span>
                <span className="text-sm text-[#16475b]/80 mt-1">sannolikhet</span>
                <span className="mt-2 px-3 py-1 bg-[#16475b] text-[#7edcff] rounded-full text-xs font-bold uppercase tracking-wider">Bäst chans</span>
              </div>
            </div>
            <div className="mt-6 text-white/80 text-xs text-left md:text-center max-w-xl mx-auto">
              <span className="font-bold text-[#7edcff]">Disclaimer:</span> Detta är endast ett estimat baserat på statistik från ALMI, Vinnova, investerarnätverk & FrejFund-användare 2021–2024. Det finns inga garantier och utfallet kan variera beroende på marknad, affärsidé och andra faktorer.
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 