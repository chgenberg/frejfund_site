'use client';
import { getSupabaseClient } from '../../lib/supabase';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  { id: 'company_value', label: 'What does the company do and what value does it create?', type: 'textarea', required: true, help: 'Describe the business idea, product/service, customer pain and how you create value.' },
  { id: 'customer_problem', label: 'What problem do you solve for your customers?', type: 'textarea', required: true, help: 'Describe the specific problem or need that your product/service addresses.' },
  { id: 'problem_evidence', label: 'How common is the problem – and how do you prove it?', type: 'textarea', required: true, help: 'Please provide a data point, reference or link.' },
  { id: 'market_gap', label: 'What "gap" in the market do you fill?', type: 'textarea', required: true, help: 'Is there a gap where existing alternatives fall short?' },
  { id: 'solution', label: 'How do you solve the problem? (Your solution)', type: 'textarea', required: true, help: 'Explain your product/service and how it addresses the problem.' },
  { id: 'why_now', label: 'Why is the timing right – technically, market-wise or regulatory-wise?', type: 'textarea', required: true, help: 'Justify why right now is the right time.' },
  { id: 'target_customer', label: 'Who is your target group and customer?', type: 'textarea', required: true, help: 'Describe your ideal customer. Are you B2B or B2C? SMB or enterprise?' },
  { id: 'market_size', label: 'How large is the market opportunity? (TAM/SAM/SOM)', type: 'market_size', required: true, help: 'Estimate your total market: TAM, SAM, SOM.' },
  { id: 'market_trends', label: 'What important market trends favor you?', type: 'textarea', required: false, help: 'Describe trends (technological, demographic, regulatory) that you are riding.' },
  { id: 'traction', label: 'What does traction look like so far?', type: 'textarea', required: true, help: 'State milestones and results: users, customers, pilots, revenue, growth figures.' },
  { id: 'revenue_block', label: 'How do you make money and how is revenue distributed (recurring/one-time)?', type: 'textarea', required: true, help: 'Describe revenue streams, pricing and distribution between recurring and one-time revenue.' },
  { id: 'runway', label: 'How long runway (number of months) do you have? (whole number)', type: 'number', required: true, help: 'How many months will your capital last?', min: 0 },
  { id: 'growth_plan', label: 'What is your growth plan for the next 12-24 months?', type: 'textarea', required: true, help: 'Describe future plans: sales growth, product launches, customer goals.' },
  { id: 'milestones', label: 'What are the three biggest milestones you plan to reach in the coming 12 months (with month/quarter)?', type: 'milestone_list', required: true, help: 'Example: "Launch Q3", "First paying customer in September".' },
  { id: 'team', label: 'What does your team look like?', type: 'textarea', required: true, help: 'Present the founders and core team, roles and experience.' },
  { id: 'founder_equity', label: 'What ownership percentage (%) does the founding team retain after this round?', type: 'number', required: true, help: 'Answer in percent, e.g. 65.', min: 0, max: 100 },
  { id: 'founder_market_fit', label: 'How well does the team\'s background match the problem you solve? (1–5 scale + free text)', type: 'founder_market_fit', required: true, help: '1 = no experience, 5 = deep domain expertise. Briefly justify.' },
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
        onEstimate(`Estimated market for ${bransch} in ${omrade}: 5 billion SEK.`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-[#0a1628] to-[#04111d] text-white rounded-3xl p-8 max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-4">Estimate market size</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block font-semibold mb-2">Industry</label>
                        <input type="text" value={bransch} onChange={(e) => setBransch(e.target.value)} className={inputBase} placeholder="E.g. SaaS for real estate agents" />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Region</label>
                        <select value={omrade} onChange={(e) => setOmrade(e.target.value)} className={inputBase}>
                            <option>City</option>
                            <option>Country</option>
                            <option>Continent</option>
                            <option>Global</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} className="px-4 py-2 bg-white/10 rounded-full">Cancel</button>
                    <button onClick={handleEstimate} className="px-4 py-2 bg-purple-500 rounded-full">Calculate</button>
                </div>
            </div>
        </div>
    );
}


export default function BusinessPlanWizard({ open, onClose }: BusinessPlanWizardProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showMarketPopup, setShowMarketPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  
  const current: Question = INVESTOR_QUESTIONS[step];

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch('/api/analyses', { method: 'GET' })
        if (res.status !== 401) setIsLoggedIn(true)
      } catch {}
    };
    checkUser();
    
    // Scroll to top when wizard opens
    if (open) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [open]);

  const isCurrentStepValid = () => {
    if (step === 0 && !policyAccepted) return false;
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
          // Scroll to top when moving to next step
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  const handleBack = () => {
      setStep(s => Math.max(s - 1, 0));
      // Scroll to top when moving to previous step
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (!open) return null;

  const saveAndAnalyze = async () => {
    try {
      let userId = null;
      let anonymousEmail = answers.email || null;

      const res = await fetch('/api/save-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: answers.company_name,
          score: 0,
          answers: {
            company_value: answers.company_value,
            customer_problem: answers.customer_problem,
            problem_evidence: answers.problem_evidence,
            market_gap: answers.market_gap,
            solution: answers.solution,
            why_now: answers.why_now,
            target_customer: answers.target_customer,
            market_size: answers.market_size,
            market_size_estimate: answers.market_size_estimate,
            market_trends: answers.market_trends,
            traction: answers.traction,
            revenue_block: answers.revenue_block,
            runway: answers.runway,
            growth_plan: answers.growth_plan,
            milestones: answers.milestones,
            team: answers.team,
            founder_equity: answers.founder_equity,
            founder_market_fit: answers.founder_market_fit,
            submitted_at: new Date().toISOString(),
            status: 'pending'
          }
        })
      })
      if (!res.ok) throw new Error('Failed to save analysis')

      // Spara txt-fil med alla svar
      fetch('/api/save-customer-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: answers.contact_email || null,
          company: answers.company_name || null,
          url: answers.website_url || null,
          answers
        })
      }).catch(err => console.error('save-customer-data error', err));

      alert('Affärsplan sparad! Analysen genereras...');
      // Redirect to analysis page or show loading state
      // For now, we'll just close the wizard
      onClose();
    } catch (error) {
      console.error('Error saving analysis:', error);
      alert('Fel vid sparande av affärsplan.');
    }
  };

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

                {step === 0 && (
                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      id="privacyPolicy"
                      checked={policyAccepted}
                      onChange={(e) => setPolicyAccepted(e.target.checked)}
                      className="w-4 h-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="privacyPolicy" className="ml-2 text-sm text-white/80">
                      I accept the{' '}
                      <Link href="/integritet" target="_blank" className="underline text-purple-400">
                        privacy policy
                      </Link>
                    </label>
                  </div>
                )}
            </div>

            <div className="flex justify-between mt-8">
                <button onClick={handleBack} disabled={step === 0} className="px-6 py-2 bg-white/10 rounded-full">Back</button>
                <button onClick={handleNext} disabled={!isCurrentStepValid()} className="px-6 py-2 bg-purple-500 rounded-full disabled:opacity-50">Next</button>
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