"use client";
import Image from 'next/image';

export default function DPA() {
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
          Databehandlaravtal
          <span className="block text-lg font-normal text-gray-600 mt-2">DPA</span>
        </h1>
        
        <div className="space-y-10 text-gray-800">
          <p className="text-sm italic text-gray-600 bg-white/50 rounded-2xl p-6 border border-gray-100">
            Gäller endast om kunden själv laddar upp personuppgifter (t.ex. kundlistor i en CSV för marknads-benchmark).
          </p>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Parter</h2>
            <p className="leading-relaxed">Personuppgiftsansvarig = Kunden; Personuppgiftsbiträde = FrejFund AB.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Behandlingens art & ändamål</h2>
            <p className="leading-relaxed">AI-baserad analys av filbilagor som kunden laddar upp.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Kategorier av personuppgifter</h2>
            <p className="leading-relaxed">Namn, e-post, titel och affärsstatistik.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Undertillbiträden</h2>
            <p className="leading-relaxed">OpenAI, AWS, Stripe – se <a href="/integritet" className="text-[#16475b] hover:underline">Integritetspolicyn</a>. Kunden godkänner dessa.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Säkerhetsåtgärder</h2>
            <p className="leading-relaxed">Kryptering i transit (TLS 1.3) & i vila (AES-256). Roll-baserad åtkomst, 2FA för personal.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Incidentrapportering</h2>
            <p className="leading-relaxed">FrejFund informerar kunden inom 48 h efter upptäckt av personuppgiftsincident.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Biträdets assistans</h2>
            <p className="leading-relaxed">FrejFund bistår kunden vid begäran om registerutdrag, radering m.m.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Gallring</h2>
            <p className="leading-relaxed">Data raderas eller anonymiseras 30 dagar efter avslutat avtal, om inte lag kräver längre lagring.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Revision</h2>
            <p className="leading-relaxed">Kunden har rätt till årlig audit eller SOC 2-rapport.</p>
          </section>
        </div>
      </div>
    </div>
  );
} 