import { QuestionSection } from '../types/businessPlan';

export const INVESTOR_QUESTION_SECTIONS: QuestionSection[] = [
  {
    id: 'company_info',
    title: '1. Företagsinformation',
    icon: '🏢',
    questions: [
      {
        id: 'company_name',
        label: 'Företagets namn',
        type: 'text',
        required: true,
        placeholder: 'Ex: TechStartup AB',
        help: 'Namnet på ditt företag',
        exampleAnswers: ['NordicTech Solutions AB']
      },
      {
        id: 'contact_name',
        label: 'Ditt namn',
        type: 'text',
        required: true,
        placeholder: 'Ex: Anna Andersson',
        help: 'Ditt fullständiga namn',
        exampleAnswers: ['Maria Johansson']
      },
      {
        id: 'contact_email',
        label: 'Din e-postadress',
        type: 'text',
        required: true,
        placeholder: 'Ex: anna@techstartup.se',
        help: 'Din företags e-postadress',
        exampleAnswers: ['maria@nordictech.se']
      },
      {
        id: 'has_website',
        label: 'Har du en hemsida idag?',
        type: 'select',
        required: true,
        options: ['Ja', 'Nej'],
        help: 'Välj om ditt företag har en aktiv hemsida',
        exampleAnswers: ['Ja']
      },
      {
        id: 'website_url',
        label: 'Företagets hemsida',
        type: 'text',
        required: false,
        placeholder: 'Ex: https://www.techstartup.se',
        help: 'Vi kan analysera din hemsida för att förifyllla information',
        exampleAnswers: ['https://www.nordictech.se']
      }
    ]
  },
  {
    id: 'problem_market',
    title: '2.1 Problem & marknadsbehov',
    icon: '🎯',
    questions: [
      {
        id: 'customer_pain_points',
        label: 'Vilka specifika problem löser ni för era kunder? Beskriv smärtpunkterna.',
        type: 'textarea',
        required: true,
        placeholder: 'Beskriv de huvudsakliga problemen...',
        help: 'Beskriv de konkreta problem som era kunder upplever',
        exampleAnswers: ['Många små e-handelsföretag kämpar med att hantera lager effektivt. De använder ofta Excel eller manuella system vilket leder till: 1) Överbeställningar som binder kapital, 2) Slut i lager på populära produkter, 3) 10-15 timmar per vecka på manuell administration']
      },
      {
        id: 'solution_description',
        label: 'Hur löser er produkt/tjänst dessa problem?',
        type: 'textarea',
        required: true,
        placeholder: 'Beskriv er lösning...',
        help: 'Förklara hur er lösning adresserar kundens problem',
        exampleAnswers: ['Vår AI-baserade lagerhanteringslösning automatiserar hela processen. Den förutspår efterfrågan baserat på historisk data, väder och trender. Systemet beställer automatiskt när lagernivåer är låga och varnar för överbeställningar. Detta sparar 80% av tiden och minskar lagerkostnader med 30%.']
      },
      {
        id: 'market_size_assessment',
        label: 'Hur stort bedömer ni att ert marknadssegment är? (antal potentiella kunder)',
        type: 'number',
        required: true,
        placeholder: 'Ex: 10000',
        help: 'Uppskatta antalet potentiella kunder i er målmarknad',
        exampleAnswers: ['15000']
      },
      {
        id: 'tam_calculation',
        label: 'Vad är er TAM (Total Addressable Market) i SEK?',
        type: 'text',
        required: true,
        placeholder: 'Ex: 500 miljoner SEK',
        help: 'Total marknadsstorlek om ni hade 100% marknadsandel',
        exampleAnswers: ['2.5 miljarder SEK']
      },
      {
        id: 'trigger_events',
        label: 'Vilka händelser eller situationer får kunder att börja leta efter er typ av lösning?',
        type: 'textarea',
        required: true,
        placeholder: 'Beskriv vad som triggar köpbeslut...',
        help: 'Vad får kunder att inse att de behöver er lösning?',
        exampleAnswers: ['1) När de missar försäljning pga slut i lager, 2) Efter inventering när de upptäcker överbeställningar värda 100k+, 3) När de expanderar till fler säljkanaler och Excel inte räcker till, 4) När konkurrenter har bättre leveranstider']
      }
    ]
  },
  {
    id: 'solution_usp',
    title: '2.2 Lösning & USP',
    icon: '💡',
    questions: [
      {
        id: 'elevator_pitch',
        label: 'Er "elevator pitch" på max 140 tecken.',
        type: 'text',
        required: true,
        placeholder: 'Vi automatiserar X för Y vilket sparar Z timmar/vecka',
        max: 140,
        help: 'Beskriv vad ni gör i en mening',
        exampleAnswers: ['Vi automatiserar lagerhantering för e-handlare vilket sparar 15h/vecka och minskar lagerkostnader med 30%']
      },
      {
        id: 'unique_tech',
        label: 'Vad är ert unika teknik-/process-skyltfönster? 📄',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: Patenterad ML-algoritm för prediktiv analys, proprietär datamodell',
        help: 'Patent, algoritm, process etc.',
        exampleAnswers: ['Vår patenterade ML-algoritm analyserar 47 datapunkter inkl. väder, säsong och sociala medier-trender. Vi har byggt en unik datamodell baserad på 5 års transaktionsdata från 500+ e-handlare vilket ger 94% träffsäkerhet i efterfrågeprognoser.']
      },
      {
        id: 'copy_difficulty',
        label: 'Hur snabbt kan konkurrenter kopiera er lösning?',
        type: 'scale',
        required: true,
        help: '1 = Mycket lätt att kopiera, 5 = Nästan omöjligt',
        min: 1,
        max: 5,
        exampleAnswers: ['4 - Vår data och algoritmer tar minst 2-3 år att replikera']
      }
    ]
  },
  {
    id: 'market_trends',
    title: '2.3 Marknadsstorlek & trender',
    icon: '📊',
    questions: [
      {
        id: 'market_size',
        label: 'TAM / SAM / SOM i EUR 🔢',
        type: 'multi_input',
        required: true,
        multiInputs: [
          { id: 'tam', label: 'TAM', type: 'number', placeholder: 'Ex: 5000000000' },
          { id: 'sam', label: 'SAM', type: 'number', placeholder: 'Ex: 500000000' },
          { id: 'som', label: 'SOM', type: 'number', placeholder: 'Ex: 50000000' },
          { id: 'sources', label: 'Källor', type: 'text', placeholder: 'Ex: Gartner 2024, Statista' }
        ],
        help: 'TAM = Total marknad, SAM = Er adresserbara marknad, SOM = Realistisk marknadsandel',
        exampleAnswers: ['TAM: 5 miljarder EUR (hela e-handelsmarknaden för lagerhantering globalt)', 'SAM: 500 miljoner EUR (Nordiska SMB e-handlare)', 'SOM: 50 miljoner EUR (10% av SAM inom 5 år)', 'Källor: Gartner E-commerce Report 2024, Statista Nordic E-commerce 2023']
      },
      {
        id: 'timing_trends',
        label: 'Vilka makro- eller regleringstrender gör timingen rätt just nu?',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: GDPR kräver compliance, AI-boom driver efterfrågan',
        help: 'Förklara varför just nu är rätt tid för er lösning',
        exampleAnswers: ['1) E-handeln växte 45% under pandemin och fortsätter +20%/år, 2) AI/ML har mognat - kostnaden för prediktiv analys har sjunkit 90% på 3 år, 3) Nya hållbarhetskrav (EU Green Deal) kräver optimerat lager för att minska svinn, 4) Brist på lagerarbetare driver automation']
      },
      {
        id: 'customer_segments',
        label: 'Beskriv de tre viktigaste kundsegmenten och deras köpkriterier.',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: 1) Enterprise (ROI>3x), 2) SMB (enkel setup), 3) Startup (låg kostnad)',
        help: 'Definiera era kundsegment och vad som driver deras köpbeslut',
        exampleAnswers: ['1) Medelstora e-handlare (10-50M SEK omsättning): Söker ROI <12 månader, enkel integration med befintliga system, 2) Snabbväxande D2C brands: Behöver skalbarhet, realtidsdata, multi-channel support, 3) Traditionella retailers som digitaliseras: Kräver utbildning, support på svenska, stegvis implementation']
      },
      {
        id: 'competitor_growth',
        label: 'Hur snabbt växer era huvudkonkurrenter? 📈',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: Competitor X: +200% ARR, Series B 50M EUR\nCompetitor Y: +150% kunder, expanderat till 5 länder',
        help: 'Ange funding, kunder, revenue eller andra tillväxtindikatorer',
        exampleAnswers: ['InventoryAI (US): +180% ARR 2023, Series B $45M från Sequoia, 2000+ kunder\nStockwise (UK): +220% användare, expanderat till Tyskland & Frankrike, £8M ARR\nNordic Inventory Solutions: +90% ARR, 400 kunder i Norden, sägs förbereda Series A']
      },
      {
        id: 'trigger_events',
        label: 'Vilka trigger events driver kundernas köpbeslut just nu?',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: GDPR-böter, digital transformation post-COVID, brist på utvecklare',
        help: 'Vad får kunder att agera NU istället för att vänta?',
        exampleAnswers: ['1) Black Friday-katastrofer där populära produkter tar slut = förlorad försäljning på miljoner, 2) Årlig inventering visar 20-30% dödlager = bundet kapital, 3) Expansion till nya marknader där Excel inte räcker, 4) Konkurrenter har 24h leverans medan de har 3-5 dagar, 5) CFO kräver 20% lägre lagerkostnader']
      }
    ]
  },
  {
    id: 'competition_moat',
    title: '2.4 Konkurrens & moat',
    icon: '🏰',
    questions: [
      {
        id: 'top_competitors',
        label: 'Topp 3 konkurrenter + er differentiator i en mening var.',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: CompetitorX - Vi har 10x snabbare implementation',
        help: 'Lista konkurrenter och vad som gör er bättre',
        exampleAnswers: ['1) InventoryAI - De fokuserar på enterprise, vi erbjuder samma AI-kraft till SMB för 1/10 av priset\n2) Excel/manuellt - Vi automatiserar helt och sparar 15h/vecka\n3) Stockwise - De kräver 3 månaders implementation, vi är igång på 2 dagar med vår plug-and-play lösning']
      },
      {
        id: 'defensibility',
        label: 'Vad är er moat/defensibility över tid? ⚜️',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: Patent #xyz, data från 10k kunder, nätverkseffekter',
        help: 'Vad skyddar er från konkurrens på sikt?',
        exampleAnswers: ['1) Proprietär data: 5 års transaktionsdata från 500+ e-handlare ger unika insikter\n2) Nätverkseffekter: Varje ny kund förbättrar AI-modellen för alla\n3) Patent pending på vår prediktiva algoritm (SE2023/050234)\n4) Djupa integrationer med 15+ e-handelsplattformar = höga byteskostnader']
      },
      {
        id: 'ip_rights',
        label: 'Har ni patent, varumärkesskydd eller annan IP? 📋',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: Patent ansökt för X, varumärke registrerat i EU',
        help: 'Lista alla immateriella rättigheter',
        exampleAnswers: ['1) Patent pending: "Method for predictive inventory optimization using ML" (SE2023/050234)\n2) Varumärke: "StockGenius" registrerat i EU och USA\n3) Trade secrets: Proprietär datamodell och 47 unika features\n4) Copyright: All källkod och algoritmer']
      },
      {
        id: 'proprietary_data',
        label: 'Har ni tillgång till unik/proprietär data som konkurrenter saknar?',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: Exklusivt API-avtal med X, historisk data från Y',
        help: 'Beskriv data som ger er konkurrensfördel',
        exampleAnswers: ['1) 5 års detaljerad transaktionsdata från 500+ e-handlare (med tillstånd)\n2) Realtids-integration med 8 stora logistikföretag för leveransdata\n3) Väderdata kopplat till köpbeteende för 200+ produktkategorier\n4) Sociala medier sentiment-analys för trendprediktion']
      }
    ]
  },
  {
    id: 'gtm_growth',
    title: '2.5 Go-to-Market & tillväxtstrategi',
    icon: '🚀',
    questions: [
      {
        id: 'main_channels',
        label: 'Huvudkanaler och deras % av pipeline 🔢',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: SEO (40%), Partner (35%), Field-sales (25%)',
        help: 'Vilka säljkanaler genererar mest affärer?',
        exampleAnswers: ['Inbound/Content (45%): SEO + webinars driver leads\nOutbound sales (30%): Fokus på e-handlare 10-50M omsättning\nPartners (20%): Integrationer med Shopify, WooCommerce\nReferrals (5%): NPS 72, organisk tillväxt']
      },
      {
        id: 'sales_cycle',
        label: 'Genomsnittlig försäljningscykel (dagar) 🔢',
        type: 'number',
        required: true,
        placeholder: 'Ex: 45',
        min: 0,
        help: 'Från första kontakt till avslut',
        exampleAnswers: ['32']
      },
      {
        id: 'gtm_experiments',
        label: 'Planerade GTM-experiment kommande 12 mån (bullet list).',
        type: 'textarea',
        required: true,
        placeholder: 'Ex:\n• Product-led growth pilot Q2\n• Vertical-specifik kampanj fintech Q3\n• Partner program lansering Q4',
        help: 'Nya sätt att nå marknaden',
        exampleAnswers: ['• Q1: Freemium-modell för små e-handlare (<1M omsättning)\n• Q2: AI-chatbot för instant demo på hemsidan\n• Q3: Vertikalfokus på fashion/beauty med branschanpassad onboarding\n• Q4: Affiliate program med e-handelskonsulter']
      }
    ]
  },
  {
    id: 'traction_proof',
    title: '2.6 Traction & proof-points',
    icon: '📈',
    questions: [
      {
        id: 'mrr_arr',
        label: 'MRR / ARR och årlig tillväxt 🔢',
        type: 'multi_input',
        required: true,
        multiInputs: [
          { id: 'mrr', label: 'MRR (EUR)', type: 'number', placeholder: 'Ex: 50000' },
          { id: 'arr', label: 'ARR (EUR)', type: 'number', placeholder: 'Ex: 600000' },
          { id: 'growth', label: 'Årlig tillväxt %', type: 'percentage', placeholder: 'Ex: 150' }
        ],
        help: 'Månads- och årsintäkter samt tillväxttakt',
        exampleAnswers: ['MRR: 85,000 EUR', 'ARR: 1,020,000 EUR', 'Årlig tillväxt: 180%']
      },
      {
        id: 'user_kpis',
        label: 'Viktigaste användar-KPI:er 🔢',
        type: 'multi_input',
        required: true,
        multiInputs: [
          { id: 'dau', label: 'DAU', type: 'number', placeholder: 'Ex: 5000' },
          { id: 'mau', label: 'MAU', type: 'number', placeholder: 'Ex: 15000' },
          { id: 'retention_30', label: 'Retention dag 30 (%)', type: 'percentage', placeholder: 'Ex: 85' }
        ]
      },
      {
        id: 'customer_case',
        label: 'Största kundcase med mätbar ROI-effekt',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: Företag X sparade 2M EUR/år, ROI 450% på 6 månader',
        help: 'Beskriv er mest framgångsrika kundimplementation',
        exampleAnswers: ['Nordic Fashion AB: Implementerade vår lösning i nov 2023. Resultat: 35% minskning av lagervärde (frigorde 4M SEK kapital), 92% färre stock-outs, 18h/vecka sparad tid. ROI: 320% på 4 månader. De har nu expanderat från 1 till 5 lager med vår lösning.']
      }
    ]
  },
  {
    id: 'business_model',
    title: '2.7 Business model & unit economics',
    icon: '💰',
    questions: [
      {
        id: 'revenue_streams',
        label: 'Intäktsströmmar (återkommande vs engång) 🔢',
        type: 'multi_input',
        required: true,
        multiInputs: [
          { id: 'recurring', label: 'Återkommande %', type: 'percentage', placeholder: 'Ex: 85' },
          { id: 'onetime', label: 'Engång %', type: 'percentage', placeholder: 'Ex: 15' }
        ],
        help: 'Fördelning mellan återkommande och engångsintäkter',
        exampleAnswers: ['Återkommande: 90% (SaaS-prenumerationer)', 'Engång: 10% (implementation och utbildning)']
      },
      {
        id: 'unit_economics',
        label: 'Unit economics 🔢',
        type: 'multi_input',
        required: true,
        multiInputs: [
          { id: 'cac', label: 'CAC (EUR)', type: 'number', placeholder: 'Ex: 1000' },
          { id: 'ltv', label: 'LTV (EUR)', type: 'number', placeholder: 'Ex: 5000' },
          { id: 'gross_margin', label: 'Bruttomarginal %', type: 'percentage', placeholder: 'Ex: 75' },
          { id: 'payback', label: 'Payback (månader)', type: 'number', placeholder: 'Ex: 12' }
        ],
        help: 'Nyckeltal för lönsamhet per kund',
        exampleAnswers: ['CAC: 800 EUR (inkl. säljkostnad och onboarding)', 'LTV: 12,000 EUR (3 års genomsnittlig kundlivslängd)', 'Bruttomarginal: 82%', 'Payback: 6 månader']
      },
      {
        id: 'scale_impact',
        label: 'Hur påverkas marginalen av skala?',
        type: 'scale',
        required: true,
        help: '1 = Ingen förbättring, 5 = Exponentiell förbättring',
        min: 1,
        max: 5,
        exampleAnswers: ['5 - Våra AI-modeller blir bättre med mer data, serverkostand per kund sjunker 70% vid 10x skala']
      }
    ]
  },
  {
    id: 'financial_status',
    title: '2.8 Finansiellt läge',
    icon: '📊',
    questions: [
      {
        id: 'burn_rate',
        label: 'Burn rate per månad 🔢',
        type: 'number',
        required: true,
        placeholder: 'Ex: 50000',
        help: 'I EUR',
        exampleAnswers: ['45000']
      },
      {
        id: 'runway',
        label: 'Runway i månader 🔢',
        type: 'number',
        required: true,
        placeholder: 'Ex: 18',
        min: 0,
        help: 'Månader kvar med nuvarande burn rate',
        exampleAnswers: ['14']
      },
      {
        id: 'funding_history',
        label: 'Historiska rundor: datum, belopp, post-money 🔢',
        type: 'textarea',
        required: false,
        placeholder: 'Ex: Seed 2023-01: 500K EUR @ 2M post\nSeries A 2024-06: 3M EUR @ 15M post',
        help: 'Lista tidigare investeringsrundor',
        exampleAnswers: ['Pre-seed 2022-06: 300K SEK @ 5M SEK pre (FFF)\nSeed 2023-03: 8M SEK @ 25M SEK post (Luminar Ventures lead)\nBridge 2023-11: 3M SEK convertible note (20% rabatt)']
      },
      {
        id: 'financial_risks',
        label: 'Viktiga finansiella risker',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: USD-exponering (30% av kostnader), beroende av 2 nyckelleverantörer'
      }
    ]
  },
  {
    id: 'team_governance',
    title: '2.9 Team & governance',
    icon: '👥',
    questions: [
      {
        id: 'founder_experience',
        label: 'Grundarteamets relevanta exits / erfarenheter 📄',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: CEO: Exit 50M EUR fintech 2020, CTO: 15 år Google AI',
        help: 'Tidigare framgångar och relevant branscherfarenhet',
        exampleAnswers: ['CEO Maria: Grundade och sålde LogisticsNow för 35M SEK 2021, 8 år e-handel\nCTO Johan: Tech lead på Spotify ML-team 2015-2022, PhD i AI från KTH\nCOO Lisa: Operations Director på Zalando Nordics, skalade från 50 till 500 anställda']
      },
      {
        id: 'team_complementarity',
        label: 'Hur kompletterar kompetenserna varandra?',
        type: 'scale',
        required: true,
        help: '1 = Överlappande, 5 = Perfekt kompletterande',
        min: 1,
        max: 5,
        exampleAnswers: ['5 - CEO har djup branschkunskap & säljförmåga, CTO är teknisk expert, COO har skalat operations']
      },
      {
        id: 'founder_ownership',
        label: 'Ägarandel (post-money) som stannar hos grundare 🔢',
        type: 'percentage',
        required: true,
        placeholder: 'Ex: 65',
        help: 'Grundarnas totala ägarandel efter denna rundan',
        exampleAnswers: ['68%']
      }
    ]
  },
  {
    id: 'culture_coachability',
    title: '2.10 Kultur & coachability',
    icon: '🌱',
    questions: [
      {
        id: 'pivot_example',
        label: 'Exempel på senaste större pivot och lärdom',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: Pivoterade från B2C till B2B Q3 2023, lärdom: enterprise har 10x högre LTV'
      },
      {
        id: 'advice_reception',
        label: 'Hur tas externa råd emot?',
        type: 'scale',
        required: true,
        help: '1 = Försvar, 5 = Embrace',
        min: 1,
        max: 5
      }
    ]
  },
  {
    id: 'risks_compliance',
    title: '2.11 Risker & compliance',
    icon: '⚖️',
    questions: [
      {
        id: 'legal_disputes',
        label: 'Pågående legala tvister?',
        type: 'select',
        required: true,
        options: ['Nej', 'Ja - beskriv nedan']
      },
      {
        id: 'regulatory_requirements',
        label: 'Regulatoriska krav/licenser för marknaden?',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: GDPR-compliant ✓, ISO27001 pågår (Q2), Finansinspektionen-licens krävs ej',
        help: 'Lista alla regulatoriska krav och er status',
        exampleAnswers: ['GDPR: Fullt compliant sedan 2022, DPO utsedd\nISO 27001: Certifiering pågår, klar Q2 2024\nPCI DSS: Level 2 compliant (hanterar ej kortdata direkt)\nSOC 2: Type 1 klar, Type 2 audit Q3 2024']
      },
      {
        id: 'top_risks',
        label: 'Topp 3 riskfaktorer ni ser och er mitigationsplan',
        type: 'textarea',
        required: true,
        placeholder: 'Ex:\n1. Teknisk: Single point of failure → Multi-region Q2\n2. Marknad: Ny konkurrent → Accelerera enterprise-features\n3. Team: Key person dependency → Kunskapsdelning-program',
        help: 'Identifiera huvudrisker och hur ni hanterar dem',
        exampleAnswers: ['1. Marknad: Amazon/Shopify lanserar egen lösning → Vi fokuserar på multi-platform och har djupare AI än de kan bygga generiskt\n2. Teknisk: ML-modellen kräver mycket data → Federerad learning gör att vi kan träna på kunddata utan att lagra den\n3. Finansiell: Lång säljcykel till enterprise → Bygger PLG-modell parallellt för snabbare intäkter']
      },
      {
        id: 'technical_risks',
        label: 'Största tekniska risker och mitigationsplan',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: Skalbarhet vid 10x användare → Microservices arkitektur pågår\nBeroende av 3rd party API → Bygger egen backup-lösning',
        help: 'Fokusera på tekniska flaskhalsar och single points of failure',
        exampleAnswers: ['1. Skalbarhet: Nuvarande arkitektur klarar 5x användare. Vid 10x behövs sharding → Implementerar redan nu (Q1)\n2. AI-modell drift: Dyrt att köra inference → Optimerar modell, minskat kostnad 60% senaste 6 mån\n3. Integrationer: Beroende av e-handelsplattformars API:er → Byggt abstraktionslager + fallback till screen scraping']
      },
      {
        id: 'key_dependency_risk',
        label: 'Vad händer om nyckelkund/partner försvinner?',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: Största kund = 30% av ARR → Diversifierar aktivt, max 15% per kund som mål',
        help: 'Beroenderisker och diversifieringsplan',
        exampleAnswers: ['Största kund är 18% av ARR (ned från 35% för 6 mån sedan). Policy: ingen kund >15% från 2025. Om Shopify-integration bryts (25% av nya kunder kommer därifrån) har vi WooCommerce och Magento redo. Största partner står för 20% av leads - bygger 3 nya partnerskap Q1.']
      }
    ]
  },
  {
    id: 'exit_capital',
    title: '2.12 Exit & kapitalbehov',
    icon: '💸',
    questions: [
      {
        id: 'capital_needed',
        label: 'Kapital som söks nu + runway/milstolpar 🔢',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: 5M EUR för 24 mån runway\nMilstolpar: 10M ARR, 3 nya marknader, Series B-ready',
        help: 'Hur mycket ni söker och vad det ska användas till',
        exampleAnswers: ['Söker: 25M SEK Series A\nRunway: 18-24 månader\n\nMilstolpar:\n- Q2 2024: 2M EUR ARR (från 1M idag)\n- Q4 2024: Lansering i Tyskland & Danmark\n- Q2 2025: 50 enterprise-kunder (från 12 idag)\n- Q4 2025: Series B ready vid 5M EUR ARR']
      },
      {
        id: 'valuation_method',
        label: 'Förväntad värdering och metod',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: 30M EUR pre-money baserat på 5x ARR-multipel (branschstandard SaaS)',
        help: 'Hur ni kommit fram till er värdering',
        exampleAnswers: ['100M SEK pre-money\n\nBaserat på:\n- 10x ARR multipel (1M EUR ARR = 10M EUR)\n- Jämförbara bolag: InventoryAI värderat till 12x ARR vid Series A\n- Premium för: 180% YoY tillväxt, 82% bruttomarginal, grundarteam med exit-erfarenhet']
      },
      {
        id: 'exit_scenarios',
        label: 'Tänkbara exit-scenarier och tidslinje',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: Strategic acquisition 2027 (SAP, Salesforce), IPO 2029 vid 100M ARR',
        help: 'Realistiska exit-möjligheter',
        exampleAnswers: ['Primär: Strategic acquisition 2027-2028\nKöpare: Oracle NetSuite, SAP, Salesforce Commerce Cloud\nLogik: De behöver AI-lager för att konkurrera\n\nSekundär: PE-exit till Vista/Thoma Bravo 2028\n\nIPO: Möjligt 2030 om vi når 100M EUR ARR']
      }
    ]
  },
  {
    id: 'storytelling_pitch',
    title: '2.13 Storytelling & Pitch',
    icon: '🎭',
    questions: [
      {
        id: 'pitch_deck_upload',
        label: 'Ladda upp er pitch deck för AI-analys (valfritt)',
        type: 'file',
        required: false,
        help: 'PDF, max 10MB. Vi analyserar struktur, design och innehåll',
        exampleAnswers: ['Ladda upp en PDF-fil med er senaste pitch deck']
      },
      {
        id: 'presentation_ability',
        label: 'Betygsätt er förmåga att presentera/pitcha',
        type: 'scale',
        required: true,
        help: '1 = Behöver mycket träning, 5 = Naturlig talare som fängslar',
        min: 1,
        max: 5,
        exampleAnswers: ['4 - CEO har pitchat 100+ gånger, vunnit flera pitch-tävlingar']
      },
      {
        id: 'unique_story',
        label: 'Vad är er unika "founder story" som skapar emotionell koppling?',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: Efter att min mamma kämpade med X i 10 år insåg jag att... / Som tidigare anställd på Y såg jag dagligen hur...',
        help: 'Den personliga anledningen till varför just DU bygger detta',
        exampleAnswers: ['Jag drev själv en e-handel 2018-2021. Varje Black Friday var en mardröm - antingen satt vi med tonnvis av osålda produkter eller så tog våra bästsäljare slut kl 10. Efter att ha förlorat över 2M SEK på dålig lagerhantering bestämde jag mig för att lösa detta problem för alla e-handlare. Min medgrundare Johan hade samma erfarenhet från sin sportbutik.']
      }
    ]
  }
]; 