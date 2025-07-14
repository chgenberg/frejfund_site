import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import BusinessPlanResult from './BusinessPlanResult';
import BusinessPlanScore, { calculateScore as calculateScoreFn } from './BusinessPlanScore';
import TestWizard, { CustomTextarea, TEST_EXPORT } from './TestWizard';
import { supabase } from '../../lib/supabase';
import {
  Question,
  BusinessPlanAnswers,
  BusinessPlanSection,
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
  isMarketSizeQuestion,
  BusinessIdea,
  CustomerSegments,
  ProblemSolution,
  MarketAnalysis,
  BusinessModel,
  Team,
  FundingDetails,
  BusinessPlanValue
} from '../types/businessPlan';

const BRANSCHER = [
  'SaaS', 'Tech', 'Konsumentvaror', 'Hälsa', 'Fintech', 'Industri', 'Tjänster', 'Utbildning', 'Energi', 'Annat'
];
const OMRADEN = [
  'Sverige', 'Norden', 'Europa', 'Globalt', 'Annat'
];

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
  { id: 'market_size', label: 'Hur stort är marknadsutrymmet? (TAM/SAM/SOM)', type: 'market_size', required: true, help: 'Uppskatta er totala marknad: TAM, SAM, SOM.' },
  { id: 'market_trends', label: 'Vilka viktiga marknadstrender gynnar er?', type: 'textarea', required: false, help: 'Beskriv trender (teknologiska, demografiska, regulatoriska) som ni surfar på.' },
  { id: 'traction', label: 'Hur ser traction ut hittills?', type: 'textarea', required: true, help: 'Ange milstolpar och resultat: användare, kunder, piloter, intäkter, tillväxttal.' },
  { id: 'revenue_block', label: 'Hur tjänar ni pengar och hur fördelas intäkterna (återkommande/engång)?', type: 'textarea', required: true, help: 'Beskriv intäktsströmmar, prissättning och fördelning mellan återkommande och engångsintäkter.' },
  { id: 'runway', label: 'Hur lång runway (antal månader) har ni? (heltal)', type: 'number', required: true, help: 'Hur många månader räcker ert kapital? (Bifoga gärna P/L-rapport om möjligt)', min: 0 },
  { id: 'growth_plan', label: 'Vad är er tillväxtplan för nästa 12-24 månader?', type: 'textarea', required: true, help: 'Beskriv framtidsplaner: försäljningstillväxt, produktlanseringar, kundmål.' },
  { id: 'milestones', label: 'Vilka tre största milstolpar planerar ni att nå kommande 12 månader (med månad/kvartal)?', type: 'milestone_list', required: true, help: 'Exempel: "Lansering Q3", "Första betalande kund i september", "ISO-certifiering Q2".' },
  { id: 'team', label: 'Hur ser ert team ut?', type: 'textarea', required: true, help: 'Presentera grundarna och kärnteamet, roller och erfarenheter.' },
  { id: 'founder_equity', label: 'Hur stor ägarandel (%) behåller grundarteamet efter denna runda?', type: 'number', required: true, help: 'Svara i procent, t.ex. 65.', min: 0, max: 100 },
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
  { id: 'tax_incentives', label: 'Finns det några skattemässiga incitament eller stöd kopplade till investeringen?', type: 'textarea', required: false, help: 'T.ex. bidrag, stöd, skattelättnader.' },
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

const BRANSCH_SPECIFIC_QUESTIONS: { [key: string]: Question[] } = {
  SaaS: [
    {
      id: 'saas_churn',
      label: 'Churn (kundbortfall, % per månad)',
      exampleAnswers: ['2%', '5%', '10%'],
      required: false,
      help: 'Ange er månatliga churn i procent.',
      type: 'text'
    },
    {
      id: 'saas_arr',
      label: 'Årlig återkommande intäkt (ARR)',
      exampleAnswers: ['1 MSEK', '5 MSEK'],
      required: false,
      help: 'Ange er årliga återkommande intäkt.',
      type: 'text'
    },
    {
      id: 'saas_onboarding',
      label: 'Hur ser onboarding-processen ut?',
      exampleAnswers: ['Automatiserad onboarding', 'Personlig onboarding av kundansvarig'],
      required: false,
      help: 'Beskriv hur ni onboardar nya kunder.',
      type: 'text'
    }
  ],
  Konsumentvaror: [
    {
      id: 'consumer_logistics',
      label: 'Hur hanterar ni logistik och lager?',
      exampleAnswers: ['Eget lager', 'Tredjepartslogistik (3PL)'],
      required: false,
      help: 'Beskriv hur ni hanterar logistik och lager.',
      type: 'text'
    },
    {
      id: 'consumer_distribution',
      label: 'Hur distribueras produkterna?',
      exampleAnswers: ['Egen e-handel', 'Återförsäljare', 'Amazon'],
      required: false,
      help: 'Beskriv era distributionskanaler.',
      type: 'text'
    }
  ],
  Tech: [
    {
      id: 'tech_ip',
      label: 'Har ni patent eller annan IP?',
      exampleAnswers: ['Patentansökan inlämnad', 'Inget patent'],
      required: false,
      help: 'Ange om ni har patent eller annan immateriell egendom.',
      type: 'text'
    },
    {
      id: 'tech_scalability',
      label: 'Hur skalbar är tekniken?',
      exampleAnswers: ['Kan hantera 1M användare', 'Behöver optimeras för tillväxt'],
      required: false,
      help: 'Beskriv hur skalbar er teknik är.',
      type: 'text'
    }
  ]
};

// Update these style constants for dark theme
const focusRing = "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#04111d]";
const mobileInput = "text-base md:text-sm";
const touchTarget = "min-h-[44px]";
const transitionBase = "transition-all duration-200 ease-in-out";

// Update the input base styles for dark theme
const inputBase = `
  w-full px-4 py-3 
  bg-white/5 
  border border-white/10 
  rounded-xl
  text-white
  placeholder-white/40
  focus:outline-none 
  focus:ring-2 
  focus:ring-purple-500/50 
  focus:border-transparent
  transition-all
  duration-200
`;

// Update the select base styles
const selectBase = `
  w-full px-4 py-3 
  bg-white/5 
  border border-white/10 
  rounded-xl
  text-white
  appearance-none
  focus:outline-none 
  focus:ring-2 
  focus:ring-purple-500/50 
  focus:border-transparent
  transition-all
  duration-200
`;

// Add new feedback styles
const successState = "border-green-500 bg-green-500/10";
const errorState = "border-red-500 bg-red-500/10";
const loadingState = "opacity-75 cursor-wait";

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
    type: 'market_size',
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
    help: 'Hur många månader räcker ert kapital? (Bifoga gärna P/L-rapport om möjligt)',
    min: 0
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
    help: 'Svara i procent, t.ex. 65.',
    min: 0,
    max: 100
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
    help: 'T.ex. bidrag, stöd, skattelättnader.'
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

// Premium frågor för 30-sidors analys
const PREMIUM_QUESTIONS: Question[] = [
  // Finansiella detaljer
  {
    id: 'monthly_burn',
    type: 'number',
    label: 'Vad är er nuvarande månatliga burn rate (SEK)?',
    help: 'Total kostnad per månad inklusive alla utgifter',
    required: true
  },
  {
    id: 'revenue_history',
    type: 'textarea', 
    label: 'Beskriv era historiska intäkter (senaste 12 månaderna)',
    help: 'Ange månad för månad om möjligt, eller kvartalsvis',
    required: true
  },
  {
    id: 'customer_ltv',
    type: 'number',
    label: 'Vad är er genomsnittliga Customer Lifetime Value (SEK)?',
    help: 'Total intäkt per kund under hela kundrelationen',
    required: false
  },
  {
    id: 'churn_rate',
    type: 'number',
    label: 'Vad är er månatliga churn rate (%)?',
    help: 'Andel kunder som lämnar er varje månad',
    required: false
  },
  {
    id: 'cac',
    type: 'number',
    label: 'Vad är er Customer Acquisition Cost (SEK)?',
    help: 'Total kostnad för att värva en ny kund',
    required: false
  },
  
  // Operationella detaljer
  {
    id: 'current_employees',
    type: 'number',
    label: 'Hur många anställda har ni idag?',
    help: 'Inklusive grundare',
    required: true
  },
  {
    id: 'hiring_plan',
    type: 'textarea',
    label: 'Beskriv er rekryteringsplan för nästa 12 månader',
    help: 'Vilka roller, när och till vilken kostnad',
    required: true
  },
  {
    id: 'key_suppliers',
    type: 'textarea',
    label: 'Vilka är era viktigaste leverantörer/partners?',
    help: 'Lista namn och vad de levererar',
    required: true
  },
  {
    id: 'tech_stack',
    type: 'textarea',
    label: 'Beskriv er tekniska stack och utvecklingsbehov',
    help: 'Vilken teknik använder ni och vad behöver utvecklas',
    required: true
  },
  
  // Strategiska frågor
  {
    id: 'international_expansion',
    type: 'textarea',
    label: 'Har ni planer för internationell expansion?',
    help: 'Vilka marknader, när och hur',
    required: true
  },
  {
    id: 'partnerships',
    type: 'textarea',
    label: 'Vilka strategiska partnerskap planerar ni?',
    help: 'Potentiella partners och samarbetsområden',
    required: true
  },
  {
    id: 'ip_strategy',
    type: 'textarea',
    label: 'Beskriv er IP/patent-strategi',
    help: 'Befintliga patent, ansökningar och framtida planer',
    required: true
  },
  {
    id: 'sustainability_goals',
    type: 'textarea',
    label: 'Vilka är era hållbarhetsmål?',
    help: 'ESG-mål och hur ni mäter dem',
    required: true
  },
  
  // Konkurrensanalys
  {
    id: 'competitor_analysis',
    type: 'textarea',
    label: 'Gör en djupare analys av era 3 största konkurrenter',
    help: 'Styrkor, svagheter, marknadsandelar, prissättning',
    required: true
  },
  {
    id: 'competitive_advantages',
    type: 'textarea',
    label: 'Vad är era varaktiga konkurrensfördelar?',
    help: 'Vad gör er svåra att kopiera på 3-5 års sikt',
    required: true
  },
  
  // Marknadsvalidering
  {
    id: 'customer_interviews',
    type: 'textarea',
    label: 'Sammanfatta insikter från kundintervjuer',
    help: 'Vad har ni lärt er från att prata med potentiella kunder',
    required: true
  },
  {
    id: 'pilot_results',
    type: 'textarea',
    label: 'Resultat från piloter eller testperioder?',
    help: 'Konkreta resultat och lärdomar',
    required: false
  },
  {
    id: 'market_timing',
    type: 'textarea',
    label: 'Varför är timingen rätt just nu?',
    help: 'Marknadstrender, teknologiska förändringar, regulatoriska skiften',
    required: true
  }
];

// Kombinera frågor baserat på prenumerationsnivå
function getAllQuestions(selectedIndustry: string): Question[] {
  return [...INVESTOR_QUESTIONS];
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
function MilestoneList({ value, onChange }: MilestoneListProps) {
  const addMilestone = () => {
    const newMilestones = [...(value.milestones || []), { text: '', date: '' }];
    onChange({ milestones: newMilestones });
  };

  const removeMilestone = (index: number) => {
    if (value.milestones.length > 1) {
      const newMilestones = value.milestones.filter((_, i) => i !== index);
      onChange({ milestones: newMilestones });
    }
  };

  const updateMilestone = (index: number, field: 'text' | 'date', val: string) => {
    const newMilestones = value.milestones.map((m, i) => 
      i === index ? { ...m, [field]: val } : m
    );
    onChange({ milestones: newMilestones });
  };

  return (
    <div className="space-y-4">
      {(value.milestones || []).map((milestone, index) => (
        <div key={index} className="bg-white/5 rounded-2xl p-4 border border-white/20">
          <div className="flex items-start gap-4">
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Milstolpe</label>
                <input
                  type="text"
                  value={milestone.text}
                  onChange={(e) => updateMilestone(index, 'text', e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:bg-white/15"
                  placeholder="T.ex. Lanserar beta, Når 1000 användare..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Datum</label>
                <input
                  type="date"
                  value={milestone.date}
                  onChange={(e) => updateMilestone(index, 'date', e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:bg-white/15"
                />
              </div>
            </div>
            <button
              onClick={() => removeMilestone(index)}
              className="p-2 text-white/60 hover:text-white transition-colors"
              disabled={value.milestones.length === 1}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
      
      <button
        onClick={addMilestone}
        className="w-full py-3 rounded-xl border-2 border-dashed border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Lägg till milstolpe
      </button>
    </div>
  );
}

function CapitalMatrixInput({ value, onChange }: CapitalMatrixInputProps) {
  // Implementation
  return null;
}

export default function BusinessPlanWizard({ open, onClose }: BusinessPlanWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [aiFilled, setAiFilled] = useState<{ [key: string]: boolean }>({});
  const [triedNext, setTriedNext] = useState(false);
  const [step, setStep] = useState(1);
  const [preStep, setPreStep] = useState(true);
  const [preStepPage, setPreStepPage] = useState(1);
  const [showFinalLoader, setShowFinalLoader] = useState(false);
  const [finalLoaderText, setFinalLoaderText] = useState('Analyserar dina svar...');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [hasWebsite, setHasWebsite] = useState<boolean | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [showExample, setShowExample] = useState<string | null>(null);
  const [exampleText, setExampleText] = useState<string>('');
  const [isLoadingExample, setIsLoadingExample] = useState(false);
  const [exampleError, setExampleError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [showMarketPopup, setShowMarketPopup] = useState(false);
  const [showCompetitorPopup, setShowCompetitorPopup] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [scrapedData, setScrapedData] = useState<any>(null);
  const [scrapeProgress, setScrapeProgress] = useState(0);
  const [scrapeStatus, setScrapeStatus] = useState('');

  const exampleRef = useRef<HTMLDivElement>(null);
  const marketRef = useRef<HTMLDivElement>(null);
  const competitorRef = useRef<HTMLDivElement>(null);

  const current: Question = INVESTOR_QUESTIONS[step];

  const handleSubmit = async () => {
    // Implementation
  };

  const handleNext = () => {
    // Implementation
  };

  return null; // Implementation
} 