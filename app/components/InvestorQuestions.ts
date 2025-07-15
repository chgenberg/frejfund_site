import { QuestionSection } from '../types/businessPlan';

export const INVESTOR_QUESTION_SECTIONS: QuestionSection[] = [
  {
    id: 'problem_market',
    title: '2.1 Problem & marknadsbehov',
    icon: '🎯',
    questions: [
      {
        id: 'customer_pain',
        label: 'Beskriv kundens pain i en mening.',
        type: 'text',
        required: true,
        placeholder: 'Ex: SMB-företag slösar 40% av arbetstiden på manuell dataentry'
      },
      {
        id: 'problem_criticality',
        label: 'Hur mäter ni att problemet är kritiskt? 🔢',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: NPS-data visar -30, 67% churn pga detta problem',
        help: 'Ange konkreta mätpunkter som NPS-data, churn-orsaker etc.'
      },
      {
        id: 'existing_solutions',
        label: 'Vilka befintliga lösningar används idag och varför räcker de inte?',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: Excel (85%) - saknar automation, API:er (15%) - för komplexa'
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
        max: 140
      },
      {
        id: 'unique_tech',
        label: 'Vad är ert unika teknik-/process-skyltfönster? 📄',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: Patenterad ML-algoritm för prediktiv analys, proprietär datamodell',
        help: 'Patent, algoritm, process etc.'
      },
      {
        id: 'copy_difficulty',
        label: 'Hur snabbt kan konkurrenter kopiera er lösning?',
        type: 'scale',
        required: true,
        help: '1 = Mycket lätt att kopiera, 5 = Nästan omöjligt',
        min: 1,
        max: 5
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
        ]
      },
      {
        id: 'timing_trends',
        label: 'Vilka makro- eller regleringstrender gör timingen rätt just nu?',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: GDPR kräver compliance, AI-boom driver efterfrågan'
      },
      {
        id: 'customer_segments',
        label: 'Beskriv de tre viktigaste kundsegmenten och deras köpkriterier.',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: 1) Enterprise (ROI>3x), 2) SMB (enkel setup), 3) Startup (låg kostnad)'
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
        placeholder: 'Ex: 1) Competitor X - Vi har 10x snabbare processing\n2) Competitor Y - Vi kräver ingen integration'
      },
      {
        id: 'network_effects',
        label: 'Har ni nätverkseffekter, bytekostnad eller IP-skydd?',
        type: 'scale',
        required: true,
        help: '1 = Inga barriärer, 5 = Starka nätverkseffekter + höga bytekostnader',
        min: 1,
        max: 5
      },
      {
        id: 'analyst_reports',
        label: 'Länka till eventuella Gartner/analyst-rapporter som styrker positionen. 📄',
        type: 'text',
        required: false,
        placeholder: 'Ex: gartner.com/report/magic-quadrant-2024'
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
        placeholder: 'Ex: SEO (40%), Partner (35%), Field-sales (25%)'
      },
      {
        id: 'sales_cycle',
        label: 'Genomsnittlig försäljningscykel (dagar) 🔢',
        type: 'number',
        required: true,
        placeholder: 'Ex: 45',
        min: 0
      },
      {
        id: 'gtm_experiments',
        label: 'Planerade GTM-experiment kommande 12 mån (bullet list).',
        type: 'textarea',
        required: true,
        placeholder: 'Ex:\n• Product-led growth pilot Q2\n• Vertical-specifik kampanj fintech Q3\n• Partner program lansering Q4'
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
        ]
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
        placeholder: 'Ex: Företag X sparade 2M EUR/år, ROI 450% på 6 månader'
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
        ]
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
        ]
      },
      {
        id: 'scale_impact',
        label: 'Hur påverkas marginalen av skala?',
        type: 'scale',
        required: true,
        help: '1 = Ingen förbättring, 5 = Exponentiell förbättring',
        min: 1,
        max: 5
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
        help: 'I EUR'
      },
      {
        id: 'runway',
        label: 'Runway i månader 🔢',
        type: 'number',
        required: true,
        placeholder: 'Ex: 18',
        min: 0
      },
      {
        id: 'funding_history',
        label: 'Historiska rundor: datum, belopp, post-money 🔢',
        type: 'textarea',
        required: false,
        placeholder: 'Ex: Seed 2023-01: 500K EUR @ 2M post\nSeries A 2024-06: 3M EUR @ 15M post'
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
        placeholder: 'Ex: CEO: Exit 50M EUR fintech 2020, CTO: 15 år Google AI'
      },
      {
        id: 'team_complementarity',
        label: 'Hur kompletterar kompetenserna varandra?',
        type: 'scale',
        required: true,
        help: '1 = Överlappande, 5 = Perfekt kompletterande',
        min: 1,
        max: 5
      },
      {
        id: 'founder_ownership',
        label: 'Ägarandel (post-money) som stannar hos grundare 🔢',
        type: 'percentage',
        required: true,
        placeholder: 'Ex: 65'
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
        placeholder: 'Ex: GDPR-compliant ✓, ISO27001 pågår (Q2), Finansinspektionen-licens krävs ej'
      },
      {
        id: 'top_risks',
        label: 'Topp 3 riskfaktorer ni ser och er mitigationsplan',
        type: 'textarea',
        required: true,
        placeholder: 'Ex:\n1. Teknisk: Single point of failure → Multi-region Q2\n2. Marknad: Ny konkurrent → Accelerera enterprise-features\n3. Team: Key person dependency → Kunskapsdelning-program'
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
        placeholder: 'Ex: 5M EUR för 24 mån runway\nMilstolpar: 10M ARR, 3 nya marknader, Series B-ready'
      },
      {
        id: 'valuation_method',
        label: 'Förväntad värdering och metod',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: 30M EUR pre-money baserat på 5x ARR-multipel (branschstandard SaaS)'
      },
      {
        id: 'exit_scenarios',
        label: 'Tänkbara exit-scenarier och tidslinje',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: Strategic acquisition 2027 (SAP, Salesforce), IPO 2029 vid 100M ARR'
      }
    ]
  }
]; 