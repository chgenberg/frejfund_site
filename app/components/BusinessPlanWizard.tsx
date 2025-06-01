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

// Update these style constants for dark theme
const focusRing = "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#04111d]";
const mobileInput = "text-base md:text-sm";
const touchTarget = "min-h-[44px]";
const transitionBase = "transition-all duration-200 ease-in-out";

// Update the input base styles for dark theme
const inputBase = `w-full px-4 py-3 rounded-2xl bg-white/10 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] border border-white/20 text-white placeholder-white/40 transition-all duration-200 backdrop-blur-md ${mobileInput} ${touchTarget} ${focusRing} hover:bg-white/15 hover:border-white/30`;

// Update the select base styles
const selectBase = `${inputBase} appearance-none pr-10 cursor-pointer`;

// Add new feedback styles
const successState = "border-green-500 bg-green-500/10";
const errorState = "border-red-500 bg-red-500/10";
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
        <div key={idx} className="bg-white/5 rounded-2xl p-4 border border-white/20 hover:border-white/30 transition-all">
          <div className="flex items-start gap-3">
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Milstolpe {idx + 1}</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:bg-white/15"
                  placeholder="T.ex. 'Lansering', 'Första betalande kund', 'ISO-certifiering'"
                  value={item.milestone}
                  onChange={e => handleChange(idx, 'milestone', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Tidpunkt</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:bg-white/15"
                  placeholder="T.ex. 'Q3 2024', 'September', 'H1 2025'"
                  value={item.date}
                  onChange={e => handleChange(idx, 'date', e.target.value)}
                />
              </div>
            </div>
            {value.length > 1 && (
              <button 
                type="button" 
                className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30 transition-colors mt-8" 
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
          className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-purple-500/50 text-purple-400 font-medium hover:bg-purple-500/10 hover:border-purple-500 transition-all flex items-center justify-center gap-2" 
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
      <div className="bg-white/5 rounded-2xl p-4 border border-white/20">
        <label className="block font-semibold mb-3 text-white">Totalt kapitalbehov</label>
        <div className="flex items-center gap-3">
          <input 
            type="number" 
            min="0" 
            step="0.5" 
            className="w-24 px-3 py-2 rounded-xl border border-white/20 bg-white/10 text-white text-center font-bold focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:bg-white/15" 
            value={value.amount} 
            onChange={e => handleField('amount', e.target.value)}
            placeholder="8" 
          />
          <span className="text-white/80 font-medium">MSEK</span>
        </div>
      </div>

      {/* Fördelning */}
      <div className="bg-white/5 rounded-2xl p-4 border border-white/20">
        <label className="block font-semibold mb-3 text-white">Hur ska kapitalet användas? (%)</label>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80">Produktutveckling</label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                min="0" 
                max="100" 
                className="w-16 px-2 py-1 rounded-lg border border-white/20 bg-white/10 text-white text-center text-sm focus:ring-1 focus:ring-purple-500 transition-all hover:bg-white/15" 
                value={value.product} 
                onChange={e => handleField('product', e.target.value)}
                placeholder="40" 
              />
              <span className="text-xs text-white/60">%</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80">Försäljning & Marknad</label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                min="0" 
                max="100" 
                className="w-16 px-2 py-1 rounded-lg border border-white/20 bg-white/10 text-white text-center text-sm focus:ring-1 focus:ring-purple-500 transition-all hover:bg-white/15" 
                value={value.sales} 
                onChange={e => handleField('sales', e.target.value)}
                placeholder="30" 
              />
              <span className="text-xs text-white/60">%</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80">Personal & Rekrytering</label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                min="0" 
                max="100" 
                className="w-16 px-2 py-1 rounded-lg border border-white/20 bg-white/10 text-white text-center text-sm focus:ring-1 focus:ring-purple-500 transition-all hover:bg-white/15" 
                value={value.team} 
                onChange={e => handleField('team', e.target.value)}
                placeholder="25" 
              />
              <span className="text-xs text-white/60">%</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80">Övrigt</label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                min="0" 
                max="100" 
                className="w-16 px-2 py-1 rounded-lg border border-white/20 bg-white/10 text-white text-center text-sm focus:ring-1 focus:ring-purple-500 transition-all hover:bg-white/15" 
                value={value.other} 
                onChange={e => handleField('other', e.target.value)}
                placeholder="5" 
              />
              <span className="text-xs text-white/60">%</span>
            </div>
          </div>
        </div>
        
        {/* Total check */}
        {(() => {
          const total = (parseInt(value.product) || 0) + (parseInt(value.sales) || 0) + (parseInt(value.team) || 0) + (parseInt(value.other) || 0);
          return total > 0 ? (
            <div className={`mt-3 text-sm text-center font-medium ${total === 100 ? 'text-green-400' : 'text-orange-400'}`}>
              Totalt: {total}% {total !== 100 && '(bör vara 100%)'}
            </div>
          ) : null;
        })()}
      </div>

      {/* Sannolikhet för mer kapital */}
      <div className="bg-white/5 rounded-2xl p-4 border border-white/20">
        <label className="block font-semibold mb-3 text-white">Sannolikhet att ni behöver mer kapital inom 18 månader</label>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/60">Låg</span>
          <input 
            type="range" 
            min="1" 
            max="5" 
            value={value.probability || '3'} 
            onChange={e => handleField('probability', e.target.value)} 
            className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${((parseInt(value.probability) || 3) - 1) * 25}%, rgba(255,255,255,0.1) ${((parseInt(value.probability) || 3) - 1) * 25}%, rgba(255,255,255,0.1) 100%)`
            }}
          />
          <span className="text-sm text-white/60">Hög</span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-sm">
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
      <div className="bg-white/5 rounded-2xl p-4 border border-white/20">
        <label className="block font-semibold mb-3 text-white">Välj relevanta områden:</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { key: 'miljö', label: 'Miljö & Klimat', icon: '🌱' },
            { key: 'socialt', label: 'Socialt Ansvar', icon: '🤝' },
            { key: 'governance', label: 'Styrning & Etik', icon: '⚖️' }
          ].map(({ key, label, icon }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer group">
              <div className={`relative w-6 h-6 rounded-lg border-2 transition-all duration-200 ${
                value[key as keyof typeof value] 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500' 
                  : 'bg-white/10 border-white/30 group-hover:border-purple-400'
              }`}>
                <input
                  type="checkbox"
                  checked={value[key as keyof typeof value] as boolean}
                  onChange={() => handleBox(key as 'miljö' | 'socialt' | 'governance')}
                  className="hidden"
                />
                {value[key as keyof typeof value] && (
                  <svg 
                    className="w-4 h-4 text-white absolute top-0.5 left-0.5" 
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
              <span className="flex items-center gap-2 text-white/80 font-medium group-hover:text-white transition-colors">
                <span>{icon}</span>
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="bg-white/5 rounded-2xl p-4 border border-white/20">
        <label className="block font-semibold mb-3 text-white">Beskriv era ESG-initiativ:</label>
        <textarea 
          className="w-full min-h-[100px] rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none hover:bg-white/15" 
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
      <div className="bg-white/5 rounded-2xl p-4 border border-white/20">
        <label className="block font-semibold mb-3 text-white">Matchning (1–5):</label>
        <div className="flex gap-3 justify-center">
          {[1,2,3,4,5].map(n => (
            <label key={n} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-all duration-200 ${
                value.score === String(n) 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-110 border-purple-500' 
                  : 'bg-white/10 text-white/70 border-white/30 hover:bg-white/20 hover:scale-105 hover:border-purple-400'
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
                value.score === String(n) ? 'text-purple-400' : 'text-white/50'
              }`}>
                {n === 1 ? 'Ingen' : n === 3 ? 'Bra' : n === 5 ? 'Expert' : ''}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className="bg-white/5 rounded-2xl p-4 border border-white/20">
        <label className="block font-semibold mb-2 text-white">Motivering:</label>
        <textarea 
          className="w-full min-h-[80px] rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none hover:bg-white/15" 
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
  const [linkedinChecked, setLinkedinChecked] = React.useState(false);
  const [showLinkedinInfo, setShowLinkedinInfo] = React.useState(false);
  const linkedinInfoRef = useRef<HTMLDivElement>(null);
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
    linkedinChecked &&
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
  useOnClickOutside(linkedinInfoRef, () => setShowLinkedinInfo(false));

  if (!open) return null;
  
  // Visa resultat om det finns
  if (result) {
    return (
      <BusinessPlanResult 
        score={result.score}
        answers={result.answers}
        feedback={result.feedback}
        subscriptionLevel={result.subscriptionLevel}
      />
    );
  }
  
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
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: .5; }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      .animate-slideIn { animation: slideIn 0.4s ease-out; }
      .animate-spin-reverse { animation: spin-reverse 1s linear infinite; }
      .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      .animate-float { animation: float 3s ease-in-out infinite; }
      .delay-150 { animation-delay: 150ms; }
      .delay-300 { animation-delay: 300ms; }
    `;
    document.head.appendChild(style);
  }

  // PreStepPage 1: Company, Email, Hemsida
  if (preStep && preStepPage === 1) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-[#0a1628] to-[#04111d] text-white rounded-3xl shadow-2xl border border-white/10 max-w-lg w-full p-8 relative animate-fadeIn">
          {/* Background glow effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl -z-10"></div>
          
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Starta din AI-analys
          </h2>
          
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
          </div>
          
          {/* Hemsida först */}
          <div className="mb-6">
            <label className="block font-semibold mb-3 text-white/90">Har ni en hemsida?</label>
            <div className="flex gap-4 flex-col sm:flex-row">
              <button
                type="button"
                className={`flex-1 p-4 rounded-2xl font-medium transition-all transform hover:scale-105 ${
                  hasWebsite === true 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
                }`}
                onClick={() => setHasWebsite(true)}
              >
                Ja
              </button>
              <button
                type="button"
                className={`flex-1 p-4 rounded-2xl font-medium transition-all transform hover:scale-105 ${
                  hasWebsite === false 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
                }`}
                onClick={() => setHasWebsite(false)}
              >
                Nej
              </button>
            </div>
          </div>
          
          {hasWebsite === true && (
            <div className="mb-6 animate-fadeIn">
              <label className="block font-semibold mb-3 text-white/90">Hemsida</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="url"
                  className={inputBase}
                  placeholder="https://www.dittforetag.se"
                  value={websiteUrl}
                  onChange={e => setWebsiteUrl(e.target.value)}
                />
                <button
                  type="button"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 transform hover:scale-105"
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
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Analyserar...</span>
                      </div>
                      <div className="text-xs text-white/60">
                        Hämtar företagsdata
                      </div>
                    </div>
                  ) : (
                    'Analysera hemsida'
                  )}
                </button>
              </div>
              {scrapeError && (
                <div className="mt-2 text-red-400 text-sm">{scrapeError}</div>
              )}
            </div>
          )}
          
          {/* Företagsnamn */}
          <div className="mb-6">
            <label className="block font-semibold mb-3 text-white/90">Företagsnamn</label>
            <input
              type="text"
              className={inputBase}
              placeholder="Ange företagets namn"
              value={company}
              onChange={e => setCompany(e.target.value)}
            />
          </div>
          
          {/* E-post */}
          <div className="mb-6">
            <label className="block font-semibold mb-3 text-white/90">E-post</label>
            <input
              type="email"
              className={inputBase}
              placeholder="din@epost.se"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          
          <div className="mb-6">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                className="mr-3 w-5 h-5 text-purple-500 bg-white/10 border-2 border-white/30 rounded focus:ring-purple-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#04111d] transition-all"
                checked={privacyChecked}
                onChange={e => setPrivacyChecked(e.target.checked)}
              />
              <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                Jag godkänner att mina uppgifter behandlas enligt <a href="/privacy" className="text-purple-400 underline hover:text-purple-300">integritetspolicyn</a>
              </span>
            </label>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer group flex-1">
                <input
                  type="checkbox"
                  className="mr-3 w-5 h-5 text-purple-500 bg-white/10 border-2 border-white/30 rounded focus:ring-purple-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#04111d] transition-all"
                  checked={linkedinChecked}
                  onChange={e => setLinkedinChecked(e.target.checked)}
                />
                <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                  Dela FrejFund på LinkedIn
                </span>
              </label>
              <button
                type="button"
                className="ml-2 text-purple-400 hover:text-purple-300 transition-colors"
                onClick={() => setShowLinkedinInfo(true)}
                aria-label="Information om LinkedIn-delning"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <text x="12" y="16" textAnchor="middle" fontSize="14" fill="currentColor">?</text>
                </svg>
              </button>
            </div>
            
            {linkedinChecked && (
              <div className="mt-3 animate-fadeIn">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://frejfund.se')}&title=${encodeURIComponent('Jag analyserade min affärsidé med AI!')}&summary=${encodeURIComponent('Testa att analysera din affärsidé du också! FrejFund hjälper startups att hitta rätt investerare med AI-driven analys. Få din investeringsscore på 10 minuter.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0077b5] hover:bg-[#006399] text-white rounded-xl transition-all transform hover:scale-105"
                  onClick={(e) => {
                    // Öppna LinkedIn-delning i nytt fönster
                    e.preventDefault();
                    const width = 600;
                    const height = 600;
                    const left = (window.innerWidth - width) / 2;
                    const top = (window.innerHeight - height) / 2;
                    window.open(
                      e.currentTarget.href,
                      'linkedin-share',
                      `width=${width},height=${height},left=${left},top=${top}`
                    );
                  }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  Dela på LinkedIn
                </a>
              </div>
            )}
          </div>
          
          <div className="flex justify-between mt-8">
            <button
              className="px-6 py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/20"
              onClick={onClose}
            >Avbryt</button>
            <button
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 transition-all transform hover:scale-105"
              onClick={() => setPreStepPage(2)}
              disabled={!isPreStep1Valid}
            >Nästa →</button>
          </div>
        </div>
      </div>
    );
  }

  // PreStepPage 2: Bransch och Område
  if (preStep && preStepPage === 2) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-[#0a1628] to-[#04111d] text-white rounded-3xl shadow-2xl border border-white/10 max-w-lg w-full p-8 relative animate-fadeIn">
          {/* Background glow effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl -z-10"></div>
          
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Företagsinformation
          </h2>
          
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          </div>
          
          <div className="mb-6">
            <label className="block font-semibold mb-3 text-white/90">Bransch</label>
            <div className="relative">
              <select
                className={`${selectBase} ${bransch ? 'border-purple-500/50' : ''}`}
                value={bransch}
                onChange={e => setBransch(e.target.value)}
              >
                <option value="">Välj bransch...</option>
                {BRANSCHER.map(b => (
                  <option key={b} value={b} className="bg-[#04111d] text-white">{b}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/60">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path d="M8 10l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
          
          <div className="mb-8">
            <label className="block font-semibold mb-3 text-white/90">Område</label>
            <div className="relative">
              <select
                className={`${selectBase} ${omrade ? 'border-purple-500/50' : ''}`}
                value={omrade}
                onChange={e => setOmrade(e.target.value)}
              >
                <option value="">Välj område...</option>
                {OMRADEN.map(o => (
                  <option key={o} value={o} className="bg-[#04111d] text-white">{o}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/60">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path d="M8 10l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
          
          <div className="flex justify-between mt-8">
            <button
              className="px-6 py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/20"
              onClick={() => setPreStepPage(1)}
            >← Tillbaka</button>
            <button
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 transition-all transform hover:scale-105"
              onClick={() => setPreStep(false)}
              disabled={!isPreStep2Valid}
            >Starta analys →</button>
          </div>
        </div>
      </div>
    );
  }
  
  if (step > 0 && !current) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-[#0a1628] to-[#04111d] text-white rounded-3xl shadow-2xl border border-white/10 max-w-xl w-full p-6 md:p-8 relative animate-fadeIn flex flex-col justify-between max-h-[90vh] overflow-y-auto">
        {/* Background glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-xl -z-10"></div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 text-2xl font-bold hover:text-white transition-colors"
          aria-label="Stäng"
        >×</button>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/60 font-medium text-sm">Fråga {step} av {INVESTOR_QUESTIONS.length}</span>
            <span className="text-white/80 font-bold text-sm">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
        
        <div id="wizard-description">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold">{current.label}</h2>
            {scrapedData && answers[current.id] && (
              <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-300 border border-green-500/30">
                <span className="mr-1">🤖</span>
                Automatiskt ifyllt
              </span>
            )}
            <button
              type="button"
              className="ml-auto text-purple-400 hover:text-purple-300 text-xl transition-colors"
              aria-label="Visa exempel"
              onClick={() => setShowExample(current.id)}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <text x="12" y="16" textAnchor="middle" fontSize="14" fill="currentColor">?</text>
              </svg>
            </button>
          </div>
          
          <div className="mb-6 text-sm text-white/60">
            {current.help}
            {scrapedData && answers[current.id] && (
              <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                <div className="text-green-300 text-xs">
                  <strong>Automatiskt ifyllt från:</strong> {scrapedData._metadata?.source_url}
                </div>
              </div>
            )}
            {scrapedData && !answers[current.id] && websiteUrl && (
              <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <div className="text-blue-300 text-xs mb-2">
                  Detta fält kunde inte fyllas i automatiskt från hemsidan.
                </div>
                <button
                  type="button"
                  className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 rounded-full hover:shadow-lg transition-all"
                  onClick={async () => {
                    setIsLoadingExample(true);
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
                    } finally {
                      setIsLoadingExample(false);
                    }
                  }}
                  disabled={isLoadingExample}
                >
                  {isLoadingExample ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                      Genererar...
                    </span>
                  ) : (
                    'AI-förslag för detta fält'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Form inputs - Add a container with min-height to keep consistent size */}
        <div className="flex-1 min-h-[200px] mb-6">
          {/* Textarea questions */}
          {isTextQuestion(current) && current.type === "textarea" && (
            <div className="relative">
              <textarea
                className={`${inputBase} ${
                  scrapedData && answers[current.id] ? 'border-green-500/50 bg-green-500/10' : ''
                }`}
                value={getStringValue(answers[current.id])}
                onChange={e => setAnswers({ ...answers, [current.id]: e.target.value })}
                placeholder={scrapedData && answers[current.id] ? "Automatiskt ifyllt - redigera efter behov" : "Skriv ditt svar här..."}
                rows={6}
                style={{ minHeight: '150px', maxHeight: '250px', resize: 'vertical' }}
              />
              {scrapedData && answers[current.id] && (
                <div className="absolute top-2 right-2">
                  <span className="text-green-400 text-xs">🤖 AI-fyllt</span>
                </div>
              )}
            </div>
          )}
          
          {/* Text input questions */}
          {isTextQuestion(current) && current.type === "text" && (
            <input
              type="text"
              className={`${inputBase} ${
                scrapedData && answers[current.id] ? 'border-green-500/50 bg-green-500/10' : ''
              }`}
              value={getStringValue(answers[current.id])}
              onChange={e => setAnswers({ ...answers, [current.id]: e.target.value })}
              placeholder={scrapedData && answers[current.id] ? "Automatiskt ifyllt" : "Skriv ditt svar..."}
            />
          )}
          
          {/* Number input questions */}
          {isTextQuestion(current) && current.type === "number" && (
            <div className="flex items-center gap-4">
              <input
                type="number"
                className={`${inputBase} max-w-[200px] text-center text-2xl font-bold ${
                  scrapedData && answers[current.id] ? 'border-green-500/50 bg-green-500/10' : ''
                }`}
                value={getStringValue(answers[current.id])}
                onChange={e => setAnswers({ ...answers, [current.id]: e.target.value })}
                placeholder="0"
                min="0"
              />
              {current.id === 'runway' && (
                <span className="text-white/60 text-lg">månader</span>
              )}
              {current.id === 'founder_equity' && (
                <span className="text-white/60 text-lg">%</span>
              )}
            </div>
          )}
          
          {/* Select questions */}
          {isSelectQuestion(current) && current.type === "select" && (
            <div className="relative">
              <select
                className={`${selectBase} ${
                  answers[current.id] ? 'border-purple-500/50' : ''
                }`}
                value={getStringValue(answers[current.id])}
                onChange={e => setAnswers({ ...answers, [current.id]: e.target.value })}
              >
                <option value="">Välj ett alternativ...</option>
                {current.options.map(opt => (
                  <option key={opt} value={opt} className="bg-[#04111d] text-white">{opt}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/60">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path d="M8 10l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          )}
          
          {/* Radio questions */}
          {isSelectQuestion(current) && current.type === "radio" && (
            <div className="space-y-3">
              {current.options.map(opt => (
                <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="radio"
                      name={current.id}
                      value={opt}
                      checked={getStringValue(answers[current.id]) === opt}
                      onChange={() => setAnswers({ ...answers, [current.id]: opt })}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded-full border-2 transition-all ${
                      getStringValue(answers[current.id]) === opt
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-white/30 bg-white/10 group-hover:border-purple-400'
                    }`}>
                      {getStringValue(answers[current.id]) === opt && (
                        <div className="w-full h-full rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-white/80 group-hover:text-white transition-colors">{opt}</span>
                </label>
              ))}
            </div>
          )}
          
          {/* Milestone list */}
          {isMilestoneQuestion(current) && (
            <MilestoneList
              value={answers[current.id] ? JSON.parse(answers[current.id] as string) : [{ milestone: '', date: '' }]}
              onChange={val => setAnswers({ ...answers, [current.id]: JSON.stringify(val) })}
            />
          )}
          
          {/* Capital matrix */}
          {isCapitalQuestion(current) && (
            <CapitalMatrix
              value={answers[current.id] ? JSON.parse(answers[current.id] as string) : { amount: '', product: '', sales: '', team: '', other: '', probability: '3' }}
              onChange={val => setAnswers({ ...answers, [current.id]: JSON.stringify(val) })}
            />
          )}
          
          {/* ESG checkbox */}
          {isESGQuestion(current) && (
            <ESGCheckbox
              value={answers[current.id] ? JSON.parse(answers[current.id] as string) : { miljö: false, socialt: false, governance: false, text: '' }}
              onChange={val => setAnswers({ ...answers, [current.id]: JSON.stringify(val) })}
            />
          )}
          
          {/* Founder market fit */}
          {isFounderMarketFitQuestion(current) && (
            <FounderMarketFit
              value={answers[current.id] ? JSON.parse(answers[current.id] as string) : { score: '', text: '' }}
              onChange={val => setAnswers({ ...answers, [current.id]: JSON.stringify(val) })}
            />
          )}
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-auto">
          <button
            type="button"
            className="px-6 py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/20 disabled:opacity-50"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            ← Tillbaka
          </button>
          
          <button
            type="button"
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50"
            onClick={async () => {
              if (step < INVESTOR_QUESTIONS.length) {
                setStep(step + 1);
              } else {
                // Submit and show loading
                setShowFinalLoader(true);
                let messageIndex = 0;
                const messageInterval = setInterval(() => {
                  messageIndex = (messageIndex + 1) % finalLoaderMessages.length;
                  setFinalLoaderText(finalLoaderMessages[messageIndex]);
                }, 2000);
                
                try {
                  const response = await fetch('/api/analyze-businessplan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      ...answers,
                      company_name: company,
                      email: email,
                      bransch: bransch,
                      omrade: omrade,
                      has_website: hasWebsite,
                      website_url: websiteUrl
                    })
                  });
                  
                  const data = await response.json();
                  clearInterval(messageInterval);
                  setShowFinalLoader(false);
                  
                  // Spara submission till Render's persistenta disk
                  try {
                    await fetch('/api/save-submission', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        timestamp: new Date().toISOString(),
                        company_name: company,
                        email: email,
                        bransch: bransch,
                        omrade: omrade,
                        has_website: hasWebsite,
                        website_url: websiteUrl,
                        answers: answers,
                        result: data
                      })
                    });
                    console.log('Submission saved successfully');
                  } catch (saveError) {
                    console.error('Could not save submission:', saveError);
                  }
                  
                  setResult(data);
                } catch (error) {
                  clearInterval(messageInterval);
                  setShowFinalLoader(false);
                  console.error('Error submitting:', error);
                }
              }
            }}
            disabled={current.required && !answers[current.id]}
          >
            {step === INVESTOR_QUESTIONS.length ? 'Slutför analys →' : 'Nästa →'}
          </button>
        </div>
      </div>
      
      {/* Example popup */}
      {showExample && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
          <div ref={exampleRef} className="bg-gradient-to-br from-[#0a1628] to-[#04111d] text-white rounded-2xl shadow-xl border border-white/10 max-w-lg w-full p-6 animate-fadeIn">
            <h3 className="text-xl font-bold mb-4">Exempel för "{current.label}"</h3>
            {isLoadingExample ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : exampleError ? (
              <p className="text-red-400">{exampleError}</p>
            ) : (
              <div className="space-y-3">
                <p className="text-white/80">{exampleText}</p>
                <button
                  className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
                  onClick={() => {
                    setAnswers({ ...answers, [current.id]: exampleText });
                    setShowExample(null);
                  }}
                >
                  Använd detta exempel
                </button>
              </div>
            )}
            <button
              className="absolute top-4 right-4 text-white/60 hover:text-white"
              onClick={() => setShowExample(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      {/* Final loader */}
      {showFinalLoader && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-[#0a1628] to-[#04111d] text-white rounded-3xl shadow-2xl border border-white/10 p-8 max-w-md w-full text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
                <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">{finalLoaderText}</h3>
            <p className="text-white/60">Detta tar vanligtvis 20-30 sekunder</p>
          </div>
        </div>
      )}
      
      {/* LinkedIn info popup */}
      {showLinkedinInfo && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
          <div ref={linkedinInfoRef} className="bg-gradient-to-br from-[#0a1628] to-[#04111d] text-white rounded-2xl shadow-xl border border-white/10 max-w-md w-full p-6 animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              onClick={() => setShowLinkedinInfo(false)}
            >
              ✕
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0077b5]/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Varför ber vi om detta?</h3>
            </div>
            
            <div className="space-y-4 text-white/80">
              <p>
                Vi på FrejFund vill hjälpa så många entreprenörer som möjligt att få rätt finansiering för sina affärsidéer. 
              </p>
              <p>
                <strong className="text-white">Det är väldigt lite för dig</strong> - bara ett klick för att dela vår tjänst.
              </p>
              <p>
                <strong className="text-white">Men det betyder väldigt mycket för oss</strong> - varje delning hjälper fler entreprenörer att hitta oss och få den hjälp de behöver.
              </p>
              <p className="text-sm italic">
                Tillsammans kan vi bygga ett starkare startup-ekosystem i Sverige! 🚀
              </p>
            </div>
            
            <button
              className="w-full mt-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
              onClick={() => setShowLinkedinInfo(false)}
            >
              Förstått!
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 