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
  const typedAnswers = answers as Record<string, string | any>;
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
  const [allAiFeedback, setAllAiFeedback] = useState<Record<string, string>>({});
  const [loadingAiFeedback, setLoadingAiFeedback] = useState(true);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showAdditionalQuestions, setShowAdditionalQuestions] = useState(false);
  const [additionalAnswers, setAdditionalAnswers] = useState<Record<string, string>>({});
  const [generatingReport, setGeneratingReport] = useState(false);
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
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
      
      // Samla relevanta svar för varje sektion
      const sectionData = {
        business_idea: {
          company_value: typedAnswers.company_value,
          customer_problem: typedAnswers.customer_problem,
          solution: typedAnswers.solution,
          problem_evidence: typedAnswers.problem_evidence,
          market_gap: typedAnswers.market_gap
        },
        market_analysis: {
          market_size: typedAnswers.market_size,
          market_trends: typedAnswers.market_trends,
          target_customer: typedAnswers.target_customer,
          why_now: typedAnswers.why_now
        },
        team: {
          team: typedAnswers.team,
          team_skills: typedAnswers.team_skills,
          founder_equity: typedAnswers.founder_equity,
          founder_market_fit: typedAnswers.founder_market_fit
        },
        competition: {
          competitors: typedAnswers.competitors,
          unique_solution: typedAnswers.unique_solution,
          ip_rights: typedAnswers.ip_rights
        },
        funding: {
          capital_block: typedAnswers.capital_block,
          runway: typedAnswers.runway,
          revenue_block: typedAnswers.revenue_block,
          growth_plan: typedAnswers.growth_plan
        }
      };

      const feedbackPromises = Object.entries(sectionData).map(async ([key, data]) => {
        try {
          // Filtrera bort tomma värden
          const filteredData = Object.entries(data).reduce((acc, [k, v]) => {
            if (v) acc[k] = v;
            return acc;
          }, {} as Record<string, any>);

          if (Object.keys(filteredData).length === 0) {
            return { key, feedback: '' };
          }

          const res = await fetch('/api/ai-section-feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              section: key, 
              text: JSON.stringify(filteredData)
            })
          });
          const result = await res.json();
          return { key, feedback: result.feedback || '' };
        } catch (error) {
          return { key, feedback: '' };
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
                <div className="w-64 h-64">
                  <CircularProgressbar
                    value={_score}
                    text={`${_score}`}
                    styles={buildStyles({
                      pathColor: getScoreColor(_score),
                      textColor: '#16475b',
                      trailColor: '#eaf6fa',
                      textSize: '28px'
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
            <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
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

          {/* AI-feedback för sektioner */}
          <div className="space-y-4">
            {loadingAiFeedback ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#16475b] mx-auto mb-2"></div>
                <div className="text-[#16475b]">Analyserar dina svar...</div>
              </div>
            ) : (
              <React.Fragment>
                {/* Affärsidé */}
                {(typedAnswers.company_value || typedAnswers.customer_problem || typedAnswers.solution) && (
                  <div className="bg-[#eaf6fa] rounded-2xl p-4 shadow border border-[#16475b]/20">
                    <div className="font-bold text-[#16475b] mb-2">AI-feedback för Affärsidé:</div>
                    <div className="text-[#16475b]">
                      {allAiFeedback.business_idea || `Baserat på: ${typedAnswers.company_value || typedAnswers.customer_problem || typedAnswers.solution || 'Ingen information'}`}
                    </div>
                  </div>
                )}
                
                {/* Marknadsanalys */}
                {(typedAnswers.market_size || typedAnswers.market_trends || typedAnswers.target_customer) && (
                  <div className="bg-[#eaf6fa] rounded-2xl p-4 shadow border border-[#16475b]/20">
                    <div className="font-bold text-[#16475b] mb-2">AI-feedback för Marknadsanalys:</div>
                    <div className="text-[#16475b]">
                      {allAiFeedback.market_analysis || `Baserat på: ${typedAnswers.market_size || typedAnswers.market_trends || 'Ingen information'}`}
                    </div>
                  </div>
                )}
                
                {/* Team */}
                {(typedAnswers.team || typedAnswers.team_skills || typedAnswers.founder_equity) && (
                  <div className="bg-[#eaf6fa] rounded-2xl p-4 shadow border border-[#16475b]/20">
                    <div className="font-bold text-[#16475b] mb-2">AI-feedback för Team:</div>
                    <div className="text-[#16475b]">
                      {allAiFeedback.team || `Baserat på: ${typedAnswers.team || 'Ingen information'}`}
                    </div>
                  </div>
                )}
                
                {/* Konkurrensanalys */}
                {(typedAnswers.competitors || typedAnswers.unique_solution) && (
                  <div className="bg-[#eaf6fa] rounded-2xl p-4 shadow border border-[#16475b]/20">
                    <div className="font-bold text-[#16475b] mb-2">AI-feedback för Konkurrensanalys:</div>
                    <div className="text-[#16475b]">
                      {allAiFeedback.competition || `Baserat på: ${typedAnswers.competitors || 'Ingen information'}`}
                    </div>
                  </div>
                )}
                
                {/* Finansiering */}
                {(typedAnswers.capital_block || typedAnswers.runway) && (
                  <div className="bg-[#eaf6fa] rounded-2xl p-4 shadow border border-[#16475b]/20">
                    <div className="font-bold text-[#16475b] mb-2">AI-feedback för Finansiering:</div>
                    <div className="text-[#16475b]">
                      {allAiFeedback.funding || `Baserat på: ${typedAnswers.capital_block || typedAnswers.runway || 'Ingen information'}`}
                    </div>
                  </div>
                )}
              </React.Fragment>
            )}
          </div>

          {/* Problem & Lösning */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa] flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>❓</span> Problem</h2>
              <div className="text-[#16475b] mb-2">{getOr(typedAnswers.customer_problem, 'Ej angivet.')}</div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>💡</span> Lösning</h2>
              <div className="text-[#16475b] mb-2">{getOr(typedAnswers.solution, 'Ej angivet.')}</div>
            </div>
          </div>

          {/* Marknad (TAM/SAM/SOM) */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa]">
            <h2 className="text-xl font-bold text-[#16475b] mb-4 flex items-center gap-2"><span>📊</span> Marknad</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-2">
                <div className="text-[#16475b]"><b>TAM/SAM/SOM:</b> {getOr(typedAnswers.market_size, 'Ej angivet')}</div>
                <div className="text-[#16475b]"><b>Målgrupp:</b> {getOr(typedAnswers.target_customer, 'Ej angivet')}</div>
                <div className="text-[#16475b]"><b>Marknadstrender:</b> {getOr(typedAnswers.market_trends, 'Ej angivet')}</div>
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

          {/* Affärsmodell & Intäkter */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa] grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>💰</span> Affärsmodell</h2>
              <div className="text-[#16475b]">{getOr(typedAnswers.revenue_block, 'Ej angivet')}</div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>📈</span> Tillväxtplan</h2>
              <div className="text-[#16475b]">{getOr(typedAnswers.growth_plan, 'Ej angivet')}</div>
            </div>
          </div>

          {/* Traction & Milestones */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa]">
            <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>📈</span> Traction & Milstolpar</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="text-[#16475b]"><b>Traction:</b> {getOr(typedAnswers.traction, 'Ej angivet')}</div>
              </div>
              <div className="flex-1">
                <div className="text-[#16475b]"><b>Milstolpar:</b> {
                  typedAnswers.milestones ? (
                    JSON.parse(typedAnswers.milestones as string).map((m: any, i: number) => 
                      `${m.milestone} (${m.date})`
                    ).join(', ')
                  ) : 'Ej angivet'
                }</div>
              </div>
            </div>
          </div>

          {/* Team & Founders' DNA */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa]">
            <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>🧬</span> Team & Founders' DNA</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="text-[#16475b]"><b>Team:</b> {getOr(typedAnswers.team, 'Ej angivet')}</div>
                <div className="text-[#16475b]"><b>Ägarandel efter runda:</b> {getOr(typedAnswers.founder_equity, 'Ej angivet')}%</div>
              </div>
              <div className="flex-1">
                <div className="text-[#16475b]"><b>Founder-Market Fit:</b> {
                  typedAnswers.founder_market_fit ? (
                    (() => {
                      const fmf = JSON.parse(typedAnswers.founder_market_fit as string);
                      return `${fmf.score}/5 - ${fmf.text}`;
                    })()
                  ) : 'Ej angivet'
                }</div>
              </div>
            </div>
          </div>

          {/* Kapitalbehov */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa]">
            <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>💵</span> Kapitalbehov & Användning</h2>
            {typedAnswers.capital_block ? (
              (() => {
                const capital = JSON.parse(typedAnswers.capital_block as string);
                return (
                  <div className="space-y-2">
                    <div className="text-[#16475b]"><b>Total summa:</b> {capital.amount} MSEK</div>
                    <div className="text-[#16475b]"><b>Fördelning:</b></div>
                    <ul className="list-disc list-inside text-[#16475b] ml-4">
                      <li>Produktutveckling: {capital.product}%</li>
                      <li>Försäljning & Marknad: {capital.sales}%</li>
                      <li>Personal & Rekrytering: {capital.team}%</li>
                      <li>Övrigt: {capital.other}%</li>
                    </ul>
                    <div className="text-[#16475b]"><b>Sannolikhet för mer kapital:</b> {capital.probability}/5</div>
                    <div className="text-[#16475b]"><b>Runway:</b> {getOr(typedAnswers.runway, 'Ej angivet')} månader</div>
                  </div>
                );
              })()
            ) : (
              <div className="text-[#16475b]">Ej angivet</div>
            )}
          </div>

          {/* Konkurrenter & Matris */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa]">
            <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>⚔️</span> Konkurrenter & Differentiering</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="text-[#16475b]"><b>Konkurrenter:</b> {getOr(typedAnswers.competitors, 'Ej angivet')}</div>
                <div className="text-[#16475b] mt-2"><b>Unik lösning:</b> {getOr(typedAnswers.unique_solution, 'Ej angivet')}</div>
                <div className="text-[#16475b] mt-2"><b>IP-rättigheter:</b> {getOr(typedAnswers.ip_rights, 'Ej angivet')}</div>
              </div>
            </div>
          </div>

          {/* AI-driven Konkurrentanalys */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa]">
            <h2 className="text-xl font-bold text-[#16475b] mb-4 flex items-center gap-2"><span>🔎</span> AI-Konkurrentanalys</h2>
            {loadingCompetitors && <div className="text-[#16475b]">Hämtar konkurrensanalys...</div>}
            {competitorError && <div className="text-red-600">{competitorError}</div>}
            {!loadingCompetitors && !competitorError && competitorAnalysis.length > 0 && (
              <div className="space-y-6">
                {competitorAnalysis.map((c: any, i) => (
                  <div key={i} className="border-b border-[#eaf6fa] pb-4 mb-4 last:border-b-0 last:mb-0">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="font-bold text-lg text-[#16475b]">{c.name}</div>
                      {c.url && <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-[#2a6b8a] underline text-sm">{c.url}</a>}
                    </div>
                    {c.error ? (
                      <div className="text-red-600 text-sm">{c.error}</div>
                    ) : (
                      <div className="text-sm space-y-1 text-[#16475b]">
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
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa]">
            <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>📑</span> Budget & Prognos</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 text-[#16475b]">
                <div><b>Budget/prognos:</b> {getOr(safeAnswers.budget_forecast?.forecast_table, 'Ej angivet')}</div>
                <div><b>ARPU:</b> {getOr(safeAnswers.budget_forecast?.arpu, 'Ej angivet')}</div>
                <div><b>CAC:</b> {getOr(safeAnswers.budget_forecast?.cac, 'Ej angivet')}</div>
                <div><b>Churn:</b> {getOr(safeAnswers.budget_forecast?.churn, 'Ej angivet')}</div>
                <div><b>Scenario:</b> {getOr(safeAnswers.budget_forecast?.scenario, 'Ej angivet')}</div>
              </div>
            </div>
          </div>

          {/* Cap Table & Dilution */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa]">
            <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>🥧</span> Cap Table & Dilution</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 text-[#16475b]">
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
              <div className="flex-1 text-[#16475b]">
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
              <div className="flex-1 text-[#16475b]">
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

          {/* Komplett AI-affärsanalys Section */}
          <div className="bg-gradient-to-br from-[#16475b] to-[#2a6b8a] rounded-3xl p-8 shadow-xl text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Vill du ha en djupare analys?</h2>
            <p className="text-lg mb-6 opacity-90">
              Få en komplett AI-driven affärsanalys med branschspecifika insikter
            </p>
            <button
              onClick={() => setShowAnalysisModal(true)}
              className="bg-white text-[#16475b] font-bold rounded-full px-10 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3 mx-auto"
            >
              <span className="text-xl">🎯</span>
              Komplett AI-affärsanalys
            </button>
            <div className="text-sm text-white/80 mt-4">
              <div className="font-semibold">3x mer djupgående analys</div>
              <div>Branschspecifika frågor • Konkreta förbättringsåtgärder • PDF-rapport</div>
            </div>
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

      {/* Komplett AI-affärsanalys Modal */}
      {showAnalysisModal && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#16475b]">Komplett AI-affärsanalys</h2>
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="text-[#16475b] text-2xl font-bold hover:text-[#2a6b8a] focus:outline-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-[#eaf6fa] rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-[#16475b] mb-4">Vad ingår i analysen?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📊</span>
                    <div>
                      <div className="font-semibold text-[#16475b]">3x mer djupgående analys</div>
                      <div className="text-sm text-[#16475b]/80">Omfattande AI-analys av alla aspekter av din affärsplan</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <div className="font-semibold text-[#16475b]">5 branschspecifika frågor</div>
                      <div className="text-sm text-[#16475b]/80">Anpassade efter just din bransch och utmaningar</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <div className="font-semibold text-[#16475b]">Konkreta förbättringsåtgärder</div>
                      <div className="text-sm text-[#16475b]/80">Handlingsplan med prioriterade åtgärder</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <div className="font-semibold text-[#16475b]">Professionell PDF-rapport</div>
                      <div className="text-sm text-[#16475b]/80">Med ditt företags logo och formaterad text</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#7edcff]/20 to-[#16475b]/20 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-[#16475b] mb-2">197 kr</div>
                <div className="text-sm text-[#16475b]/80">Engångskostnad</div>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowAnalysisModal(false)}
                  className="px-6 py-3 text-[#16475b] hover:bg-[#f5f7fa] rounded-full transition-colors"
                >
                  Avbryt
                </button>
                <button
                  onClick={() => {
                    setShowAnalysisModal(false);
                    setShowAdditionalQuestions(true);
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-[#16475b] to-[#2a6b8a] text-white font-bold rounded-full hover:shadow-lg transition-all"
                >
                  Testa gratis (Demo)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Questions Modal */}
      {showAdditionalQuestions && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#16475b]">Branschspecifika frågor</h2>
              <button
                onClick={() => setShowAdditionalQuestions(false)}
                className="text-[#16475b] text-2xl font-bold hover:text-[#2a6b8a] focus:outline-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Logo Upload */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#16475b] mb-3">Företagslogo (valfritt)</h3>
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 border-2 border-dashed border-[#7edcff] rounded-xl flex items-center justify-center bg-[#f5f7fa]">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <svg className="w-12 h-12 text-[#7edcff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <label className="bg-[#16475b] text-white px-6 py-2 rounded-full cursor-pointer hover:bg-[#2a6b8a] transition-colors inline-block">
                      Ladda upp logo
                      <input
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setCompanyLogo(file);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setLogoPreview(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-[#16475b]/60 mt-2">PNG eller JPG, max 5MB</p>
                  </div>
                </div>
              </div>

              {/* Additional Questions based on industry */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#16475b]">Branschspecifika frågor för {typedAnswers.bransch || 'din bransch'}</h3>
                
                {/* Question 1 */}
                <div>
                  <label className="block font-semibold text-[#16475b] mb-2">
                    1. Vilka regulatoriska utmaningar finns inom er bransch?
                  </label>
                  <textarea
                    className="w-full min-h-[100px] rounded-xl border border-[#7edcff] bg-white px-4 py-3 text-[#16475b] placeholder-gray-400 focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all resize-none"
                    placeholder="Beskriv eventuella lagar, regler eller certifieringar som påverkar er verksamhet..."
                    value={additionalAnswers.regulatory || ''}
                    onChange={(e) => setAdditionalAnswers({ ...additionalAnswers, regulatory: e.target.value })}
                  />
                </div>

                {/* Question 2 */}
                <div>
                  <label className="block font-semibold text-[#16475b] mb-2">
                    2. Hur ser er go-to-market strategi ut?
                  </label>
                  <textarea
                    className="w-full min-h-[100px] rounded-xl border border-[#7edcff] bg-white px-4 py-3 text-[#16475b] placeholder-gray-400 focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all resize-none"
                    placeholder="Beskriv hur ni planerar att nå ut till era kunder..."
                    value={additionalAnswers.goToMarket || ''}
                    onChange={(e) => setAdditionalAnswers({ ...additionalAnswers, goToMarket: e.target.value })}
                  />
                </div>

                {/* Question 3 */}
                <div>
                  <label className="block font-semibold text-[#16475b] mb-2">
                    3. Vilka är era viktigaste KPI:er och hur mäter ni framgång?
                  </label>
                  <textarea
                    className="w-full min-h-[100px] rounded-xl border border-[#7edcff] bg-white px-4 py-3 text-[#16475b] placeholder-gray-400 focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all resize-none"
                    placeholder="Lista era viktigaste nyckeltal och mål..."
                    value={additionalAnswers.kpis || ''}
                    onChange={(e) => setAdditionalAnswers({ ...additionalAnswers, kpis: e.target.value })}
                  />
                </div>

                {/* Question 4 */}
                <div>
                  <label className="block font-semibold text-[#16475b] mb-2">
                    4. Hur ser er prissättningsstrategi ut jämfört med konkurrenter?
                  </label>
                  <textarea
                    className="w-full min-h-[100px] rounded-xl border border-[#7edcff] bg-white px-4 py-3 text-[#16475b] placeholder-gray-400 focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all resize-none"
                    placeholder="Beskriv er prissättning och positionering..."
                    value={additionalAnswers.pricing || ''}
                    onChange={(e) => setAdditionalAnswers({ ...additionalAnswers, pricing: e.target.value })}
                  />
                </div>

                {/* Question 5 */}
                <div>
                  <label className="block font-semibold text-[#16475b] mb-2">
                    5. Vilka partnerskap eller samarbeten är kritiska för er tillväxt?
                  </label>
                  <textarea
                    className="w-full min-h-[100px] rounded-xl border border-[#7edcff] bg-white px-4 py-3 text-[#16475b] placeholder-gray-400 focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all resize-none"
                    placeholder="Beskriv viktiga partners, leverantörer eller distributionskanaler..."
                    value={additionalAnswers.partnerships || ''}
                    onChange={(e) => setAdditionalAnswers({ ...additionalAnswers, partnerships: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => setShowAdditionalQuestions(false)}
                  className="px-6 py-3 text-[#16475b] hover:bg-[#f5f7fa] rounded-full transition-colors"
                >
                  Avbryt
                </button>
                <button
                  onClick={async () => {
                    setGeneratingReport(true);
                    setShowAdditionalQuestions(false);
                    
                    try {
                      // Skapa FormData för att skicka både JSON och fil
                      const formData = new FormData();
                      formData.append('answers', JSON.stringify(answers));
                      formData.append('additionalAnswers', JSON.stringify(additionalAnswers));
                      formData.append('score', String(_score));
                      formData.append('company', typedAnswers.company || '');
                      if (companyLogo) {
                        formData.append('logo', companyLogo);
                      }
                      
                      const response = await fetch('/api/generate-deep-analysis', {
                        method: 'POST',
                        body: formData
                      });
                      
                      if (response.ok) {
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'affarsanalys-rapport.pdf';
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                      } else {
                        alert('Kunde inte generera rapport. Försök igen senare.');
                      }
                    } catch (error) {
                      console.error('Error generating report:', error);
                      alert('Ett fel uppstod vid generering av rapport.');
                    } finally {
                      setGeneratingReport(false);
                    }
                  }}
                  disabled={generatingReport}
                  className="px-8 py-3 bg-gradient-to-r from-[#16475b] to-[#2a6b8a] text-white font-bold rounded-full hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {generatingReport ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Genererar rapport...
                    </span>
                  ) : (
                    'Generera rapport'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 