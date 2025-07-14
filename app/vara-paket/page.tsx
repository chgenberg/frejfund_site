"use client";
import CapitalChanceCalculator from '../components/CapitalChanceCalculator';

export default function VaraPaket() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-2 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#16475b] tracking-widest text-center mb-10 mt-2 uppercase">VÅRA PAKET</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Paket 1: Frej Basic */}
        <div className="bg-white/90 rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col">
          <h2 className="text-2xl font-bold text-[#16475b] mb-4">Frej Basic</h2>
          <p className="text-4xl font-extrabold text-[#16475b] mb-6">Gratis</p>
          <ul className="text-gray-700 space-y-2 mb-6 flex-grow">
            <li>✅ AI-analys av din affärsplan</li>
            <li>✅ Investerings-score (1-100)</li>
          </ul>
          <button className="bg-[#16475b] text-white font-bold rounded-full px-8 py-3 w-full">Kom igång</button>
        </div>
        {/* Paket 2: Frej Pro */}
        <div className="bg-white/90 rounded-2xl shadow-lg border-2 border-[#16475b] p-6 flex flex-col">
          <h2 className="text-2xl font-bold text-[#16475b] mb-4">Frej Pro</h2>
          <p className="text-4xl font-extrabold text-[#16475b] mb-6">197 kr</p>
          <ul className="text-gray-700 space-y-2 mb-6 flex-grow">
            <li>✅ Allt i Basic</li>
            <li>✅ Djupgående AI-analys</li>
            <li>✅ Investerar-matchning</li>
          </ul>
          <button className="bg-[#16475b] text-white font-bold rounded-full px-8 py-3 w-full">Välj Pro</button>
        </div>
        {/* Paket 3: Frej Enterprise */}
        <div className="bg-white/90 rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col">
          <h2 className="text-2xl font-bold text-[#16475b] mb-4">Frej Enterprise</h2>
          <p className="text-4xl font-extrabold text-[#16475b] mb-6">Kontakta oss</p>
          <ul className="text-gray-700 space-y-2 mb-6 flex-grow">
            <li>✅ Allt i Pro</li>
            <li>✅ API-access & integration</li>
            <li>✅ Personlig support</li>
          </ul>
          <button className="bg-[#16475b] text-white font-bold rounded-full px-8 py-3 w-full">Kontakta oss</button>
        </div>
      </div>
      <CapitalChanceCalculator />
    </div>
  );
} 