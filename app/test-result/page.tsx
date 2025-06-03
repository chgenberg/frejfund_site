"use client";
import { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter } from 'recharts';
import { FaCheckCircle, FaExclamationTriangle, FaLightbulb, FaChartBar, FaUsers, FaMoneyBill, FaLeaf, FaRoad, FaSignOutAlt, FaDownload, FaRedo, FaFilePdf, FaChevronDown, FaChevronUp, FaUpload } from 'react-icons/fa';
import BusinessPlanResult from '../components/BusinessPlanResult';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const COLORS = ['#16475b', '#7edcff', '#eaf6fa', '#fbbf24', '#10b981', '#ef4444'];

const sectionConfig = [
  { id: 'problem', title: 'Problem', icon: <FaExclamationTriangle className="text-yellow-500" />, color: 'from-yellow-100 via-white to-yellow-50' },
  { id: 'solution', title: 'Lösning', icon: <FaLightbulb className="text-blue-400" />, color: 'from-blue-100 via-white to-blue-50' },
  { id: 'market', title: 'Marknad', icon: <FaChartBar className="text-blue-600" />, color: 'from-blue-100 via-white to-blue-50' },
  { id: 'business_model', title: 'Affärsmodell', icon: <FaMoneyBill className="text-green-600" />, color: 'from-green-100 via-white to-green-50' },
  { id: 'traction', title: 'Traction', icon: <FaUsers className="text-indigo-600" />, color: 'from-indigo-100 via-white to-indigo-50' },
  { id: 'team', title: 'Team', icon: <FaUsers className="text-pink-600" />, color: 'from-pink-100 via-white to-pink-50' },
  { id: 'financials', title: 'Finansiellt', icon: <FaMoneyBill className="text-green-700" />, color: 'from-green-100 via-white to-green-50' },
  { id: 'risk_esg', title: 'Risk & ESG', icon: <FaLeaf className="text-green-500" />, color: 'from-green-100 via-white to-green-50' },
  { id: 'ask', title: 'Ask/Use of Funds', icon: <FaMoneyBill className="text-yellow-700" />, color: 'from-yellow-100 via-white to-yellow-50' },
  { id: 'roadmap', title: 'Roadmap', icon: <FaRoad className="text-gray-600" />, color: 'from-gray-100 via-white to-gray-50' },
  { id: 'exit', title: 'Exit', icon: <FaSignOutAlt className="text-gray-700" />, color: 'from-gray-100 via-white to-gray-50' }
];

const marketData = [
  { name: 'TAM', value: 1000 },
  { name: 'SAM', value: 300 },
  { name: 'SOM', value: 50 }
];
const useOfFundsData = [
  { name: 'Produkt', value: 50 },
  { name: 'Sälj', value: 30 },
  { name: 'Team', value: 20 }
];
const tractionData = [
  { month: 'Jan', users: 100 },
  { month: 'Feb', users: 200 },
  { month: 'Mar', users: 400 },
  { month: 'Apr', users: 800 },
  { month: 'Maj', users: 1200 }
];
const esgRadarData = [
  { subject: 'Miljö', A: 120, fullMark: 150 },
  { subject: 'Socialt', A: 98, fullMark: 150 },
  { subject: 'Styrning', A: 86, fullMark: 150 }
];

const todoList = [
  { text: 'Öka traction', done: false },
  { text: 'Förbättra differentiering', done: false },
  { text: 'Säkra finansiering', done: false }
];

const strengths = [
  'Stark marknadspotential',
  'Innovativ lösning',
  'Skalbar affärsmodell',
  'Starkt team'
];
const weaknesses = [
  'Begränsad traction',
  'Höga konkurrenter',
  'Osäker finansiering',
  'Behöver fler kundcase'
];

const longAIComment = `Det här området är väl genomarbetat och sticker ut i jämförelse med andra startups. För att ta det till nästa nivå, rekommenderar vi att du kompletterar med fler konkreta exempel och visar på tydliga resultat från marknaden. Tänk på att investerare ofta letar efter bevis på "founder-market fit" och att du kan visa på en skalbarhet i din lösning.\n\nInvestor-insights:\n• Marknaden är stor men konkurrensutsatt – differentiering är avgörande.\n• Tydlig traction och kundcase ökar trovärdigheten.\n• Visa på hur kapitalet ska användas för att driva tillväxt.\n\nTODOs:\n1. Samla fler kundcitat.\n2. Visualisera traction-data.\n3. Förbered en känslighetsanalys för budgeten.`;

const scatterData = [
  { x: 1, y: 3, name: 'Bokio', fill: '#16475b' },
  { x: 2, y: 2, name: 'Fortnox', fill: '#7edcff' },
  { x: 3, y: 4, name: 'FrejFund', fill: '#fbbf24' }
];

const FONT_OPTIONS = [
  { label: 'Sans-serif (Helvetica)', value: 'Helvetica', style: { fontFamily: 'Helvetica, Arial, sans-serif' } },
  { label: 'Serif (Times)', value: 'Times', style: { fontFamily: 'Times New Roman, Times, serif' } },
  { label: 'Monospace (Courier)', value: 'Courier', style: { fontFamily: 'Courier New, Courier, monospace' } },
  { label: 'Modern (Lato)', value: 'Lato', style: { fontFamily: 'Lato, Arial, sans-serif', fontWeight: 700 } },
  { label: 'Handwritten (Pacifico)', value: 'Pacifico', style: { fontFamily: 'Pacifico, cursive' } },
];

export default function TestResultPage() {
  // Dummy data för test
  const dummyData = {
    score: 78,
    answers: {
      customer_problem: "Företag har svårt att hitta rätt investerare för sina projekt. Det tar för lång tid och är ineffektivt.",
      solution: "En AI-driven plattform som matchar företag med rätt investerare baserat på bransch, projekttyp och investeringsbehov.",
      market_size: "Sveriges investeringsmarknad är värd 50 miljarder SEK årligen. Vår TAM är 5 miljarder SEK, SAM 1 miljard SEK, och vi riktar oss till en SOM på 200 miljoner SEK inom 3 år.",
      target_customer: "Tech-startups i tidigt skede (1-5 år) som söker investeringar mellan 2-10 MSEK. Primärt inom SaaS, AI och CleanTech.",
      team: "Vi har ett erfaret team med bakgrund från både tech och finans. VD har 10 års erfarenhet av investeringar, CTO kommer från Spotify, och COO har byggt upp flera framgångsrika startups.",
      traction: "Vi har 50 aktiva företag på plattformen och har matchat 10 investeringar hittills. Månadsvis tillväxt på 20%.",
      founder_market_fit: JSON.stringify({
        score: 4,
        text: "Teamet har stark erfarenhet från både tech och finans, med relevanta kontakter i branschen."
      }),
      milestones: JSON.stringify([
        { milestone: "Lansera beta-version", date: "Q2 2024" },
        { milestone: "Nå 100 aktiva företag", date: "Q3 2024" },
        { milestone: "Utöka till Norden", date: "Q1 2025" }
      ]),
      capital_block: JSON.stringify({
        amount: "15",
        product: "40",
        sales: "30",
        team: "20",
        other: "10"
      })
    }
  };

  return (
    <div className="min-h-screen">
      <BusinessPlanResult 
        score={dummyData.score}
        answers={dummyData.answers}
      />
    </div>
  );
} 