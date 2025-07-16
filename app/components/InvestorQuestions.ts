import { QuestionSection } from '../types/businessPlan';

export const INVESTOR_QUESTION_SECTIONS: QuestionSection[] = [
  {
    id: 'company_info',
    title: '1. Company Information',
    icon: '🏢',
    questions: [
      {
        id: 'company_name',
        label: "Company name",
        type: 'text',
        required: true,
        placeholder: 'Ex: TechStartup AB',
        help: 'The name of your company',
        exampleAnswers: ['NordicTech Solutions AB']
      },
      {
        id: 'contact_name',
        label: 'Your name',
        type: 'text',
        required: true,
        placeholder: 'Ex: Anna Andersson',
        help: 'Your full name',
        exampleAnswers: ['Maria Johansson']
      },
      {
        id: 'contact_email',
        label: 'Your email address',
        type: 'text',
        required: true,
        placeholder: 'Ex: anna@techstartup.se',
        help: 'Your company email address',
        exampleAnswers: ['maria@nordictech.se']
      },
      {
        id: 'has_website',
        label: 'Do you have a website?',
        type: 'select',
        required: true,
        options: ['Yes', 'No'],
        help: 'Select if your company has an active website',
        exampleAnswers: ['Yes']
      },
      {
        id: 'website_url',
        label: 'Company website (if yes above)',
        type: 'text',
        required: false,
        placeholder: 'Ex: https://www.techstartup.se',
        help: 'Only required if you have a website. We will analyze it automatically when you click "Next"',
        exampleAnswers: ['https://www.nordictech.se']
      }
    ]
  },
  {
    id: 'problem_market',
    title: '2.1 Problem & market demand',
    icon: '🎯',
    questions: [
      {
        id: 'customer_pain_points',
        label: 'What specific problems do you solve for your customers? Describe the pain points.',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the main problems...',
        help: 'Describe the concrete problems your customers experience',
        exampleAnswers: ['Many small e-commerce companies struggle with efficient inventory management. They often use Excel or manual systems, which leads to: 1) Over-ordering that ties up capital, 2) Stockouts on popular products, 3) 10-15 hours per week on manual administration']
      },
      {
        id: 'solution_description',
        label: 'How does your product/service solve these problems?',
        type: 'textarea',
        required: true,
        placeholder: 'Describe your solution...',
        help: 'Explain how your solution addresses the customer\'s problem',
        exampleAnswers: ['Our AI-based inventory management solution automates the entire process. It predicts demand based on historical data, weather, and trends. The system automatically orders when inventory levels are low and warns against over-ordering. This saves 80% of time and reduces inventory costs by 30%.']
      },
      {
        id: 'market_size_assessment',
        label: 'How large do you estimate your market segment to be? (number of potential customers)',
        type: 'number',
        required: true,
        placeholder: 'Ex: 10000',
        help: 'Estimate the number of potential customers in your target market',
        exampleAnswers: ['15000']
      },
      {
        id: 'tam_calculation',
        label: 'What is your TAM (Total Addressable Market) in SEK?',
        type: 'text',
        required: true,
        placeholder: 'Ex: 500 million SEK',
        help: 'Total market size if you had 100% market share',
        exampleAnswers: ['2.5 billion SEK']
      },
      {
        id: 'trigger_events',
        label: 'What events or situations cause customers to start looking for your type of solution?',
        type: 'textarea',
        required: true,
        placeholder: 'Describe what triggers purchase decisions...',
        help: 'What makes customers realize they need your solution?',
        exampleAnswers: ['1) When they miss sales due to stockouts, 2) After inventory counts when they discover over-orders worth 100k+, 3) When they expand to more sales channels and Excel is no longer sufficient, 4) When competitors have better delivery times']
      }
    ]
  },
  {
    id: 'solution_usp',
    title: '2.2 Solution & USP',
    icon: '💡',
    questions: [
      {
        id: 'elevator_pitch',
        label: 'Your "elevator pitch" in max 140 characters.',
        type: 'text',
        required: true,
        placeholder: 'We automate X for Y which saves Z hours/week',
        max: 140,
        help: 'Describe what you do in one sentence',
        exampleAnswers: ['We automate inventory management for e-commerce companies, saving 15h/week and reducing inventory costs by 30%']
      },
      {
        id: 'unique_tech',
        label: 'What is your unique technology/process window? 📄',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: Patented ML algorithm for predictive analysis, proprietary data model',
        help: 'Patent, algorithm, process etc.',
        exampleAnswers: ['Our patented ML algorithm analyzes 47 data points including weather, season, and social media trends. We have built a unique data model based on 5 years of transaction data from 500+ e-commerce companies, achieving 94% accuracy in demand forecasts.']
      },
      {
        id: 'copy_difficulty',
        label: 'How quickly can competitors copy your solution?',
        type: 'scale',
        required: true,
        help: '1 = Very easy to copy, 5 = Almost impossible',
        min: 1,
        max: 5,
        exampleAnswers: ['4 - Our data and algorithms take at least 2-3 years to replicate']
      }
    ]
  },
  {
    id: 'market_trends',
    title: '2.3 Market size & trends',
    icon: '📊',
    questions: [
      {
        id: 'market_size',
        label: 'TAM / SAM / SOM in EUR 🔢',
        type: 'multi_input',
        required: true,
        multiInputs: [
          { id: 'tam', label: 'TAM', type: 'number', placeholder: 'Ex: 5000000000' },
          { id: 'sam', label: 'SAM', type: 'number', placeholder: 'Ex: 500000000' },
          { id: 'som', label: 'SOM', type: 'number', placeholder: 'Ex: 50000000' },
          { id: 'sources', label: 'Sources', type: 'text', placeholder: 'Ex: Gartner 2024, Statista' }
        ],
        help: 'TAM = Total market, SAM = Your addressable market, SOM = Realistic market share',
        exampleAnswers: ['TAM: 5 billion EUR (entire e-commerce market for inventory management globally)', 'SAM: 500 million EUR (Nordic SMBs)', 'SOM: 50 million EUR (10% of SAM within 5 years)', 'Sources: Gartner E-commerce Report 2024, Statista Nordic E-commerce 2023']
      },
      {
        id: 'timing_trends',
        label: 'What macro or regulatory trends are right now?',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: GDPR requires compliance, AI boom drives demand',
        help: 'Explain why now is the right time for your solution',
        exampleAnswers: ['1) E-commerce grew 45% during the pandemic and continues +20%/year, 2) AI/ML has matured - the cost of predictive analysis has dropped 90% in 3 years, 3) New sustainability requirements (EU Green Deal) require optimized inventory to reduce shrinkage, 4) Shortage of warehouse workers drives automation']
      },
      {
        id: 'customer_segments',
        label: 'Describe the three most important customer segments and their purchase criteria.',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: 1) Enterprise (ROI>3x), 2) SMB (easy setup), 3) Startup (low cost)',
        help: 'Define your customer segments and what drives their purchase decisions',
        exampleAnswers: ['1) Medium-sized e-commerce companies (10-50M SEK turnover): Seeking ROI <12 months, easy integration with existing systems, 2) Fast-growing D2C brands: Need scalability, real-time data, multi-channel support, 3) Traditional retailers becoming digital: Require training, Swedish support, step-by-step implementation']
      },
      {
        id: 'competitor_growth',
        label: 'How fast are your main competitors growing? 📈',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: Competitor X: +200% ARR, Series B 50M EUR\nCompetitor Y: +150% customers, expanded to 5 countries',
        help: 'Specify funding, customers, revenue, or other growth indicators',
        exampleAnswers: ['InventoryAI (US): +180% ARR 2023, Series B $45M from Sequoia, 2000+ customers\nStockwise (UK): +220% users, expanded to Germany & France, £8M ARR\nNordic Inventory Solutions: +90% ARR, 400 customers in Nordic countries, rumored to be preparing for Series A']
      },
      {
        id: 'trigger_events',
        label: 'What trigger events drive customer purchase decisions right now?',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: GDPR fines, digital transformation post-COVID, shortage of developers',
        help: 'What makes customers act NOW instead of waiting?',
        exampleAnswers: ['1) Black Friday catastrophes where popular products run out = lost sales in millions, 2) Annual inventory counts show 20-30% dead stock = tied up capital, 3) Expansion into new markets where Excel is insufficient, 4) Competitors have 24-hour delivery while they have 3-5 days, 5) CFO requires 20% lower inventory costs']
      }
    ]
  },
  {
    id: 'competition_moat',
    title: '2.4 Competition & moat',
    icon: '🏰',
    questions: [
      {
        id: 'top_competitors',
        label: 'Top 3 competitors + your differentiator in one sentence.',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: CompetitorX - We have 10x faster implementation',
        help: 'List competitors and what makes you better',
        exampleAnswers: ['1) InventoryAI - They focus on enterprise, we offer the same AI power to SMB for 1/10 of the price\n2) Excel/manual - We automate completely and save 15h/week\n3) Stockwise - They require 3-month implementation, we are live in 2 days with our plug-and-play solution']
      },
      {
        id: 'defensibility',
        label: 'What is your moat/defensibility over time? ⚜️',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: Patent #xyz, data from 10k customers, network effects',
        help: 'What protects you from competition over the long term?',
        exampleAnswers: ['1) Proprietary data: 5 years of transaction data from 500+ e-commerce companies provide unique insights\n2) Network effects: Each new customer improves the AI model for everyone\n3) Patent pending on our predictive algorithm (SE2023/050234)\n4) Deep integrations with 15+ e-commerce platforms = high switching costs']
      },
      {
        id: 'ip_rights',
        label: 'Do you have patents, trademarks, or other IP? 📋',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: Patent pending for X, trademark registered in EU',
        help: 'List all intangible rights',
        exampleAnswers: ['1) Patent pending: "Method for predictive inventory optimization using ML" (SE2023/050234)\n2) Trademark: "StockGenius" registered in EU and USA\n3) Trade secrets: Proprietary data model and 47 unique features\n4) Copyright: All source code and algorithms']
      },
      {
        id: 'proprietary_data',
        label: 'Do you have unique/proprietary data that competitors lack?',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: Exclusive API agreement with X, historical data from Y',
        help: 'Describe data that gives you a competitive advantage',
        exampleAnswers: ['1) 5 years of detailed transaction data from 500+ e-commerce companies (with permission)\n2) Real-time integration with 8 major logistics companies for delivery data\n3) Weather data linked to purchase behavior for 200+ product categories\n4) Social media sentiment analysis for trend prediction']
      }
    ]
  },
  {
    id: 'gtm_growth',
    title: '2.5 Go-to-Market & growth strategy',
    icon: '🚀',
    questions: [
      {
        id: 'main_channels',
        label: 'Main channels and their % of pipeline 🔢',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: SEO (40%), Partner (35%), Field-sales (25%)',
        help: 'Which sales channels generate the most deals?',
        exampleAnswers: ['Inbound/Content (45%): SEO + webinars drive leads\nOutbound sales (30%): Focus on e-commerce companies 10-50M turnover\nPartners (20%): Integrations with Shopify, WooCommerce\nReferrals (5%): NPS 72, organic growth']
      },
      {
        id: 'sales_cycle',
        label: 'Average sales cycle (days) 🔢',
        type: 'number',
        required: true,
        placeholder: 'Ex: 45',
        min: 0,
        help: 'From first contact to close',
        exampleAnswers: ['32']
      },
      {
        id: 'gtm_experiments',
        label: 'Planned GTM experiments for the next 12 months (bullet list).',
        type: 'textarea',
        required: true,
        placeholder: 'Ex:\n• Product-led growth pilot Q2\n• Vertical-specific fintech campaign Q3\n• Partner program launch Q4',
        help: 'New ways to reach the market',
        exampleAnswers: ['• Q1: Freemium model for small e-commerce companies (<1M turnover)\n• Q2: AI chatbot for instant demo on the website\n• Q3: Vertical focus on fashion/beauty with industry-specific onboarding\n• Q4: Affiliate program with e-commerce consultants']
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
        label: 'MRR / ARR and annual growth 🔢',
        type: 'multi_input',
        required: true,
        multiInputs: [
          { id: 'mrr', label: 'MRR (EUR)', type: 'number', placeholder: 'Ex: 50000' },
          { id: 'arr', label: 'ARR (EUR)', type: 'number', placeholder: 'Ex: 600000' },
          { id: 'growth', label: 'Annual growth %', type: 'percentage', placeholder: 'Ex: 150' }
        ],
        help: 'Monthly and annual revenues and growth rate',
        exampleAnswers: ['MRR: 85,000 EUR', 'ARR: 1,020,000 EUR', 'Annual growth: 180%']
      },
      {
        id: 'user_kpis',
        label: 'Most important user KPIs 🔢',
        type: 'multi_input',
        required: true,
        multiInputs: [
          { id: 'dau', label: 'DAU', type: 'number', placeholder: 'Ex: 5000' },
          { id: 'mau', label: 'MAU', type: 'number', placeholder: 'Ex: 15000' },
          { id: 'retention_30', label: 'Retention day 30 (%)', type: 'percentage', placeholder: 'Ex: 85' }
        ]
      },
      {
        id: 'customer_case',
        label: 'Largest customer case with measurable ROI effect',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: Company X saved 2M EUR/year, ROI 450% in 6 months',
        help: 'Describe your most successful customer implementation',
        exampleAnswers: ['Nordic Fashion AB: Implemented our solution in November 2023. Results: 35% reduction in inventory value (freed up 4M SEK capital), 92% fewer stock-outs, 18h/week saved time. ROI: 320% in 4 months. They have now expanded from 1 to 5 warehouses with our solution.']
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
        label: 'Revenue streams (recurring vs one-time) 🔢',
        type: 'multi_input',
        required: true,
        multiInputs: [
          { id: 'recurring', label: 'Recurring %', type: 'percentage', placeholder: 'Ex: 85' },
          { id: 'onetime', label: 'One-time %', type: 'percentage', placeholder: 'Ex: 15' }
        ],
        help: 'Distribution between recurring and one-time revenues',
        exampleAnswers: ['Recurring: 90% (SaaS subscriptions)', 'One-time: 10% (implementation and training)']
      },
      {
        id: 'unit_economics',
        label: 'Unit economics 🔢',
        type: 'multi_input',
        required: true,
        multiInputs: [
          { id: 'cac', label: 'CAC (EUR)', type: 'number', placeholder: 'Ex: 1000' },
          { id: 'ltv', label: 'LTV (EUR)', type: 'number', placeholder: 'Ex: 5000' },
          { id: 'gross_margin', label: 'Gross margin %', type: 'percentage', placeholder: 'Ex: 75' },
          { id: 'payback', label: 'Payback (months)', type: 'number', placeholder: 'Ex: 12' }
        ],
        help: 'Key metrics for profitability per customer',
        exampleAnswers: ['CAC: 800 EUR (including sales costs and onboarding)', 'LTV: 12,000 EUR (average customer lifetime of 3 years)', 'Gross margin: 82%', 'Payback: 6 months']
      },
      {
        id: 'scale_impact',
        label: 'How does margin change with scale?',
        type: 'scale',
        required: true,
        help: '1 = No improvement, 5 = Exponential improvement',
        min: 1,
        max: 5,
        exampleAnswers: ['5 - Our AI models become better with more data, server costs per customer drop by 70% at 10x scale']
      }
    ]
  },
  {
    id: 'financial_status',
    title: '2.8 Financial status',
    icon: '📊',
    questions: [
      {
        id: 'burn_rate',
        label: 'Burn rate per month 🔢',
        type: 'number',
        required: true,
        placeholder: 'Ex: 50000',
        help: 'In EUR',
        exampleAnswers: ['45000']
      },
      {
        id: 'runway',
        label: 'Runway in months 🔢',
        type: 'number',
        required: true,
        placeholder: 'Ex: 18',
        min: 0,
        help: 'Months remaining with current burn rate',
        exampleAnswers: ['14']
      },
      {
        id: 'funding_history',
        label: 'Historical rounds: date, amount, post-money 🔢',
        type: 'textarea',
        required: false,
        placeholder: 'Ex: Seed 2023-01: 500K EUR @ 2M post\nSeries A 2024-06: 3M EUR @ 15M post',
        help: 'List previous funding rounds',
        exampleAnswers: ['Pre-seed 2022-06: 300K SEK @ 5M SEK pre (FFF)\nSeed 2023-03: 8M SEK @ 25M SEK post (Luminar Ventures lead)\nBridge 2023-11: 3M SEK convertible note (20% discount)']
      },
      {
        id: 'financial_risks',
        label: 'Important financial risks',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: USD exposure (30% of costs), dependency on 2 key suppliers'
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
        label: 'Relevant exits and experience of the founding team 📄',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: CEO: Exit 50M EUR fintech 2020, CTO: 15 years Google AI',
        help: 'Previous successes and relevant industry experience',
        exampleAnswers: ['CEO Maria: Founded and sold LogisticsNow for 35M SEK 2021, 8 years e-commerce\nCTO Johan: Tech lead at Spotify ML team 2015-2022, PhD in AI from KTH\nCOO Lisa: Operations Director at Zalando Nordics, scaled from 50 to 500 employees']
      },
      {
        id: 'team_complementarity',
        label: 'How do the competencies complement each other?',
        type: 'scale',
        required: true,
        help: '1 = Overlapping, 5 = Perfectly complementary',
        min: 1,
        max: 5,
        exampleAnswers: ['5 - CEO has deep industry knowledge & sales capability, CTO is technical expert, COO has scaled operations']
      },
      {
        id: 'founder_ownership',
        label: 'Founder ownership (post-money) 🔢',
        type: 'percentage',
        required: true,
        placeholder: 'Ex: 65',
        help: 'Founders\' total ownership after this round',
        exampleAnswers: ['68%']
      }
    ]
  },
  {
    id: 'culture_coachability',
    title: '2.10 Culture & coachability',
    icon: '🌱',
    questions: [
      {
        id: 'pivot_example',
        label: 'Example of the latest major pivot and lesson',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: Pivoted from B2C to B2B Q3 2023, lesson: enterprise has 10x higher LTV'
      },
      {
        id: 'advice_reception',
        label: 'How are external recommendations received?',
        type: 'scale',
        required: true,
        help: '1 = Defend, 5 = Embrace',
        min: 1,
        max: 5
      }
    ]
  },
  {
    id: 'risks_compliance',
    title: '2.11 Risks & compliance',
    icon: '⚖️',
    questions: [
      {
        id: 'legal_disputes',
        label: 'Active legal disputes?',
        type: 'select',
        required: true,
        options: ['No', 'Yes - describe below']
      },
      {
        id: 'regulatory_requirements',
        label: 'Regulatory requirements/licenses for the market?',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: GDPR compliant ✓, ISO27001 ongoing (Q2), Finansinspektionen license not required',
        help: 'List all regulatory requirements and your status',
        exampleAnswers: ['GDPR: Fully compliant since 2022, DPO appointed\nISO 27001: Certification ongoing, Q2 2024\nPCI DSS: Level 2 compliant (does not directly handle card data)\nSOC 2: Type 1 completed, Type 2 audit Q3 2024']
      },
      {
        id: 'top_risks',
        label: 'Top 3 risks you see and your mitigations plan',
        type: 'textarea',
        required: true,
        placeholder: 'Ex:\n1. Technical: Single point of failure → Multi-region Q2\n2. Market: New competitor → Accelerate enterprise features\n3. Team: Key person dependency → Knowledge sharing program',
        help: 'Identify key risks and how you manage them',
        exampleAnswers: ['1. Market: Amazon/Shopify launching their own solution → We focus on multi-platform and have deeper AI than they can build generically\n2. Technical: ML model requires a lot of data → Federated learning allows us to train on customer data without storing it\n3. Financial: Long sales cycle to enterprise → Building PLG model in parallel for faster revenue']
      },
      {
        id: 'technical_risks',
        label: 'Largest technical risks and mitigations plan',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: Scalability at 10x users → Microservices architecture ongoing\nDependency on 3rd party API → Building own backup solution',
        help: 'Focus on technical bottlenecks and single points of failure',
        exampleAnswers: ['1. Scalability: Current architecture handles 5x users. At 10x, sharding is needed → Implementing already (Q1)\n2. AI model drift: Expensive to run inference → Optimizing model, cost reduced by 60% in last 6 months\n3. Integrations: Dependency on e-commerce platform APIs → Built abstraction layer + fallback to screen scraping']
      },
      {
        id: 'key_dependency_risk',
        label: 'What happens if a key customer/partner disappears?',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: Largest customer = 30% of ARR → Actively diversify, max 15% per customer as target',
        help: 'Dependency risks and diversification plan',
        exampleAnswers: ['Largest customer is 18% of ARR (down from 35% for 6 months ago). Policy: no customer >15% from 2025. If Shopify integration breaks (25% of new customers come from there) we have WooCommerce and Magento ready. Largest partner accounts for 20% of leads - building 3 new partnerships Q1.']
      }
    ]
  },
  {
    id: 'exit_capital',
    title: '2.12 Exit & capital need',
    icon: '💸',
    questions: [
      {
        id: 'capital_needed',
        label: 'Capital sought now + runway/milestones 🔢',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: 5M EUR for 24 month runway\nMilestones: 10M ARR, 3 new markets, Series B-ready',
        help: 'How much you are seeking and what it will be used for',
        exampleAnswers: ['Sought: 25M SEK Series A\nRunway: 18-24 months\n\nMilestones:\n- Q2 2024: 2M EUR ARR (from 1M today)\n- Q4 2024: Launch in Germany & Denmark\n- Q2 2025: 50 enterprise customers (from 12 today)\n- Q4 2025: Series B ready at 5M EUR ARR']
      },
      {
        id: 'valuation_method',
        label: 'Expected valuation and method',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: 30M EUR pre-money based on 5x ARR multiple (industry standard SaaS)',
        help: 'How you arrived at your valuation',
        exampleAnswers: ['100M SEK pre-money\n\nBased on:\n- 10x ARR multiple (1M EUR ARR = 10M EUR)\n- Comparable companies: InventoryAI valued at 12x ARR at Series A\n- Premium for: 180% YoY growth, 82% gross margin, founding team with exit experience']
      },
      {
        id: 'exit_scenarios',
        label: 'Possible exit scenarios and timeline',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: Strategic acquisition 2027 (SAP, Salesforce), IPO 2029 at 100M ARR',
        help: 'Realistic exit possibilities',
        exampleAnswers: ['Primary: Strategic acquisition 2027-2028\nBuyer: Oracle NetSuite, SAP, Salesforce Commerce Cloud\nLogic: They need AI inventory for competitive advantage\n\nSecondary: PE exit to Vista/Thoma Bravo 2028\n\nIPO: Possible 2030 if we reach 100M EUR ARR']
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
        label: 'Upload your pitch deck for AI analysis (optional)',
        type: 'file',
        required: false,
        help: 'PDF, max 10MB. We analyze structure, design, and content',
        exampleAnswers: ['Upload a PDF file with your latest pitch deck']
      },
      {
        id: 'presentation_ability',
        label: 'Rate your ability to present/pitch',
        type: 'scale',
        required: true,
        help: '1 = Needs a lot of training, 5 = Natural presenter who captivates',
        min: 1,
        max: 5,
        exampleAnswers: ['4 - CEO has pitched 100+ times, won several pitch competitions']
      },
      {
        id: 'unique_story',
        label: 'What is your unique "founder story" that creates emotional connection?',
        type: 'textarea',
        required: true,
        placeholder: 'Ex: After my mom struggled with X for 10 years, I realized... / As a former employee at Y, I saw daily how...',
        help: 'The personal reason why YOU are building this',
        exampleAnswers: ['I ran an e-commerce business 2018-2021. Every Black Friday was a nightmare - either we were stuck with tons of unsold products or our best-sellers ran out by 10 AM. After losing over 2M SEK on poor inventory management, I decided to solve this problem for all e-commerce companies. My co-founder Johan had the same experience from his sports store.']
      }
    ]
  }
]; 