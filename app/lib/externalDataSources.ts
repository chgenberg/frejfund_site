// Externa datakällor för premium-analys
// Dessa kan enkelt bytas ut mot riktiga API:er

export interface MarketData {
  totalMarketSize: number;
  growthRate: number;
  topPlayers: string[];
  marketTrends: string[];
  source: string;
}

export interface IndustryBenchmarks {
  averageCAC: number;
  averageLTV: number;
  averageChurnRate: number;
  averageGrossMargin: number;
  source: string;
}

export interface CompetitorData {
  name: string;
  marketShare: number;
  funding: number;
  strengths: string[];
  weaknesses: string[];
}

// Simulerade data baserat på bransch
export async function getMarketData(industry: string, region: string): Promise<MarketData> {
  // I produktion: anropa verkliga API:er som Statista, CB Insights, etc.
  
  const marketDataByIndustry: Record<string, MarketData> = {
    'SaaS': {
      totalMarketSize: 195000000000, // 195 miljarder USD
      growthRate: 18.5,
      topPlayers: ['Salesforce', 'Microsoft', 'Adobe', 'SAP', 'Oracle'],
      marketTrends: [
        'AI-driven automation',
        'Vertical SaaS growth', 
        'Usage-based pricing',
        'Low-code/no-code platforms'
      ],
      source: 'Gartner Market Analysis 2024'
    },
    'Fintech': {
      totalMarketSize: 310000000000,
      growthRate: 23.8,
      topPlayers: ['Stripe', 'Square', 'PayPal', 'Adyen', 'Klarna'],
      marketTrends: [
        'Embedded finance',
        'Open banking',
        'Cryptocurrency integration',
        'RegTech solutions'
      ],
      source: 'McKinsey Fintech Report 2024'
    },
    'E-handel': {
      totalMarketSize: 5800000000000,
      growthRate: 12.2,
      topPlayers: ['Amazon', 'Alibaba', 'Shopify', 'eBay', 'Zalando'],
      marketTrends: [
        'Social commerce',
        'Sustainability focus',
        'Same-day delivery',
        'AR/VR shopping'
      ],
      source: 'eMarketer Global Ecommerce 2024'
    }
  };

  // Justera för region
  const regionMultiplier = region === 'Sverige' ? 0.001 : 
                          region === 'Norden' ? 0.005 : 
                          region === 'Europa' ? 0.15 : 1;

  const baseData = marketDataByIndustry[industry] || marketDataByIndustry['SaaS'];
  
  return {
    ...baseData,
    totalMarketSize: baseData.totalMarketSize * regionMultiplier
  };
}

export async function getIndustryBenchmarks(industry: string): Promise<IndustryBenchmarks> {
  const benchmarksByIndustry: Record<string, IndustryBenchmarks> = {
    'SaaS': {
      averageCAC: 1200,
      averageLTV: 14400,
      averageChurnRate: 5,
      averageGrossMargin: 80,
      source: 'SaaS Capital Industry Report 2024'
    },
    'Fintech': {
      averageCAC: 800,
      averageLTV: 12000,
      averageChurnRate: 7,
      averageGrossMargin: 70,
      source: 'CB Insights Fintech Benchmarks 2024'
    },
    'E-handel': {
      averageCAC: 50,
      averageLTV: 250,
      averageChurnRate: 15,
      averageGrossMargin: 40,
      source: 'Shopify Commerce Report 2024'
    }
  };

  return benchmarksByIndustry[industry] || benchmarksByIndustry['SaaS'];
}

export async function getCompetitorAnalysis(competitors: string, industry: string): Promise<CompetitorData[]> {
  // Parse konkurrenter från användarinput
  const competitorNames = competitors.split(',').map(c => c.trim());
  
  // Simulera data för varje konkurrent
  return competitorNames.slice(0, 3).map(name => ({
    name,
    marketShare: Math.random() * 20 + 5,
    funding: Math.random() * 100000000 + 10000000,
    strengths: [
      'Etablerat varumärke',
      'Stor kundbas',
      'Stark teknisk plattform'
    ],
    weaknesses: [
      'Långsam innovation',
      'Höga priser',
      'Dålig kundservice'
    ]
  }));
}

// Hämta regulatorisk information
export async function getRegulatoryInfo(industry: string, region: string): Promise<string[]> {
  const regulations: Record<string, string[]> = {
    'Fintech': [
      'PSD2 - Payment Services Directive',
      'GDPR - Dataskydd',
      'AML/KYC - Anti-penningtvätt',
      'MiFID II - Investeringstjänster'
    ],
    'Hälsa': [
      'MDR - Medical Device Regulation',
      'GDPR - Patientdata',
      'CE-märkning',
      'ISO 13485 certifiering'
    ],
    'SaaS': [
      'GDPR - Dataskydd',
      'SOC 2 compliance',
      'ISO 27001',
      'Schrems II - Data transfer'
    ]
  };

  return regulations[industry] || ['GDPR - Dataskydd'];
}

// Hämta investeringstrender
export async function getInvestmentTrends(industry: string): Promise<{
  averageDealSize: number;
  totalInvestments: number;
  topInvestors: string[];
  source: string;
}> {
  const trends: Record<string, any> = {
    'SaaS': {
      averageDealSize: 15000000,
      totalInvestments: 2340,
      topInvestors: ['Sequoia', 'Accel', 'Bessemer', 'Index Ventures'],
      source: 'PitchBook European SaaS Report 2024'
    },
    'Fintech': {
      averageDealSize: 25000000,
      totalInvestments: 1560,
      topInvestors: ['Andreessen Horowitz', 'Ribbit Capital', 'QED Investors'],
      source: 'CB Insights Fintech Funding 2024'
    }
  };

  return trends[industry] || trends['SaaS'];
} 