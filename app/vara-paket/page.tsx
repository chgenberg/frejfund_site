"use client";

import Image from 'next/image';
import { useState } from 'react';
import { useLoginModal } from '../components/LoginModal';
import { useRouter } from 'next/navigation';

const AVERAGES = {
  silver: 0.7,
  gold: 2.0,
  black: 3.0,
};

function getChance(requested: number, average: number) {
  if (requested <= average) return 80;
  if (requested > average * 2.5) return 5;
  if (requested > average * 2) return 15;
  if (requested > average * 1.5) return 30;
  if (requested > average * 1.2) return 50;
  return 65;
}

// Feature explanations
const FEATURE_EXPLANATIONS: { [key: string]: string } = {
  "PDF light": "En grundläggande PDF-rapport med dina analysresultat och rekommendationer. Perfekt för att få en första bild av ditt företags potential.",
  "PDF full": "En detaljerad PDF-rapport med djupgående analys, marknadsinsikter, konkurrentanalys och konkreta handlingsplaner. Inkluderar även interaktiva grafer och visualiseringar.",
  "interaktiv dashboard": "Ett dynamiskt kontrollpanel där du kan utforska dina data i realtid, filtrera resultat och se trender över tid. Uppdateras automatiskt när nya data tillkommer.",
  "deck-export": "Automatiskt genererade presentationsbilder i PowerPoint-format, perfekt för investerarpitchar och team-möten. Inkluderar alla viktiga KPI:er och insikter.",
  "dataroom-länk": "En säker, delbar länk till en virtuell dataroom där potentiella investerare kan granska all dokumentation och data på ett strukturerat sätt.",
  "TTS-svar": "Text-to-Speech funktion som läser upp feedback och analyser på 5 olika språk. Perfekt för internationella team och investerare.",
  "auto-brand": "Automatisk anpassning av alla material med ditt företags varumärke, färger och grafiska element för en professionell och konsekvent presentation.",
  "internationella multiplar": "Jämförelse med liknande företag globalt, med justeringar för lokala marknadsförhållanden och branschtrender.",
  "simuleringar": "Avancerade scenarioberäkningar som visar hur olika beslut påverkar ditt företags värde och tillväxtpotential.",
  "warm intros": "Personliga introduktioner till relevanta investerare baserat på din bransch, stadie och behov.",
  "CRM-sync": "Automatisk synkronisering med ditt CRM-system för att hålla koll på alla investerarkontakter och möten.",
  "dedikerad CSM": "En personlig Customer Success Manager som hjälper dig maximera värdet av FrejFund och stöttar dig i din tillväxtresa.",
};

export default function Pricing() {
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const openLoginModal = useLoginModal();
  const router = useRouter();
  const [input, setInput] = useState(1500000);
  const requestedMSEK = input / 1_000_000;
  const chanceSilver = getChance(requestedMSEK, AVERAGES.silver);
  const chanceGold = getChance(requestedMSEK, AVERAGES.gold);
  const chanceBlack = getChance(requestedMSEK, AVERAGES.black);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#16475b] tracking-widest text-center mb-10 mt-2 uppercase">VÅRA PAKET</h1>
      
      {/* Bakgrundsbild */}
      <Image
        src="/bakgrund.png"
        alt="Bakgrund"
        fill
        className="object-cover -z-10"
        priority
      />

      <div className="w-full max-w-7xl">
        {/* Package Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* SILVER Package */}
          <div className="bg-white/95 rounded-[2.5rem] shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-extrabold text-[#16475b] mb-2">SILVER</h2>
              <div className="text-3xl font-bold text-[#16475b] mb-2">"Explorer"</div>
              <div className="text-4xl font-black text-[#16475b] mb-2">0 kr</div>
              <div className="text-sm text-gray-600">(konto krävs)</div>
            </div>
            
            <div className="space-y-6">
              <Feature title="AI-Formulär" value="Basformulär 15 min" />
              <Feature title="Rapportformat" value="PDF light" onInfoClick={() => setActivePopup("PDF light")} />
              <Feature title="Pitch-Pingvinen" value="1 inspelning / månad" />
              <Feature title="Benchmarks" value="Generellt Norden" />
              <Feature title="Support SLA" value="Community-forum" />
              <Feature title="Perfekt för" value="Idé-test, studenter" />
            </div>

            <div className="mt-8 text-center">
              <button
                className="bg-[#16475b] text-white font-bold rounded-full px-8 py-3 shadow-lg hover:bg-[#133a4a] transition-colors text-lg tracking-widest uppercase w-full"
                onClick={openLoginModal}
              >
                Börja gratis
              </button>
            </div>
          </div>

          {/* GOLD Package */}
          <div className="bg-white/95 rounded-[2.5rem] shadow-xl border-2 border-[#7edcff] p-8 backdrop-blur-sm relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#7edcff] text-[#16475b] font-bold px-6 py-1 rounded-full text-sm">
              POPULÄR
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-extrabold text-[#16475b] mb-2">GOLD</h2>
              <div className="text-3xl font-bold text-[#16475b] mb-2">"Builder"</div>
              <div className="text-4xl font-black text-[#16475b] mb-2">990 kr</div>
              <div className="text-sm text-gray-600">/ analys eller 5 990 kr / år</div>
            </div>
            
            <div className="space-y-6">
              <Feature title="AI-Formulär" value="Fullt formulär 30 min" />
              <Feature title="Rapportformat" value="PDF full + interaktiv dashboard" onInfoClick={() => setActivePopup("PDF full")} />
              <Feature title="Pitch-Pingvinen" value="10 inspelningar / månad" />
              <Feature title="Auto-Deck Snapshot" value="✅ (6 slides)" />
              <Feature title="Benchmarks" value="Bransch-specifika" />
              <Feature title="Risk-& Fail-Cost-Calc" value="✅" />
              <Feature title="Investor Radar" value="Lista med änglar" />
              <Feature title="Partner-rabatter" value="10 % på IP-jurist" />
              <Feature title="Support SLA" value="24 h e-post / 1 call" />
              <Feature title="Perfekt för" value="Aktiva pre-seed-grundare" />
            </div>

            <div className="mt-8 text-center">
              <button
                className="bg-[#7edcff] text-[#16475b] font-bold rounded-full px-8 py-3 shadow-lg hover:bg-[#16475b] hover:text-white transition-colors text-lg tracking-widest uppercase w-full"
                onClick={() => router.push('/paket/gold')}
              >
                Välj Gold
              </button>
            </div>
          </div>

          {/* BLACK Package */}
          <div className="bg-black rounded-[2.5rem] shadow-xl border border-gray-900 p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-extrabold text-white mb-2">BLACK</h2>
              <div className="text-3xl font-bold text-white mb-2">"Partner"</div>
              <div className="text-4xl font-black text-white mb-2">24 900 kr</div>
              <div className="text-sm text-white/80">/ år + 2 % success-fee</div>
            </div>
            
            <div className="space-y-6">
              <Feature title="AI-Formulär" value="Fullt + modul för due-diligence-bilagor" textWhite />
              <Feature title="Rapportformat" value="PDF full, deck-export, delad dataroom-länk" onInfoClick={() => setActivePopup("deck-export")} textWhite />
              <Feature title="Pitch-Pingvinen" value="Obegränsat + TTS-svar på 5 språk" onInfoClick={() => setActivePopup("TTS-svar")} textWhite />
              <Feature title="Auto-Deck Snapshot" value="✅ (12 slides + auto-brand)" onInfoClick={() => setActivePopup("auto-brand")} textWhite />
              <Feature title="Benchmarks" value="Bransch + internationella multiplar" onInfoClick={() => setActivePopup("internationella multiplar")} textWhite />
              <Feature title="Risk-& Fail-Cost-Calc" value="✅ + simuleringar" onInfoClick={() => setActivePopup("simuleringar")} textWhite />
              <Feature title="Investor Radar" value="Lista + warm intros + CRM-sync" onInfoClick={() => setActivePopup("warm intros")} textWhite />
              <Feature title="Partner-rabatter" value="Upp till 30 % på partnertjänster" textWhite />
              <Feature title="Support SLA" value="4 h svar-SLA, dedikerad CSM" onInfoClick={() => setActivePopup("dedikerad CSM")} textWhite />
              <Feature title="Perfekt för" value="Scale-ups som ska resa >3 Mkr inom 12 mån" textWhite />
            </div>

            <div className="mt-8 text-center">
              <button
                className="bg-black text-white font-bold rounded-full px-8 py-3 shadow-lg border border-[#7edcff] hover:bg-[#7edcff] hover:text-black transition-colors text-lg tracking-widest uppercase w-full"
                onClick={() => router.push('/paket/platinum')}
              >
                Välj Black
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/95 rounded-[2.5rem] shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-extrabold text-[#16475b] mb-6 text-center">Vanliga frågor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-[#16475b] mb-2">Kan jag byta paket senare?</h3>
              <p className="text-gray-700">Ja, du kan uppgradera när som helst. Vid nedgradering gäller avtalets längd.</p>
            </div>
            <div>
              <h3 className="font-bold text-[#16475b] mb-2">Vad är success-fee?</h3>
              <p className="text-gray-700">En liten procent av investeringen när vi hjälper dig hitta kapital.</p>
            </div>
            <div>
              <h3 className="font-bold text-[#16475b] mb-2">Hur fungerar betalning?</h3>
              <p className="text-gray-700">Faktura eller kortbetalning. Årspaket kan delas upp i kvartalsbetalningar.</p>
            </div>
            <div>
              <h3 className="font-bold text-[#16475b] mb-2">Finns det studentrabatt?</h3>
              <p className="text-gray-700">Ja, kontakta oss med din studentmail för specialpriser.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Popup */}
      {activePopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full relative animate-fade-in">
            <button
              onClick={() => setActivePopup(null)}
              className="absolute top-4 right-4 text-[#16475b] text-2xl font-bold hover:text-[#133a4a] focus:outline-none"
            >
              ×
            </button>
            <h3 className="text-xl font-bold text-[#16475b] mb-4">{activePopup}</h3>
            <p className="text-gray-700 leading-relaxed">
              {FEATURE_EXPLANATIONS[activePopup]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Feature component for consistent styling
function Feature({ title, value, onInfoClick, textWhite }: { title: string; value: string; onInfoClick?: () => void; textWhite?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className={textWhite ? "text-sm font-semibold text-white" : "text-sm font-semibold text-[#16475b]"}>{title}</span>
      <div className="flex items-center gap-2">
        <span className={textWhite ? "text-white" : "text-gray-700"}>{value}</span>
        {onInfoClick && (
          <button
            onClick={onInfoClick}
            className={textWhite ? "text-white hover:text-[#7edcff] focus:outline-none" : "text-[#16475b] hover:text-[#133a4a] focus:outline-none"}
            aria-label="Läs mer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
} 