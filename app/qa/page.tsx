"use client";
import Image from 'next/image';
import { useState } from 'react';

interface QAItem {
  q: string;
  a: string;
}

const qaData: QAItem[] = [
  { q: '1. Vad är FrejFund i ett nötskal?', a: 'FrejFund är en end-to-end plattform för AI-analys, investeringspitch och investerar-matchning.' },
  { q: '2. Hur gör man en affärsanalys – och hur lång tid tar det?', a: 'Du fyller i ett interaktivt frågeformulär, laddar upp din pitch/PDF. Få AI-pitch & Analys – som kan laddas ner som PDF.' },
  { q: '3. Är det öppet för bolag utanför EU – betyder det att investerare kan koppla in internationellt på samma villkor?', a: 'Ja, men du ansvarar för att följa lokala regler. Plattformen är byggd för export, men investerarna är främst EU-baserade.' },
  { q: '4. Hur görs dataskydd? (GDPR)', a: 'All data lagras i EU och delas aldrig utan godkännande. Vi följer Schrems II och har DPA med OpenAI.' },
  { q: '5. Kan man ladda upp Excel och PDF?', a: 'Ja, du kan ladda upp Excel och PDF till analysen.' },
  { q: '6. Hur funkar investerar-matchningen?', a: 'AI:n matchar dig med relevanta investerare baserat på din analys och preferenser.' },
  { q: '7. Hur lång tid tar det att få svar?', a: 'Oftast inom 24 timmar, ibland snabbare.' },
  { q: '8. Hur många investerare finns på plattformen?', a: 'Över 70 aktiva investerare och nätverk.' },
  { q: '9. Vad kostar det?', a: 'Grundanalys är gratis. Premium-analys och investerar-matchning har en avgift.' },
  { q: '10. Vilka investerare får se min pitch?', a: 'Endast de du själv väljer att dela med.' },
  { q: '11. Kan jag bjuda in teamet att fylla i?', a: 'Ja, du kan bjuda in co-founders och team.' },
  { q: '12. Hur skyddas min pitch och data?', a: 'All data krypteras och delas aldrig utan ditt godkännande.' },
  { q: '13. Hur hanteras personuppgifter?', a: 'Vi följer GDPR och Schrems II. All data lagras i EU.' },
  { q: '14. Kan man få hjälp att förbättra sin pitch?', a: 'Ja, AI:n ger konkreta förbättringsförslag och mallar.' },
  { q: '15. Kan investerare kontakta mig direkt?', a: 'Ja, om du godkänner det.' },
  { q: '16. Kan investerare se vilka andra som pitchat?', a: 'Nej, endast de du delar med.' },
  { q: '17. Hur funkar Premium-analysen?', a: 'Du får en djupare AI-analys, fler datapunkter och en professionell PDF-rapport.' },
  { q: '18. Kan man använda FrejFund för grant-ansökningar?', a: 'Ja, analysen kan användas som underlag för t.ex. Vinnova, Almi, EU SME, EIC Accelerator.' },
  { q: '19. Kan man använda FrejFund för due diligence?', a: 'Ja, rapporten kan användas som underlag för due diligence.' },
  { q: '20. Vem står bakom FrejFund?', a: 'Team och investerare med bakgrund från AI, startups, riskkapital och juridik.' },
  { q: '21. Hur kontaktar jag support eller ger feedback?', a: 'Maila support@frejfund.com.' },
  { q: '22. Vilka språk stöds?', a: 'Svenska och engelska.' },
  { q: '23. Hur rapporterar jag buggar eller fel?', a: 'Maila support@frejfund.com.' },
  { q: '24. Vad händer om jag inte är nöjd?', a: 'Formulär, support och Pitch-Fix-guiden finns för att hjälpa dig – med förtydligande och väg till produktutveckling.' },
];

export default function QA() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-2 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#16475b] tracking-widest text-center mb-10 mt-2 uppercase">Q&amp;A</h1>
      {/* Bakgrundsbild */}
      <Image
        src="/bakgrund.png"
        alt="Q&A bakgrund"
        fill
        className="object-cover -z-10"
        priority
      />
      <div className="w-full max-w-3xl mx-auto bg-white/90 rounded-3xl shadow-xl p-8 border border-gray-200 backdrop-blur-md">
        <div className="flex flex-col gap-4">
          {qaData.map((item, i) => (
            <div key={i} className="rounded-2xl bg-white/80 border border-gray-200 shadow-md overflow-hidden">
              <button
                className="w-full text-left px-6 py-4 font-bold text-lg text-[#16475b] flex justify-between items-center focus:outline-none"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-controls={`qa-answer-${i}`}
              >
                <span>{item.q}</span>
                <span className={`ml-4 transition-transform ${open === i ? 'rotate-90' : ''}`}>▶</span>
              </button>
              {open === i && (
                <div id={`qa-answer-${i}`} className="px-6 pb-4 text-gray-800 text-base animate-fade-in">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 