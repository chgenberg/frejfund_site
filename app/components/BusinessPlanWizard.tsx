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
    <div className="space-y-2">
      {value.map((item, idx) => (
        <div key={idx} className="flex gap-2 items-center">
          <input
            type="text"
            className="flex-1 px-3 py-2 rounded-lg border border-[#16475b] bg-white/80 text-[#16475b]"
            placeholder="Milstolpe (t.ex. 'Lansering')"
            value={item.milestone}
            onChange={e => handleChange(idx, 'milestone', e.target.value)}
          />
          <input
            type="text"
            className="w-32 px-3 py-2 rounded-lg border border-[#16475b] bg-white/80 text-[#16475b]"
            placeholder="Månad/Kvartal"
            value={item.date}
            onChange={e => handleChange(idx, 'date', e.target.value)}
          />
          {value.length > 1 && (
            <button type="button" className="text-red-500 text-xl px-2" onClick={() => removeMilestone(idx)} aria-label="Ta bort milstolpe">×</button>
          )}
        </div>
      ))}
      {value.length < 5 && (
        <button type="button" className="mt-2 px-4 py-1 rounded-full bg-[#7edcff] text-[#16475b] font-bold" onClick={addMilestone}>+ Lägg till milstolpe</button>
      )}
    </div>
  );
}

function CapitalMatrix({ value, onChange }: { value: { amount: string; product: string; sales: string; team: string; other: string; probability: string }; onChange: (val: any) => void }) {
  const handleField = (field: string, val: string) => onChange({ ...value, [field]: val });
  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <label className="w-32">Belopp (MSEK)</label>
        <input type="number" min="0" step="0.1" className="flex-1 px-3 py-2 rounded-lg border border-[#16475b] bg-white/80 text-[#16475b]" value={value.amount} onChange={e => handleField('amount', e.target.value)} />
      </div>
      <div className="flex gap-2 items-center">
        <label className="w-32">Produkt (%)</label>
        <input type="number" min="0" max="100" className="w-20 px-3 py-2 rounded-lg border border-[#16475b] bg-white/80 text-[#16475b]" value={value.product} onChange={e => handleField('product', e.target.value)} />
        <label className="w-20">Försäljning (%)</label>
        <input type="number" min="0" max="100" className="w-20 px-3 py-2 rounded-lg border border-[#16475b] bg-white/80 text-[#16475b]" value={value.sales} onChange={e => handleField('sales', e.target.value)} />
        <label className="w-20">Team (%)</label>
        <input type="number" min="0" max="100" className="w-20 px-3 py-2 rounded-lg border border-[#16475b] bg-white/80 text-[#16475b]" value={value.team} onChange={e => handleField('team', e.target.value)} />
        <label className="w-20">Övrigt (%)</label>
        <input type="number" min="0" max="100" className="w-20 px-3 py-2 rounded-lg border border-[#16475b] bg-white/80 text-[#16475b]" value={value.other} onChange={e => handleField('other', e.target.value)} />
      </div>
      <div className="flex gap-2 items-center">
        <label className="w-48">Sannolikhet att mer kapital behövs (1–5)</label>
        <input type="range" min="1" max="5" value={value.probability || '3'} onChange={e => handleField('probability', e.target.value)} className="flex-1" />
        <span className="ml-2 font-bold">{value.probability || '3'}</span>
      </div>
    </div>
  );
}

function ESGCheckbox({ value, onChange }: { value: { miljö: boolean; socialt: boolean; governance: boolean; text: string }; onChange: (val: any) => void }) {
  const handleBox = (field: 'miljö' | 'socialt' | 'governance') => onChange({ ...value, [field]: !value[field] });
  return (
    <div className="space-y-2">
      <div className="flex gap-4 mb-2">
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={value.miljö} onChange={() => handleBox('miljö')} /> Miljö</label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={value.socialt} onChange={() => handleBox('socialt')} /> Socialt</label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={value.governance} onChange={() => handleBox('governance')} /> Governance</label>
      </div>
      <textarea className="w-full min-h-[40px] rounded-lg border border-[#16475b] bg-white/80 px-4 py-2 text-[#16475b]" value={value.text} onChange={e => onChange({ ...value, text: e.target.value })} placeholder="Beskriv kort..." />
    </div>
  );
}

function FounderMarketFit({ value, onChange }: { value: { score: string; text: string }; onChange: (val: any) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <label className="w-48">Matchning (1–5):</label>
        {[1,2,3,4,5].map(n => (
          <label key={n} className="flex items-center gap-1 cursor-pointer">
            <input type="radio" name="founder_market_fit_score" value={n} checked={value.score === String(n)} onChange={() => onChange({ ...value, score: String(n) })} />
            <span>{n}</span>
          </label>
        ))}
      </div>
      <textarea className="w-full min-h-[40px] rounded-lg border border-[#16475b] bg-white/80 px-4 py-2 text-[#16475b]" value={value.text} onChange={e => onChange({ ...value, text: e.target.value })} placeholder="Motivera kort..." />
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
  if (result) {
    // Automatiskt spara submission när resultat finns (görs en gång)
    if (!submissionSaved) {
      fetch('/api/save-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          company,
          email,
          bransch,
          omrade,
          score: result.score,
          timestamp: new Date().toISOString()
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSubmissionSaved(true);
          } else {
            setSubmissionError('Kunde inte spara din information.');
          }
        })
        .catch(() => setSubmissionError('Kunde inte spara din information.'));
      
      // Visa loading medan vi sparar
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white text-[#16475b] rounded-3xl shadow-2xl border max-w-lg w-full p-8 relative text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#7edcff] mb-6 mx-auto"></div>
            <h2 className="text-2xl font-bold mb-6">Sparar din information...</h2>
          </div>
        </div>
      );
    }

    // Om sparning misslyckades
    if (submissionError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white text-[#16475b] rounded-3xl shadow-2xl border max-w-lg w-full p-8 relative text-center">
            <h2 className="text-2xl font-bold mb-6">Ett fel uppstod</h2>
            <p className="mb-6">{submissionError}</p>
            <button 
              className="bg-[#16475b] text-white font-bold rounded-full px-8 py-3 shadow-lg"
              onClick={onClose}
            >
              Stäng
            </button>
          </div>
        </div>
      );
    }

    // Om score > 80 och samtycke ej givet, visa investerarfråga
    if (result.score > 80 && investorConsent === null && submissionSaved) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white text-[#16475b] rounded-3xl shadow-2xl border max-w-lg w-full p-8 relative text-center">
            <h2 className="text-2xl font-bold mb-6">Grattis till en hög poäng!</h2>
            <p className="mb-6">Vi är i kontakt med några av de största investeringsbolagen i Sverige.<br />
              Om du får en score på över 80/100, vill du då att vi förmedlar din information vidare?</p>
            <div className="flex justify-center gap-6 mb-6">
              <button 
                className="bg-[#16475b] text-white font-bold rounded-full px-8 py-3 shadow-lg" 
                onClick={() => {
                  setInvestorConsent(true);
                  // Uppdatera sparad data med investorConsent
                  fetch('/api/save-submission', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      answers,
                      company,
                      email,
                      bransch,
                      omrade,
                      score: result.score,
                      investorConsent: true,
                      timestamp: new Date().toISOString()
                    })
                  });
                }}
              >
                Ja, förmedla gärna min information
              </button>
              <button 
                className="bg-gray-200 text-[#16475b] font-bold rounded-full px-8 py-3 shadow-lg" 
                onClick={() => setInvestorConsent(false)}
              >
                Nej, tack
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // Visa vanliga resultatet när allt är sparat
    if (submissionSaved) {
      return (
        <BusinessPlanResult
          score={result.score}
          answers={answers}
          subscriptionLevel={result.subscriptionLevel || 'silver'}
        />
      );
    }
  }
  if (preStep) {
    if (preStepPage === 1) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white text-[#16475b] rounded-3xl shadow-2xl border max-w-lg w-full p-8 relative">
            <h2 className="text-2xl font-bold mb-6 text-center">Starta din affärsplan-analys</h2>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Företagsnamn</label>
              <input
                type="text"
                className="w-full p-3 border rounded-xl mb-2 text-[#16475b] bg-white"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="Ex: FrejFund AB"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">E-post</label>
              <input
                type="email"
                className="w-full p-3 border rounded-xl mb-2 text-[#16475b] bg-white"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="din@email.se"
              />
            </div>
            <div className="mb-4 flex items-center gap-2">
              <input
                id="privacy"
                type="checkbox"
                checked={privacyChecked}
                onChange={e => setPrivacyChecked(e.target.checked)}
              />
              <label htmlFor="privacy" className="text-sm">Jag godkänner <a href="/privacy" target="_blank" className="underline">privacy policy</a></label>
            </div>
            <div className="mb-6">
              <label className="block font-semibold mb-2">Har du en hemsida?</label>
              <div className="flex gap-4 mb-2">
                <button
                  className={`px-6 py-2 rounded-full font-bold ${hasWebsite === true ? 'bg-[#16475b] text-white' : 'bg-gray-200 text-[#16475b]'}`}
                  onClick={() => setHasWebsite(true)}
                  type="button"
                >JA</button>
                <button
                  className={`px-6 py-2 rounded-full font-bold ${hasWebsite === false ? 'bg-[#16475b] text-white' : 'bg-gray-200 text-[#16475b]'}`}
                  onClick={() => setHasWebsite(false)}
                  type="button"
                >NEJ</button>
              </div>
              {hasWebsite && (
                <div className="mt-2">
                  <input
                    type="url"
                    className="w-full p-3 border rounded-xl mb-2 text-[#16475b] bg-white"
                    value={websiteUrl}
                    onChange={e => setWebsiteUrl(e.target.value)}
                    placeholder="www.dittforetag.se"
                  />
                  <button
                    className="w-full bg-[#16475b] text-white font-bold rounded-full px-8 py-3 shadow-lg mt-2 disabled:opacity-50"
                    onClick={async () => {
                      setIsScraping(true);
                      setScrapeError(null);
                      try {
                        await new Promise(res => setTimeout(res, 1500));
                        setPreStepPage(2);
                      } catch (e) {
                        setScrapeError('Kunde inte hämta information från hemsidan.');
                      } finally {
                        setIsScraping(false);
                      }
                    }}
                    disabled={!websiteUrl || isScraping}
                  >
                    {isScraping ? 'Analyserar hemsidan...' : 'Skrapa hemsida & fortsätt'}
                  </button>
                  {scrapeError && <div className="text-red-600 text-sm mt-2 text-center">{scrapeError}</div>}
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button
                className="bg-[#16475b] text-white font-bold rounded-full px-8 py-3 shadow-lg mt-6 disabled:opacity-50"
                onClick={() => setPreStepPage(2)}
                disabled={!isPreStep1Valid}
              >Nästa</button>
            </div>
          </div>
        </div>
      );
    }
    // PreStepPage 2: Bransch & Område
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white text-[#16475b] rounded-3xl shadow-2xl border max-w-lg w-full p-8 relative">
          <h2 className="text-2xl font-bold mb-6 text-center">Starta din affärsplan-analys</h2>
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
          </div>
          {isTextQuestion(current) && current.type === "textarea" && (
            <textarea
              className="w-full p-3 border rounded-xl mb-4 text-[#16475b] bg-white min-h-32"
              value={getStringValue(answers[current.id])}
              onChange={e => setAnswers({ ...answers, [current.id]: e.target.value })}
              placeholder="Skriv ditt svar här..."
              rows={6}
              style={{ minHeight: '8rem', maxHeight: '8rem', resize: 'none' }}
            />
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
            <div className="flex flex-col gap-2 mb-4">
              <label className="block font-semibold">LinkedIn-profiler (en per rad)</label>
              <textarea
                className="w-full p-2 border rounded-xl text-[#16475b] bg-white"
                rows={2}
                placeholder="https://linkedin.com/in/namn..."
                value={linkedinInput}
                onChange={e => { setLinkedinInput(e.target.value); setLinkedinError(null); }}
              />
              <button
                className="bg-[#7edcff] text-[#16475b] font-bold rounded-full px-6 py-2 shadow hover:bg-[#16475b] hover:text-white transition-all w-fit"
                onClick={async () => {
                  setLinkedinLoading(true);
                  setLinkedinResult('');
                  setLinkedinError(null);
                  try {
                    const res = await fetch('/api/scrape-linkedin', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ profiles: linkedinInput.split('\n').filter(Boolean) })
                    });
                    const data = await res.json();
                    if (data.result) {
                      setLinkedinResult(data.result);
                      setAnswers(a => ({ ...a, team: (a.team ? a.team + '\n' : '') + data.result }));
                    } else setLinkedinError('Kunde inte hämta info.');
                  } catch {
                    setLinkedinError('Kunde inte hämta info.');
                  } finally {
                    setLinkedinLoading(false);
                  }
                }}
              >Skrapa LinkedIn-profiler</button>
              {linkedinLoading && <span className="text-[#7edcff]">Hämtar info...</span>}
              {linkedinError && <span className="text-red-600">{linkedinError}</span>}
              {linkedinResult && <div className="bg-[#eaf6fa] rounded-xl p-2 mt-2 text-left whitespace-pre-line">{linkedinResult}</div>}
            </div>
          )}
          {current.id === 'competitors' && (
            <div className="flex flex-col md:flex-row items-end gap-2 mb-2">
              <input
                type="text"
                className="w-full md:w-64 p-2 border rounded-xl text-[#16475b] bg-white"
                placeholder="Ange bransch..."
                value={competitorBransch}
                onChange={e => setCompetitorBransch(e.target.value)}
              />
              <button
                className="bg-[#7edcff] text-[#16475b] font-bold rounded-full px-6 py-2 shadow hover:bg-[#16475b] hover:text-white transition-all"
                onClick={async () => {
                  setShowCompetitorPopup(true);
                  setCompetitorLoading(true);
                  setCompetitorResult('');
                  setCompetitorError(null);
                  try {
                    const res = await fetch('/api/competitor-suggest', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ bransch: competitorBransch })
                    });
                    const data = await res.json();
                    if (data.result) setCompetitorResult(data.result);
                    else setCompetitorError('Kunde inte hämta förslag.');
                  } catch {
                    setCompetitorError('Kunde inte hämta förslag.');
                  } finally {
                    setCompetitorLoading(false);
                  }
                }}
              >Få förslag</button>
            </div>
          )}
          {showCompetitorPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div ref={competitorRef} className="bg-white text-[#16475b] rounded-3xl shadow-2xl border max-w-lg w-full p-8 relative animate-fade-in text-center">
                <button className="absolute top-2 right-3 text-2xl text-[#7edcff] hover:text-[#16475b]" onClick={() => setShowCompetitorPopup(false)} aria-label="Stäng">×</button>
                <h2 className="text-xl font-bold mb-4">AI-förslag på konkurrenter</h2>
                {competitorLoading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7edcff]"></div>
                    <span className="text-[#16475b]">Hämtar konkurrenter...</span>
                  </div>
                ) : competitorError ? (
                  <div className="text-red-600">{competitorError}</div>
                ) : competitorResult ? (
                  <div>
                    <div className="whitespace-pre-line text-left bg-[#eaf6fa] rounded-xl p-4 mb-4">{competitorResult}</div>
                    <button
                      className="bg-[#16475b] text-white font-bold rounded-full px-6 py-2 shadow hover:bg-[#7edcff] hover:text-[#16475b] transition-all"
                      onClick={() => {
                        setAnswers(a => ({ ...a, competitors: competitorResult }));
                        setShowCompetitorPopup(false);
                      }}
                    >Fyll i svaret</button>
                  </div>
                ) : null}
              </div>
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