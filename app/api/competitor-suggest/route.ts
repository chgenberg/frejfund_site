import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { bransch } = await request.json();
    
    // Simulera konkurrentanalys med realistiska företag
    const competitorData = {
      'SaaS': `DIREKTA KONKURRENTER:
• Zapier - Global automationsplattform, men för komplex för svenska SMB
• Microsoft Power Automate - Stor aktör men kräver Office 365-ekosystem  
• Fortnox automationer - Begränsad till bokföring
• Visma Severa - Fokus på konsultbranschen

INDIREKTA KONKURRENTER:
• Manuella processer (60% av målgruppen)
• Anställning av administrativ personal
• Branschspecifika system (bygg: BIM, transport: TMS)

KONKURRENSFÖRDELAR:
• Sveriges-fokus med svenska integrations (Fortnox, Kivra, Bankgirot)
• AI som lär sig av användarmönster
• Branschspecifika mallar för nordiska affärsprocesser
• Lägre tröskel än enterprise-lösningar`,

      'Tech': `KONKURRENTER INOM TECH:
• Internationella tech-jättar (Microsoft, Google, Amazon)
• Nordiska scale-ups (Klarna, Spotify-modellen)
• Lokala konsultbolag och systemintegratörer
• Open source-alternativ

NISCHKONKURRENTER:
• Beroende på specifik teknikfokus
• Startup-ekosystemet i Stockholm/Göteborg
• Akademiska spin-offs från KTH/Chalmers

DIFFERENTIERING:
• Nordisk marknadsförståelse
• Regulatorisk compliance (GDPR, AI Act)
• Lokalt supportteam och partnerskap`,

      'Fintech': `FINTECH-KONKURRENTER:
• Klarna - Betallösningar och BNPL
• iZettle/PayPal - Kortterminaler och SMB-betalningar  
• Trustly/Zimpler - Banköverföringar och gambling
• Tink - Open banking och PFM
• Northmill - Digitala lån

TRADITIONELLA AKTÖRER:
• Storbanker (SEB, Handelsbanken, Swedbank)
• Etablerade betalaktörer (Nets, Worldline)
• Kreditbolag och finansbolag

UNIKA FÖRDELAR:
• Regulatorisk förståelse (Finansinspektionen)
• Svenska bankkopplingar (Swish, BankID)
• Lokal kundservice på svenska`
    };

    const result = competitorData[bransch as keyof typeof competitorData] || 
      `GENERELLA KONKURRENTER INOM ${bransch.toUpperCase()}:

DIREKTA KONKURRENTER:
• Etablerade aktörer inom branschen
• Internationella företag med svensk verksamhet
• Lokala/regionala konkurrenter

INDIREKTA KONKURRENTER:
• Traditionella lösningar/arbetssätt
• DIY-alternativ
• Substitutprodukter

ANALYS REKOMMENDERAS:
• Branschspecifik konkurrentkartläggning
• SWOT-analys mot identifierade aktörer
• Positionering och differentiering`;

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error generating competitor analysis:', error);
    return NextResponse.json({ error: 'Kunde inte generera konkurrentanalys' }, { status: 500 });
  }
} 