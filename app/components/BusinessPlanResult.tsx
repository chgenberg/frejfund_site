import React, { useState, useEffect, ReactNode } from 'react';
import Image from 'next/image';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import SectionFeedback from './SectionFeedback';

interface ResultProps {
  score: number;
  answers: Record<string, unknown>;
  feedback?: Record<string, string>;
  subscriptionLevel?: 'silver' | 'gold' | 'platinum';
}

interface CompetitorAnalysis {
  name: string;
  url: string;
  analysis?: string;
  error?: string;
}

const getScoreLabel = (score: number) => {
  if (score >= 95) return { 
    emoji: '🏆', 
    label: 'Exceptionell (Top 1%)', 
    summary: 'Din affärsplan är exceptionell och visar på en mycket lovande framtid.',
    strengths: [
      'Utmärkt team med relevant erfarenhet',
      'Tydlig och unik lösning på ett verkligt problem',
      'Stor och växande marknad med tydlig tillväxtpotential'
    ],
    weaknesses: [
      'Fokusera på att skala upp snabbt',
      'Överväg strategiska partnerskap'
    ]
  };
  if (score >= 85) return { 
    emoji: '🚀', 
    label: 'Deal-ready (Mycket stark)', 
    summary: 'Din affärsplan är mycket lovande och redo för investerare.',
    strengths: [
      'Stark grund med tydlig vision',
      'Validerad marknad med tillväxtpotential',
      'Tydlig affärsmodell'
    ],
    weaknesses: [
      'Förbättra teamets kompetensprofil',
      'Utveckla tydligare konkurrensfördelar'
    ]
  };
  if (score >= 75) return { 
    emoji: '⭐', 
    label: 'Investable (Bra potential)', 
    summary: 'Din affärsplan har potential men behöver några justeringar.',
    strengths: [
      'Intressant marknad',
      'Tydlig affärsidé',
      'Grundläggande team på plats'
    ],
    weaknesses: [
      'Förstärk teamet med nyckelkompetenser',
      'Skärp marknadsanalysen',
      'Utveckla tydligare värdeerbjudande'
    ]
  };
  if (score >= 50) return { 
    emoji: '⚙️', 
    label: 'Potential (Kräver utveckling)', 
    summary: 'Din affärsplan visar potential men behöver betydande förbättringar.',
    strengths: [
      'Intressant affärsidé',
      'Några lovande marknadstrender'
    ],
    weaknesses: [
      'Förstärk teamet',
      'Skärp problemformuleringen',
      'Förbättra marknadsanalysen',
      'Utveckla tydligare affärsmodell'
    ]
  };
  return { 
    emoji: '🚧', 
    label: 'Under utveckling', 
    summary: 'Din affärsplan behöver omfattande omarbetning.',
    strengths: [
      'Grundläggande affärsidé på plats'
    ],
    weaknesses: [
      'Bygg ut teamet',
      'Skärp problemformuleringen',
      'Förbättra marknadsanalysen',
      'Utveckla tydligare affärsmodell',
      'Förstärk konkurrensfördelarna'
    ]
  };
};

const getScoreComparison = (score: number) => {
  // Simulerad data - i produktion skulle detta komma från en databas
  const percentiles = {
    95: 99,
    85: 92,
    75: 85,
    50: 70,
    0: 50
  };
  
  let percentile = 50;
  for (const [threshold, value] of Object.entries(percentiles)) {
    if (score >= Number(threshold)) {
      percentile = value;
      break;
    }
  }
  
  return percentile;
};

const getMarketSizeData = (marketValue: string) => {
  // Simulerad data - i produktion skulle detta komma från en databas
  const value = marketValue.toLowerCase().includes('miljard') ? 1000 : 100;
  return {
    tam: value,
    sam: value * 0.3,
    som: value * 0.05
  };
};

// Helper för dummy-data
const getOr = (val: ReactNode, fallback: ReactNode): ReactNode => {
  if (val && (typeof val === 'string' ? val.length > 0 : true)) return val;
  if (typeof fallback === 'string' && fallback.toLowerCase().includes('ej angiv')) {
    return <span style={{ color: '#16475b' }}>{fallback}</span>;
  }
  return fallback;
};

export default function BusinessPlanResult({ score: _score, answers, feedback = {}, subscriptionLevel = 'silver' }: ResultProps) {
  const safeAnswers = answers as Record<string, Record<string, string>>;
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [motivation, setMotivation] = useState('');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [loadingScore, setLoadingScore] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [competitorAnalysis, setCompetitorAnalysis] = useState<CompetitorAnalysis[]>([]);
  const [loadingCompetitors, setLoadingCompetitors] = useState(false);
  const [competitorError, setCompetitorError] = useState<string | null>(null);
  const [showScoreInfo, setShowScoreInfo] = useState(false);
  const [pitchDeckLoading, setPitchDeckLoading] = useState(false);
  const [allAiFeedback, setAllAiFeedback] = useState<Record<string, string>>({});
  const [loadingAiFeedback, setLoadingAiFeedback] = useState(true);
  
  const scoreComparison = getScoreComparison(_score);
  const marketData = getMarketSizeData(safeAnswers.market_size?.market_value || '0');
  const scoreInfo = getScoreLabel(_score);

  // Sektioner att visa feedback för
  const sectionKeys = [
    { key: 'business_idea', label: 'Affärsidé' },
    { key: 'market_analysis', label: 'Marknadsanalys' }, 
    { key: 'team', label: 'Team' },
    { key: 'competition', label: 'Konkurrensanalys' },
    { key: 'funding', label: 'Finansiering' }
  ];

  // Hämta AI-feedback för alla sektioner direkt
  useEffect(() => {
    const fetchAllAiFeedback = async () => {
      setLoadingAiFeedback(true);
      const feedbackPromises = sectionKeys.map(async ({ key, label }) => {
        try {
          const response = await fetch('/api/ai-feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              section: key, 
              answers: answers,
              questionText: JSON.stringify(answers)
            })
          });
          const data = await response.json();
          return { key, feedback: data.feedback || `Analyserar ${label.toLowerCase()}...` };
        } catch (error) {
          return { key, feedback: `Kunde inte generera feedback för ${label.toLowerCase()}.` };
        }
      });

      const results = await Promise.all(feedbackPromises);
      const feedbackMap: Record<string, string> = {};
      results.forEach(({ key, feedback }) => {
        feedbackMap[key] = feedback;
      });
      
      setAllAiFeedback(feedbackMap);
      setLoadingAiFeedback(false);
    };

    fetchAllAiFeedback();
  }, [answers]);

  useEffect(() => {
    setLoadingScore(true);
    fetch('/api/ai-score-businessplan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    })
      .then(res => res.json())
      .then(data => {
        setAiScore(data.score);
        setMotivation(data.motivation || scoreInfo.summary);
        setStrengths(data.strengths || scoreInfo.strengths.join(', '));
        setWeaknesses(data.weaknesses || scoreInfo.weaknesses.join(', '));
      })
      .catch(error => {
        console.error('Error fetching score:', error);
        setMotivation(scoreInfo.summary);
        setStrengths(scoreInfo.strengths.join(', '));
        setWeaknesses(scoreInfo.weaknesses.join(', '));
      })
      .finally(() => setLoadingScore(false));
  }, [answers]);

  useEffect(() => {
    async function fetchCompetitors() {
      setLoadingCompetitors(true);
      setCompetitorError(null);
      try {
        const res = await fetch('/api/analyze-competitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers })
        });
        const data = await res.json();
        setCompetitorAnalysis(data.competitors || []);
      } catch (error) {
        setCompetitorError('Kunde inte hämta konkurrensanalys.');
      } finally {
        setLoadingCompetitors(false);
      }
    }
    fetchCompetitors();
  }, [answers]);

  const handlePitchDeckGeneration = async () => {
    setPitchDeckLoading(true);
    try {
      const response = await fetch('/api/generate-pitchdeck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, score: _score })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pitch-deck.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Kunde inte generera pitch deck. Försök igen senare.');
      }
    } catch (error) {
      console.error('Error generating pitch deck:', error);
      alert('Ett fel uppstod vid generering av pitch deck.');
    } finally {
      setPitchDeckLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#7edc7a'; // Grön
    if (score >= 60) return '#ffd700'; // Gul
    return '#ff6b6b'; // Röd
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* SCORE HEADER ALLRA HÖGST UPP */}
      <div className="relative z-20 w-full flex justify-center pt-8 pb-2">
        <div className="bg-white/95 rounded-3xl shadow-xl border border-[#16475b] p-8 flex flex-col items-center w-full max-w-2xl">
          {loadingScore ? (
            <div className="text-[#16475b] text-xl font-bold flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16475b] mb-4"></div>
              AI sätter betyg på din affärsplan...
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center mb-2">
                <div className="w-48 h-48">
                  <CircularProgressbar
                    value={_score}
                    text={`${_score}`}
                    styles={buildStyles({
                      pathColor: getScoreColor(_score),
                      textColor: '#16475b',
                      trailColor: '#eaf6fa',
                    })}
                  />
                </div>
              </div>
              <div className="text-lg text-[#16475b] font-semibold mt-2 mb-1">{motivation}</div>
              <div className="flex flex-col gap-2 w-full mt-2">
                <div className="bg-[#eaf6fa] rounded-xl p-3 text-[#16475b] text-sm"><b>Styrkor:</b> {strengths}</div>
                <div className="bg-[#fff0f0] rounded-xl p-3 text-[#16475b] text-sm"><b>Svagheter:</b> {weaknesses}</div>
              </div>
            </>
          )}
          <button
            className="mt-2 text-[#2a6b8a] underline text-base hover:text-[#16475b] focus:outline-none"
            onClick={() => setShowScoreInfo(true)}
          >
            Vad betyder score?
          </button>
          <div className="mt-4 text-lg text-[#16475b] text-center font-medium max-w-2xl">
            {scoreInfo.label}
          </div>
          <div className="mt-4 bg-[#eaf6fa] rounded-xl p-4 text-[#16475b] text-base text-center max-w-xl">
            {scoreInfo.label}
          </div>
        </div>
      </div>

      {/* Bakgrundsbild */}
      <Image
        src="/brain.png"
        alt="Brain"
        fill
        className="object-cover"
        priority
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full space-y-8">
          {/* SCORE INFO MODAL */}
          {showScoreInfo && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="bg-white rounded-3xl shadow-2xl border border-[#16475b] max-w-lg w-full p-8 relative animate-fade-in">
                <button
                  onClick={() => setShowScoreInfo(false)}
                  className="absolute top-4 right-4 text-[#16475b] text-2xl font-bold hover:text-[#2a6b8a] focus:outline-none"
                  aria-label="Stäng"
                >×</button>
                <h2 className="text-2xl font-bold text-[#16475b] mb-4 text-center">Vad betyder score?</h2>
                <ul className="space-y-4 text-[#16475b]">
                  <li><span className="text-3xl">🏆</span> <b>95–100:</b> Top 1% – Din affärsplan är exceptionell och redo för VC eller internationell expansion.</li>
                  <li><span className="text-3xl">🚀</span> <b>85–94:</b> Deal-ready – Mycket stark, redo för investerare och tillväxt.</li>
                  <li><span className="text-3xl">⭐</span> <b>75–84:</b> Investable with guidance – Bra grund, men behöver viss utveckling.</li>
                  <li><span className="text-3xl">⚙️</span> <b>50–74:</b> Potential, men kräver jobb – Intressant idé, men flera områden behöver stärkas.</li>
                  <li><span className="text-3xl">🚧</span> <b>0–49:</b> Under byggtid – Affärsplanen behöver omarbetas och utvecklas vidare.</li>
                </ul>
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowScoreInfo(false)}
                    className="bg-[#16475b] text-white font-bold rounded-full px-6 py-2 shadow hover:bg-[#2a6b8a] transition-colors"
                  >Stäng</button>
                </div>
              </div>
            </div>
          )}

          {/* Executive Summary & Demo */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#16475b] mb-8 text-[#04121d]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-[#16475b] mb-2 flex items-center gap-2">
                  <span>🚀</span> Executive Summary
                </h1>
                <div className="text-lg text-[#16475b] mb-2">
                  {safeAnswers.executive_summary?.summary || 'Ingen sammanfattning angiven.'}
                </div>
                {safeAnswers.executive_summary?.demo_link && (
                  <div className="mt-2">
                    <a href={safeAnswers.executive_summary.demo_link} target="_blank" rel="noopener noreferrer" className="underline text-[#2a6b8a] font-semibold">Se demo/video</a>
                  </div>
                )}
              </div>
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="text-6xl mb-2">{scoreInfo.emoji}</div>
                <div className="text-5xl font-bold text-[#16475b]">{_score}</div>
                <div className="text-lg text-[#16475b] font-semibold">{scoreInfo.label}</div>
              </div>
            </div>
            
            {/* Pitch Deck Generation Button */}
            <div className="mt-6 pt-6 border-t border-[#16475b]/20">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <button
                  onClick={handlePitchDeckGeneration}
                  disabled={pitchDeckLoading}
                  className="bg-gradient-to-r from-[#16475b] to-[#2a6b8a] text-white font-bold rounded-full px-8 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  {pitchDeckLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Genererar pitch deck...
                    </>
                  ) : (
                    <>
                      <span className="text-xl">📊</span>
                      Generera AI Pitch Deck (PDF)
                    </>
                  )}
                </button>
                <div className="text-sm text-[#16475b] text-center">
                  <div className="font-semibold">Professionell pitch deck</div>
                  <div>Baserad på dina svar • Redo för investerare</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI-feedback för sektioner */}
          <div className="space-y-4">
            {sectionKeys.map(({ key, label }) => (
              <div key={key} className="bg-[#eaf6fa] rounded-2xl p-4 shadow border border-[#16475b]/20">
                <div className="font-bold text-[#16475b] mb-1">AI-feedback för {label}:</div>
                <SectionFeedback section={key} text={safeAnswers[key] ? JSON.stringify(safeAnswers[key]) : ''} />
              </div>
            ))}
          </div>

          {/* Problem & Lösning */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa] flex flex-col md:flex-row gap-6 text-[#04121d]">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>❓</span> Problem</h2>
              <div className="text-[#16475b] mb-2">{getOr(safeAnswers.business_idea?.what_you_do, 'Ej angivet.')}</div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>💡</span> Lösning</h2>
              <div className="text-[#16475b] mb-2">{getOr(safeAnswers.business_idea?.why_unique, 'Ej angivet.')}</div>
            </div>
          </div>

          {/* Marknad (TAM/SAM/SOM) */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa] text-[#04121d]">
            <h2 className="text-xl font-bold text-[#16475b] mb-4 flex items-center gap-2"><span>📊</span> Marknad</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-2">
                <div className="text-[#04121d]"><b>TAM:</b> {getOr(safeAnswers.market_details?.tam, 'Ej angivet')}</div>
                <div className="text-[#04121d]"><b>SAM:</b> {getOr(safeAnswers.market_details?.sam, 'Ej angivet')}</div>
                <div className="text-[#04121d]"><b>SOM:</b> {getOr(safeAnswers.market_details?.som, 'Ej angivet')}</div>
                <div className="text-xs text-[#2a6b8a]">Källa: {getOr(safeAnswers.market_details?.market_source, 'Ej angiven')}</div>
              </div>
              {/* Dummy funnel-graf */}
              <div className="flex-1 flex items-center justify-center">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <ellipse cx="60" cy="40" rx="50" ry="20" fill="#7edcff" fillOpacity="0.3" />
                  <ellipse cx="60" cy="70" rx="35" ry="14" fill="#7edcff" fillOpacity="0.5" />
                  <ellipse cx="60" cy="100" rx="20" ry="8" fill="#16475b" fillOpacity="0.7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Affärsmodell & Prissättning */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa] grid grid-cols-1 md:grid-cols-2 gap-6 text-[#04121d]">
            <div>
              <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>💰</span> Affärsmodell</h2>
              <div>{getOr(safeAnswers.revenue_model?.model, 'Ej angivet')}</div>
              <div className="text-xs text-[#2a6b8a]">Övriga intäkter: {getOr(safeAnswers.revenue_model?.other_revenue, 'Ej angivet')}</div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>🏷️</span> Prissättning</h2>
              <div>{getOr(safeAnswers.pricing?.price_model, 'Ej angivet')}</div>
              <div className="text-xs text-[#2a6b8a]">Prisintervall: {getOr(safeAnswers.pricing?.price_range, 'Ej angivet')}</div>
            </div>
          </div>

          {/* Traction & Milestones */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa] text-[#04121d]">
            <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>📈</span> Traction & Milstolpar</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div><b>Milstolpar:</b> {getOr(safeAnswers.milestones?.milestones_list, 'Ej angivet')}</div>
              </div>
              <div className="flex-1">
                <div><b>KPI/Traction:</b> {getOr(safeAnswers.milestones?.traction_kpi, 'Ej angivet')}</div>
              </div>
            </div>
          </div>

          {/* Team & Founders' DNA */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa] text-[#04121d]">
            <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>🧬</span> Team & Founders' DNA</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div><b>Roller:</b> {getOr(safeAnswers.founders_dna?.team_roles, 'Ej angivet')}</div>
              </div>
              <div className="flex-1">
                <div><b>Styrkor:</b> {getOr(safeAnswers.founders_dna?.dna_strengths, 'Ej angivet')}</div>
              </div>
            </div>
          </div>

          {/* Kundcase/LOI */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa] text-[#04121d]">
            <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>🤝</span> Kundcase & LOI</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div><b>LOI/länk:</b> {getOr(safeAnswers.customer_cases?.loi_links, 'Ej angivet')}</div>
              </div>
              <div className="flex-1">
                <div><b>Kundcitat:</b> {getOr(safeAnswers.customer_cases?.customer_quotes, 'Ej angivet')}</div>
              </div>
            </div>
          </div>

          {/* Konkurrent-matris */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa] text-[#04121d]">
            <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>⚔️</span> Konkurrenter & Matris</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div><b>Konkurrenter:</b> {getOr(safeAnswers.competition_matrix?.competitors, 'Ej angivet')}</div>
                <div><b>Funktioner vs pris:</b> {getOr(safeAnswers.competition_matrix?.features_vs_price, 'Ej angivet')}</div>
                <div><b>Egen position:</b> {getOr(safeAnswers.competition_matrix?.positioning, 'Ej angivet')}</div>
              </div>
            </div>
          </div>

          {/* AI-driven Konkurrentanalys */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa] text-[#04121d]">
            <h2 className="text-xl font-bold text-[#16475b] mb-4 flex items-center gap-2"><span>🔎</span> AI-Konkurrentanalys</h2>
            {loadingCompetitors && <div className="text-[#16475b]">Hämtar konkurrensanalys...</div>}
            {competitorError && <div className="text-red-600">{competitorError}</div>}
            {!loadingCompetitors && !competitorError && competitorAnalysis.length > 0 && (
              <div className="space-y-6">
                {competitorAnalysis.map((c: any, i) => (
                  <div key={i} className="border-b border-[#eaf6fa] pb-4 mb-4 last:border-b-0 last:mb-0">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="font-bold text-lg">{c.name}</div>
                      {c.url && <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-[#2a6b8a] underline text-sm">{c.url}</a>}
                    </div>
                    {c.error ? (
                      <div className="text-red-600 text-sm">{c.error}</div>
                    ) : (
                      <div className="text-sm space-y-1">
                        <div><b>Styrkor:</b> {c.strengths || '-'}</div>
                        <div><b>Svagheter:</b> {c.weaknesses || '-'}</div>
                        <div><b>Möjligheter för dig:</b> {c.opportunities || '-'}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Budget/Prognos */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa] text-[#04121d]">
            <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>📑</span> Budget & Prognos</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div><b>Budget/prognos:</b> {getOr(safeAnswers.budget_forecast?.forecast_table, 'Ej angivet')}</div>
                <div><b>ARPU:</b> {getOr(safeAnswers.budget_forecast?.arpu, 'Ej angivet')}</div>
                <div><b>CAC:</b> {getOr(safeAnswers.budget_forecast?.cac, 'Ej angivet')}</div>
                <div><b>Churn:</b> {getOr(safeAnswers.budget_forecast?.churn, 'Ej angivet')}</div>
                <div><b>Scenario:</b> {getOr(safeAnswers.budget_forecast?.scenario, 'Ej angivet')}</div>
              </div>
            </div>
          </div>

          {/* Cap Table & Dilution */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa] text-[#04121d]">
            <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>🥧</span> Cap Table & Dilution</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div><b>Ägare och andel:</b> {getOr(safeAnswers.cap_table?.owners, 'Ej angivet')}</div>
                <div><b>Planerade rundor:</b> {getOr(safeAnswers.cap_table?.planned_rounds, 'Ej angivet')}</div>
                <div><b>Pro-forma:</b> {getOr(safeAnswers.cap_table?.pro_forma, 'Ej angivet')}</div>
              </div>
              {/* Dummy pie chart */}
              <div className="flex-1 flex items-center justify-center">
                <svg width="100" height="100" viewBox="0 0 32 32">
                  <circle r="16" cx="16" cy="16" fill="#eaf6fa" />
                  <path d="M16 16 L16 0 A16 16 0 0 1 32 16 Z" fill="#7edcff" />
                  <path d="M16 16 L32 16 A16 16 0 0 1 16 32 Z" fill="#16475b" />
                </svg>
              </div>
            </div>
          </div>

          {/* Teknik/IP */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa]">
            <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>🛠️</span> Teknik & IP</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div><b>Patentstatus:</b> {getOr(safeAnswers.tech_ip?.patent_status, 'Ej angivet')}</div>
                <div><b>Tech-stack:</b> {getOr(safeAnswers.tech_ip?.tech_stack, 'Ej angivet')}</div>
                <div><b>Unika algoritmer:</b> {getOr(safeAnswers.tech_ip?.unique_algorithms, 'Ej angivet')}</div>
              </div>
            </div>
          </div>

          {/* ESG/Impact */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa]">
            <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>🌱</span> ESG & Impact</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div><b>KPI för impact:</b> {getOr(safeAnswers.esg_impact?.kpi, 'Ej angivet')}</div>
                <div><b>FN-SDG:</b> {getOr(safeAnswers.esg_impact?.sdg, 'Ej angivet')}</div>
                <div><b>Jämförelse med bransch:</b> {getOr(safeAnswers.esg_impact?.industry_comparison, 'Ej angivet')}</div>
              </div>
              {/* Dummy radar chart */}
              <div className="flex-1 flex items-center justify-center">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <polygon points="50,10 90,30 80,90 20,90 10,30" fill="#7edcff33" />
                  <polygon points="50,30 75,40 70,80 30,80 25,40" fill="#16475b88" />
                </svg>
              </div>
            </div>
          </div>

          {/* Exit/Övrigt */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa]">
            <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>🏁</span> Exit & Övrigt</h2>
            <div><b>Exit-plan:</b> {getOr(safeAnswers.exit_strategy?.exit_plan, 'Ej angivet')}</div>
          </div>

          {/* Second Pitch Deck Button */}
          <div className="bg-gradient-to-br from-[#16475b] to-[#2a6b8a] rounded-3xl p-8 shadow-xl text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Redo för nästa steg?</h2>
            <p className="text-lg mb-6 opacity-90">
              Skapa en professionell pitch deck baserad på din analys
            </p>
            <button
              onClick={handlePitchDeckGeneration}
              disabled={pitchDeckLoading}
              className="bg-white text-[#16475b] font-bold rounded-full px-10 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
            >
              {pitchDeckLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#16475b]"></div>
                  Genererar...
                </>
              ) : (
                <>
                  <span className="text-xl">🎯</span>
                  Ladda ner Pitch Deck (PDF)
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-[#16475b] mb-4">
              Lås upp {selectedFeature}
            </h2>
            <p className="text-[#16475b] mb-6">
              Uppgradera till {subscriptionLevel === 'silver' ? 'Gold' : 'Platinum'} för att få tillgång till:
            </p>
            <ul className="space-y-2 mb-6">
              {selectedFeature === 'score' && (
                <>
                  <li className="flex items-center">
                    <span className="text-[#16475b] mr-2">✓</span>
                    <span>Jämförelse med andra team</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-[#16475b] mr-2">✓</span>
                    <span>Branschspecifika insikter</span>
                  </li>
                </>
              )}
              {/* Add more feature-specific benefits */}
            </ul>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-2 text-[#16475b] hover:text-[#2a6b8a]"
              >
                Stäng
              </button>
              <button
                className="bg-[#16475b] text-white px-6 py-2 rounded-full hover:bg-[#2a6b8a]"
              >
                Uppgradera
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 