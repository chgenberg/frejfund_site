export const premiumTestData = {
  score: 78,
  subscriptionLevel: 'premium',
  paymentSuccess: true,
  answers: {
    // Alla standard-svar (men mer utförliga)
    customer_problem: "Små och medelstora företag i Sverige har svårt att hitta rätt investerare och riskkapitalbolag. Processen är tidskrävande, otransparent och ofta misslyckas matchningen. Många företag spenderar månader på att kontakta fel investerare, medan investerare missar potentiellt intressanta investeringsmöjligheter. Enligt vår marknadsundersökning upplever 87% av startup-grundare att de slösar tid på fel investerare.",
    solution: "Vi har byggt en AI-driven matchmaking-plattform som automatiskt matchar företag med rätt investerare baserat på bransch, investeringsstadium, geografi och investeringskriterier. Plattformen använder machine learning för att kontinuerligt förbättra matchningarna och erbjuder en transparent process med tydlig kommunikation. Vår unika algoritm analyserar över 50 datapunkter för att säkerställa optimal matchning.",
    market_size: "Den svenska riskkapitalmarknaden är värd cirka 5 miljarder SEK årligen. Vår TAM (Total Addressable Market) är alla företag som söker kapital (cirka 5000 per år) och alla aktiva investerare (cirka 200). Med en genomsnittlig avgift på 50 000 SEK per matchning blir marknadsstorleken 250 MSEK. Marknaden växer med 15% årligen drivet av ökad digitalisering.",
    target_customer: "Primärt B2B SaaS-företag i seed/serie A-stadiet som söker 2-10 MSEK i finansiering. Sekundärt tech-bolag inom fintech, healthtech och cleantech. Våra kunder är vanligtvis 2-5 år gamla, har bevisad produktmarknadsanpassning och söker kapital för att accelerera tillväxten. Vi har identifierat 1200 potentiella kunder bara i Sverige.",
    competitors: "Det finns flera aktörer i marknaden:\n1. Traditionella rådgivare (höga kostnader, långsam process)\n2. Generella matchmaking-plattformar (låg kvalitet på matchningar)\n3. Branschspecifika nätverk (begränsad räckvidd)\n\nVår unika position är att vi kombinerar AI-teknologi med branschkunskap för att skapa högkvalitativa matchningar. Vi är 10x snabbare och 50% billigare än traditionella rådgivare.",
    revenue_model: "Vi använder en hybrid modell:\n1. Grundavgift: 25 000 SEK för att komma igång\n2. Success fee: 2% av investeringsbeloppet\n3. Premium-paket: 50 000 SEK för extra tjänster som pitch-coaching och due diligence-förberedelse\n4. Enterprise-avtal: 200 000 SEK/år för obegränsad användning",
    pricing: "Standardpaket: 25 000 SEK + 2% success fee\nPremium-paket: 50 000 SEK + 1.5% success fee\nEnterprise: Anpassad prissättning för större organisationer\nVi har testat prissättningen med 50 potentiella kunder och 78% anser det vara rimligt.",
    unit_economics: "CAC: 15 000 SEK\nLTV: 150 000 SEK\nPayback period: 6 månader\nChurn: <5% årligen\nGross margin: 85%\nContribution margin: 65%\nMRR growth: 20%",
    traction: "Sedan lanseringen för 6 månader sedan:\n- 50 aktiva företag på plattformen\n- 20 framgångsrika matchningar\n- 45 MSEK i totala investeringar\n- 20% månatlig tillväxt i antal företag\n- 4.8/5 i kundnöjdhet\n- 3 strategiska partnerskap med acceleratorer",
    team: "VD: Maria Andersson - Tidigare investerare med 10 års erfarenhet från riskkapitalbolag, lett investeringar på över 500 MSEK\nCTO: Johan Svensson - Tidigare tech lead från Spotify med expertis inom AI/ML, byggt skalbar teknik för 100M+ användare\nHead of Sales: Lisa Berg - 8 års erfarenhet från B2B SaaS-försäljning, byggt säljteam från 0-50 personer\n3 utvecklare med erfarenhet från tech-bolag\n2 business developers med nätverks inom VC-branschen",
    risks: "1. Marknadens mognad: Sverige är en relativt liten marknad - ÅTGÄRD: Expandera till Norden Q4 2024\n2. Teknisk risk: AI-matchningen måste vara extremt träffsäker - ÅTGÄRD: Kontinuerlig förbättring med ML\n3. Konkurrens: Större aktörer kan kopiera konceptet - ÅTGÄRD: Bygga starka nätverkseffekter\n4. Regulatorisk risk: Finansieringsbranschen är starkt reglerad - ÅTGÄRD: Juridisk rådgivare ombord",
    moat: "1. Proprietär AI-algoritm tränad på 1000+ historiska investeringar\n2. Nätverkseffekter: Ju fler användare, desto bättre matchningar\n3. Branschkunskap och relationer byggda över 10 år\n4. Patentansökan på matchningsalgoritmen\n5. Exklusiva avtal med top-tier VC:s",
    exit_strategy: "Primärt: Trade sale till större fintech-bolag eller investeringsbank inom 5-7 år vid 10x omsättning\nSekundärt: IPO om vi når 500 MSEK i årlig omsättning\nTertiary: Strategisk sammanslagning med kompletterande aktör\nPotentiell värdering vid exit: 1-2 miljarder SEK",
    exit_potential: "Potentiella köpare:\n1. Klarna - Vill expandera till B2B\n2. Nordea/SEB - Digitalisering av investment banking\n3. International players: Stripe, Square\n4. PE-bolag som EQT, Nordic Capital",
    runway: "18 månader med nuvarande burn rate på 800k SEK/månad",
    milestones: JSON.stringify([
      { milestone: "100 aktiva företag på plattformen", date: "Q2 2024" },
      { milestone: "50 MSEK i totala investeringar", date: "Q3 2024" },
      { milestone: "Expansion till Danmark och Norge", date: "Q4 2024" },
      { milestone: "Serie A funding 50 MSEK", date: "Q1 2025" },
      { milestone: "500 aktiva företag", date: "Q4 2025" }
    ]),
    capital_block: JSON.stringify({
      amount: "15",
      product: "40",
      sales: "35",
      team: "20",
      other: "5"
    }),
    founder_market_fit: JSON.stringify({
      score: 5,
      text: "VD har 10 års erfarenhet som investerare och känner marknaden väl. CTO kommer från Spotify med expertis inom AI/ML. Perfekt kombination av branschkunskap och teknisk kompetens. Teamet har tidigare byggt och sålt bolag tillsammans."
    }),
    // Premium-specifika fält
    financial_projections: JSON.stringify({
      year1: { revenue: 5000000, costs: 8000000, ebitda: -3000000, customers: 100 },
      year2: { revenue: 25000000, costs: 20000000, ebitda: 5000000, customers: 500 },
      year3: { revenue: 75000000, costs: 45000000, ebitda: 30000000, customers: 1500 }
    }),
    market_analysis: JSON.stringify({
      trends: ["AI-adoption ökar med 40% årligen", "VC-investeringar i Norden växer med 20% per år", "Digitalisering av finansbranschen accelererar"],
      opportunities: ["Expansion till hela Europa", "Partnerskap med banker", "AI-coaching för pitching"],
      threats: ["Ekonomisk recession kan minska investeringar", "Nya regleringar", "Tech-jättar som Google/Microsoft"]
    }),
    competitive_matrix: JSON.stringify({
      us: { price: 3, speed: 5, quality: 5, network: 3 },
      traditional: { price: 1, speed: 1, quality: 4, network: 5 },
      platforms: { price: 5, speed: 4, quality: 2, network: 2 }
    }),
    paymentSuccess: true,
    // Premium analys-sektioner flyttas till answers
    premiumAnalysis: {
      swot: {
        strengths: [
          "Stark teknisk plattform med skalbar arkitektur",
          "Erfaret team med branschkunskap",
          "Bevisad produktmarknadsanpassning",
          "Höga bruttomarginaler (85%)",
          "Starka partnerskap med acceleratorer"
        ],
        weaknesses: [
          "Begränsad geografisk närvaro (endast Sverige)",
          "Beroende av få stora kunder",
          "Relativt litet team för snabb expansion",
          "Begränsad marknadsföringsbudget"
        ],
        opportunities: [
          "Expansion till Norden och Europa",
          "AI-driven pitch-coaching som tillägstjänst",
          "Strategiska partnerskap med banker",
          "M&A-rådgivning som ny vertikal",
          "White-label lösning för större aktörer"
        ],
        threats: [
          "Ekonomisk nedgång påverkar investeringsviljan",
          "Större tech-bolag kan komma in i marknaden",
          "Regulatoriska förändringar",
          "Beroende av AI-teknologi som utvecklas snabbt"
        ]
      },
      detailedRecommendations: {
        immediate: [
          {
            action: "Säkra 5 ankarkunder inom Q1",
            why: "Skapar trovärdighet och case studies för försäljning",
            how: "Erbjud 50% rabatt mot testimonials och data",
            impact: "Ökar konvertering med 30%",
            resources: "Säljteam + VD",
            timeline: "4 veckor"
          },
          {
            action: "Implementera automatisk onboarding",
            why: "Minskar CAC och förbättrar skalbarhet",
            how: "Bygga self-service flow med AI-guidning",
            impact: "Reducerar onboarding-tid från 2h till 15min",
            resources: "Tech-team",
            timeline: "6 veckor"
          }
        ],
        shortTerm: [
          {
            action: "Lansera i Danmark och Norge",
            why: "Liknande marknad, låg entry barrier",
            how: "Lokala partnerskap och översättning",
            impact: "3x addressable market",
            resources: "200k SEK + 1 FTE",
            timeline: "Q3 2024"
          },
          {
            action: "Bygga ut AI-coaching modul",
            why: "Ökar LTV med 50%",
            how: "Utveckla MVP baserat på befintlig data",
            impact: "Extra 10k SEK per kund",
            resources: "Tech-team + extern AI-konsult",
            timeline: "Q4 2024"
          }
        ],
        longTerm: [
          {
            action: "Europeisk expansion",
            why: "10x större marknad",
            how: "Serie B funding + lokala team",
            impact: "500 MSEK ARR potential",
            resources: "50 MSEK funding",
            timeline: "2025-2026"
          }
        ]
      },
      investmentProposal: {
        askAmount: "15 MSEK",
        valuation: "60 MSEK pre-money",
        useOfFunds: {
          productDevelopment: "40% - AI-förbättringar, nya features",
          salesMarketing: "35% - Bygga säljteam, marknadsföring",
          teamExpansion: "20% - Nyckelrekryteringar",
          other: "5% - Legal, compliance, overhead"
        },
        keyMetrics: {
          currentMRR: "400k SEK",
          targetMRR12Months: "2M SEK",
          currentCustomers: 50,
          targetCustomers12Months: 200,
          burnRate: "800k SEK/månad",
          monthsRunway: 18
        },
        investorBenefits: [
          "Tidigt in i växande marknad",
          "Skalbar SaaS-modell med höga marginaler",
          "Erfaret team med tidigare exits",
          "Tydlig exit-strategi",
          "Möjlighet till follow-on investeringar"
        ]
      },
      benchmarkAnalysis: {
        industryComparison: {
          metric: "vs Industry Average",
          grossMargin: { us: "85%", industry: "70%", verdict: "Excellent" },
          cacPayback: { us: "6 months", industry: "14 months", verdict: "Top quartile" },
          growthRate: { us: "20% MoM", industry: "7% MoM", verdict: "Hypergrowth" },
          churnRate: { us: "5% annual", industry: "15% annual", verdict: "Best in class" }
        },
        peerComparison: [
          { company: "Similar US startup", funding: "$5M", revenue: "$2M ARR", valuation: "$25M" },
          { company: "UK competitor", funding: "£3M", revenue: "£1M ARR", valuation: "£15M" },
          { company: "German player", funding: "€4M", revenue: "€1.5M ARR", valuation: "€20M" }
        ]
      },
      riskMitigation: {
        identifiedRisks: [
          {
            risk: "Teknisk skalbarhet",
            probability: "Medium",
            impact: "High",
            mitigation: "Microservices arkitektur, AWS auto-scaling",
            status: "In progress"
          },
          {
            risk: "Kundkoncentration",
            probability: "High",
            impact: "Medium",
            mitigation: "Diversifiera kundbas, fokus på SMB",
            status: "Planned"
          },
          {
            risk: "Regulatorisk compliance",
            probability: "Low",
            impact: "High",
            mitigation: "Legal advisor, GDPR-certifiering",
            status: "Completed"
          }
        ]
      }
    }
  }
}; 