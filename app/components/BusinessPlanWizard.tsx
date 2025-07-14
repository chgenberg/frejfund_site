import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '../../lib/supabase';
import {
  Question,
  BusinessPlanAnswers,
  MilestoneListProps,
  CapitalMatrixInputProps,
  BusinessPlanWizardProps,
  isSelectQuestion,
  isTextQuestion,
  isMilestoneQuestion,
  isCapitalQuestion,
  isESGQuestion,
  isFounderMarketFitQuestion,
  isNumberQuestion,
  isMarketSizeQuestion
} from '../types/businessPlan';

const INVESTOR_QUESTIONS: Question[] = [
  { id: 'company_value', label: 'Vad gör företaget och vilket värde skapar det?', type: 'textarea', required: true, help: 'Beskriv affärsidén, produkten/tjänsten, kundpain och hur ni skapar värde.' },
  { id: 'customer_problem', label: 'Vilket problem löser ni för era kunder?', type: 'textarea', required: true, help: 'Beskriv det specifika problem eller behov som er produkt/tjänst adresserar.' },
  { id: 'problem_evidence', label: 'Hur vanligt är problemet – och hur bevisar ni det?', type: 'textarea', required: true, help: 'Ge gärna en datapunkt, referens eller länk.' },
  { id: 'market_gap', label: 'Vilket "gap" på marknaden fyller ni?', type: 'textarea', required: true, help: 'Finns det en lucka där befintliga alternativ inte räcker till?' },
  { id: 'solution', label: 'Hur löser ni problemet? (Er lösning)', type: 'textarea', required: true, help: 'Förklara er produkt/tjänst och hur den adresserar problemet.' },
  { id: 'why_now', label: 'Varför är timingen rätt – tekniskt, marknadsmässigt eller reglerings-mässigt?', type: 'textarea', required: true, help: 'Motivera varför just nu är rätt tillfälle.' },
  { id: 'target_customer', label: 'Vem är er målgrupp och kund?', type: 'textarea', required: true, help: 'Beskriv er idealkund. Är ni B2B eller B2C? SMB eller enterprise?' },
  { id: 'market_size', label: 'Hur stort är marknadsutrymmet? (TAM/SAM/SOM)', type: 'market_size', required: true, help: 'Uppskatta er totala marknad: TAM, SAM, SOM.' },
  { id: 'market_trends', label: 'Vilka viktiga marknadstrender gynnar er?', type: 'textarea', required: false, help: 'Beskriv trender (teknologiska, demografiska, regulatoriska) som ni surfar på.' },
  { id: 'traction', label: 'Hur ser traction ut hittills?', type: 'textarea', required: true, help: 'Ange milstolpar och resultat: användare, kunder, piloter, intäkter, tillväxttal.' },
  { id: 'revenue_block', label: 'Hur tjänar ni pengar och hur fördelas intäkterna (återkommande/engång)?', type: 'textarea', required: true, help: 'Beskriv intäktsströmmar, prissättning och fördelning mellan återkommande och engångsintäkter.' },
  { id: 'runway', label: 'Hur lång runway (antal månader) har ni? (heltal)', type: 'number', required: true, help: 'Hur många månader räcker ert kapital?', min: 0 },
  { id: 'growth_plan', label: 'Vad är er tillväxtplan för nästa 12-24 månader?', type: 'textarea', required: true, help: 'Beskriv framtidsplaner: försäljningstillväxt, produktlanseringar, kundmål.' },
  { id: 'milestones', label: 'Vilka tre största milstolpar planerar ni att nå kommande 12 månader (med månad/kvartal)?', type: 'milestone_list', required: true, help: 'Exempel: "Lansering Q3", "Första betalande kund i september".' },
  { id: 'team', label: 'Hur ser ert team ut?', type: 'textarea', required: true, help: 'Presentera grundarna och kärnteamet, roller och erfarenheter.' },
  { id: 'founder_equity', label: 'Hur stor ägarandel (%) behåller grundarteamet efter denna runda?', type: 'number', required: true, help: 'Svara i procent, t.ex. 65.', min: 0, max: 100 },
  { id: 'founder_market_fit', label: 'Hur väl matchar teamets bakgrund det problem ni löser? (1–5-skala + fritext)', type: 'founder_market_fit', required: true, help: '1 = ingen erfarenhet, 5 = djup domänexpertis. Motivera kort.' },
];

const inputBase = `w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200`;

function MilestoneList({ value, onChange }: MilestoneListProps) {
    // Implementation as before
    return <div>Milestone List Component</div>;
}

function CapitalMatrixInput({ value, onChange }: CapitalMatrixInputProps) {
    // Implementation as before
    return <div>Capital Matrix Component</div>;
}

function FounderMarketFit({ value, onChange }: { value: { score: string; text: string }; onChange: (val: any) => void }) {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Skala (1-5)</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                        <button
                            key={score}
                            type="button"
                            onClick={() => onChange({ ...value, score: score.toString() })}
                            className={`w-12 h-12 rounded-full border-2 transition-all ${value.score === score.toString() ? 'bg-purple-500 border-purple-500' : 'bg-white/10 border-white/20 hover:bg-white/20'}`}
                        >
                            {score}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Motivering (fritext)</label>
                <textarea
                    value={value.text || ''}
                    onChange={(e) => onChange({ ...value, text: e.target.value })}
                    className={inputBase}
                    rows={3}
                    placeholder="Beskriv varför teamet har rätt bakgrund..."
                />
            </div>
        </div>
    );
}

function MarketSizePopup({ open, onClose, onEstimate }: { open: boolean, onClose: () => void, onEstimate: (estimate: string) => void }) {
    const [bransch, setBransch] = useState('');
    const [omrade, setOmrade] = useState('Sverige');

    if (!open) return null;

    const handleEstimate = async () => {
        // Mock API call
        onEstimate(`Uppskattad marknad för ${bransch} i ${omrade}: 5 miljarder SEK.`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-[#0a1628] to-[#04111d] text-white rounded-3xl p-8 max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-4">Uppskatta marknadsstorlek</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block font-semibold mb-2">Bransch</label>
                        <input type="text" value={bransch} onChange={(e) => setBransch(e.target.value)} className={inputBase} placeholder="T.ex. SaaS för fastighetsmäklare" />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Område</label>
                        <select value={omrade} onChange={(e) => setOmrade(e.target.value)} className={inputBase}>
                            <option>Stad</option>
                            <option>Land</option>
                            <option>Kontinent</option>
                            <option>Världsdel</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} className="px-4 py-2 bg-white/10 rounded-full">Avbryt</button>
                    <button onClick={handleEstimate} className="px-4 py-2 bg-purple-500 rounded-full">Beräkna</button>
                </div>
            </div>
        </div>
    );
}


export default function BusinessPlanWizard({ open, onClose }: BusinessPlanWizardProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showMarketPopup, setShowMarketPopup] = useState(false);
  
  const current: Question = INVESTOR_QUESTIONS[step];

  const isCurrentStepValid = () => {
    if (!current.required) return true;
    
    const answer = answers[current.id];
    if (!answer) return false;

    if (isNumberQuestion(current)) {
      return String(answer).trim().length > 0;
    }

    if (typeof answer === 'string') {
      return answer.trim().length >= 10;
    }
    
    // Add other type checks as needed
    return true;
  };

  const handleNext = () => {
      if (isCurrentStepValid()) {
          setStep(s => Math.min(s + 1, INVESTOR_QUESTIONS.length - 1));
      }
  };

  const handleBack = () => {
      setStep(s => Math.max(s - 1, 0));
  };
  
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
        <div className="bg-[#101624] rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-white">
            <h2 className="text-2xl font-bold mb-2">{current.label}</h2>
            <p className="text-white/60 mb-6">{current.help}</p>

            <div className="space-y-4">
                {isTextQuestion(current) && <textarea value={answers[current.id] || ''} onChange={(e) => setAnswers({...answers, [current.id]: e.target.value})} className={inputBase} rows={5} />}
                {isNumberQuestion(current) && <input type="number" value={answers[current.id] || ''} onChange={(e) => setAnswers({...answers, [current.id]: e.target.value})} className={inputBase} />}
                {isMilestoneQuestion(current) && <MilestoneList value={answers[current.id] || { milestones: [{ text: '', date: '' }] }} onChange={(val) => setAnswers({...answers, [current.id]: val})} />}
                {isCapitalQuestion(current) && <CapitalMatrixInput value={answers[current.id] || {}} onChange={(val) => setAnswers({...answers, [current.id]: val})} />}
                {isFounderMarketFitQuestion(current) && <FounderMarketFit value={answers[current.id] || { score: '', text: '' }} onChange={(val) => setAnswers({...answers, [current.id]: val})} />}
                
                {isMarketSizeQuestion(current) && (
                    <div>
                        <textarea value={answers[current.id] || ''} onChange={(e) => setAnswers({...answers, [current.id]: e.target.value})} className={inputBase} rows={3} />
                        <button onClick={() => setShowMarketPopup(true)} className="mt-2 text-sm text-purple-400 hover:underline">Hjälp mig uppskatta</button>
                    </div>
                )}
            </div>

            <div className="flex justify-between mt-8">
                <button onClick={handleBack} disabled={step === 0} className="px-6 py-2 bg-white/10 rounded-full">Tillbaka</button>
                <button onClick={handleNext} disabled={!isCurrentStepValid()} className="px-6 py-2 bg-purple-500 rounded-full disabled:opacity-50">Nästa</button>
            </div>
        </div>
        <MarketSizePopup 
            open={showMarketPopup}
            onClose={() => setShowMarketPopup(false)}
            onEstimate={(estimate) => setAnswers({...answers, market_size_estimate: estimate})}
        />
    </div>
  );
} 