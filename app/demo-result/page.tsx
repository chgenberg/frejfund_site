'use client';
import EnhancedBusinessResult from '../components/EnhancedBusinessResult';

const DEMO_DATA = {
  overallScore: 78,
  categories: {
    problemSolution: {
      score: 85,
      label: 'Problem–Lösning Fit',
      description: 'Poäng för problemets akuthet & USP-styrka',
      metrics: {
        gapIndex: { value: 8.5, type: 'number' },
        problemCriticality: { value: 9, type: 'number' }
      },
      insights: [
        'Er lösning adresserar ett kritiskt problem inom SMB-segmentet där 67% upplever dagliga utmaningar med manuell datahantering.',
        'USP:en kring AI-driven automation är stark och differentierad, men behöver tydligare kvantifiering av ROI för kunderna.',
        'Konkurrerande lösningar fokuserar främst på enterprise vilket ger er en tydlig nisch inom SMB-marknaden.'
      ]
    },
    marketTiming: {
      score: 82,
      label: 'Marknad & Timing',
      description: 'TAM-validitet, trender, Why now',
      metrics: {
        tamConfidence: { value: 88, type: 'percentage' },
        marketGrowth: { value: 45, type: 'percentage' }
      },
      insights: [
        'Marknaden växer med 45% årligen drivet av AI-adoption och regulatoriska krav på datahantering.',
        'TAM på €5 miljarder är välunderbyggd med källor från Gartner och McKinsey 2024.',
        'Timingen är optimal med nya EU-regleringar som träder i kraft Q2 2025 vilket driver efterfrågan.'
      ]
    },
    moatCompetition: {
      score: 72,
      label: 'Moat & Konkurrens',
      description: 'Unikhet, skydd, hot',
      metrics: {
        defensibilityScore: { value: 7.2, type: 'number' },
        competitiveThreat: { value: 6.5, type: 'number' }
      },
      insights: [
        'Proprietär ML-algoritm ger teknisk fördel men saknar patentskydd vilket ökar kopieringsrisken.',
        'Nätverkseffekter börjar synas med 15% av nya kunder som kommer via befintliga användare.',
        'Största hotet kommer från BigTech-aktörer som kan komma in i SMB-segmentet inom 18-24 månader.'
      ]
    },
    tractionKpi: {
      score: 91,
      label: 'Traction & KPI-progress',
      description: 'MRR/DAU tillväxt & benchmarks',
      metrics: {
        growthQuality: { value: 9.1, type: 'number' },
        mrr: { value: 125000, type: 'currency' },
        growthRate: { value: 156, type: 'percentage' }
      },
      insights: [
        'MRR-tillväxt på 156% YoY överträffar branschstandard (120%) för SaaS i er fas.',
        'DAU/MAU ratio på 68% indikerar stark produktengagemang och sticky product.',
        'Net Revenue Retention på 142% visar framgångsrik land-and-expand strategi.'
      ]
    },
    unitEconomics: {
      score: 79,
      label: 'Unit Economics',
      description: 'CAC vs LTV, break-even-prognos',
      metrics: {
        paybackMonths: { value: 14, type: 'number' },
        ltvCacRatio: { value: 3.8, type: 'number' },
        grossMargin: { value: 82, type: 'percentage' }
      },
      insights: [
        'LTV:CAC ratio på 3.8x är över benchmark (3x) vilket indikerar hälsosam enhetsekomi.',
        'Payback period på 14 månader är acceptabel men kan förbättras genom optimerad onboarding.',
        'Bruttomarginal på 82% ger utrymme för aggressiv tillväxtsatsning.'
      ]
    },
    teamExecution: {
      score: 74,
      label: 'Team & Execution',
      description: 'Founder-market-fit, coachability',
      metrics: {
        teamStrength: { value: 7.4, type: 'number' },
        executionSpeed: { value: 8.2, type: 'number' }
      },
      insights: [
        'Grundarteamet har relevant branscherfarenhet men saknar tidigare exit-erfarenhet.',
        'Snabb produktutveckling med nya features var 3:e vecka visar stark execution capability.',
        'Behöver komplettera med senior CFO inför kommande funding-runda.'
      ]
    },
    financialHealth: {
      score: 68,
      label: 'Finansiell Hälsa',
      description: 'Burn, runway, finansplan',
      metrics: {
        cashRisk: { value: 6.8, type: 'number' },
        runwayMonths: { value: 16, type: 'number' },
        burnRate: { value: 85000, type: 'currency' }
      },
      insights: [
        'Runway på 16 månader ger tillräcklig tid för Series A men marginalerna är små.',
        'Burn rate har ökat 40% senaste kvartalet drivet av nya anställningar.',
        'Break-even projekteras Q4 2025 vilket är realistiskt med nuvarande tillväxttakt.'
      ]
    },
    riskCompliance: {
      score: 88,
      label: 'Risk & Compliance',
      description: 'Röd-gul-grön-flags',
      metrics: {
        riskLevel: { value: 3.2, type: 'number' },
        complianceStatus: { value: 8.8, type: 'number' }
      },
      insights: [
        'GDPR-compliance och ISO27001-certifiering på plats vilket är starkt för er fas.',
        'Inga legala tvister och tydlig IP-strategi minimerar juridiska risker.',
        'Huvudrisk är beroendet av en stor kund som står för 35% av ARR.'
      ]
    },
    storytellingDeck: {
      score: 70,
      label: 'Storytelling & Deck-kvalitet',
      description: 'Captivate-Validate-Motivate-poäng',
      metrics: {
        pitchClarity: { value: 7.0, type: 'number' },
        narrativeStrength: { value: 6.8, type: 'number' }
      },
      insights: [
        'Pitch deck har stark problemformulering men saknar emotionell koppling till kundernas pain.',
        'Finansiella projektioner är väl underbyggda men visualiseringen kan förbättras.',
        'Case studies från befintliga kunder skulle stärka trovärdigheten betydligt.'
      ]
    }
  },
  premiumAnalysis: {
    swot: {
      strengths: [
        'Stark produktmarknadsanpassning inom SMB-segmentet',
        'Överlägsna unit economics med LTV:CAC 3.8x',
        'Hög produktengagemang (DAU/MAU 68%)',
        'Erfaret tech-team med djup domänkunskap',
        'GDPR-compliant från dag ett'
      ],
      weaknesses: [
        'Beroende av stor kund (35% av ARR)',
        'Saknar patentskydd för kärnteknologi',
        'Begränsad finansiell runway (16 månader)',
        'Avsaknad av erfaren CFO i teamet',
        'Låg varumärkeskännedom i målgruppen'
      ],
      opportunities: [
        'EU-regleringar driver marknadstillväxt',
        'Expansion till närliggande vertikaler',
        'Partnership-möjligheter med etablerade SaaS-bolag',
        'AI-boom skapar ökad betalningsvilja',
        'Internationell expansion (UK, Tyskland)'
      ],
      threats: [
        'BigTech kan komma in i SMB-segmentet',
        'Ekonomisk nedgång påverkar SMB-budgetar',
        'Snabb teknologisk utveckling kräver konstant innovation',
        'Ökad konkurrens från VC-backade startups',
        'Regulatoriska förändringar kan påverka affärsmodellen'
      ]
    }
  }
};

export default function DemoResultPage() {
  return <EnhancedBusinessResult data={DEMO_DATA} />;
} 