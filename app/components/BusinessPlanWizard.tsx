"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import BusinessPlanResult from './BusinessPlanResult';
import BusinessPlanScore from './BusinessPlanScore';

const BRANSCHER = [
  "SaaS",
  "Tech",
  "Konsumentvaror",
  "Hälsa",
  "Fintech",
  "Industri",
  "Tjänster",
  "Utbildning",
  "Energi",
  "Annat"
];
const OMRADEN = [
  "Sverige",
  "Norden",
  "Europa",
  "Globalt",
  "Annat"
];

const questions = [
  // 1. Pitch & Demo
  {
    id: "executive_summary",
    question: "Sammanfatta din affärsidé på max 1 minut",
    help: "Tänk elevator pitch! Vad gör ni, för vem, och varför är det unikt?",
    subQuestions: [
      {
        id: "summary",
        label: "Executive summary (max 300 tecken)",
        exampleAnswers: [
          "Vi automatiserar bokföring för småföretag med AI och sparar 80% av deras tid.",
          "Vi säljer miljövänliga rengöringsprodukter till hotell och restauranger."
        ]
      },
      {
        id: "demo_link",
        label: "Har du en demo eller video? (länk)",
        exampleAnswers: [
          "https://youtu.be/demo123",
          "https://vimeo.com/yourdemo"
        ]
      }
    ]
  },
  // 2. Problem & Lösning
  {
    id: "business_idea",
    question: "Vad är din affärsidé?",
    help: "Beskriv tydligt vad ni gör, för vem och varför det är unikt.",
    subQuestions: [
      {
        id: "what_you_do",
        label: "Vad gör ni?",
        exampleAnswers: [
          "Vi utvecklar en app för att automatisera bokföring åt småföretag.",
          "Vi säljer miljövänliga rengöringsprodukter till hotell."
        ]
      },
      {
        id: "for_whom",
        label: "För vem?",
        exampleAnswers: [
          "Småföretagare inom tjänstesektorn.",
          "Hotell och restauranger med hållbarhetsfokus."
        ]
      },
      {
        id: "why_unique",
        label: "Varför är det unikt?",
        exampleAnswers: [
          "Vår lösning använder AI för att spara tid och minska fel.",
          "Vi är de enda med Svanenmärkta produkter i branschen."
        ]
      }
    ]
  },
  {
    id: "customer_segments",
    question: "Vem är din huvudsakliga kund?",
    help: "Vilka grupper köper er produkt/tjänst och varför?",
    subQuestions: [
      {
        id: "customer_group",
        label: "Vilken grupp?",
        exampleAnswers: [
          "Kvinnor 25–40 år i storstad.",
          "Småföretagare inom tjänstesektorn."
        ]
      },
      {
        id: "customer_needs",
        label: "Vilka behov/problem har de?",
        exampleAnswers: [
          "Behöver spara tid på administration.",
          "Vill ha miljövänliga alternativ."
        ]
      },
      {
        id: "customer_location",
        label: "Var finns de?",
        exampleAnswers: [
          "Främst i Stockholm och Göteborg.",
          "Hotellkedjor i hela Sverige."
        ]
      }
    ]
  },
  {
    id: "problem_solution",
    question: "Vilket problem löser ni och hur?",
    help: "Beskriv det viktigaste kundproblemet och hur ni adresserar det.",
    subQuestions: [
      {
        id: "problem",
        label: "Vilket problem?",
        exampleAnswers: [
          "Småföretag lägger onödig tid på bokföring.",
          "Stora mängder kemikalier används i städbranschen."
        ]
      },
      {
        id: "solution",
        label: "Hur löser ni det?",
        exampleAnswers: [
          "Vi automatiserar processen med AI.",
          "Vi erbjuder ett miljövänligt alternativ."
        ]
      }
    ]
  },
  {
    id: "team",
    question: "Vilka är grundarna och medarbetarna?",
    help: "Beskriv teamet och deras bakgrund.",
    subQuestions: [
      {
        id: "founders",
        label: "Grundare (namn, roll, erfarenhet)",
        exampleAnswers: [
          "Anna (VD, 10 år i branschen), Erik (CTO, AI-expert)",
          "Två grundare med bakgrund inom logistik och apputveckling."
        ]
      },
      {
        id: "key_team",
        label: "Nyckelpersoner/kompetenser",
        exampleAnswers: [
          "Sara (Marknad, ex-Google)",
          "Ett team på fem personer med erfarenhet från både hotell och kemikalieindustrin."
        ]
      },
      {
        id: "team_expertise",
        label: "Teamets expertis och erfarenhet",
        exampleAnswers: [
          "Kombinerad erfarenhet av 25+ år inom branschen",
          "Tidigare framgångsrika startups och exit-erfarenhet"
        ]
      }
    ]
  },
  // 3. Marknad & Affärsmodell
  {
    id: "market_details",
    question: "Hur stor är marknaden?",
    help: "Dela upp i TAM (total), SAM (adresserbar), SOM (nåbar) och ange källa/metod.",
    subQuestions: [
      { id: "tam", label: "TAM (Total Addressable Market)", exampleAnswers: ["10 miljarder kr", "1 miljon användare"] },
      { id: "sam", label: "SAM (Serviceable Addressable Market)", exampleAnswers: ["2 miljarder kr", "200 000 användare"] },
      { id: "som", label: "SOM (Serviceable Obtainable Market)", exampleAnswers: ["200 miljoner kr", "20 000 användare"] },
      { id: "market_source", label: "Källa/metod", exampleAnswers: ["Statista 2023", "Egna beräkningar"] }
    ]
  },
  {
    id: "revenue_model",
    question: "Hur tjänar ni pengar?",
    help: "Välj intäktsmodell(er) och beskriv.",
    subQuestions: [
      {
        id: "model",
        label: "Intäktsmodell(er)",
        exampleAnswers: [
          "Månadsabonnemang per företag.",
          "Transaktionsavgift per bokning.",
          "Försäljning av produkter till grossist och direkt till kund."
        ]
      },
      {
        id: "other_revenue",
        label: "Övriga intäktskällor",
        exampleAnswers: [
          "Konsulttjänster inom bokföring.",
          "Licensiering av teknik."
        ]
      }
    ]
  },
  {
    id: "pricing",
    question: "Prissättning",
    help: "Beskriv hur ni bestämmer priset på er produkt/tjänst.",
    subQuestions: [
      {
        id: "price_model",
        label: "Prismodell",
        exampleAnswers: [
          "Långsiktig abonnemangspris.",
          "Transaktionspris per bokning.",
          "Fast pris för hela kontraktet."
        ]
      },
      {
        id: "price_range",
        label: "Prisintervallet",
        exampleAnswers: [
          "1000-5000 kr per månad.",
          "500-3000 kr per bokning."
        ]
      }
    ]
  },
  // 4. Traction & Milestones
  {
    id: "traction",
    question: "Traction/milstolpar",
    help: "Beskriv er framgång och framstegen.",
    subQuestions: [
      {
        id: "milestones",
        label: "Viktiga milstolpar",
        exampleAnswers: [
          "Lansering av appen.",
          "Första kundkontakten."
        ]
      },
      {
        id: "user_growth",
        label: "Användarökning",
        exampleAnswers: [
          "1000 nya användare per månad.",
          "500 nya kunder per år."
        ]
      }
    ]
  },
  {
    id: "customer_validation",
    question: "Kundvalidering",
    help: "Beskriv hur ni har validerat er produkt/tjänst.",
    subQuestions: [
      {
        id: "validation_method",
        label: "Metod",
        exampleAnswers: [
          "Onlineundersökningar.",
          "Kundintervjuer."
        ]
      },
      {
        id: "validation_results",
        label: "Resultat",
        exampleAnswers: [
          "Validering av 80% av kunderna.",
          "Validering av 50% av kunderna."
        ]
      }
    ]
  },
  // 5. Partners & Risks
  {
    id: "partners",
    question: "Partners/leverantörer",
    help: "Beskriv era partners och leverantörer.",
    subQuestions: [
      {
        id: "main_partners",
        label: "Huvudsakliga partners",
        exampleAnswers: [
          "Google, Microsoft.",
          "Ecolab, Henkel."
        ]
      },
      {
        id: "partner_contributions",
        label: "Bidrag",
        exampleAnswers: [
          "Marknadsföring och distribution.",
          "Produktutveckling och kvalitetssäkring."
        ]
      }
    ]
  },
  {
    id: "risks",
    question: "Viktigaste risker",
    help: "Beskriv de viktigaste riskerna för er affärsidé.",
    subQuestions: [
      {
        id: "financial_risk",
        label: "Finansiella risker",
        exampleAnswers: [
          "Marknadsrisk.",
          "Valutarisk."
        ]
      },
      {
        id: "operational_risk",
        label: "Operationsrisk",
        exampleAnswers: [
          "Teknisk risk.",
          "Personellrisk."
        ]
      }
    ]
  },
  // 6. Sustainability & Budget
  {
    id: "sustainability",
    question: "Hållbarhet/impact",
    help: "Beskriv hur ni tar hänsyn till hållbarheten och impacten.",
    subQuestions: [
      {
        id: "environmental_impact",
        label: "Miljöpåverkan",
        exampleAnswers: [
          "Minskar kemikalier i produkterna.",
          "Ökar användningen av miljövänliga energikällor."
        ]
      },
      {
        id: "social_impact",
        label: "Social impact",
        exampleAnswers: [
          "Stöttar lokala ekonomier.",
          "Skapar jobb och utvecklar kompetenser."
        ]
      }
    ]
  },
  {
    id: "budget",
    question: "Budget/prognos",
    help: "Beskriv budgeten och prognosen för er affärsidé.",
    subQuestions: [
      {
        id: "revenue_forecast",
        label: "Revisionsprognos",
        exampleAnswers: [
          "2 miljoner kr i årlig intäkt.",
          "1,5 miljoner kr i årlig intäkt."
        ]
      },
      {
        id: "cost_forecast",
        label: "Kostnadsprognos",
        exampleAnswers: [
          "1 miljon kr i årliga kostnader.",
          "500 000 kr i årliga kostnader."
        ]
      }
    ]
  },
  // 7. Board & Exit
  {
    id: "board",
    question: "Styrelse/rådgivare",
    help: "Beskriv er styrelse och rådgivare.",
    subQuestions: [
      {
        id: "board_members",
        label: "Styrelsemedlemmar",
        exampleAnswers: [
          "Anna (VD), Erik (CTO), Sara (Marknad).",
          "Två styrelsemedlemmar med erfarenhet från både hotell och kemikalieindustrin."
        ]
      },
      {
        id: "advisors",
        label: "Rådgivare",
        exampleAnswers: [
          "Extern ekonom, jurist.",
          "Intern ekonom, jurist."
        ]
      }
    ]
  },
  {
    id: "exit_strategy",
    question: "Har ni en exit-strategi?",
    help: "Beskriv eventuella exit-strategier.",
    subQuestions: [
      {
        id: "exit_plan",
        label: "Exit-plan",
        exampleAnswers: [
          "IPO 2027",
          "Förvärv av större aktör"
        ]
      }
    ]
  }
];

const EXAMPLES: { [key: string]: string[] } = {
  business_idea: [
    "Vi erbjuder en AI-baserad plattform som hjälper småföretag att automatisera sin bokföring.",
    "En app som gör det enkelt för privatpersoner att hyra ut och boka parkeringsplatser i realtid.",
    "Vi säljer miljövänliga rengöringsprodukter till hotell och restauranger."
  ],
  customer_segments: [
    "Småföretagare inom tjänstesektorn som vill spara tid på administration.",
    "Stadsbor med egen bil och behov av parkering i city.",
    "Hotellkedjor och restauranger med hållbarhetsfokus."
  ],
  problem_solution: [
    "Många småföretag lägger onödig tid på bokföring – vi automatiserar processen.",
    "Det är svårt att hitta parkering i storstäder – vår app matchar lediga platser med förare.",
    "Stora mängder kemikalier används i städbranschen – vi erbjuder ett miljövänligt alternativ."
  ],
  team: [
    "Anna (VD, 10 år i branschen), Erik (CTO, AI-expert), Sara (Marknad, ex-Google)",
    "Två grundare med bakgrund inom logistik och apputveckling.",
    "Ett team på fem personer med erfarenhet från både hotell och kemikalieindustrin."
  ],
  revenue_model: [
    "Månadsabonnemang per företag.",
    "Transaktionsavgift per bokning.",
    "Försäljning av produkter till grossist och direkt till kund."
  ],
  market_size: [
    "Det finns 500 000 småföretag i Sverige, marknaden värderas till 2 miljarder kr.",
    "I Stockholm finns 100 000 potentiella användare, marknaden växer 10% per år.",
    "Den globala marknaden för miljövänliga rengöringsmedel är 50 miljarder kr."
  ],
  competition: [
    "Största konkurrenten är Bokio, men vi har bättre AI och enklare gränssnitt.",
    "Det finns flera parkeringsappar, men ingen med realtidsmatchning.",
    "Våra konkurrenter använder kemikalier – vi är helt gröna."
  ],
  funding_details: [
    "Vi söker 2 MSEK för att anställa säljare och utveckla nya funktioner.",
    "Behov av 500 000 kr för marknadsföring och lansering i Göteborg.",
    "Vi vill ta in 1,5 MSEK för att expandera till Norden."
  ]
};

interface BranschQuestion {
  id: string;
  text?: string;
  type?: 'text' | 'textarea' | 'select' | 'radio';
  options?: string[];
  label?: string;
  exampleAnswers?: string[];
}

const BRANSCH_SPECIFIC_QUESTIONS: { [key: string]: BranschQuestion[] } = {
  SaaS: [
    {
      id: 'saas_churn',
      label: 'Churn (kundbortfall, % per månad)',
      exampleAnswers: ['2%', '5%', '10%']
    },
    {
      id: 'saas_arr',
      label: 'Årlig återkommande intäkt (ARR)',
      exampleAnswers: ['1 MSEK', '5 MSEK']
    },
    {
      id: 'saas_onboarding',
      label: 'Hur ser onboarding-processen ut?',
      exampleAnswers: ['Automatiserad onboarding', 'Personlig onboarding av kundansvarig']
    }
  ],
  Konsumentvaror: [
    {
      id: 'consumer_logistics',
      label: 'Hur hanterar ni logistik och lager?',
      exampleAnswers: ['Eget lager', 'Tredjepartslogistik (3PL)']
    },
    {
      id: 'consumer_distribution',
      label: 'Hur distribueras produkterna?',
      exampleAnswers: ['Egen e-handel', 'Återförsäljare', 'Amazon']
    }
  ],
  Tech: [
    {
      id: 'tech_ip',
      label: 'Har ni patent eller annan IP?',
      exampleAnswers: ['Patentansökan inlämnad', 'Inget patent']
    },
    {
      id: 'tech_scalability',
      label: 'Hur skalbar är tekniken?',
      exampleAnswers: ['Kan hantera 1M användare', 'Behöver optimeras för tillväxt']
    }
  ]
};

// 1. Apple-inspirerade utility-klasser
const inputBase = "w-full px-4 py-2 rounded-2xl bg-white/10 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] border border-[#16475b] text-white placeholder-[#7edcff] focus:outline-none focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all duration-200 backdrop-blur-md";
const selectWrapper = "relative w-full";
const selectBase = `${inputBase} appearance-none pr-10 cursor-pointer`;
const selectArrow = (
  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7edcff] text-lg">
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M6 8l4 4 4-4" stroke="#7edcff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  </span>
);
const radioOuter = "w-5 h-5 rounded-full border-2 border-[#7edcff] bg-white/10 shadow-inner flex items-center justify-center transition-all duration-200 group-focus:ring-2 group-focus:ring-[#7edcff] group-hover:border-[#7edcff]";
const radioInner = "w-3 h-3 rounded-full bg-[#7edcff] scale-0 group-checked:scale-100 transition-transform duration-200";

interface BusinessIdea {
  what_you_do: string;
  for_whom: string;
  why_unique: string;
}

interface CustomerSegments {
  customer_group: string;
  customer_needs: string;
  customer_location: string;
}

interface ProblemSolution {
  problem: string;
  solution: string;
  unique_value: string;
}

interface MarketAnalysis {
  market_size: string;
  competitors: string;
  market_trends: string;
  market_source?: string;
}

interface BusinessModel {
  revenue_model: string;
  pricing_strategy: string;
  sales_channels: string;
}

interface Team {
  key_people: string;
  roles: string;
  expertise: string;
  [key: string]: string;
}

interface FundingDetails {
  funding_needed: string;
  use_of_funds: string;
  exit_strategy: string;
}

type BusinessPlanValue = string | string[] | Record<string, string>;

interface BusinessPlanSection {
  [key: string]: string;
}

interface BusinessPlanAnswers {
  company_name: string;
  business_idea: BusinessPlanSection;
  customer_segments: BusinessPlanSection;
  problem_solution: BusinessPlanSection;
  market_analysis: BusinessPlanSection;
  business_model: BusinessPlanSection;
  team: BusinessPlanSection;
  funding_details: BusinessPlanSection;
  market_potential?: BusinessPlanSection;
  competition?: BusinessPlanSection;
  [key: string]: string | BusinessPlanSection | undefined;
}

const initialAnswers: BusinessPlanAnswers = {
  company_name: '',
  business_idea: {
    what_you_do: '',
    for_whom: '',
    why_unique: ''
  },
  customer_segments: {
    customer_group: '',
    customer_needs: '',
    customer_location: ''
  },
  problem_solution: {
    problem: '',
    solution: '',
    unique_value: ''
  },
  market_analysis: {
    market_size: '',
    competitors: '',
    market_trends: ''
  },
  business_model: {
    revenue_model: '',
    pricing_strategy: '',
    sales_channels: ''
  },
  team: {
    key_people: '',
    roles: '',
    expertise: ''
  },
  funding_details: {
    funding_needed: '',
    use_of_funds: '',
    exit_strategy: ''
  }
};

export default function BusinessPlanWizard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [answers, setAnswers] = useState<BusinessPlanAnswers>(initialAnswers);
  const [step, setStep] = useState(0);
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [bransch, setBransch] = useState("");
  const [customBransch, setCustomBransch] = useState("");
  const [omrade, setOmrade] = useState("");
  const [customOmrade, setCustomOmrade] = useState("");
  const [linkedinProfiles, setLinkedinProfiles] = useState<string[]>([]);
  const [profileAnalysis, setProfileAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showExamples, setShowExamples] = useState<string | null>(null);
  const [showMarketPopup, setShowMarketPopup] = useState(false);
  const [marketEstimate, setMarketEstimate] = useState<string>("");
  const [marketSource, setMarketSource] = useState<string>("");
  const [isMarketLoading, setIsMarketLoading] = useState(false);
  const [competitionSuggestions, setCompetitionSuggestions] = useState<string[]>([]);
  const [isCompetitionLoading, setIsCompetitionLoading] = useState(false);
  const [result, setResult] = useState<{ score: number; subscriptionLevel?: 'silver' | 'gold' | 'platinum' } | null>(null);
  const [isAnalyzingPlan, setIsAnalyzingPlan] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [budgetPosts, setBudgetPosts] = useState<{ amount: string; purpose: string }[]>([{ amount: '', purpose: '' }]);
  const [preStep, setPreStep] = useState(true);
  const [hasWebsite, setHasWebsite] = useState<null | boolean>(null);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const scrapingMessages = [
    "Analyserar din hemsida...",
    "Sammanfattar affärsidé och erbjudande...",
    "Bygger frågeställningar efter dina behov...",
    "Förbereder autofyll..."
  ];
  const [scrapeMsgIdx, setScrapeMsgIdx] = useState(0);
  const scrapeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // --- sub-question navigation ---
  const [subStep, setSubStep] = useState(0);

  const current = questions[step - 1];
  const progress = Math.round(((step) / questions.length) * 100);

  const isStartValid =
    company.trim().length > 1 &&
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) &&
    bransch && (bransch !== "Annat" || customBransch.trim().length > 1) &&
    omrade && (omrade !== "Annat" || customOmrade.trim().length > 1);

  const handleStart = () => {
    localStorage.setItem(
      "bpw_start",
      JSON.stringify({
        company,
        email,
        bransch: bransch === "Annat" ? customBransch : bransch,
        omrade: omrade === "Annat" ? customOmrade : omrade
      })
    );
    setStep(1);
  };

  // Fetch AI suggestions for certain questions (must be after 'current' is defined)
  useEffect(() => {
    if (!current?.id) return;
    const currentAnswers = answers[current.id];
    if (['customer_segments', 'problem_solution'].includes(current.id) && currentAnswers && Array.isArray(currentAnswers) && currentAnswers.length > 1) {
      setIsFetchingSuggestions(true);
      fetch('/api/ai-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: current.id, answers: currentAnswers })
      })
        .then(res => res.json())
        .then(data => {
          setAiSuggestions(data.suggestions);
        })
        .catch(error => {
          console.error('Error fetching suggestions:', error);
        })
        .finally(() => {
          setIsFetchingSuggestions(false);
        });
    }
  }, [current, answers]);

  useEffect(() => {
    if (isScraping) {
      setScrapeMsgIdx(0);
      scrapeIntervalRef.current = setInterval(() => {
        setScrapeMsgIdx(idx => (idx + 1) % scrapingMessages.length);
      }, 1500);
    } else if (scrapeIntervalRef.current) {
      clearInterval(scrapeIntervalRef.current);
      scrapeIntervalRef.current = null;
    }
    return () => {
      if (scrapeIntervalRef.current) {
        clearInterval(scrapeIntervalRef.current);
        scrapeIntervalRef.current = null;
      }
    };
  }, [isScraping, scrapingMessages.length]);

  // När vi byter huvudfråga, nollställ subStep
  useEffect(() => { setSubStep(0); }, [step]);

  // Hur många sub-questions per sida?
  const SUBS_PER_PAGE = 3;

  if (!open) return null;
  if (result) {
    // Visa stora resultatsidan istället för betygs-popup
    return (
      <BusinessPlanResult
        score={result.score}
        answers={answers}
        subscriptionLevel={result.subscriptionLevel || 'silver'}
      />
    );
  }
  if (preStep) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-[#f5f7fa] text-[#16475b] rounded-3xl shadow-2xl border border-[#16475b] max-w-lg w-full p-8 relative animate-fade-in">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#16475b] text-2xl font-bold hover:text-[#16475b] focus:outline-none"
            aria-label="Stäng"
          >×</button>
          <h2 className="text-2xl font-bold mb-6 text-center text-[#16475b]">Har du en hemsida idag?</h2>
          <div className="flex justify-center gap-6 mb-6">
            <button
              className={`px-8 py-3 rounded-full font-bold text-lg shadow ${hasWebsite === true ? 'bg-[#16475b] text-white' : 'bg-[#eaf6fa] text-[#16475b]'} hover:bg-[#2a6b8a] hover:text-white transition-colors`}
              onClick={() => setHasWebsite(true)}
            >JA</button>
            <button
              className={`px-8 py-3 rounded-full font-bold text-lg shadow ${hasWebsite === false ? 'bg-[#16475b] text-white' : 'bg-[#eaf6fa] text-[#16475b]'} hover:bg-[#2a6b8a] hover:text-white transition-colors`}
              onClick={() => { setHasWebsite(false); setPreStep(false); }}
            >NEJ</button>
          </div>
          {hasWebsite && (
            <div className="mt-4">
              <label className="block font-semibold mb-1 text-[#16475b]">Ange din webbadress</label>
              <input
                type="url"
                className="w-full px-4 py-2 rounded-2xl bg-white/60 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] border border-[#16475b] text-[#16475b] placeholder-[#16475b] focus:outline-none focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all duration-200 backdrop-blur-md"
                value={websiteUrl || ""}
                onChange={e => setWebsiteUrl(e.target.value)}
                placeholder="www"
              />
              <button
                className="w-full mt-4 bg-[#16475b] text-white font-bold rounded-full px-8 py-3 shadow-lg hover:bg-[#16475b] hover:text-[#16475b] transition-colors text-lg tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={async () => {
                  setIsScraping(true);
                  setScrapeError(null);
                  try {
                    const res = await fetch('/api/scrape-website', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ url: websiteUrl })
                    });
                    const data = await res.json();
                    if (data && typeof data === 'object') {
                      // Mappa den skrapade datan till rätt fält
                      const mappedData: BusinessPlanAnswers = {
                        company_name: data.company_name,
                        business_idea: {
                          what_you_do: data.business_idea,
                          for_whom: data.customer_segments,
                          why_unique: data.övrigt?.unique_selling_point || ''
                        },
                        customer_segments: {
                          customer_group: data.customer_segments,
                          customer_needs: data.övrigt?.customer_needs || '',
                          customer_location: data.area
                        },
                        problem_solution: {
                          problem: data.övrigt?.problem || '',
                          solution: data.business_idea
                        },
                        market_analysis: {
                          market_size: data.market_size || '',
                          competitors: data.competition || '',
                          market_trends: data.övrigt?.market_trends || ''
                        },
                        business_model: {
                          revenue_model: data.revenue_model || '',
                          pricing_strategy: data.övrigt?.pricing_strategy || '',
                          sales_channels: data.övrigt?.sales_channels || ''
                        },
                        team: {
                          key_people: data.team || '',
                          roles: data.övrigt?.roles || '',
                          expertise: data.övrigt?.expertise || ''
                        },
                        funding_details: {
                          funding_needed: data.övrigt?.funding_amount || '',
                          use_of_funds: data.övrigt?.funding_usage || '',
                          exit_strategy: data.övrigt?.funding_period || ''
                        }
                      };
                      
                      // Sätt företagsnamn och andra grundläggande fält
                      setCompany(data.company_name || '');
                      setBransch(data.industry || '');
                      setOmrade(data.area || '');
                      
                      // Sätt svaren i formuläret
                      setAnswers(mappedData);
                      setPreStep(false);
                    } else {
                      setScrapeError('Kunde inte tolka informationen från hemsidan.');
                    }
                  } catch (e) {
                    setScrapeError('Kunde inte hämta information från hemsidan.');
                  } finally {
                    setIsScraping(false);
                  }
                }}
                disabled={!websiteUrl || isScraping}
              >
                {isScraping ? 'Analyserar hemsidan...' : 'Fortsätt'}
              </button>
              {isScraping && (
                <div className="flex flex-col items-center mt-6 mb-2">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#16475b]"></div>
                  <div className="mt-4 text-[#16475b] text-base font-semibold min-h-[32px] text-center">
                    {scrapingMessages[scrapeMsgIdx]}
                  </div>
                </div>
              )}
              {scrapeError && <div className="text-red-600 text-sm mt-2 text-center">{scrapeError}</div>}
            </div>
          )}
        </div>
      </div>
    );
  }
  if (step === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-[#f5f7fa] text-[#16475b] rounded-3xl shadow-2xl border border-[#16475b] max-w-lg w-full p-8 relative animate-fade-in">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#16475b] text-2xl font-bold hover:text-[#16475b] focus:outline-none"
            aria-label="Stäng"
          >
            ×
          </button>
          <h2 className="text-2xl font-bold text-[#16475b] mb-6 text-center">Starta din affärsplan-analys</h2>
          <div className="mb-4">
            <label className="block text-[#16475b] font-semibold mb-1">Företagsnamn</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-2xl bg-white/60 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] border border-[#16475b] text-[#16475b] placeholder-[#16475b] focus:outline-none focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all duration-200 backdrop-blur-md"
              value={company || ""}
              onChange={e => setCompany(e.target.value)}
              placeholder="Ex: FrejFund AB"
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#16475b] font-semibold mb-1">E-post</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-2xl bg-white/60 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] border border-[#16475b] text-[#16475b] placeholder-[#16475b] focus:outline-none focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all duration-200 backdrop-blur-md"
              value={email || ""}
              onChange={e => setEmail(e.target.value)}
              placeholder="din@email.se"
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#16475b] font-semibold mb-1">Bransch</label>
            <div className={selectWrapper}>
              <select
                className="w-full px-4 py-2 rounded-2xl bg-white/60 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] border border-[#16475b] text-[#16475b] placeholder-[#16475b] focus:outline-none focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all duration-200 backdrop-blur-md appearance-none pr-10 cursor-pointer"
                value={bransch}
                onChange={e => setBransch(e.target.value)}
              >
                <option value="">Välj bransch...</option>
                {BRANSCHER.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2">{selectArrow}</div>
            </div>
            {bransch === "Annat" && (
              <input
                type="text"
                className="w-full px-4 py-2 rounded-2xl bg-white/60 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] border border-[#16475b] text-[#16475b] placeholder-[#16475b] focus:outline-none focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all duration-200 backdrop-blur-md"
                value={customBransch || ""}
                onChange={e => setCustomBransch(e.target.value)}
                placeholder="Ange bransch"
              />
            )}
          </div>
          <div className="mb-6">
            <label className="block text-[#16475b] font-semibold mb-1">Område</label>
            <div className={selectWrapper}>
              <select
                className="w-full px-4 py-2 rounded-2xl bg-white/60 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] border border-[#16475b] text-[#16475b] placeholder-[#16475b] focus:outline-none focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all duration-200 backdrop-blur-md appearance-none pr-10 cursor-pointer"
                value={omrade}
                onChange={e => setOmrade(e.target.value)}
              >
                <option value="">Välj område...</option>
                {OMRADEN.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2">{selectArrow}</div>
            </div>
            {omrade === "Annat" && (
              <input
                type="text"
                className="w-full px-4 py-2 rounded-2xl bg-white/60 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] border border-[#16475b] text-[#16475b] placeholder-[#16475b] focus:outline-none focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all duration-200 backdrop-blur-md"
                value={customOmrade || ""}
                onChange={e => setCustomOmrade(e.target.value)}
                placeholder="Ange område (stad, land, region)"
              />
            )}
          </div>
          <button
            className="w-full bg-[#16475b] text-white font-bold rounded-full px-8 py-3 shadow-lg hover:bg-[#16475b] hover:text-[#16475b] transition-colors text-lg tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleStart}
            disabled={!isStartValid}
          >
            Starta analysen
          </button>
        </div>
      </div>
    );
  }
  if (step > 0 && !current) return null;

  const handleLinkedinProfilesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const profiles = e.target.value.split('\n').filter(profile => profile.trim() !== '');
    setLinkedinProfiles(profiles);
    setAnswers(a => ({
      ...a,
      team: {
        key_people: e.target.value || "",
        roles: a.team?.roles || "",
        expertise: a.team?.expertise || ""
      }
    }));
  };

  const analyzeLinkedinProfiles = async () => {
    if (linkedinProfiles.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Example analysis - in production, this would call your backend API
      const analysis = linkedinProfiles.map(profile => {
        const name = profile.split('/').pop()?.replace(/-/g, ' ') || '';
        return `${name}: ${getRandomProfileAnalysis()}`;
      }).join('\n\n');
      
      setProfileAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing profiles:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRandomProfileAnalysis = () => {
    const analyses = [
      "f.d. professionellt pokerproffs, numera AI-utvecklare med 7 års erfarenhet av SaaS-plattformar.",
      "serieentreprenör inom hudvård, 3 exiter, expert på D2C-marknadsföring.",
      "tidigare CTO på Spotify, 15 års erfarenhet av skalbar teknik.",
      "grundare av 3 framgångsrika startups, expert på B2B-försäljning.",
      "tidigare VD på Klarna, specialiserad på fintech och betalningslösningar."
    ];
    return analyses[Math.floor(Math.random() * analyses.length)];
  };

  const handleNext = () => {
    if (step < questions.length) {
      setStep(step + 1);
    } else if (step === questions.length) {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = async () => {
    setIsAnalyzingPlan(true);
    setAnalyzeError(null);
    try {
      const res = await fetch('/api/analyze-businessplan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, applicationType: 'almi' })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setAnalyzeError('Kunde inte analysera affärsplanen. Försök igen.');
    } finally {
      setIsAnalyzingPlan(false);
    }
  };

  const handleAnswerChange = (section: keyof BusinessPlanAnswers, field: string, value: string) => {
    setAnswers(prev => {
      const sectionData = prev[section];
      if (typeof sectionData === 'string') {
        return {
          ...prev,
          [section]: value
        };
      }
      if (sectionData) {
        return {
          ...prev,
          [section]: {
            ...sectionData,
            [field]: value
          }
        };
      }
      return prev;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#f5f7fa] text-[#16475b] rounded-3xl shadow-2xl border border-[#16475b] max-w-xl min-h-[700px] w-full p-8 relative animate-fade-in flex flex-col justify-between">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#16475b] text-2xl font-bold hover:text-[#16475b] focus:outline-none"
          aria-label="Stäng"
        >
          ×
        </button>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#16475b] font-bold text-sm">Fråga {step} av {questions.length}</span>
            <span className="text-[#16475b] font-bold text-sm">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-[#eaf6fa] rounded-full overflow-hidden mb-2">
            <div className="h-full bg-[#16475b] rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
        {current && current.id === "team" ? (
          <div>
            <h2 className="text-xl font-bold mb-2">{current.question}</h2>
            <p className="mb-4 text-sm text-[#16475b]">{current.help}</p>
            <label className="block font-semibold mb-1">LinkedIn-profiler (en per rad)</label>
            <textarea
              className="w-full min-h-[60px] rounded-lg border border-[#16475b] bg-white/80 px-4 py-2 text-[#16475b] focus:outline-none focus:border-[#16475b]"
              value={linkedinProfiles.join('\n') || ""}
              onChange={handleLinkedinProfilesChange}
              placeholder="https://www.linkedin.com/in/namn-efternamn"
            />
            <button
              className="mt-2 mb-4 bg-[#16475b] text-white font-bold rounded-full px-6 py-2 shadow transition-colors hover:bg-[#7edc7a] hover:text-[#16475b]"
              onClick={analyzeLinkedinProfiles}
              disabled={linkedinProfiles.length === 0 || isAnalyzing}
            >
              {isAnalyzing ? "Analyserar profiler..." : "Hämta info"}
            </button>
            {profileAnalysis && (
              <div className="mt-2 mb-4 p-4 bg-[#eaf6fa] rounded-lg">
                <h3 className="text-[#16475b] font-semibold mb-2">Analys:</h3>
                <p className="text-[#16475b] whitespace-pre-line">{profileAnalysis}</p>
              </div>
            )}
            {/* Render sub-questions for team (excluding LinkedIn) */}
            {current.subQuestions.slice(1).map((sub, idx) => (
              <div key={sub.id} className="mb-4">
                <label className="block font-semibold mb-1">{sub.label}</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-[#16475b] bg-white/80 px-4 py-2 text-[#16475b] focus:outline-none focus:border-[#16475b]"
                  value={answers.team?.[sub.id] || ""}
                  onChange={e => handleAnswerChange('team', sub.id, e.target.value)}
                  placeholder="Skriv ditt svar här..."
                />
                <button
                  className="mt-1 text-xs underline text-[#16475b]"
                  type="button"
                  onClick={() => setShowExamples(sub.id === showExamples ? null : sub.id)}
                >
                  Visa förslag
                </button>
                {showExamples === sub.id && (
                  <div style={{ background: '#04121d', borderRadius: '0.75rem', padding: '0.75rem', marginTop: '0.5rem', border: '1px solid #16475b' }}>
                    <div className="font-bold text-lg mb-2 text-white">{sub.label}</div>
                    <div className="text-sm text-white">
                      {sub.exampleAnswers?.map((ex: string, i: number) => (
                        <button
                          key={i}
                          className="bg-[#16475b] text-white rounded-full px-3 py-1 text-xs font-semibold hover:bg-[#7edcff] hover:text-[#04121d] transition-colors mr-2 mb-2"
                          type="button"
                          onClick={() => handleAnswerChange('team', sub.id, ex)}
                        >
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/* Navigationsknappar alltid längst ner */}
            <div className="flex justify-between mt-8">
              <button
                className="bg-[#eaf6fa] text-[#16475b] font-bold rounded-full px-6 py-2 shadow border border-[#16475b] hover:bg-[#16475b] hover:text-white transition-colors text-base"
                onClick={() => {
                  if (subStep === 0) {
                    if (step > 1) {
                      setStep(step - 1);
                      setSubStep(0);
                    }
                  } else {
                    setSubStep(s => Math.max(0, s - 1));
                  }
                }}
                disabled={step === 1 && subStep === 0}
              >
                Tillbaka
              </button>
              <button
                className="bg-[#16475b] text-white font-bold rounded-full px-6 py-2 shadow border border-[#16475b] hover:bg-[#16475b] hover:text-white transition-colors text-base"
                onClick={() => {
                  const maxSubStep = Math.ceil(current.subQuestions.length / SUBS_PER_PAGE) - 1;
                  const isLastChunk = subStep >= maxSubStep;
                  const isLastStep = step === questions.length;
                  if (!isLastChunk) setSubStep(s => s + 1);
                  else if (!isLastStep) handleNext();
                  else handleFinish();
                }}
                disabled={isAnalyzingPlan}
              >
                {(() => {
                  const maxSubStep = Math.ceil(current.subQuestions.length / SUBS_PER_PAGE) - 1;
                  const isLastChunk = subStep >= maxSubStep;
                  const isLastStep = step === questions.length;
                  if (!isLastChunk) return 'Nästa';
                  if (isLastStep) return isAnalyzingPlan ? 'Analyserar...' : 'Slutför';
                  return 'Nästa';
                })()}
              </button>
            </div>
          </div>
        ) : current && current.subQuestions ? (
          <div>
            <h2 className="text-xl font-bold mb-2">{current.question}</h2>
            <p className="mb-4 text-sm text-[#16475b]">{current.help}</p>
            {/* Visa 3 sub-questions per sida */}
            {current.subQuestions.slice(subStep * SUBS_PER_PAGE, (subStep + 1) * SUBS_PER_PAGE).map((sub: BranschQuestion) => (
              <div key={sub.id} className="mb-4">
                <label className="block font-semibold mb-1">{sub.label}</label>
                <textarea
                  className="w-full min-h-[60px] rounded-lg border border-[#16475b] bg-white/80 px-4 py-2 text-[#16475b] focus:outline-none focus:border-[#16475b]"
                  value={typeof answers[current.id] === 'object' && answers[current.id] !== null 
                    ? (answers[current.id] as BusinessPlanSection)[sub.id] || ""
                    : ""}
                  onChange={e => handleAnswerChange(current.id as keyof BusinessPlanAnswers, sub.id, e.target.value)}
                  placeholder="Skriv ditt svar här..."
                />
                <button
                  className="mt-1 text-xs underline text-[#16475b]"
                  type="button"
                  onClick={() => setShowExamples(sub.id === showExamples ? null : sub.id)}
                >
                  Visa förslag
                </button>
                {showExamples === sub.id && (
                  <div style={{ background: '#04121d', borderRadius: '0.75rem', padding: '0.75rem', marginTop: '0.5rem', border: '1px solid #16475b' }}>
                    <div className="font-bold text-lg mb-2 text-white">{sub.label}</div>
                    <div className="text-sm text-white">
                      {sub.exampleAnswers?.map((ex: string, i: number) => (
                        <button
                          key={i}
                          className="bg-[#16475b] text-white rounded-full px-3 py-1 text-xs font-semibold hover:bg-[#7edcff] hover:text-[#04121d] transition-colors mr-2 mb-2"
                          type="button"
                          onClick={() => handleAnswerChange(current.id as keyof BusinessPlanAnswers, sub.id, ex)}
                        >
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/* Sub-question navigation - alltid längst ner */}
            <div className="flex justify-between items-center mt-4 relative">
              <button
                className="bg-[#eaf6fa] text-[#16475b] font-bold rounded-full px-6 py-2 shadow border border-[#16475b] hover:bg-[#16475b] hover:text-white transition-colors text-base"
                onClick={() => {
                  if (subStep === 0) {
                    if (step > 1) {
                      setStep(step - 1);
                      setSubStep(0);
                    }
                  } else {
                    setSubStep(s => Math.max(0, s - 1));
                  }
                }}
                disabled={step === 1 && subStep === 0}
              >
                Tillbaka
              </button>
              {/* Centrera BERÄKNA MARKNADSVÄRDE mellan knapparna om market_potential */}
              {current.id === 'market_potential' && (
                <div className="absolute left-1/2 -translate-x-1/2 flex justify-center">
                  <button
                    className="bg-[#16475b] text-white font-bold rounded-full px-4 py-2 shadow hover:bg-[#7edcff] hover:text-[#04121d] transition-colors text-sm mx-2"
                    type="button"
                    onClick={async () => {
                      setIsMarketLoading(true);
                      try {
                        const res = await fetch('/api/market-estimate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            bransch: bransch === 'Annat' ? customBransch : bransch,
                            omrade: omrade === 'Annat' ? customOmrade : omrade
                          })
                        });
                        const data = await res.json();
                        handleAnswerChange('market_potential', 'market_value', data.estimate || '');
                        handleAnswerChange('market_potential', 'market_source', data.source || '');
                      } finally {
                        setIsMarketLoading(false);
                      }
                    }}
                    disabled={isMarketLoading}
                  >
                    {isMarketLoading ? 'Hämtar marknadsvärde...' : 'BERÄKNA MARKNADSVÄRDE'}
                  </button>
                </div>
              )}
              {current.id === 'competition' && (
                <button
                  className="bg-[#16475b] text-white font-bold rounded-full px-4 py-2 shadow hover:bg-[#7edcff] hover:text-[#04121d] transition-colors text-sm mx-2"
                  type="button"
                  onClick={async () => {
                    setIsCompetitionLoading(true);
                    try {
                      const res = await fetch('/api/competition-suggestions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          business_idea: answers.business_idea?.what_you_do || '',
                          bransch: bransch === 'Annat' ? customBransch : bransch,
                          omrade: omrade === 'Annat' ? customOmrade : omrade
                        })
                      });
                      const data = await res.json();
                      handleAnswerChange('competition', 'main_competitors', data.suggestions || []);
                    } finally {
                      setIsCompetitionLoading(false);
                    }
                  }}
                  disabled={isCompetitionLoading}
                >
                  {isCompetitionLoading ? 'Hämtar konkurrenter...' : 'HITTA KONKURRENTER'}
                </button>
              )}
              <button
                className="bg-[#16475b] text-white font-bold rounded-full px-6 py-2 shadow border border-[#16475b] hover:bg-[#16475b] hover:text-white transition-colors text-base"
                onClick={() => {
                  const maxSubStep = Math.ceil(current.subQuestions.length / SUBS_PER_PAGE) - 1;
                  const isLastChunk = subStep >= maxSubStep;
                  const isLastStep = step === questions.length;
                  if (!isLastChunk) setSubStep(s => s + 1);
                  else if (!isLastStep) handleNext();
                  else handleFinish();
                }}
                disabled={isAnalyzingPlan}
              >
                {(() => {
                  const maxSubStep = Math.ceil(current.subQuestions.length / SUBS_PER_PAGE) - 1;
                  const isLastChunk = subStep >= maxSubStep;
                  const isLastStep = step === questions.length;
                  if (!isLastChunk) return 'Nästa';
                  if (isLastStep) return isAnalyzingPlan ? 'Analyserar...' : 'Slutför';
                  return 'Nästa';
                })()}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between mt-4">
            <button
              className="bg-[#eaf6fa] text-[#16475b] font-bold rounded-full px-6 py-2 shadow border border-[#16475b] hover:bg-[#16475b] hover:text-white transition-colors text-base"
              onClick={handleBack}
              disabled={step === 1}
            >
              Tillbaka
            </button>
            <button
              className="bg-[#16475b] text-white font-bold rounded-full px-6 py-2 shadow border border-[#16475b] hover:bg-[#16475b] hover:text-white transition-colors text-base"
              onClick={() => {
                const maxSubStep = Math.ceil(current.subQuestions.length / SUBS_PER_PAGE) - 1;
                const isLastChunk = subStep >= maxSubStep;
                const isLastStep = step === questions.length;
                if (!isLastChunk) setSubStep(s => s + 1);
                else if (!isLastStep) handleNext();
                else handleFinish();
              }}
              disabled={isAnalyzingPlan}
            >
              {(() => {
                const maxSubStep = Math.ceil(current.subQuestions.length / SUBS_PER_PAGE) - 1;
                const isLastChunk = subStep >= maxSubStep;
                const isLastStep = step === questions.length;
                if (!isLastChunk) return 'Nästa';
                if (isLastStep) return isAnalyzingPlan ? 'Analyserar...' : 'Slutför';
                return 'Nästa';
              })()}
            </button>
          </div>
        )}
        {analyzeError && <div className="text-red-600 text-sm mt-2 text-center">{analyzeError}</div>}
        {isAnalyzingPlan && (
          <div className="flex justify-center items-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#16475b]"></div>
            <span className="ml-3 text-[#16475b]">AI analyserar din affärsplan...</span>
          </div>
        )}
        {current.id === 'market_potential' && (
          <div className="mb-4">
            {answers.market_potential?.market_source && (
              <div className="text-xs mt-2 text-[#16475b]">
                {typeof answers.market_potential.market_source === 'string' 
                  ? answers.market_potential.market_source 
                  : ''}
              </div>
            )}
          </div>
        )}
        {current.id === 'competition' && (
          <div className="mb-4">
            {Array.isArray(answers.competition?.main_competitors) && answers.competition.main_competitors.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {answers.competition.main_competitors.map((c: string, i: number) => (
                  <span key={i} className="bg-[#eaf6fa] text-[#16475b] rounded-full px-3 py-1 text-xs font-semibold">{c}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 