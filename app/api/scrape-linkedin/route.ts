import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { profiles } = await request.json();
    
    // Simulera LinkedIn-skrapning med realistiska profiler
    const mockProfiles = [
      {
        url: 'linkedin.com/in/anna-svensson',
        name: 'Anna Svensson', 
        title: 'VD & Grundare',
        experience: '12 år som IT-konsult och projektledare på Visma och Accenture. MBA från SSE. Specialist på affärsprocesser och digital transformation för småföretag.',
        skills: 'Affärsutveckling, Projektledning, IT-konsultation'
      },
      {
        url: 'linkedin.com/in/erik-johansson',
        name: 'Erik Johansson',
        title: 'CTO & Grundare', 
        experience: 'Tidigare Tech Lead på Klarna (3 år) och senior utvecklare på Spotify (2 år). KTH Datateknik. Expertis inom AI/ML, skalbar arkitektur och fintech-system.',
        skills: 'AI/ML, Python, Systemarkitektur, Fintech'
      },
      {
        url: 'linkedin.com/in/sara-lindqvist',
        name: 'Sara Lindqvist',
        title: 'CPO - Chief Product Officer',
        experience: '6 års produktmanagement på Spotify, fokus på B2B-produkter. Tidigare UX-designer på IKEA Digital. Expertis inom användarcentrerad produktutveckling.',
        skills: 'Produktmanagement, UX Design, B2B SaaS'
      }
    ];

    // Använd mock-data baserat på antal profiler
    const selectedProfiles = mockProfiles.slice(0, Math.min(profiles.length, 3));
    
    const result = selectedProfiles.map(profile => 
      `${profile.name} (${profile.title})\n${profile.experience}\nKärnkompetenser: ${profile.skills}\n`
    ).join('\n');

    return NextResponse.json({ 
      result: result || 'Exempel på teaminfo:\n\nAnna Svensson (VD): 12 års erfarenhet av affärsprocesser\nErik Johansson (CTO): AI-expert från Klarna och Spotify\nSara Lindqvist (CPO): Produktmanagement från Spotify\n\nStarkt tekniskt team med komplementära skills.'
    });
  } catch (error) {
    console.error('Error scraping LinkedIn:', error);
    return NextResponse.json({ error: 'Kunde inte hämta LinkedIn-data' }, { status: 500 });
  }
} 