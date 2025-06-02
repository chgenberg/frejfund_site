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
      },
      investorFilm: {
        whyStatement: "Vi finns för att demokratisera tillgången till kapital. Vi tror att varje lovande företag förtjänar en chans att hitta rätt investerare, oavsett nätverk eller bakgrund. Vår drivkraft är att se innovativa idéer blomstra och skapa jobb och värde för samhället.",
        emotionalHook: "Tänk dig känslan när en entreprenör får sitt första 'ja' från en investerare. Den där magiska stunden när månader av hårt arbete, sömnlösa nätter och oändliga avslag äntligen leder till genombrott. Det är den känslan vi skapar - varje dag.",
        targetEmotion: "Hopp, möjlighet och förtroende. Vi vill att investerare ska känna spänningen av att upptäcka nästa unicorn, och att entreprenörer ska känna trygghet i att de presenterar sig för rätt personer.",
        soraPrompt: `Create a 30-second cinematic video with emotional storytelling:

OPENING (0-5s): Close-up of an entrepreneur's tired eyes looking at rejection emails, slowly zooming out to reveal a small, cluttered home office at night. Soft, melancholic piano music.

TRANSITION (5-10s): The screen lights up with our platform interface. The entrepreneur's face transforms from despair to curiosity. Music shifts to hopeful.

MIDDLE (10-20s): Split screen showing:
- Left: Entrepreneur refining their pitch with AI assistance
- Right: Investor receiving a perfectly matched opportunity notification
Both smile as they see the match score: 94%
Music builds with orchestral elements.

CLIMAX (20-25s): Virtual meeting room. Handshake moment. Deal terms appear. 
Text overlay: "15 million SEK investment secured"
Triumphant music crescendo.

CLOSING (25-30s): Montage of success stories - offices expanding, teams celebrating, products launching.
Logo reveal with tagline: "Where great ideas meet smart money"
Emotional voiceover: "Every unicorn started with a single believer. Let us find yours."

Style: Cinematic, warm color grading, mix of real footage feel with subtle tech elements. Focus on human emotions and connections rather than technology.`,
        scriptStructure: [
          {
            timeframe: "Öppning",
            duration: "0-5 sek",
            content: "Visa problemet - en entreprenör som får avslag efter avslag. Närbilder på trötta ögon, rejection emails, tom kaffekopp.",
            emotion: "Frustration, ensamhet"
          },
          {
            timeframe: "Vändpunkt",
            duration: "5-10 sek",
            content: "Vår plattform lyser upp skärmen. AI-matchning visar 94% compatibility med en investerare.",
            emotion: "Hopp, nyfikenhet"
          },
          {
            timeframe: "Transformation",
            duration: "10-20 sek",
            content: "Split screen: Entreprenör förbereder pitch med AI-hjälp. Investerare får notifikation om perfekt matchning.",
            emotion: "Spänning, förväntan"
          },
          {
            timeframe: "Klimax",
            duration: "20-25 sek",
            content: "Virtuellt möte. Handskakning. '15 MSEK investering säkrad' visas på skärmen.",
            emotion: "Glädje, lättnad, triumf"
          },
          {
            timeframe: "Avslutning",
            duration: "25-30 sek",
            content: "Montage av framgångssagor. Logo och tagline: 'Where great ideas meet smart money'",
            emotion: "Inspiration, möjlighet"
          }
        ],
        productionTips: {
          visual: [
            "Använd varma färger (guld, orange) för positiva känslor",
            "Kalla färger (blå, grå) för frustration i början",
            "Mjuk belysning för att skapa intimitet",
            "Närbilder på ansikten för emotionell koppling",
            "Clean, modern kontorsmiljöer som kontrast"
          ],
          audio: [
            "Starta med enkel pianomelodi (moll)",
            "Bygg gradvis med stråkar när hoppet växer",
            "Klimax med full orkester",
            "Använd tystnader för dramatisk effekt",
            "Autentiska ljud: tangentbord, notifikationer, skratt"
          ]
        },
        storyboard: [
          { shot: "Entreprenörens ansikte", icon: "😔", duration: "2 sek" },
          { shot: "Rejection emails", icon: "📧", duration: "3 sek" },
          { shot: "Platform interface", icon: "💻", duration: "3 sek" },
          { shot: "AI matching animation", icon: "🤖", duration: "4 sek" },
          { shot: "Split screen prep", icon: "👥", duration: "5 sek" },
          { shot: "Virtual meeting", icon: "🤝", duration: "3 sek" },
          { shot: "Deal celebration", icon: "🎉", duration: "5 sek" },
          { shot: "Success montage", icon: "🚀", duration: "3 sek" },
          { shot: "Logo & tagline", icon: "✨", duration: "2 sek" }
        ]
      },
      marketInsights: {
        marketSize: {
          current: "5 miljarder SEK",
          growth: "+18% årligen",
          projected: "12 miljarder SEK",
          source: "Källa: Gartner Market Analysis 2024, McKinsey Nordic Tech Report"
        },
        keyTrends: [
          {
            icon: "🤖",
            name: "AI-driven automatisering",
            description: "AI och ML transformerar investeringsprocessen. 75% av VC-bolag planerar att implementera AI-verktyg inom 2 år.",
            impact: "Hög",
            timeframe: "1-2 år"
          },
          {
            icon: "🌍",
            name: "Gränsöverskridande investeringar",
            description: "Nordiska startups attraherar allt mer internationellt kapital. 40% ökning av utländska investeringar sedan 2022.",
            impact: "Medium",
            timeframe: "2-3 år"
          },
          {
            icon: "🌱",
            name: "Impact investing",
            description: "ESG-kriterier blir standard. 60% av investerare kräver nu tydlig hållbarhetsprofil.",
            impact: "Hög",
            timeframe: "Pågående"
          },
          {
            icon: "💰",
            name: "Alternative funding",
            description: "Crowdfunding, revenue-based financing och tokenisering växer snabbt som komplement till traditionell VC.",
            impact: "Medium",
            timeframe: "3-5 år"
          }
        ],
        regulatory: [
          {
            name: "EU Startup Act",
            description: "Förenklar gränsöverskridande investeringar och ger skattelättnader för startup-investeringar",
            impact: "Positive"
          },
          {
            name: "GDPR & Data Protection",
            description: "Kräver robust datahantering men ökar också förtroende för digitala plattformar",
            impact: "Neutral"
          },
          {
            name: "MiFID III",
            description: "Ny finansregulering kan påverka hur investeringsrådgivning ges",
            impact: "Negative"
          }
        ],
        customerBehavior: [
          "78% föredrar digital första kontakt med investerare",
          "Genomsnittlig tid från första kontakt till avslut har minskat från 6 till 4 månader",
          "92% vill ha transparens kring investeringskriterier innan första mötet",
          "65% använder redan någon form av digital plattform i fundraising-processen"
        ],
        decisionMakers: [
          {
            role: "VD/Grundare",
            priority: "Snabbhet och rätt matchning viktigast"
          },
          {
            role: "CFO",
            priority: "Fokus på värdering och deal-termer"
          },
          {
            role: "Styrelse",
            priority: "Investerarens track record och nätverk"
          }
        ],
        competitiveLandscape: {
          leaders: [
            { name: "Traditional advisors", share: "35%" },
            { name: "Direct networking", share: "30%" },
            { name: "Digital platforms", share: "20%" },
            { name: "Others", share: "15%" }
          ],
          ourAdvantage: "Vi är den enda aktören som kombinerar AI-driven matchning med djup branschkunskap och ett kurerat nätverk av top-tier investerare. Vår teknologi är 10x snabbare än manuella processer och våra matchningar har 3x högre success rate än branschsnittet."
        }
      }
    }
  }
}; 