"use client";
import Image from 'next/image';
import { useState } from 'react';

interface QAItem {
  q: string;
  a: string;
}

const qaData: QAItem[] = [
  { q: 'Vad gör FrejFund i ett nötskal?', a: 'Vi analyserar din affärsidé med AI, identifierar styrkor / luckor och guidar dig till investerings­redo pitch och kapital.' },
  { q: 'Måste jag ha ett registrerat bolag?', a: 'Nej, idéstadie räcker – men vi visar vad som krävs för att bilda bolag innan du söker investerare.' },
  { q: 'Hur lång tid tar Silver-analysen?', a: '10–15 minuter att svara, rapporten levereras inom 30 sekunder.' },
  { q: 'Vilka datapunkter tittar AI-n på?', a: 'Team­profil, marknadsstorlek, traction, konkurrensfördel, risker, ekonomi och kapitalbehov.' },
  { q: 'Kan ni garantera investering?', a: 'Nej – men vi ökar oddsen genom att täppa igen typiska deal-breakers och matcha dig med rätt investerare.' },
  { q: 'Hur fungerar scoring-systemet (0–10)?', a: 'AI viktar 120 parametrar enligt nordiska VC- och ängel­kriterier; 7+ anses investerbart.' },
  { q: 'Är mina svar konfidentiella?', a: 'Ja, data krypteras, lagras i EU-datacenter och delas aldrig utan ditt godkännande.' },
  { q: 'Kan jag exportera rapporten?', a: 'Ja, PDF + delbar länk; Gold- och Platinum-kunder får även PowerPoint-one-pager.' },
  { q: 'Vad kostar det om jag ändrar mina svar?', a: 'Obegränsade omkörningar ingår i Gold (kvartalsvis) och Platinum (löpande).' },
  { q: 'Vilka investerare samarbetar ni med?', a: '70+ nordiska affärsänglar, ALMI Invest-kontor, STOAF, Norrsken VC m.fl.; listan uppdateras kontinuerligt.' },
  { q: 'Tar ni ägarandel?', a: 'Endast i Platinum: 2 % success-fee när du faktiskt tar in kapital, ingen equity up-front.' },
  { q: 'Hur mäter ni "team-kompetens"?', a: 'Kombinerar CV-metadata, track-record och komplementäritet i roller; luckor flaggas automatiskt.' },
  { q: 'Stöder ni non-profit eller impact-bolag?', a: 'Ja – AI-n har särskilda ESG-parametrar och vi samarbetar med impact-fonder.' },
  { q: 'Kan jag bjuda in co-founders att fylla i?', a: 'Ja, dela link med gäst-token; svaren slås samman i en gemensam rapport.' },
  { q: 'Vad gör jag med en röd flagg i rapporten?', a: 'Klicka "Fix-guide" – du får konkreta åtgärder, mallar och resurser för att lösa luckan.' },
  { q: 'Hur ofta uppdateras AI-modellen?', a: 'Kvartalsvis; vi tränar mot färska deal-flow-data och justerar vikter efter investerarnas krav.' },
  { q: 'Stöder ni andra språk än svenska/engelska?', a: 'Input accepteras på båda; rapporten kan automatiskt översättas till engelska för internationella VC.' },
  { q: 'Får jag mänsklig rådgivare?', a: 'Gold kan boka 30 min call; Platinum har dedikerad coach med 4 timmar per månad.' },
  { q: 'Vilken tech-stack bygger plattformen på?', a: 'Next.js, Django, OpenAI-API, Stripe, Postgres – driftas i EU.' },
  { q: 'Kan jag integrera data med mitt CRM?', a: 'Ja, Gold+/API-key: Zapier-flöden till HubSpot, Pipedrive, Notion.' },
  { q: 'Vad krävs för att nå 9–10 i score?', a: 'Starkt, kompletterande team + unik teknik + validerad marknadstraktion + tydlig skalbar affärs­modell.' },
  { q: 'Får jag feedback på pitch-deck?', a: 'Platinum: AI-review + mänsklig design-check; Gold kan köpa som add-on.' },
  { q: 'Har ni student- eller ideell rabatt?', a: 'Ja, 50 % på Gold för studenter och ideella projekt med org-nummer.' },
  { q: 'Kan AI-n skriva min executive summary?', a: 'Ja – efter analys kan du klicka "Generate summary"; sparas i Word/Google Docs-format.' },
  { q: 'Hur hanteras personuppgifter enligt GDPR?', a: 'Vi följer Schrems II-rekommendationer, har DPA med OpenAI och anonymiserar känsliga fält.' },
  { q: 'Funkar plattformen för rena e-handelsidéer?', a: 'Absolut – AI byter fråga-set beroende på bransch (SaaS, e-com, medtech, etc.).' },
  { q: 'Kan jag ladda upp Excel-budget?', a: 'Ja, Gold/Platinum: systemet parses .xlsx och validerar antaganden mot branschsnitt.' },
  { q: 'Vad händer om jag redan har investerare?', a: 'Rapporten ger dem en extern validation; vi kan även stötta i nästa runda.' },
  { q: 'Hur skiljer ni er från acceleratorer?', a: 'Vi är on-demand, remote-först och tar ingen equity förrän du får kapital; du väljer tempo.' },
  { q: 'Kan jag pausa mitt abonnemang?', a: 'Ja, Gold månadsabonnemang kan frysa i upp till 3 månader utan extra kostnad.' },
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