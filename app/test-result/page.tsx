"use client";
import { useState } from 'react';
import BusinessPlanResult from '../components/BusinessPlanResult';

const aiFeedback = {
  executive_summary: "AI-feedback: Din pitch är tydlig och fokuserar på värdet för kunden. För att öka investerarintresset, lägg till en konkret marknadssiffra och en unik säljpunkt.",
  problem_solution: "AI-feedback: Problemet är välformulerat och lösningen är innovativ. Lyft gärna fram varför nu är rätt tid för denna lösning.",
  market: "AI-feedback: Marknadspotentialen är stor. För att övertyga investerare, visa gärna på tillväxttakt och källor till siffrorna.",
  business_model: "AI-feedback: Affärsmodellen är skalbar. Tydliggör gärna hur ni kan öka ARPU över tid.",
  traction: "AI-feedback: Bra traction och tydliga milstolpar. Sätt gärna upp ett par stretch goals för att visa ambition.",
  team: "AI-feedback: Teamet har stark kompetens. Komplettera gärna med rådgivare eller experter inom sälj/marknad.",
  customer_cases: "AI-feedback: Kundcase och LOI stärker trovärdigheten. Fler citat från betalande kunder ökar effekten.",
  competition: "AI-feedback: Ni har en tydlig differentiering. Visa gärna på svagheter hos konkurrenterna och hur ni adresserar dem.",
  budget: "AI-feedback: Budgeten är realistisk. Lägg gärna till ett worst-case scenario och visa känslighetsanalys.",
  cap_table: "AI-feedback: Cap table är balanserad. Tydliggör gärna incitament för framtida nyckelrekryteringar.",
  tech_ip: "AI-feedback: Egen AI-modell och patentansökan är starkt. Beskriv gärna hur ni skyddar er teknik långsiktigt.",
  esg: "AI-feedback: Impact och hållbarhet är tydligt. Koppla gärna till fler SDG och visa på mätbara resultat.",
  exit: "AI-feedback: Exit-planen är rimlig. Visa gärna på liknande exits i branschen för att stärka caset."
};

export default function TestResultPage() {
  const [subscriptionLevel, setSubscriptionLevel] = useState<'silver' | 'gold' | 'platinum'>('platinum');

  // Dummydata för ALLA sektioner
  const testData = {
    score: 92,
    details: {
      team: 23,
      problemSolution: 22,
      market: 24
    },
    answers: {
      executive_summary: {
        summary: "Vi automatiserar bokföring för småföretag med AI och sparar 80% av deras tid.",
        demo_link: "https://youtu.be/demo123"
      },
      business_idea: {
        what_you_do: "Småföretag lägger onödig tid på bokföring.",
        why_unique: "Vi använder AI för att automatisera och förenkla hela processen."
      },
      market_details: {
        tam: "10 miljarder kr",
        sam: "2 miljarder kr",
        som: "200 miljoner kr",
        market_source: "Statista 2023"
      },
      revenue_model: {
        model: "Månadsabonnemang per företag.",
        other_revenue: "Konsulttjänster inom bokföring."
      },
      pricing: {
        price_model: "Abonnemangspris",
        price_range: "1000-5000 kr per månad."
      },
      milestones: {
        milestones_list: "Lansering Q1 2024, ISO-certifiering Q2 2025",
        traction_kpi: "300kkr MRR, 1000 nya användare/mån"
      },
      founders_dna: {
        team_roles: "Anna (VD, 10 år i branschen), Erik (CTO, AI-expert)",
        dna_strengths: "Tech + sälj, Visionär + analytiker"
      },
      customer_cases: {
        loi_links: "https://kundcase.se/case1",
        customer_quotes: "'30% lägre churn' – Kund AB"
      },
      competition_matrix: {
        competitors: "Bokio, Fortnox",
        features_vs_price: "Vi har AI, de har inte",
        positioning: "Bäst på automation"
      },
      budget_forecast: {
        forecast_table: "Se bifogad fil",
        arpu: "500 kr/mån",
        cac: "2000 kr",
        churn: "5%/månad",
        scenario: "Base"
      },
      cap_table: {
        owners: "Anna 40%, Erik 40%, Option pool 20%",
        planned_rounds: "Seed Q3 2024",
        pro_forma: "Anna 30%, Erik 30%, Investerare 20%, Option pool 20%"
      },
      tech_ip: {
        patent_status: "Ansökan inlämnad",
        tech_stack: "React, Node.js, Python",
        unique_algorithms: "Egen AI-modell"
      },
      esg_impact: {
        kpi: "CO2 minskat med 10% per kund",
        sdg: "SDG 12: Hållbar konsumtion",
        industry_comparison: "Bättre än snittet"
      },
      exit_strategy: {
        exit_plan: "IPO 2027 eller förvärv av större aktör"
      }
    }
  };

  return (
    <div>
      <div className="mt-8 flex flex-col items-center">
        <div className="text-sm font-semibold text-[#16475b] mb-2">Testa olika nivåer:</div>
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setSubscriptionLevel('silver')}
            className={`px-3 py-1 rounded-full text-sm ${
              subscriptionLevel === 'silver'
                ? 'bg-[#16475b] text-white'
                : 'bg-[#eaf6fa] text-[#16475b]'
            }`}
          >
            Silver
          </button>
          <button
            onClick={() => setSubscriptionLevel('gold')}
            className={`px-3 py-1 rounded-full text-sm ${
              subscriptionLevel === 'gold'
                ? 'bg-[#16475b] text-white'
                : 'bg-[#eaf6fa] text-[#16475b]'
            }`}
          >
            Gold
          </button>
          <button
            onClick={() => setSubscriptionLevel('platinum')}
            className={`px-3 py-1 rounded-full text-sm ${
              subscriptionLevel === 'platinum'
                ? 'bg-[#16475b] text-white'
                : 'bg-[#eaf6fa] text-[#16475b]'
            }`}
          >
            Platinum
          </button>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        <BusinessPlanResult 
          score={testData.score}
          details={testData.details}
          answers={testData.answers}
          subscriptionLevel={subscriptionLevel}
        />
        <div className="space-y-6 mt-8">
          <Section title="Executive Summary & Demo" feedback={aiFeedback.executive_summary} />
          <Section title="Problem & Lösning" feedback={aiFeedback.problem_solution} />
          <Section title="Marknad (TAM/SAM/SOM)" feedback={aiFeedback.market} />
          <Section title="Affärsmodell & Prissättning" feedback={aiFeedback.business_model} />
          <Section title="Traction & Milestones" feedback={aiFeedback.traction} />
          <Section title="Team & Founders' DNA" feedback={aiFeedback.team} />
          <Section title="Kundcase/LOI" feedback={aiFeedback.customer_cases} />
          <Section title="Konkurrent-matris" feedback={aiFeedback.competition} />
          <Section title="Budget/Prognos" feedback={aiFeedback.budget} />
          <Section title="Cap Table & Dilution" feedback={aiFeedback.cap_table} />
          <Section title="Teknik/IP" feedback={aiFeedback.tech_ip} />
          <Section title="ESG/Impact" feedback={aiFeedback.esg} />
          <Section title="Exit/Övrigt" feedback={aiFeedback.exit} />
        </div>
      </div>
    </div>
  );
}

function Section({ title, feedback }: { title: string; feedback: string }) {
  return (
    <div className="bg-[#eaf6fa] rounded-2xl p-4 shadow border border-[#16475b]/20">
      <div className="font-bold text-[#16475b] mb-1">AI-feedback för {title}:</div>
      <div className="text-[#16475b] text-sm">{feedback}</div>
    </div>
  );
} 