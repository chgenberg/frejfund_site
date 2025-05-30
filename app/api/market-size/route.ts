import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { bransch } = await request.json();
    
    // Simulera marknadsanalys med realistisk data
    const marketData = {
      'SaaS': {
        tam: 'TAM Sverige: 15 miljarder kr (företagsapplikationer)',
        sam: 'SAM SMB-segment: 4,5 miljarder kr (företag 5-250 anställda)',  
        som: 'SOM automation: 900 MSEK (5% marknadsandel över 5 år)',
        growth: 'Tillväxt: 12% årligen',
        source: 'Källor: IDC Nordic Software Market 2024, Tillväxtverket'
      },
      'Tech': {
        tam: 'TAM Sverige: 25 miljarder kr (hela tech-sektorn)',
        sam: 'SAM relevanta segment: 8 miljarder kr',
        som: 'SOM potentiell marknad: 400 MSEK',
        growth: 'Tillväxt: 8% årligen',
        source: 'Källor: Svensk Industri, Business Sweden'
      },
      'Fintech': {
        tam: 'TAM Norden: 12 miljarder kr (finansiella tjänster)',
        sam: 'SAM digital betalningar: 3,2 miljarder kr',
        som: 'SOM nischmarknad: 160 MSEK',
        growth: 'Tillväxt: 15% årligen',
        source: 'Källor: Fintech Sweden, McKinsey Nordic Fintech'
      }
    };

    const data = marketData[bransch as keyof typeof marketData] || {
      tam: `TAM ${bransch}: Uppskattas till 5-20 miljarder kr beroende på segment`,
      sam: 'SAM: Specifik analys krävs för er nisch',
      som: 'SOM: Realistisk målmarknad 100-500 MSEK inom 5 år',
      growth: 'Tillväxt: Varierar mellan branscher, genomsnitt 5-10%',
      source: 'Rekommendation: Genomför djupare marknadsanalys med branschspecialist'
    };

    const result = `${data.tam}\n${data.sam}\n${data.som}\n\n${data.growth}\n\n${data.source}`;

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error generating market size:', error);
    return NextResponse.json({ error: 'Kunde inte generera marknadsdata' }, { status: 500 });
  }
} 