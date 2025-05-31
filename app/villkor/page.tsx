"use client";
import Image from 'next/image';

export default function Terms() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12">
      <Image
        src="/bakgrund.png"
        alt="Bakgrund"
        fill
        className="object-cover -z-10"
        priority
      />
      <div className="w-full max-w-4xl mx-auto bg-white/95 rounded-3xl shadow-xl p-8 md:p-12 border border-white/20 backdrop-blur-md">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-12 text-center text-[#16475b] tracking-tight">
          Allmänna användarvillkor
        </h1>
        
        <div className="space-y-10 text-gray-800">
          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Tjänsten</h2>
            <p className="leading-relaxed">FrejFund är en molnbaserad plattform för AI-baserad affärsanalys och investerarmatchning.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Konto & behörighet</h2>
            <p className="leading-relaxed">Du ansvarar för att hålla dina inloggningsuppgifter hemliga. Konton får inte delas.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Betalning</h2>
            <p className="leading-relaxed">Priser visas exkl. moms. Betalning sker via Stripe/Klarna.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Dataskydd</h2>
            <p className="leading-relaxed">Vi behandlar uppgifter enligt vår <a href="/integritet" className="text-[#16475b] hover:underline">Integritetspolicy</a>. Information som kunden anger i analysen sparas för utvärdering och analys för att förbättra vår tjänst.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Immateriella rättigheter</h2>
            <p className="leading-relaxed">All kod, grafik och rapportmotor tillhör Christopher Genberg AB. Du äger dina inmatade uppgifter och genererade rapporter.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Ansvarsbegränsning</h2>
            <p className="leading-relaxed">Tjänsten tillhandahålls &quot;i befintligt skick&quot;. FrejFund ansvarar inte för indirekta skador eller utebliven vinst. Ansvars taket motsvarar avgifter du betalat senaste 12 månaderna.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Force Majeure</h2>
            <p className="leading-relaxed">Vi är inte ansvariga för händelser utanför vår rimliga kontroll.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Tvist</h2>
            <p className="leading-relaxed">Svensk lag gäller. Tvister avgörs av Stockholms tingsrätt.</p>
          </section>
        </div>
      </div>
    </div>
  );
} 