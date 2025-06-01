"use client";
import BusinessPlanResult from '../components/BusinessPlanResult';
import '../globals.css'; // Importera CSS direkt

export default function TestResultStandalonePage() {
  // Omfattande dummy data för test
  const dummyData = {
    score: 78,
    answers: {
      // Grundläggande information
      customer_problem: "Företag har svårt att hitta rätt investerare för sina projekt. Det tar för lång tid och är ineffektivt. Många startups spenderar månader på att pitcha till fel investerare som inte matchar deras bransch eller utvecklingsfas.",
      solution: "En AI-driven plattform som matchar företag med rätt investerare baserat på bransch, projekttyp, investeringsbehov och utvecklingsfas. Vår algoritm analyserar 50+ parametrar för perfekt matchning.",
      
      // Marknadsanalys
      market_size: "Sveriges investeringsmarknad är värd 50 miljarder SEK årligen. Vår TAM är 5 miljarder SEK (alla företag som söker kapital), SAM 1 miljard SEK (tech-startups), och vi siktar på en SOM på 200 miljoner SEK inom 3 år.",
      target_customer: "Tech-startups i tidigt skede (1-5 år) som söker investeringar mellan 2-10 MSEK. Primärt inom SaaS, AI och CleanTech. Sekundärt: Scale-ups som söker 10-50 MSEK i Series A/B.",
      competitors: "Huvudkonkurrenter är manuella matchningstjänster som Dealroom och PitchBook. Vi differentierar genom AI-driven matchning, lägre pris och svenskt fokus.",
      
      // Affärsmodell
      revenue_model: "SaaS-prenumeration med tre nivåer: Starter (2500 kr/mån), Growth (5000 kr/mån), Enterprise (10000 kr/mån). Success fee på 1-2% vid lyckad investering.",
      pricing: "Prissättning baserad på värde: vi sparar startups 100+ timmar och ökar chansen för framgångsrik investering med 3x. ROI för kunden är 10-20x på årsbasis.",
      unit_economics: "CAC: 15000 kr, LTV: 150000 kr, LTV/CAC ratio: 10x. Payback period: 6 månader. Gross margin: 85%. Churn rate: 3% monthly.",
      
      // Team & Traction
      team: "VD: Maria Andersson - 10 års erfarenhet från Klarna och EQT. CTO: Erik Johansson - tidigare tech lead på Spotify. COO: Lisa Chen - byggt 3 framgångsrika SaaS-startups. Advisory board inkluderar partners från Northzone och Creandum.",
      traction: "50 aktiva företag på plattformen, 10 genomförda investeringar totalt 85 MSEK. MRR: 175000 kr med 20% månatlig tillväxt. NPS: 72. 3 enterprise-kunder inkl. SUP46.",
      
      // Finansiell information
      runway: "18",
      risks: "Huvudrisker: 1) Beroende av investerarnas deltagande 2) Regulatoriska förändringar kring investeringsrådgivning 3) Ekonomisk nedgång minskar investeringsviljan",
      moat: "Vår AI-algoritm tränas på unik svensk data. Nätverkseffekter när fler investerare/startups ansluter. Exklusiva partnerskap med ledande acceleratorer.",
      
      // Exit & Milestones
      exit_strategy: "Trade sale till större fintech (Klarna, Tink) eller global M&A-plattform (Axial, Dealroom) inom 5-7 år. Målvärdering: 1-2 miljarder SEK.",
      exit_potential: "Potentiella köpare: Klarna (expanderar till B2B), Dealroom (vill in på nordisk marknad), PitchBook (konsoliderar europeisk marknad). Strategisk fit med alla tre.",
      
      // JSON-strukturerad data
      founder_market_fit: JSON.stringify({
        score: 4,
        text: "Teamet har djup erfarenhet från både tech och finans. VD har personligt nätverk med 50+ nordiska investerare. CTO har byggt skalbar AI på Spotify."
      }),
      milestones: JSON.stringify([
        { milestone: "MVP lansering", date: "Q1 2024" },
        { milestone: "100 betalande kunder", date: "Q3 2024" },
        { milestone: "Break-even", date: "Q4 2024" },
        { milestone: "Internationell expansion", date: "Q2 2025" },
        { milestone: "Series A (50 MSEK)", date: "Q3 2025" }
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