import React from 'react';

interface ScoreProps {
  answers: {
    team?: {
      founders?: string | string[];
      key_team?: string[];
    };
    problem_solution?: {
      problem?: string;
      solution?: string;
    };
    business_idea?: {
      why_unique?: string;
    };
    market_size?: {
      market_value?: string;
      growth?: string;
    };
    competition?: {
      main_competitors?: string;
    };
  };
}

const calculateScore = (answers: ScoreProps['answers']) => {
  // Baspoäng per kategori (0-25)
  const teamScore = calculateTeamScore(answers);
  const problemSolutionScore = calculateProblemSolutionScore(answers);
  const marketScore = calculateMarketScore(answers);

  // Total baspoäng (0-75)
  const baseScore = teamScore + problemSolutionScore + marketScore;

  // Asymptotisk cap för att göra 100 nästan omöjligt
  const finalScore = Math.min(100, Math.round(100 * (1 - Math.exp(-baseScore / 50))));

  return {
    score: finalScore,
    details: {
      team: teamScore,
      problemSolution: problemSolutionScore,
      market: marketScore
    }
  };
};

const calculateTeamScore = (answers: ScoreProps['answers']) => {
  let score = 0;
  
  // Team experience and background
  if (answers.team?.founders) {
    const foundersRaw = answers.team.founders;
    const founders = Array.isArray(foundersRaw)
      ? foundersRaw
      : typeof foundersRaw === 'string' && foundersRaw.length > 0
        ? foundersRaw.split(',').map(f => f.trim()).filter(Boolean)
        : [];
    if (founders.length > 0) score += 5;
    if (founders.length > 1) score += 5;
    if (founders.some((f: string) => f.toLowerCase().includes('cto') || f.toLowerCase().includes('tech'))) score += 5;
    if (founders.some((f: string) => f.toLowerCase().includes('ceo') || f.toLowerCase().includes('vd'))) score += 5;
  }

  // Key team members
  if (answers.team?.key_team) {
    const keyTeam = answers.team.key_team;
    if (keyTeam.length > 0) score += 5;
  }

  return Math.min(25, score);
};

const calculateProblemSolutionScore = (answers: ScoreProps['answers']) => {
  let score = 0;

  // Problem definition
  if (answers.problem_solution?.problem) {
    const problem = answers.problem_solution.problem;
    if (problem.length > 50) score += 5;
    if (problem.length > 100) score += 5;
  }

  // Solution clarity
  if (answers.problem_solution?.solution) {
    const solution = answers.problem_solution.solution;
    if (solution.length > 50) score += 5;
    if (solution.length > 100) score += 5;
  }

  // Business idea uniqueness
  if (answers.business_idea?.why_unique) {
    const uniqueness = answers.business_idea.why_unique;
    if (uniqueness.length > 50) score += 5;
  }

  return Math.min(25, score);
};

const calculateMarketScore = (answers: ScoreProps['answers']) => {
  let score = 0;

  // Market size
  if (answers.market_size?.market_value) {
    const marketValue = answers.market_size.market_value;
    if (marketValue.length > 0) score += 5;
    if (marketValue.includes('miljard') || marketValue.includes('billion')) score += 5;
  }

  // Market growth
  if (answers.market_size?.growth) {
    const growth = answers.market_size.growth;
    if (growth.length > 0) score += 5;
    if (growth.includes('%') || growth.includes('procent')) score += 5;
  }

  // Competition analysis
  if (answers.competition?.main_competitors) {
    const competitors = answers.competition.main_competitors;
    if (competitors.length > 0) score += 5;
  }

  return Math.min(25, score);
};

const getScoreLabel = (score: number) => {
  if (score >= 95) return { emoji: '🏆', label: 'Top 1%', cta: 'VIP-snabbfil – vi pingar VC-scouts redan i dag.' };
  if (score >= 85) return { emoji: '🚀', label: 'Deal-ready', cta: 'Klicka för varm intro till vårt investerarnätverk.' };
  if (score >= 75) return { emoji: '⭐', label: 'Investable with guidance', cta: 'Vi matchar dig med ängel/ALMI – låt oss polera pitchen först.' };
  if (score >= 50) return { emoji: '⚙️', label: 'Potential, men kräver jobb', cta: 'Få en 30-dagars handlingsplan + coach.' };
  return { emoji: '🚧', label: 'Under byggtid', cta: 'Här är topp 3 luckor att åtgärda – boka workshop.' };
};

export default function BusinessPlanScore({ answers }: ScoreProps) {
  const { score, details } = calculateScore(answers);
  const { emoji, label, cta } = getScoreLabel(score);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">{emoji}</div>
        <h2 className="text-2xl font-bold text-[#16475b] mb-2">{label}</h2>
        <div className="text-4xl font-bold text-[#16475b]">{score}</div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-[#16475b]">Team</span>
            <span className="text-sm font-medium text-[#16475b]">{details.team}/25</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#16475b] h-2 rounded-full" style={{ width: `${(details.team / 25) * 100}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-[#16475b]">Problem/Lösning</span>
            <span className="text-sm font-medium text-[#16475b]">{details.problemSolution}/25</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#16475b] h-2 rounded-full" style={{ width: `${(details.problemSolution / 25) * 100}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-[#16475b]">Marknad</span>
            <span className="text-sm font-medium text-[#16475b]">{details.market}/25</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#16475b] h-2 rounded-full" style={{ width: `${(details.market / 25) * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-[#16475b] mb-4">{cta}</p>
        <button className="bg-[#16475b] text-white font-bold rounded-full px-6 py-2 shadow hover:bg-[#16475b] hover:text-white transition-colors">
          Boka möte
        </button>
      </div>
    </div>
  );
} 