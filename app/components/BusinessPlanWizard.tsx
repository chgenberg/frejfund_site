"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import BusinessPlanResult from './BusinessPlanResult';
import BusinessPlanScore from './BusinessPlanScore';
import TestWizard, { CustomTextarea, TEST_EXPORT } from './TestWizard';

const BRANSCHER = [
  'SaaS', 'Tech', 'Konsumentvaror', 'Hälsa', 'Fintech', 'Industri', 'Tjänster', 'Utbildning', 'Energi', 'Annat'
];
const OMRADEN = [
  'Sverige', 'Norden', 'Europa', 'Globalt', 'Annat'
];

// Update Question type definition to be more specific
type BaseQuestion = {
  id: string;
  label: string;
  required: boolean;
  help: string;
};

type TextQuestion = BaseQuestion & {
  type: 'textarea' | 'text' | 'number' | 'file';
};

type SelectQuestion = BaseQuestion & {
  type: 'select' | 'radio';
  options: string[];
};

type MilestoneQuestion = BaseQuestion & {
  type: 'milestone_list';
};

type CapitalQuestion = BaseQuestion & {
  type: 'capital_matrix';
};

type ESGQuestion = BaseQuestion & {
  type: 'esg_checkbox';
};

type FounderMarketFitQuestion = BaseQuestion & {
  type: 'founder_market_fit';
};

type Question = TextQuestion | SelectQuestion | MilestoneQuestion | CapitalQuestion | ESGQuestion | FounderMarketFitQuestion;

// Type guard to check if a question is a SelectQuestion
function isSelectQuestion(question: Question): question is SelectQuestion {
  return question.type === 'select' || question.type === 'radio';
}

// Type guard to check if a question is a TextQuestion
function isTextQuestion(question: Question): question is TextQuestion {
  return question.type === 'textarea' || question.type === 'text' || question.type === 'number' || question.type === 'file';
}

// Type guard to check if a question is a MilestoneQuestion
function isMilestoneQuestion(question: Question): question is MilestoneQuestion {
  return question.type === 'milestone_list';
}

// Type guard to check if a question is a CapitalQuestion
function isCapitalQuestion(question: Question): question is CapitalQuestion {
  return question.type === 'capital_matrix';
}

// Type guard to check if a question is an ESGQuestion
function isESGQuestion(question: Question): question is ESGQuestion {
  return question.type === 'esg_checkbox';
}

// Type guard to check if a question is a FounderMarketFitQuestion
function isFounderMarketFitQuestion(question: Question): question is FounderMarketFitQuestion {
  return question.type === 'founder_market_fit';
}

// Steg 1-5: Inledande frågor
const INTRO_QUESTIONS: Question[] = [];

const QUESTIONS: Question[] = [
  { id: 'company_value', label: 'Vad gör företaget och vilket värde skapar det?', type: 'textarea', required: true, help: 'Beskriv affärsidén, produkten/tjänsten, kundpain och hur ni skapar värde.' },
  { id: 'customer_problem', label: 'Vilket problem löser ni för era kunder?', type: 'textarea', required: true, help: 'Beskriv det specifika problem eller behov som er produkt/tjänst adresserar.' },
  { id: 'problem_evidence', label: 'Hur vanligt är problemet – och hur bevisar ni det?', type: 'textarea', required: true, help: 'Ge gärna en datapunkt, referens eller länk.' },
  { id: 'market_gap', label: 'Vilket "gap" på marknaden fyller ni?', type: 'textarea', required: true, help: 'Finns det en lucka där befintliga alternativ inte räcker till?' },
  { id: 'solution', label: 'Hur löser ni problemet? (Er lösning)', type: 'textarea', required: true, help: 'Förklara er produkt/tjänst och hur den adresserar problemet.' },
  { id: 'why_now', label: 'Varför är timingen rätt – tekniskt, marknadsmässigt eller reglerings-mässigt?', type: 'textarea', required: true, help: 'Motivera varför just nu är rätt tillfälle.' },
  { id: 'target_customer', label: 'Vem är er målgrupp och kund?', type: 'textarea', required: true, help: 'Beskriv er idealkund. Är ni B2B eller B2C? SMB eller enterprise?' },
  { id: 'market_size', label: 'Hur stort är marknadsutrymmet? (TAM/SAM/SOM)', type: 'textarea', required: true, help: 'Uppskatta er totala marknad: TAM, SAM, SOM.' },
  { id: 'market_trends', label: 'Vilka viktiga marknadstrender gynnar er?', type: 'textarea', required: false, help: 'Beskriv trender (teknologiska, demografiska, regulatoriska) som ni surfar på.' },
  { id: 'traction', label: 'Hur ser traction ut hittills?', type: 'textarea', required: true, help: 'Ange milstolpar och resultat: användare, kunder, piloter, intäkter, tillväxttal.' },
  { id: 'revenue_block', label: 'Hur tjänar ni pengar och hur fördelas intäkterna (återkommande/engång)?', type: 'textarea', required: true, help: 'Beskriv intäktsströmmar, prissättning och fördelning mellan återkommande och engångsintäkter.' },
  { id: 'runway', label: 'Hur lång runway (antal månader) har ni? (heltal)', type: 'number', required: true, help: 'Hur många månader räcker ert kapital? (Bifoga gärna P/L-rapport om möjligt)' },
  { id: 'growth_plan', label: 'Vad är er tillväxtplan för nästa 12-24 månader?', type: 'textarea', required: true, help: 'Beskriv framtidsplaner: försäljningstillväxt, produktlanseringar, kundmål.' },
  { id: 'milestones', label: 'Vilka tre största milstolpar planerar ni att nå kommande 12 månader (med månad/kvartal)?', type: 'milestone_list', required: true, help: 'Exempel: "Lansering Q3", "Första betalande kund i september", "ISO-certifiering Q2".' },
  { id: 'team', label: 'Hur ser ert team ut?', type: 'textarea', required: true, help: 'Presentera grundarna och kärnteamet, roller och erfarenheter.' },
  { id: 'founder_equity', label: 'Hur stor ägarandel (%) behåller grundarteamet efter denna runda?', type: 'number', required: true, help: 'Svara i procent, t.ex. 65.' },
  { id: 'founder_market_fit', label: 'Hur väl matchar teamets bakgrund det problem ni löser? (1–5-skala + fritext)', type: 'founder_market_fit', required: true, help: '1 = ingen erfarenhet, 5 = djup domänexpertis. Motivera kort.' },
  { id: 'team_skills', label: 'Vilka kompetenser täcker teamet – och saknas det någon?', type: 'textarea', required: false, help: 'Beskriv hur komplett teamet är och ev. kompetensluckor.' },
  { id: 'hiring_plan', label: 'Har ni en rekryteringsplan?', type: 'textarea', required: false, help: 'Beskriv er hiring plan för kommande året.' },
  { id: 'board_advisors', label: 'Har ni en styrelse eller rådgivare?', type: 'textarea', required: false, help: 'Ange om ni har en formell styrelse och vilka som sitter i den, eller tunga rådgivare.' },
  { id: 'competitors', label: 'Vilka är era konkurrenter?', type: 'textarea', required: true, help: 'Lista de viktigaste konkurrenterna och hur ni skiljer er.' },
  { id: 'unique_solution', label: 'Vad gör er lösning unik eller svår att kopiera?', type: 'textarea', required: true, help: 'Utveckla ert konkurrensförsprång: teknik, patent, nätverkseffekter, IP.' },
  { id: 'ip_rights', label: 'Äger ni immateriella rättigheter (IP)?', type: 'radio', options: ['Ja', 'Nej'], required: false, help: 'Patent, varumärkesskydd, upphovsrätt? Om Ja – specificera kort.' },
  { id: 'capital_block', label: 'Kapitalbehov och användning', type: 'capital_matrix', required: true, help: 'Ange belopp (MSEK), fördelning (% till produkt/försäljning/team/övrigt) och sannolikhet att ni behöver mer kapital (1–5).' },
  { id: 'exit_strategy', label: 'Vad är er exit-strategi för investerare?', type: 'textarea', required: false, help: 'Beskriv möjliga exitmöjligheter på sikt.' },
  { id: 'main_risks', label: 'Vilka är de största riskerna i er affär?', type: 'textarea', required: true, help: 'Identifiera de viktigaste riskfaktorerna och hur ni planerar att hantera dem.' },
  { id: 'esg', label: 'Hur adresserar ni hållbarhet och ESG?', type: 'esg_checkbox', required: false, help: 'Kryssa i vad som är relevant och beskriv kort.' },
  { id: 'tax_incentives', label: 'Finns det några skattemässiga incitament eller stöd kopplade till investeringen?', type: 'textarea', required: false, help: 'T.ex. bidrag, stöd, skattelättnader. (Visas bara för SaaS/Fintech)' },
  { id: 'anything_else', label: 'Vill du dela med dig av någonting mer?', type: 'textarea', required: false, help: 'Något du vill förtydliga, komplettera eller lyfta fram?' }
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
  type?: 'text' | 'textarea' | 'select' | 'radio' | 'number' | 'file' | 'milestone_list' | 'capital_matrix' | 'esg_checkbox' | 'founder_market_fit';
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
const focusRing = "focus:outline-none focus:ring-2 focus:ring-[#7edcff] focus:ring-offset-2 focus:ring-offset-[#f5f7fa]";
const mobileInput = "text-base md:text-sm"; // Larger text on mobile
const touchTarget = "min-h-[44px]"; // Minimum touch target size
const transitionBase = "transition-all duration-200 ease-in-out";

// Update the input base styles
const inputBase = `w-full px-4 py-3 rounded-2xl bg-white/10 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] border border-[#16475b] text-[#04121d] placeholder-[#7edcff] transition-all duration-200 backdrop-blur-md ${mobileInput} ${touchTarget}`;

// Update the select base styles
const selectBase = `${inputBase} appearance-none pr-10 cursor-pointer`;

// Add new feedback styles
const successState = "border-green-500 bg-green-50/10";
const errorState = "border-red-500 bg-red-50/10";
const loadingState = "opacity-75 cursor-wait";

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

// Efter inledande steg, nytt investerarvänligt frågebatteri
const INVESTOR_QUESTIONS: Question[] = [
  {
    id: 'company_value',
    label: 'Vad gör företaget och vilket värde skapar det?',
    type: 'textarea',
    required: true,
    help: 'Beskriv affärsidén, produkten/tjänsten, kundpain och hur ni skapar värde.'
  },
  {
    id: 'customer_problem',
    label: 'Vilket problem löser ni för era kunder?',
    type: 'textarea',
    required: true,
    help: 'Beskriv det specifika problem eller behov som er produkt/tjänst adresserar.'
  },
  {
    id: 'problem_evidence',
    label: 'Hur vanligt är problemet – och hur bevisar ni det?',
    type: 'textarea',
    required: true,
    help: 'Ge gärna en datapunkt, referens eller länk.'
  },
  {
    id: 'market_gap',
    label: 'Vilket "gap" på marknaden fyller ni?',
    type: 'textarea',
    required: true,
    help: 'Finns det en lucka där befintliga alternativ inte räcker till?'
  },
  {
    id: 'solution',
    label: 'Hur löser ni problemet? (Er lösning)',
    type: 'textarea',
    required: true,
    help: 'Förklara er produkt/tjänst och hur den adresserar problemet.'
  },
  {
    id: 'why_now',
    label: 'Varför är timingen rätt – tekniskt, marknadsmässigt eller reglerings-mässigt?',
    type: 'textarea',
    required: true,
    help: 'Motivera varför just nu är rätt tillfälle.'
  },
  {
    id: 'target_customer',
    label: 'Vem är er målgrupp och kund?',
    type: 'textarea',
    required: true,
    help: 'Beskriv er idealkund. Är ni B2B eller B2C? SMB eller enterprise?'
  },
  {
    id: 'market_size',
    label: 'Hur stort är marknadsutrymmet? (TAM/SAM/SOM)',
    type: 'textarea',
    required: true,
    help: 'Uppskatta er totala marknad: TAM, SAM, SOM.'
  },
  {
    id: 'market_trends',
    label: 'Vilka viktiga marknadstrender gynnar er?',
    type: 'textarea',
    required: false,
    help: 'Beskriv trender (teknologiska, demografiska, regulatoriska) som ni surfar på.'
  },
  {
    id: 'traction',
    label: 'Hur ser traction ut hittills?',
    type: 'textarea',
    required: true,
    help: 'Ange milstolpar och resultat: användare, kunder, piloter, intäkter, tillväxttal.'
  },
  {
    id: 'revenue_block',
    label: 'Hur tjänar ni pengar och hur fördelas intäkterna (återkommande/engång)?',
    type: 'textarea',
    required: true,
    help: 'Beskriv intäktsströmmar, prissättning och fördelning mellan återkommande och engångsintäkter.'
  },
  {
    id: 'runway',
    label: 'Hur lång runway (antal månader) har ni? (heltal)',
    type: 'number',
    required: true,
    help: 'Hur många månader räcker ert kapital? (Bifoga gärna P/L-rapport om möjligt)'
  },
  {
    id: 'growth_plan',
    label: 'Vad är er tillväxtplan för nästa 12-24 månader?',
    type: 'textarea',
    required: true,
    help: 'Beskriv framtidsplaner: försäljningstillväxt, produktlanseringar, kundmål.'
  },
  {
    id: 'milestones',
    label: 'Vilka tre största milstolpar planerar ni att nå kommande 12 månader (med månad/kvartal)?',
    type: 'milestone_list',
    required: true,
    help: 'Exempel: "Lansering Q3", "Första betalande kund i september", "ISO-certifiering Q2".'
  },
  {
    id: 'team',
    label: 'Hur ser ert team ut?',
    type: 'textarea',
    required: true,
    help: 'Presentera grundarna och kärnteamet, roller och erfarenheter.'
  },
  {
    id: 'founder_equity',
    label: 'Hur stor ägarandel (%) behåller grundarteamet efter denna runda?',
    type: 'number',
    required: true,
    help: 'Svara i procent, t.ex. 65.'
  },
  {
    id: 'founder_market_fit',
    label: 'Hur väl matchar teamets bakgrund det problem ni löser? (1–5-skala + fritext)',
    type: 'founder_market_fit',
    required: true,
    help: '1 = ingen erfarenhet, 5 = djup domänexpertis. Motivera kort.'
  },
  {
    id: 'team_skills',
    label: 'Vilka kompetenser täcker teamet – och saknas det någon?',
    type: 'textarea',
    required: false,
    help: 'Beskriv hur komplett teamet är och ev. kompetensluckor.'
  },
  {
    id: 'hiring_plan',
    label: 'Har ni en rekryteringsplan?',
    type: 'textarea',
    required: false,
    help: 'Beskriv er hiring plan för kommande året.'
  },
  {
    id: 'board_advisors',
    label: 'Har ni en styrelse eller rådgivare?',
    type: 'textarea',
    required: false,
    help: 'Ange om ni har en formell styrelse och vilka som sitter i den, eller tunga rådgivare.'
  },
  {
    id: 'competitors',
    label: 'Vilka är era konkurrenter?',
    type: 'textarea',
    required: true,
    help: 'Lista de viktigaste konkurrenterna och hur ni skiljer er.'
  },
  {
    id: 'unique_solution',
    label: 'Vad gör er lösning unik eller svår att kopiera?',
    type: 'textarea',
    required: true,
    help: 'Utveckla ert konkurrensförsprång: teknik, patent, nätverkseffekter, IP.'
  },
  {
    id: 'ip_rights',
    label: 'Äger ni immateriella rättigheter (IP)?',
    type: 'radio',
    options: ['Ja', 'Nej'],
    required: false,
    help: 'Patent, varumärkesskydd, upphovsrätt? Om Ja – specificera kort.'
  },
  {
    id: 'capital_block',
    label: 'Kapitalbehov och användning',
    type: 'capital_matrix',
    required: true,
    help: 'Ange belopp (MSEK), fördelning (% till produkt/försäljning/team/övrigt) och sannolikhet att ni behöver mer kapital (1–5).'
  },
  {
    id: 'exit_strategy',
    label: 'Vad är er exit-strategi för investerare?',
    type: 'textarea',
    required: false,
    help: 'Beskriv möjliga exitmöjligheter på sikt.'
  },
  {
    id: 'main_risks',
    label: 'Vilka är de största riskerna i er affär?',
    type: 'textarea',
    required: true,
    help: 'Identifiera de viktigaste riskfaktorerna och hur ni planerar att hantera dem.'
  },
  {
    id: 'esg',
    label: 'Hur adresserar ni hållbarhet och ESG?',
    type: 'esg_checkbox',
    required: false,
    help: 'Kryssa i vad som är relevant och beskriv kort.'
  },
  // Bonusfråga, endast för SaaS/Fintech
  {
    id: 'tax_incentives',
    label: 'Finns det några skattemässiga incitament eller stöd kopplade till investeringen?',
    type: 'textarea',
    required: false,
    help: 'T.ex. bidrag, stöd, skattelättnader. (Visas bara för SaaS/Fintech)'
  },
  // Sista öppna frågan
  {
    id: 'anything_else',
    label: 'Vill du dela med dig av någonting mer?',
    type: 'textarea',
    required: false,
    help: 'Något du vill förtydliga, komplettera eller lyfta fram?'
  }
];

// Funktion för att dynamiskt lägga till branschspecifika frågor
function getAllQuestions(selectedIndustry: string): Question[] {
  const industrySpecific: Question[] = [];
  // Här kan du lägga till logik för att hämta branschspecifika frågor baserat på selectedIndustry
  // Exempel:
  // if (selectedIndustry === 'SaaS') industrySpecific = [...];
  return [...INTRO_QUESTIONS, ...INVESTOR_QUESTIONS, ...industrySpecific];
}

// Add these constants back
const selectWrapper = "relative w-full";
const selectArrow = (
  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7edcff] text-lg">
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M6 8l4 4 4-4" stroke="#7edcff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  </span>
);
const radioOuter = "w-5 h-5 rounded-full border-2 border-[#7edcff] bg-white/10 shadow-inner flex items-center justify-center transition-all duration-200 group-focus:ring-2 group-focus:ring-[#7edcff] group-hover:border-[#7edcff]";
const radioInner = "w-3 h-3 rounded-full bg-[#7edcff] scale-0 group-checked:scale-100 transition-transform duration-200";

function getStringValue(val: any): string {
  return typeof val === 'string' ? val : '';
}

// Add helper components for custom question types above the main export
function MilestoneList({ value, onChange }: { value: { milestone: string; date: string }[]; onChange: (val: { milestone: string; date: string }[]) => void }) {
  const handleChange = (idx: number, field: 'milestone' | 'date', val: string) => {
    const updated = value.map((item, i) => i === idx ? { ...item, [field]: val } : item);
    onChange(updated);
  };
  const addMilestone = () => onChange([...value, { milestone: '', date: '' }]);
  const removeMilestone = (idx: number) => onChange(value.filter((_, i) => i !== idx));
  
  return (
    <div className="space-y-4">
      {value.map((item, idx) => (
        <div key={idx} className="bg-white/50 rounded-2xl p-4 border border-[#7edcff]/30">
          <div className="flex items-start gap-3">
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-sm font-medium text-[#16475b] mb-2">Milstolpe {idx + 1}</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-[#7edcff] bg-white/80 text-[#16475b] placeholder-gray-400 focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all"
                  placeholder="T.ex. 'Lansering', 'Första betalande kund', 'ISO-certifiering'"
                  value={item.milestone}
                  onChange={e => handleChange(idx, 'milestone', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#16475b] mb-2">Tidpunkt</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-[#7edcff] bg-white/80 text-[#16475b] placeholder-gray-400 focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all"
                  placeholder="T.ex. 'Q3 2024', 'September', 'H1 2025'"
                  value={item.date}
                  onChange={e => handleChange(idx, 'date', e.target.value)}
                />
              </div>
            </div>
            {value.length > 1 && (
              <button 
                type="button" 
                className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors mt-8" 
                onClick={() => removeMilestone(idx)} 
                aria-label="Ta bort milstolpe"
              >
                ×
              </button>
            )}
          </div>
        </div>
      ))}
      {value.length < 5 && (
        <button 
          type="button" 
          className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-[#7edcff] text-[#7edcff] font-medium hover:bg-[#7edcff]/10 transition-all flex items-center justify-center gap-2" 
          onClick={addMilestone}
        >
          <span className="text-xl">+</span>
          Lägg till milstolpe
        </button>
      )}
    </div>
  );
}

function CapitalMatrix({ value, onChange }: { value: { amount: string; product: string; sales: string; team: string; other: string; probability: string }; onChange: (val: any) => void }) {
  const handleField = (field: string, val: string) => onChange({ ...value, [field]: val });
  
  return (
    <div className="space-y-4">
      {/* Kapitalbehov */}
      <div className="bg-white/50 rounded-2xl p-4 border border-[#7edcff]/30">
        <label className="block font-semibold mb-3 text-[#16475b]">Totalt kapitalbehov</label>
        <div className="flex items-center gap-3">
          <input 
            type="number" 
            min="0" 
            step="0.5" 
            className="w-24 px-3 py-2 rounded-xl border border-[#7edcff] bg-white/80 text-[#16475b] text-center font-bold focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all" 
            value={value.amount} 
            onChange={e => handleField('amount', e.target.value)}
            placeholder="8" 
          />
          <span className="text-[#16475b] font-medium">MSEK</span>
        </div>
      </div>

      {/* Fördelning */}
      <div className="bg-white/50 rounded-2xl p-4 border border-[#7edcff]/30">
        <label className="block font-semibold mb-3 text-[#16475b]">Hur ska kapitalet användas? (%)</label>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#16475b]">Produktutveckling</label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                min="0" 
                max="100" 
                className="w-16 px-2 py-1 rounded-lg border border-[#7edcff] bg-white/80 text-[#16475b] text-center text-sm focus:ring-1 focus:ring-[#7edcff] transition-all" 
                value={value.product} 
                onChange={e => handleField('product', e.target.value)}
                placeholder="40" 
              />
              <span className="text-xs text-gray-500">%</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#16475b]">Försäljning & Marknad</label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                min="0" 
                max="100" 
                className="w-16 px-2 py-1 rounded-lg border border-[#7edcff] bg-white/80 text-[#16475b] text-center text-sm focus:ring-1 focus:ring-[#7edcff] transition-all" 
                value={value.sales} 
                onChange={e => handleField('sales', e.target.value)}
                placeholder="30" 
              />
              <span className="text-xs text-gray-500">%</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#16475b]">Personal & Rekrytering</label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                min="0" 
                max="100" 
                className="w-16 px-2 py-1 rounded-lg border border-[#7edcff] bg-white/80 text-[#16475b] text-center text-sm focus:ring-1 focus:ring-[#7edcff] transition-all" 
                value={value.team} 
                onChange={e => handleField('team', e.target.value)}
                placeholder="25" 
              />
              <span className="text-xs text-gray-500">%</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#16475b]">Övrigt</label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                min="0" 
                max="100" 
                className="w-16 px-2 py-1 rounded-lg border border-[#7edcff] bg-white/80 text-[#16475b] text-center text-sm focus:ring-1 focus:ring-[#7edcff] transition-all" 
                value={value.other} 
                onChange={e => handleField('other', e.target.value)}
                placeholder="5" 
              />
              <span className="text-xs text-gray-500">%</span>
            </div>
          </div>
        </div>
        
        {/* Total check */}
        {(() => {
          const total = (parseInt(value.product) || 0) + (parseInt(value.sales) || 0) + (parseInt(value.team) || 0) + (parseInt(value.other) || 0);
          return total > 0 ? (
            <div className={`mt-3 text-sm text-center font-medium ${total === 100 ? 'text-green-600' : 'text-orange-600'}`}>
              Totalt: {total}% {total !== 100 && '(bör vara 100%)'}
            </div>
          ) : null;
        })()}
      </div>

      {/* Sannolikhet för mer kapital */}
      <div className="bg-white/50 rounded-2xl p-4 border border-[#7edcff]/30">
        <label className="block font-semibold mb-3 text-[#16475b]">Sannolikhet att ni behöver mer kapital inom 18 månader</label>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Låg</span>
          <input 
            type="range" 
            min="1" 
            max="5" 
            value={value.probability || '3'} 
            onChange={e => handleField('probability', e.target.value)} 
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #7edcff 0%, #7edcff ${((parseInt(value.probability) || 3) - 1) * 25}%, #e5e7eb ${((parseInt(value.probability) || 3) - 1) * 25}%, #e5e7eb 100%)`
            }}
          />
          <span className="text-sm text-gray-600">Hög</span>
          <div className="w-8 h-8 rounded-full bg-[#7edcff] text-[#16475b] flex items-center justify-center font-bold text-sm">
            {value.probability || '3'}
          </div>
        </div>
      </div>
    </div>
  );
}

function ESGCheckbox({ value, onChange }: { value: { miljö: boolean; socialt: boolean; governance: boolean; text: string }; onChange: (val: any) => void }) {
  const handleBox = (field: 'miljö' | 'socialt' | 'governance') => onChange({ ...value, [field]: !value[field] });
  
  return (
    <div className="space-y-4">
      <div className="bg-white/50 rounded-2xl p-4 border border-[#7edcff]/30">
        <label className="block font-semibold mb-3 text-[#16475b]">Välj relevanta områden:</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { key: 'miljö', label: 'Miljö & Klimat', icon: '🌱' },
            { key: 'socialt', label: 'Socialt Ansvar', icon: '🤝' },
            { key: 'governance', label: 'Styrning & Etik', icon: '⚖️' }
          ].map(({ key, label, icon }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer group">
              <div className={`relative w-6 h-6 rounded-lg border-2 transition-all duration-200 ${
                value[key as keyof typeof value] 
                  ? 'bg-[#7edcff] border-[#7edcff]' 
                  : 'bg-white border-gray-300 group-hover:border-[#7edcff]'
              }`}>
                <input
                  type="checkbox"
                  checked={value[key as keyof typeof value] as boolean}
                  onChange={() => handleBox(key as 'miljö' | 'socialt' | 'governance')}
                  className="hidden"
                />
                {value[key as keyof typeof value] && (
                  <svg 
                    className="w-4 h-4 text-[#16475b] absolute top-0.5 left-0.5" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                )}
              </div>
              <span className="flex items-center gap-2 text-[#16475b] font-medium">
                <span>{icon}</span>
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="bg-white/50 rounded-2xl p-4 border border-[#7edcff]/30">
        <label className="block font-semibold mb-3 text-[#16475b]">Beskriv era ESG-initiativ:</label>
        <textarea 
          className="w-full min-h-[100px] rounded-xl border border-[#7edcff] bg-white/80 px-4 py-3 text-[#16475b] placeholder-gray-400 focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all resize-none" 
          value={value.text} 
          onChange={e => onChange({ ...value, text: e.target.value })} 
          placeholder="Beskriv konkreta åtgärder, mål eller initiativ inom valda områden..."
        />
      </div>
    </div>
  );
}

function FounderMarketFit({ value, onChange }: { value: { score: string; text: string }; onChange: (val: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="bg-white/50 rounded-2xl p-4 border border-[#7edcff]/30">
        <label className="block font-semibold mb-3 text-[#16475b]">Matchning (1–5):</label>
        <div className="flex gap-3 justify-center">
          {[1,2,3,4,5].map(n => (
            <label key={n} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className={`w-12 h-12 rounded-full border-2 border-[#7edcff] flex items-center justify-center font-bold text-lg transition-all duration-200 ${
                value.score === String(n) 
                  ? 'bg-[#7edcff] text-[#16475b] shadow-lg scale-110' 
                  : 'bg-white/80 text-[#7edcff] hover:bg-[#7edcff]/20 hover:scale-105'
              }`}>
                {n}
              </div>
              <input
                type="radio"
                name="founder_market_fit_score"
                value={n}
                checked={value.score === String(n)}
                onChange={() => onChange({ ...value, score: String(n) })}
                className="hidden"
              />
              <span className={`text-xs font-medium transition-colors ${
                value.score === String(n) ? 'text-[#16475b]' : 'text-gray-500'
              }`}>
                {n === 1 ? 'Ingen' : n === 3 ? 'Bra' : n === 5 ? 'Expert' : ''}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className="bg-white/50 rounded-2xl p-4 border border-[#7edcff]/30">
        <label className="block font-semibold mb-2 text-[#16475b]">Motivering:</label>
        <textarea 
          className="w-full min-h-[80px] rounded-xl border border-[#7edcff] bg-white/80 px-4 py-3 text-[#16475b] placeholder-gray-400 focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all resize-none" 
          value={value.text} 
          onChange={e => onChange({ ...value, text: e.target.value })} 
          placeholder="Beskriv kort teamets relevanta erfarenhet och expertis..."
        />
      </div>
    </div>
  );
}

function useOnClickOutside(ref: any, handler: () => void) {
  React.useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

export default function BusinessPlanWizard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [answers, setAnswers] = React.useState<{ [key: string]: string }>({});
  const [step, setStep] = React.useState(1);
  const [preStep, setPreStep] = React.useState(true);
  const [preStepPage, setPreStepPage] = React.useState(1);
  const [result, setResult] = React.useState<any>(null);
  // Pre-step state
  const [company, setCompany] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [bransch, setBransch] = React.useState('');
  const [omrade, setOmrade] = React.useState('');
  const [privacyChecked, setPrivacyChecked] = React.useState(false);
  const [hasWebsite, setHasWebsite] = React.useState<null | boolean>(null);
  const [websiteUrl, setWebsiteUrl] = React.useState('');
  const [isScraping, setIsScraping] = React.useState(false);
  const [scrapeError, setScrapeError] = React.useState<string | null>(null);
  const [scrapedData, setScrapedData] = React.useState<any>(null);
  const [showExample, setShowExample] = React.useState<string | null>(null);
  const [exampleText, setExampleText] = React.useState<string>('');
  const [isLoadingExample, setIsLoadingExample] = React.useState(false);
  const [exampleError, setExampleError] = React.useState<string | null>(null);
  const exampleRef = useRef<HTMLDivElement>(null);
  const [fileLoading, setFileLoading] = React.useState(false);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const [investorConsent, setInvestorConsent] = React.useState<null | boolean>(null);
  const [submissionSaved, setSubmissionSaved] = React.useState(false);
  const [submissionError, setSubmissionError] = React.useState<string | null>(null);
  const [showMarketPopup, setShowMarketPopup] = React.useState(false);
  const [marketLoading, setMarketLoading] = React.useState(false);
  const [marketResult, setMarketResult] = React.useState('');
  const [marketError, setMarketError] = React.useState<string | null>(null);
  const marketRef = useRef<HTMLDivElement>(null);
  const [marketBransch, setMarketBransch] = React.useState('');
  const [linkedinInput, setLinkedinInput] = React.useState('');
  const [linkedinLoading, setLinkedinLoading] = React.useState(false);
  const [linkedinResult, setLinkedinResult] = React.useState('');
  const [linkedinError, setLinkedinError] = React.useState<string | null>(null);
  const competitorRef = useRef<HTMLDivElement>(null);
  const [competitorBransch, setCompetitorBransch] = React.useState('');
  const [showCompetitorPopup, setShowCompetitorPopup] = React.useState(false);
  const [competitorLoading, setCompetitorLoading] = React.useState(false);
  const [competitorResult, setCompetitorResult] = React.useState('');
  const [competitorError, setCompetitorError] = React.useState<string | null>(null);
  const [showFinalLoader, setShowFinalLoader] = React.useState(false);
  const [finalLoaderText, setFinalLoaderText] = React.useState('Analyserar dina svar...');
  const finalLoaderMessages = [
    'Analyserar dina svar...',
    'Ger praktiska råd kring investeringstips...',
    'Sammanställer din investeringsprofil...'
  ];

  const current: Question = INVESTOR_QUESTIONS[step - 1];
  const progress = Math.round((step / INVESTOR_QUESTIONS.length) * 100);

  const isPreStep1Valid =
    company.trim().length > 1 &&
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) &&
    privacyChecked &&
    hasWebsite !== null &&
    (hasWebsite === false || (hasWebsite === true && websiteUrl.trim().length > 3));

  const isPreStep2Valid = bransch && omrade;

  // Funktioner för att mappa skrapad data till formulärfält
  const mapScrapedDataToAnswers = (scrapedData: any) => {
    const mappedAnswers: { [key: string]: string } = {};
    let detectedCompany = '';
    let detectedBransch = '';
    let detectedOmrade = '';
    
    if (scrapedData) {
      // Direkt mappning för fält som matchar exakt
      const directMappings = {
        'company_value': scrapedData.company_value,
        'customer_problem': scrapedData.customer_problem,
        'problem_evidence': scrapedData.problem_evidence,
        'market_gap': scrapedData.market_gap,
        'solution': scrapedData.solution,
        'why_now': scrapedData.why_now,
        'target_customer': scrapedData.target_customer,
        'market_size': scrapedData.market_size,
        'market_trends': scrapedData.market_trends,
        'traction': scrapedData.traction,
        'revenue_block': scrapedData.revenue_block,
        'growth_plan': scrapedData.growth_plan,
        'team': scrapedData.team,
        'team_skills': scrapedData.team_skills,
        'competitors': scrapedData.competitors,
        'unique_solution': scrapedData.unique_solution,
        'main_risks': scrapedData.main_risks
      };

      // Fyll i direkta mappningar
      Object.entries(directMappings).forEach(([key, value]) => {
        if (value && value !== 'Ej angivet' && value !== 'Information saknas') {
          mappedAnswers[key] = value;
        }
      });

      // Speciella mappningar
      if (scrapedData.ip_rights && scrapedData.ip_rights !== 'Ej angivet') {
        mappedAnswers['ip_rights'] = scrapedData.ip_rights.toLowerCase().includes('ja') || 
                                     scrapedData.ip_rights.toLowerCase().includes('patent') ? 'Ja' : 'Nej';
      }

      // ESG-mappning
      if (scrapedData.esg && scrapedData.esg !== 'Ej angivet') {
        const esgData = {
          miljö: scrapedData.esg.toLowerCase().includes('miljö') || 
                 scrapedData.esg.toLowerCase().includes('sustainability') ||
                 scrapedData.esg.toLowerCase().includes('hållbar'),
          socialt: scrapedData.esg.toLowerCase().includes('social') || 
                  scrapedData.esg.toLowerCase().includes('samhälle'),
          governance: scrapedData.esg.toLowerCase().includes('governance') || 
                     scrapedData.esg.toLowerCase().includes('styrning'),
          text: scrapedData.esg
        };
        mappedAnswers['esg'] = JSON.stringify(esgData);
      }

      // Founder market fit - sätt default värden baserat på team-info
      if (scrapedData.team && scrapedData.team !== 'Ej angivet') {
        const founderFit = {
          score: '3', // Default score
          text: scrapedData.team_skills || scrapedData.team || 'Teamet har relevant erfarenhet inom branschen.'
        };
        mappedAnswers['founder_market_fit'] = JSON.stringify(founderFit);
      }

      // Milstones - skapa från future_plans eller growth_plan
      if (scrapedData.future_plans || scrapedData.growth_plan) {
        const milestonesText = scrapedData.future_plans || scrapedData.growth_plan;
        
        // Försök att extrahera intelligenta milstones från texten
        const extractMilestones = (text: string) => {
          const milestones = [];
          const lowerText = text.toLowerCase();
          
          // Sök efter nyckelord som indikerar milestones
          const milestonePatterns = [
            { keywords: ['lansering', 'launch', 'släpp'], milestone: 'Produktlansering', date: 'Q2 2024' },
            { keywords: ['kund', 'customer', 'client'], milestone: 'Första betalande kund', date: 'Q1 2024' },
            { keywords: ['expansion', 'expandera', 'nya marknader'], milestone: 'Marknadsexpansion', date: 'Q3 2024' },
            { keywords: ['anställ', 'rekrytera', 'hiring'], milestone: 'Teamutbyggnad', date: 'Q2 2024' },
            { keywords: ['finansiering', 'funding', 'kapital'], milestone: 'Finansieringsrunda', date: 'Q1 2024' },
            { keywords: ['partner', 'samarbete', 'partnership'], milestone: 'Strategiska partnerskap', date: 'Q3 2024' },
            { keywords: ['certifiering', 'godkännande', 'approval'], milestone: 'Regulatoriskt godkännande', date: 'Q4 2024' },
            { keywords: ['break-even', 'vinst', 'profit'], milestone: 'Break-even', date: 'Q4 2024' },
            { keywords: ['internationell', 'global', 'export'], milestone: 'Internationell expansion', date: 'H2 2024' }
          ];
          
          milestonePatterns.forEach(pattern => {
            if (pattern.keywords.some(keyword => lowerText.includes(keyword))) {
              milestones.push({
                milestone: pattern.milestone,
                date: pattern.date
              });
            }
          });
          
          // Om inga specifika milstones hittades, använd generiska baserat på bransch
          if (milestones.length === 0) {
            if (scrapedData.industry?.toLowerCase().includes('tech') || scrapedData.industry?.toLowerCase().includes('saas')) {
              milestones.push(
                { milestone: 'Beta-lansering', date: 'Q2 2024' },
                { milestone: '100 aktiva användare', date: 'Q3 2024' },
                { milestone: 'Första MRR milestone', date: 'Q4 2024' }
              );
            } else if (scrapedData.industry?.toLowerCase().includes('konsument')) {
              milestones.push(
                { milestone: 'Produktlansering', date: 'Q2 2024' },
                { milestone: 'E-handelsplattform live', date: 'Q3 2024' },
                { milestone: '1000 sålda produkter', date: 'Q4 2024' }
              );
            } else {
              milestones.push(
                { milestone: 'Första pilotprojekt', date: 'Q2 2024' },
                { milestone: 'Marknadsvalidering', date: 'Q3 2024' },
                { milestone: 'Skalning av verksamhet', date: 'Q4 2024' }
              );
            }
          }
          
          // Begränsa till max 3 milstones
          return milestones.slice(0, 3);
        };
        
        const intelligentMilestones = extractMilestones(milestonesText);
        mappedAnswers['milestones'] = JSON.stringify(intelligentMilestones);
      }

      // Capital matrix - skapa från finansiell info
      if (scrapedData.financial_info || scrapedData.revenue_block || scrapedData.growth_plan) {
        let amount = '5'; // Default 5 MSEK
        let product = '40';
        let sales = '30';
        let team = '25';
        let other = '5';
        
        // Justera baserat på bransch
        if (scrapedData.industry) {
          const industry = scrapedData.industry.toLowerCase();
          if (industry.includes('saas') || industry.includes('tech')) {
            product = '50'; // Mer på produktutveckling för tech
            sales = '35';
            team = '15';
            amount = '8'; // Högre kapitalbehov för tech
          } else if (industry.includes('konsument') || industry.includes('handel')) {
            product = '25';
            sales = '45'; // Mer på marknadsföring för konsumentvaror
            team = '25';
            other = '5';
          } else if (industry.includes('fintech')) {
            product = '45';
            sales = '25';
            team = '20';
            other = '10'; // Mer för compliance/regulatoriska kostnader
            amount = '10';
          }
        }
        
        // Justera baserat på tillväxtplan
        if (scrapedData.growth_plan) {
          const growthText = scrapedData.growth_plan.toLowerCase();
          if (growthText.includes('expansion') || growthText.includes('international')) {
            amount = String(parseInt(amount) + 3); // Mer kapital för expansion
            sales = String(Math.min(parseInt(sales) + 10, 100));
          }
          if (growthText.includes('hiring') || growthText.includes('rekrytering')) {
            team = String(Math.min(parseInt(team) + 10, 100));
          }
        }
        
        // Justera baserat på traction
        if (scrapedData.traction) {
          const tractionText = scrapedData.traction.toLowerCase();
          if (tractionText.includes('revenue') || tractionText.includes('intäkt') || 
              tractionText.includes('customer') || tractionText.includes('kund')) {
            // Har redan traction, kan fokusera mer på tillväxt
            sales = String(Math.min(parseInt(sales) + 5, 100));
            product = String(Math.max(parseInt(product) - 5, 0));
          }
        }
        
        const capitalMatrix = {
          amount,
          product,
          sales,
          team,
          other,
          probability: scrapedData.main_risks ? '4' : '3' // Högre risk om de identifierat risker
        };
        mappedAnswers['capital_block'] = JSON.stringify(capitalMatrix);
      }

      // Spara företagsnamn från scraped data (returnera istället för att sätta direkt)
      if (scrapedData.company_name && scrapedData.company_name !== 'Ej angivet') {
        detectedCompany = scrapedData.company_name;
      }

      // Automatisk bransch- och områdesigenkänning
      if (scrapedData.industry && scrapedData.industry !== 'Ej angivet') {
        const industryMap: { [key: string]: string } = {
          'saas': 'SaaS',
          'tech': 'Tech', 
          'teknologi': 'Tech',
          'konsumentvaror': 'Konsumentvaror',
          'hälsa': 'Hälsa',
          'fintech': 'Fintech',
          'finansiell': 'Fintech',
          'industri': 'Industri',
          'tjänster': 'Tjänster',
          'utbildning': 'Utbildning',
          'energi': 'Energi'
        };
        
        const detectedIndustry = Object.entries(industryMap).find(([key]) => 
          scrapedData.industry.toLowerCase().includes(key)
        );
        
        if (detectedIndustry) {
          detectedBransch = detectedIndustry[1];
        }
      }

      if (scrapedData.area && scrapedData.area !== 'Ej angivet') {
        const areaMap: { [key: string]: string } = {
          'sverige': 'Sverige',
          'norden': 'Norden',
          'europa': 'Europa', 
          'global': 'Globalt',
          'internationell': 'Globalt'
        };
        
        const detectedArea = Object.entries(areaMap).find(([key]) => 
          scrapedData.area.toLowerCase().includes(key)
        );
        
        if (detectedArea) {
          detectedOmrade = detectedArea[1];
        }
      }
    }

    return {
      answers: mappedAnswers,
      detectedCompany,
      detectedBransch,
      detectedOmrade
    };
  };

  // Hantera AI-exempel-popup
  React.useEffect(() => {
    if (!showExample) return;
    setIsLoadingExample(true);
    setExampleError(null);
    setExampleText('');
    fetch('/api/ai-suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: showExample, websiteUrl })
    })
      .then(res => res.json())
      .then(data => {
        setExampleText(data.suggestion || 'Inget förslag kunde genereras.');
      })
      .catch(() => setExampleError('Kunde inte hämta AI-förslag.'))
      .finally(() => setIsLoadingExample(false));
  }, [showExample, websiteUrl]);

  useOnClickOutside(exampleRef, () => setShowExample(null));
  useOnClickOutside(marketRef, () => setShowMarketPopup(false));
  useOnClickOutside(competitorRef, () => setShowCompetitorPopup(false));

  if (!open) return null;
  
  // Lägg till CSS för animeringar
  if (typeof window !== 'undefined' && !document.getElementById('wizard-animations')) {
    const style = document.createElement('style');
    style.id = 'wizard-animations';
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes spin-reverse {
        from { transform: rotate(0deg); }
        to { transform: rotate(-360deg); }
      }
      .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      .animate-slideIn { animation: slideIn 0.4s ease-out; }
      .animate-spin-reverse { animation: spin-reverse 1s linear infinite; }
      .delay-150 { animation-delay: 150ms; }
      .delay-300 { animation-delay: 300ms; }
    `;
    document.head.appendChild(style);
  }

  // PreStepPage 1: Company, Email, Hemsida
  if (preStep && preStepPage === 1) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white text-[#16475b] rounded-3xl shadow-2xl border max-w-lg w-full p-8 relative">
          <h2 className="text-2xl font-bold mb-6 text-center">Starta din affärsplan-analys</h2>
          
          <div className="mb-4">
            <label className="block font-semibold mb-1">Företagsnamn</label>
            <input
              type="text"
              className="w-full p-4 border-2 border-[#7edcff] rounded-2xl mb-2 text-[#16475b] bg-white focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all text-lg"
              placeholder="Ange företagets namn"
              value={company}
              onChange={e => setCompany(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block font-semibold mb-1">E-post</label>
            <input
              type="email"
              className="w-full p-4 border-2 border-[#7edcff] rounded-2xl mb-2 text-[#16475b] bg-white focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all text-lg"
              placeholder="din@epost.se"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block font-semibold mb-2">Har ni en hemsida?</label>
            <div className="flex gap-4">
              <button
                type="button"
                className={`flex-1 p-3 rounded-xl font-medium transition-all ${
                  hasWebsite === true 
                    ? 'bg-[#16475b] text-white' 
                    : 'bg-gray-100 text-[#16475b] hover:bg-gray-200'
                }`}
                onClick={() => setHasWebsite(true)}
              >
                Ja
              </button>
              <button
                type="button"
                className={`flex-1 p-3 rounded-xl font-medium transition-all ${
                  hasWebsite === false 
                    ? 'bg-[#16475b] text-white' 
                    : 'bg-gray-100 text-[#16475b] hover:bg-gray-200'
                }`}
                onClick={() => setHasWebsite(false)}
              >
                Nej
              </button>
            </div>
          </div>
          
          {hasWebsite === true && (
            <div className="mb-4 animate-fadeIn">
              <label className="block font-semibold mb-1">Hemsida</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  className="flex-1 p-4 border-2 border-[#7edcff] rounded-2xl text-[#16475b] bg-white focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all"
                  placeholder="https://www.dittforetag.se"
                  value={websiteUrl}
                  onChange={e => setWebsiteUrl(e.target.value)}
                />
                <button
                  type="button"
                  className="bg-[#7edcff] text-[#16475b] font-bold rounded-2xl px-6 py-3 shadow hover:bg-[#16475b] hover:text-white transition-all disabled:opacity-50"
                  disabled={!websiteUrl || isScraping}
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
                      if (data.success) {
                        setScrapedData(data.data);
                        const mappedData = mapScrapedDataToAnswers(data.data);
                        setAnswers(mappedData.answers);
                        if (mappedData.detectedCompany) {
                          setCompany(mappedData.detectedCompany);
                        }
                        if (mappedData.detectedBransch) {
                          setBransch(mappedData.detectedBransch);
                        }
                        if (mappedData.detectedOmrade) {
                          setOmrade(mappedData.detectedOmrade);
                        }
                      } else {
                        setScrapeError(data.error || 'Kunde inte hämta data från hemsidan');
                      }
                    } catch (error) {
                      setScrapeError('Ett fel uppstod vid hämtning av data');
                    } finally {
                      setIsScraping(false);
                    }
                  }}
                >
                  {isScraping ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#16475b]"></div>
                      Analyserar...
                    </span>
                  ) : (
                    'Analysera hemsida'
                  )}
                </button>
              </div>
              {scrapeError && (
                <div className="mt-2 text-red-600 text-sm">{scrapeError}</div>
              )}
            </div>
          )}
          
          {/* Visa skrapningssammanfattning om tillgänglig */}
          {scrapedData && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-fadeIn">
              <h3 className="font-bold text-green-800 mb-2 flex items-center">
                <span className="mr-2">✅</span>
                Hemsida analyserad framgångsrikt!
              </h3>
              <div className="text-sm text-green-700 space-y-1">
                {scrapedData.company_name && (
                  <div><strong>Företag:</strong> {scrapedData.company_name}</div>
                )}
                {scrapedData.industry && (
                  <div><strong>Bransch:</strong> {scrapedData.industry}</div>
                )}
                {scrapedData.company_value && (
                  <div><strong>Värde:</strong> {scrapedData.company_value.slice(0, 100)}...</div>
                )}
                <div className="text-xs text-green-600 mt-2 font-semibold">
                  ✓ {Object.keys(mapScrapedDataToAnswers(scrapedData).answers).length} fält kommer att fyllas i automatiskt
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="mr-2 w-5 h-5 text-[#16475b] border-2 border-[#7edcff] rounded focus:ring-[#7edcff]"
                checked={privacyChecked}
                onChange={e => setPrivacyChecked(e.target.checked)}
              />
              <span className="text-sm text-[#16475b]">
                Jag godkänner att mina uppgifter behandlas enligt <a href="/privacy" className="text-[#7edcff] underline">integritetspolicyn</a>
              </span>
            </label>
          </div>
          
          <div className="flex justify-between">
            <button
              className="bg-gray-200 text-[#16475b] font-bold rounded-full px-8 py-3 shadow-lg"
              onClick={onClose}
            >Avbryt</button>
            <button
              className="bg-[#16475b] text-white font-bold rounded-full px-8 py-3 shadow-lg disabled:opacity-50"
              onClick={() => setPreStepPage(2)}
              disabled={!isPreStep1Valid}
            >Nästa</button>
          </div>
        </div>
      </div>
    );
  }

  // PreStepPage 2: Bransch och Område
  if (preStep && preStepPage === 2) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white text-[#16475b] rounded-3xl shadow-2xl border max-w-lg w-full p-8 relative">
          <h2 className="text-2xl font-bold mb-6 text-center">Företagsinformation</h2>
          
          <div className="mb-4">
            <label className="block font-semibold mb-1">Bransch</label>
            <div className="relative">
              <select
                className="w-full p-4 border-2 border-[#7edcff] rounded-2xl mb-2 text-[#16475b] bg-white pr-12 focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all text-lg appearance-none cursor-pointer hover:bg-[#eaf6fa]"
                value={bransch}
                onChange={e => setBransch(e.target.value)}
              >
                <option value="">Välj bransch...</option>
                {BRANSCHER.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7edcff] text-2xl">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M8 10l4 4 4-4" stroke="#7edcff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </div>
          </div>
          <div className="mb-6">
            <label className="block font-semibold mb-1">Område</label>
            <div className="relative">
              <select
                className="w-full p-4 border-2 border-[#7edcff] rounded-2xl mb-2 text-[#16475b] bg-white pr-12 focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all text-lg appearance-none cursor-pointer hover:bg-[#eaf6fa]"
                value={omrade}
                onChange={e => setOmrade(e.target.value)}
              >
                <option value="">Välj område...</option>
                {OMRADEN.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7edcff] text-2xl">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M8 10l4 4 4-4" stroke="#7edcff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <button
              className="bg-gray-200 text-[#16475b] font-bold rounded-full px-8 py-3 shadow-lg mt-6"
              onClick={() => setPreStepPage(1)}
            >Tillbaka</button>
            <button
              className="bg-[#16475b] text-white font-bold rounded-full px-8 py-3 shadow-lg mt-6 disabled:opacity-50"
              onClick={() => setPreStep(false)}
              disabled={!isPreStep2Valid}
            >Starta</button>
          </div>
        </div>
      </div>
    );
  }
  if (step > 0 && !current) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#f5f7fa] text-[#16475b] rounded-3xl shadow-2xl border border-[#16475b] max-w-xl w-full p-6 md:p-8 relative animate-fade-in flex flex-col justify-between max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#16475b] text-2xl font-bold hover:text-[#16475b] focus:outline-none focus:ring-2 focus:ring-[#7edcff] rounded-full p-1"
          aria-label="Stäng"
        >×</button>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#16475b] font-bold text-sm">Fråga {step} av {INVESTOR_QUESTIONS.length}</span>
            <div className="flex items-center gap-2">
              <span className="text-[#16475b] font-bold text-sm">{progress}%</span>
              <button
                onClick={onClose}
                className="text-[#16475b] text-2xl font-bold hover:text-[#16475b] focus:outline-none focus:ring-2 focus:ring-[#7edcff] rounded-full p-1 ml-2"
                aria-label="Stäng"
              >×</button>
            </div>
          </div>
          <div className="w-full h-2 bg-[#eaf6fa] rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-[#16475b] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
        <div id="wizard-description">
          <div className="flex items-center gap-2 mb-2 min-h-24 md:min-h-20">
            <h2 className="text-2xl font-bold">{current.label}</h2>
            {scrapedData && answers[current.id] && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
                <span className="mr-1">🤖</span>
                Ifyllt automatiskt
              </span>
            )}
            <button
              type="button"
              className="ml-2 text-[#7edcff] hover:text-[#16475b] text-xl focus:outline-none"
              aria-label="Visa exempel"
              onClick={() => setShowExample(current.id)}
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#7edcff" strokeWidth="2"/><text x="12" y="16" textAnchor="middle" fontSize="16" fill="#7edcff">?</text></svg>
            </button>
          </div>
          <div className="mb-4 text-sm text-gray-600 min-h-10">
            {current.help}
            {scrapedData && answers[current.id] && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-green-800 text-xs">
                  <strong>Automatiskt ifyllt från din hemsida:</strong> {scrapedData._metadata?.source_url}
                </div>
              </div>
            )}
            {scrapedData && !answers[current.id] && websiteUrl && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-blue-800 text-xs mb-2">
                  Detta fält kunde inte fyllas i automatiskt från hemsidan.
                </div>
                <button
                  type="button"
                  className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
                  onClick={async () => {
                    // Försök att hämta mer specifik information för detta fält
                    try {
                      const response = await fetch('/api/ai-suggest', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                          questionId: current.id, 
                          websiteUrl,
                          scrapedData: scrapedData,
                          questionText: current.label
                        })
                      });
                      const data = await response.json();
                      if (data.suggestion) {
                        setAnswers({ ...answers, [current.id]: data.suggestion });
                      }
                    } catch (error) {
                      console.error('Kunde inte hämta AI-förslag:', error);
                    }
                  }}
                >
                  AI-förslag för detta fält
                </button>
              </div>
            )}
          </div>
          {isTextQuestion(current) && current.type === "textarea" && (
            <div className="relative">
              <textarea
                className={`w-full p-3 border rounded-xl mb-4 text-[#16475b] bg-white min-h-32 ${
                  scrapedData && answers[current.id] ? 'border-green-300 bg-green-50' : ''
                }`}
                value={getStringValue(answers[current.id])}
                onChange={e => setAnswers({ ...answers, [current.id]: e.target.value })}
                placeholder={scrapedData && answers[current.id] ? "Automatiskt ifyllt från din hemsida - redigera efter behov" : "Skriv ditt svar här..."}
                rows={6}
                style={{ minHeight: '8rem', maxHeight: '8rem', resize: 'none' }}
              />
              {scrapedData && answers[current.id] && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-200 text-green-800">
                    🤖 Auto
                  </span>
                </div>
              )}
            </div>
          )}
          {isSelectQuestion(current) && current.type === "select" && (
            <div className="relative mb-4">
              <select
                className="w-full p-3 border rounded-xl pr-10 text-[#16475b] bg-white focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all min-h-32"
                value={getStringValue(answers[current.id])}
                onChange={e => setAnswers({ ...answers, [current.id]: e.target.value })}
                style={{ minHeight: '8rem', maxHeight: '8rem' }}
              >
                <option value="">Välj...</option>
                {isSelectQuestion(current) ? current.options.map((opt: string) => (
                  <option key={opt} value={opt}>{opt}</option>
                )) : null}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#16475b]">
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path d="M6 8l4 4 4-4" stroke="#16475b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          )}
          {isSelectQuestion(current) && current.type === "radio" && (
            <div className="flex flex-col gap-2 mb-4">
              {isSelectQuestion(current) ? current.options.map((opt: string) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={current.id}
                    value={opt}
                    checked={getStringValue(answers[current.id]) === opt}
                    onChange={() => setAnswers({ ...answers, [current.id]: opt })}
                    className="accent-[#16475b]"
                  />
                  <span>{opt}</span>
                </label>
              )) : null}
            </div>
          )}
          {(isTextQuestion(current) && (current.type === "text" || current.type === "number")) && (
            <input
              className="w-full p-3 border rounded-xl mb-4 text-[#16475b] bg-white min-h-32"
              type={current.type}
              value={getStringValue(answers[current.id])}
              onChange={e => setAnswers({ ...answers, [current.id]: e.target.value })}
              placeholder="Skriv ditt svar här..."
              style={{ minHeight: '8rem', maxHeight: '8rem' }}
            />
          )}
          {isTextQuestion(current) && current.type === "file" && (
            <div className="flex flex-col items-start gap-2 mb-4">
              <label className="block font-semibold">Bifoga P/L-rapport (valfritt)</label>
              <div className="flex items-center gap-3">
                <label className="bg-[#7edcff] text-[#16475b] font-bold rounded-full px-6 py-2 shadow hover:bg-[#16475b] hover:text-white transition-all cursor-pointer flex items-center gap-2">
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 3v10m0 0l-3-3m3 3l3-3" stroke="#16475b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Ladda upp PDF
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={async e => {
                      setFileError(null);
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setFileLoading(true);
                      try {
                        const formData = new FormData();
                        formData.append('file', file);
                        const res = await fetch('/api/parse-pdf', { method: 'POST', body: formData });
                        if (!res.ok) throw new Error('Kunde inte läsa PDF');
                        const data = await res.json();
                        setAnswers(a => ({ ...a, runway: (a.runway ? a.runway + '\n' : '') + (data.text || '') }));
                      } catch (err) {
                        setFileError('Kunde inte läsa PDF-filen.');
                      } finally {
                        setFileLoading(false);
                      }
                    }}
                  />
                </label>
                {fileLoading && <span className="text-[#7edcff] ml-2">Läser in PDF...</span>}
              </div>
              {fileError && <div className="text-red-600 mt-1">{fileError}</div>}
            </div>
          )}
          {current.id === 'team' && (
            <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-600">💡</span>
                <span className="font-semibold text-blue-800">Tips för teamfrågan:</span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Inkludera namn, roller och relevant erfarenhet</li>
                <li>• Nämn tidigare företag och utbildning</li>
                <li>• Beskriv varje persons nyckelkompetenser</li>
                <li>• Förklara hur teamet kompletterar varandra</li>
              </ul>
            </div>
          )}
          {current.id === 'competitors' && (
            <div className="mb-4 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-600">🎯</span>
                <span className="font-semibold text-green-800">Tips för konkurrentanalys:</span>
              </div>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Lista både direkta och indirekta konkurrenter</li>
                <li>• Förklara hur ni skiljer er från varje konkurrent</li>
                <li>• Inkludera både svenska och internationella aktörer</li>
                <li>• Nämn er unika konkurrensfördel</li>
              </ul>
            </div>
          )}
          {current.id === 'market_size' && (
            <div className="flex flex-col md:flex-row items-end gap-2 mb-2">
              <input
                type="text"
                className="w-full md:w-64 p-2 border rounded-xl text-[#16475b] bg-white"
                placeholder="Ange bransch..."
                value={marketBransch}
                onChange={e => setMarketBransch(e.target.value)}
              />
              <button
                className="bg-[#7edcff] text-[#16475b] font-bold rounded-full px-6 py-2 shadow hover:bg-[#16475b] hover:text-white transition-all"
                onClick={async () => {
                  setShowMarketPopup(true);
                  setMarketLoading(true);
                  setMarketResult('');
                  setMarketError(null);
                  try {
                    const res = await fetch('/api/market-size', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ bransch: marketBransch })
                    });
                    const data = await res.json();
                    if (data.result) setMarketResult(data.result);
                    else setMarketError('Kunde inte hämta marknadsdata.');
                  } catch {
                    setMarketError('Kunde inte hämta marknadsdata.');
                  } finally {
                    setMarketLoading(false);
                  }
                }}
              >Beräkna värde</button>
            </div>
          )}
          {current.id === 'runway' && (
            <div className="flex flex-col items-start gap-2 mb-4">
              <label className="block font-semibold">Bifoga P/L-rapport (valfritt)</label>
              <div className="flex items-center gap-3">
                <label className="bg-[#7edcff] text-[#16475b] font-bold rounded-full px-6 py-2 shadow hover:bg-[#16475b] hover:text-white transition-all cursor-pointer flex items-center gap-2">
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 3v10m0 0l-3-3m3 3l3-3" stroke="#16475b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Ladda upp PDF
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={async e => {
                      setFileError(null);
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setFileLoading(true);
                      try {
                        const formData = new FormData();
                        formData.append('file', file);
                        const res = await fetch('/api/parse-pdf', { method: 'POST', body: formData });
                        if (!res.ok) throw new Error('Kunde inte läsa PDF');
                        const data = await res.json();
                        setAnswers(a => ({ ...a, runway: (a.runway ? a.runway + '\n' : '') + (data.text || '') }));
                      } catch (err) {
                        setFileError('Kunde inte läsa PDF-filen.');
                      } finally {
                        setFileLoading(false);
                      }
                    }}
                  />
                </label>
                {fileLoading && <span className="text-[#7edcff] ml-2">Läser in PDF...</span>}
              </div>
              {fileError && <div className="text-red-600 mt-1">{fileError}</div>}
            </div>
          )}
          {isMilestoneQuestion(current) && (
            <MilestoneList 
              value={JSON.parse(answers[current.id] || '[]')}
              onChange={(val) => setAnswers({ ...answers, [current.id]: JSON.stringify(val) })}
            />
          )}
          {isCapitalQuestion(current) && (
            <CapitalMatrix 
              value={JSON.parse(answers[current.id] || '{"amount":"","product":"","sales":"","team":"","other":"","probability":"3"}')}
              onChange={(val) => setAnswers({ ...answers, [current.id]: JSON.stringify(val) })}
            />
          )}
          {isESGQuestion(current) && (
            <ESGCheckbox 
              value={JSON.parse(answers[current.id] || '{"miljö":false,"socialt":false,"governance":false,"text":""}')}
              onChange={(val) => setAnswers({ ...answers, [current.id]: JSON.stringify(val) })}
            />
          )}
          {isFounderMarketFitQuestion(current) && (
            <FounderMarketFit 
              value={JSON.parse(answers[current.id] || '{"score":"","text":""}')}
              onChange={(val) => setAnswers({ ...answers, [current.id]: JSON.stringify(val) })}
            />
          )}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(s => Math.max(s - 1, 1))}
              disabled={step === 1}
              className="px-4 py-2 rounded bg-gray-200 text-[#16475b] disabled:opacity-50"
            >Tillbaka</button>
            <button
              onClick={() => {
                if (current.required && !getStringValue(answers[current.id])) {
                  alert('Fältet är obligatoriskt');
                  return;
                }
                
                if (step === INVESTOR_QUESTIONS.length) {
                  // Sista frågan - visa resultat
                  setShowFinalLoader(true);
                  let loaderIndex = 0;
                  const loaderInterval = setInterval(() => {
                    loaderIndex++;
                    if (loaderIndex < finalLoaderMessages.length) {
                      setFinalLoaderText(finalLoaderMessages[loaderIndex]);
                    } else {
                      clearInterval(loaderInterval);
                      // Simulera ett score baserat på svaren
                      const score = Math.floor(Math.random() * 30) + 70; // 70-100
                      setResult({ 
                        score, 
                        subscriptionLevel: score >= 80 ? 'gold' : 'silver',
                        answers
                      });
                      setShowFinalLoader(false);
                    }
                  }, 2000);
                } else {
                  setStep(s => Math.min(s + 1, INVESTOR_QUESTIONS.length));
                }
              }}
              className="px-4 py-2 rounded bg-[#16475b] text-white"
            >{step === INVESTOR_QUESTIONS.length ? 'Slutför' : 'Nästa'}</button>
          </div>
        </div>
        {showExample === current.id && (
          <div ref={exampleRef} className="absolute left-0 right-0 mx-auto top-20 z-50 max-w-md w-full bg-white border border-[#7edcff] rounded-2xl shadow-xl p-6 animate-fade-in">
            <button className="absolute top-2 right-3 text-2xl text-[#7edcff] hover:text-[#16475b]" onClick={() => setShowExample(null)} aria-label="Stäng">×</button>
            <div className="font-bold mb-2 text-[#16475b]">AI-förslag</div>
            {isLoadingExample ? (
              <div className="flex items-center gap-2"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#7edcff]"></div> Hämtar förslag...</div>
            ) : exampleError ? (
              <div className="text-red-600">{exampleError}</div>
            ) : (
              <div className="text-[#16475b] whitespace-pre-line">{exampleText}</div>
            )}
          </div>
        )}
        {showMarketPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div ref={marketRef} className="bg-white text-[#16475b] rounded-3xl shadow-2xl border max-w-lg w-full p-8 relative animate-fade-in text-center">
              <button className="absolute top-2 right-3 text-2xl text-[#7edcff] hover:text-[#16475b]" onClick={() => setShowMarketPopup(false)} aria-label="Stäng">×</button>
              <h2 className="text-xl font-bold mb-4">AI-baserad marknadsuppskattning</h2>
              {marketLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7edcff]"></div>
                  <span className="text-[#16475b]">Hämtar marknadsdata...</span>
                </div>
              ) : marketError ? (
                <div className="text-red-600">{marketError}</div>
              ) : marketResult ? (
                <div>
                  <div className="whitespace-pre-line text-left bg-[#eaf6fa] rounded-xl p-4 mb-4">{marketResult}</div>
                  <button
                    className="bg-[#16475b] text-white font-bold rounded-full px-6 py-2 shadow hover:bg-[#7edcff] hover:text-[#16475b] transition-all"
                    onClick={() => {
                      setAnswers(a => ({ ...a, market_size: marketResult }));
                      setShowMarketPopup(false);
                    }}
                  >Fyll i svaret</button>
                </div>
              ) : null}
            </div>
          </div>
        )}
        {showFinalLoader && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white text-[#16475b] rounded-3xl shadow-2xl border max-w-lg w-full p-8 relative text-center flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#7edcff] mb-6"></div>
              <h2 className="text-2xl font-bold mb-4">{finalLoaderText}</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 