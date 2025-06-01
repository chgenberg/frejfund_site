"use client";
import { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function PremiumAnalysisPage() {
  const [activeSection, setActiveSection] = useState('executive-summary');
  const [isGenerating, setIsGenerating] = useState(true);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [pdfGenerating, setPDFGenerating] = useState(false);
  const [pdfProgress, setPDFProgress] = useState(0);
  
  useEffect(() => {
    // Simulera AI-generering
    setTimeout(() => setIsGenerating(false), 3000);
  }, []);

  const sections = [
    { id: 'executive-summary', title: 'Executive Summary', icon: '📋' },
    { id: 'market-deep-dive', title: 'Marknadsanalys Deep Dive', icon: '📊' },
    { id: 'competitive-landscape', title: 'Konkurrenslandskap', icon: '🏆' },
    { id: 'business-model-analysis', title: 'Affärsmodellanalys', icon: '💰' },
    { id: 'financial-projections', title: 'Finansiella Projektioner', icon: '📈' },
    { id: 'risk-assessment', title: 'Riskbedömning', icon: '⚠️' },
    { id: 'growth-strategy', title: 'Tillväxtstrategi', icon: '🚀' },
    { id: 'investor-readiness', title: 'Investerarberedskap', icon: '💼' },
    { id: 'action-plan', title: 'Handlingsplan', icon: '✅' },
    { id: 'benchmarks', title: 'Branschjämförelser', icon: '📏' }
  ];

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-[#04111d] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-transparent border-t-pink-500 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
            <div className="absolute inset-4 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">AI analyserar din affärsplan...</h2>
          <p className="text-white/60">Detta tar cirka 30 sekunder</p>
          <div className="mt-8 space-y-2">
            <p className="text-white/40 text-sm animate-pulse">Analyserar marknadspotential...</p>
            <p className="text-white/40 text-sm animate-pulse" style={{ animationDelay: '0.5s' }}>Jämför med 100+ framgångsrika startups...</p>
            <p className="text-white/40 text-sm animate-pulse" style={{ animationDelay: '1s' }}>Genererar finansiella projektioner...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#04111d]">
      {/* Premium header */}
      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">👑</span> Premium AI-Analys
            </h1>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white/5 backdrop-blur-xl border-r border-white/10 min-h-screen p-6">
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
                  activeSection === section.id 
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30' 
                    : 'text-white/60 hover:bg-white/10'
                }`}
              >
                <span className="text-xl">{section.icon}</span>
                <span className="text-sm font-medium">{section.title}</span>
              </button>
            ))}
          </div>

          {/* PDF Download Button - moved here */}
          <div className="mt-6">
            <button 
              onClick={() => setShowPDFModal(true)}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Ladda ner Premium PDF
            </button>
          </div>

          {/* Progress overview */}
          <div className="mt-8 bg-white/5 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3">Analysöversikt</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/60">Marknadspotential</span>
                  <span className="text-green-400">92%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-green-500" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/60">Investerarberedskap</span>
                  <span className="text-yellow-400">78%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/60">Skalbarhet</span>
                  <span className="text-blue-400">85%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {activeSection === 'executive-summary' && (
              <div className="animate-fadeIn">
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <span className="text-4xl">📋</span> Executive Summary
                </h2>
                
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Huvudsakliga Styrkor</h3>
                  <div className="grid gap-4">
                    {[
                      {
                        title: 'Stark Marknadspotential',
                        desc: 'Er TAM på 5 miljarder SEK representerar en betydande möjlighet. Marknaden för investeringsmatchning växer med 25% årligen drivet av ökad startup-aktivitet.',
                        score: 92
                      },
                      {
                        title: 'Erfaret Team',
                        desc: 'Kombinationen av finansexpertis (Maria från EQT) och tech-kompetens (Erik från Spotify) ger er en unik fördel i marknaden.',
                        score: 88
                      },
                      {
                        title: 'Validerad Affärsmodell',
                        desc: 'SaaS-modellen med 85% bruttomarginal och LTV/CAC på 10x visar på stark enhetsekonomi.',
                        score: 85
                      }
                    ].map((strength, index) => (
                      <div key={index} className="bg-white/5 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-white">{strength.title}</h4>
                          <span className="text-green-400 font-bold">{strength.score}%</span>
                        </div>
                        <p className="text-white/70 text-sm">{strength.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Kritiska Framgångsfaktorer</h3>
                  <div className="space-y-6">
                    {[
                      {
                        factor: 'Investerarnätverk',
                        current: 'Ni har kontakt med 50+ investerare',
                        needed: 'Behöver 200+ aktiva investerare för kritisk massa',
                        action: 'Inled partnerskap med SVCA och investera i BD-team'
                      },
                      {
                        factor: 'Teknisk Differentiering',
                        current: 'AI-matchning är lovande men obevisad',
                        needed: 'Bevisa 3x bättre träffsäkerhet än manuell matchning',
                        action: 'Genomför A/B-test med kontrollgrupp under Q1 2024'
                      },
                      {
                        factor: 'Marknadsposition',
                        current: '50 kunder ger tidig validering',
                        needed: 'Behöver 500+ kunder för marknadsledarskap',
                        action: 'Investera i content marketing och thought leadership'
                      }
                    ].map((factor, index) => (
                      <div key={index} className="border-l-4 border-purple-500/50 pl-6">
                        <h4 className="font-semibold text-white mb-2">{factor.factor}</h4>
                        <div className="space-y-1 text-sm">
                          <p className="text-green-400">✓ {factor.current}</p>
                          <p className="text-yellow-400">→ {factor.needed}</p>
                          <p className="text-blue-400">⚡ {factor.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-3xl p-8 border border-green-500/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Investeringsrekommendation</h3>
                  <div className="flex items-center gap-8 mb-6">
                    <div className="w-32 h-32">
                      <CircularProgressbar
                        value={78}
                        text="78"
                        styles={buildStyles({
                          pathColor: '#10B981',
                          textColor: '#ffffff',
                          trailColor: 'rgba(255,255,255,0.1)',
                        })}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-white mb-2">Stark Investeringskandidat</h4>
                      <p className="text-white/70">
                        Baserat på vår analys bedömer vi FrejFund som en stark investeringskandidat med hög potential för 10-20x avkastning inom 5 år.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-2xl font-bold text-white">15 MSEK</div>
                      <div className="text-white/60 text-sm">Optimal funding</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-2xl font-bold text-white">24 mån</div>
                      <div className="text-white/60 text-sm">Till Series A</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-2xl font-bold text-white">300 MSEK</div>
                      <div className="text-white/60 text-sm">Värdering om 3 år</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'market-deep-dive' && (
              <div className="animate-fadeIn">
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <span className="text-4xl">📊</span> Marknadsanalys Deep Dive
                </h2>
                
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 mb-8">
                  <h3 className="text-xl font-semibold text-white mb-6">Marknadsdynamik</h3>
                  
                  <div className="grid gap-6">
                    <div>
                      <h4 className="font-semibold text-white mb-3">Marknadsstorlek & Tillväxt</h4>
                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-3xl font-bold text-blue-400">5.2B</div>
                            <div className="text-white/60 text-sm">SEK TAM 2024</div>
                          </div>
                          <div>
                            <div className="text-3xl font-bold text-green-400">+25%</div>
                            <div className="text-white/60 text-sm">Årlig tillväxt</div>
                          </div>
                          <div>
                            <div className="text-3xl font-bold text-purple-400">8.5B</div>
                            <div className="text-white/60 text-sm">SEK TAM 2027</div>
                          </div>
                        </div>
                        <p className="text-white/70 text-sm">
                          Den svenska venture capital-marknaden har vuxit från 3.2 miljarder 2020 till 5.2 miljarder 2024. 
                          Tillväxten drivs av ökad startup-aktivitet, mer tillgängligt kapital och digitalisering av investeringsprocesser.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white mb-3">Marknadssegmentering</h4>
                      <div className="space-y-3">
                        {[
                          { segment: 'Pre-seed/Seed Startups', size: '2.1B SEK', growth: '+30%', fit: 'Perfekt match - er kärnmålgrupp' },
                          { segment: 'Series A/B Scale-ups', size: '1.8B SEK', growth: '+20%', fit: 'Sekundär målgrupp med hög potential' },
                          { segment: 'Corporate Ventures', size: '0.8B SEK', growth: '+15%', fit: 'Framtida expansionsmöjlighet' },
                          { segment: 'Angel/Family Offices', size: '0.5B SEK', growth: '+35%', fit: 'Strategisk partnerskapsmöjlighet' }
                        ].map((seg, i) => (
                          <div key={i} className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-white">{seg.segment}</h5>
                              <p className="text-white/60 text-sm">{seg.fit}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-semibold">{seg.size}</div>
                              <div className="text-green-400 text-sm">{seg.growth} YoY</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white mb-3">Marknadstrender</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { trend: 'AI/ML-investeringar', impact: 'Hög', desc: 'Perfekt timing för er AI-fokuserade lösning' },
                          { trend: 'Hållbarhetsfokus', impact: 'Medium', desc: 'Möjlighet att lyfta fram ESG-matchning' },
                          { trend: 'Remote due diligence', impact: 'Hög', desc: 'Er digitala plattform möter detta behov' },
                          { trend: 'Snabbare dealflow', impact: 'Hög', desc: 'AI-matchning kan korta tiden med 70%' }
                        ].map((trend, i) => (
                          <div key={i} className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-white">{trend.trend}</h5>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                trend.impact === 'Hög' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                              }`}>{trend.impact}</span>
                            </div>
                            <p className="text-white/60 text-sm">{trend.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/20">
                  <h3 className="text-xl font-semibold text-white mb-4">AI-Driven Marknadsinsikt</h3>
                  <p className="text-white/80 mb-4">
                    Baserat på analys av 10,000+ investeringar i Norden de senaste 5 åren:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💡</span>
                      <p className="text-white/70">
                        <span className="text-white font-semibold">87% av misslyckade investeringar</span> berodde på dålig matchning mellan startup och investerare. 
                        Er lösning adresserar kärnproblemet.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📈</span>
                      <p className="text-white/70">
                        <span className="text-white font-semibold">Genomsnittlig tid till investering</span> är 6 månader. 
                        Med AI-matchning kan detta reduceras till 2 månader.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🎯</span>
                      <p className="text-white/70">
                        <span className="text-white font-semibold">ROI för investerare ökar med 3.2x</span> när de investerar i startups som matchar deras expertis och nätverk.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Lägg till fler sektioner här... */}

          </div>
        </div>
      </div>

      {/* Premium PDF Modal */}
      {showPDFModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-[#0a1628] to-[#04111d] rounded-3xl shadow-2xl max-w-4xl w-full p-8 relative animate-fadeIn border border-purple-500/30">
            {!pdfGenerating ? (
              <>
                <button
                  onClick={() => setShowPDFModal(false)}
                  className="absolute top-4 right-4 text-white/40 hover:text-white text-2xl transition-colors"
                >
                  ×
                </button>
                
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Premium PDF-rapport</h2>
                  <p className="text-white/60">Anpassa din professionella investerarrapport</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Vänster kolumn - Anpassningsalternativ */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white mb-4">Välj innehåll</h3>
                    
                    {[
                      { id: 'cover', label: 'Professionellt omslag', checked: true, icon: '🎨' },
                      { id: 'summary', label: 'Executive Summary', checked: true, icon: '📋' },
                      { id: 'market', label: 'Marknadsanalys (15 sidor)', checked: true, icon: '📊' },
                      { id: 'competition', label: 'Konkurrensanalys (10 sidor)', checked: true, icon: '🏆' },
                      { id: 'financials', label: 'Finansiella projektioner (12 sidor)', checked: true, icon: '📈' },
                      { id: 'team', label: 'Team & Organisation', checked: true, icon: '👥' },
                      { id: 'risks', label: 'Risk & Möjligheter', checked: true, icon: '⚠️' },
                      { id: 'appendix', label: 'Bilagor & Data', checked: false, icon: '📎' }
                    ].map((item) => (
                      <label key={item.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                        <input 
                          type="checkbox" 
                          defaultChecked={item.checked}
                          className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500"
                        />
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-white flex-1">{item.label}</span>
                      </label>
                    ))}
                  </div>

                  {/* Höger kolumn - Designval */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white mb-4">Design & Format</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-white/80 text-sm mb-2 block">Färgschema</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { name: 'Professional', colors: ['#1a365d', '#2b6cb0'] },
                            { name: 'Modern', colors: ['#9333ea', '#ec4899'] },
                            { name: 'Nature', colors: ['#059669', '#10b981'] },
                            { name: 'Luxury', colors: ['#991b1b', '#dc2626'] }
                          ].map((theme, i) => (
                            <button
                              key={i}
                              className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/30 transition-all"
                            >
                              <div className="flex gap-1 justify-center mb-1">
                                {theme.colors.map((color, j) => (
                                  <div key={j} className="w-6 h-6 rounded" style={{ backgroundColor: color }}></div>
                                ))}
                              </div>
                              <span className="text-xs text-white/60">{theme.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-white/80 text-sm mb-2 block">Språk</label>
                        <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white">
                          <option value="sv">Svenska</option>
                          <option value="en">English</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-white/80 text-sm mb-2 block">Logotyp</label>
                        <button className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white/60 hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Ladda upp företagslogotyp
                        </button>
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="mt-6 p-4 bg-white/5 rounded-xl">
                      <h4 className="text-white/80 text-sm mb-3">Förhandsvisning</h4>
                      <div className="bg-white rounded-lg p-4 aspect-[210/297] flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-3"></div>
                          <div className="h-2 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
                          <div className="h-2 bg-gray-300 rounded w-24 mx-auto"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setShowPDFModal(false)}
                    className="px-6 py-3 bg-white/10 rounded-full text-white font-medium hover:bg-white/20 transition-all"
                  >
                    Avbryt
                  </button>
                  <button
                    onClick={() => {
                      setPDFGenerating(true);
                      // Simulate PDF generation
                      let progress = 0;
                      const interval = setInterval(() => {
                        progress += 10;
                        setPDFProgress(progress);
                        if (progress >= 100) {
                          clearInterval(interval);
                          setTimeout(() => {
                            setPDFGenerating(false);
                            setPDFProgress(0);
                            setShowPDFModal(false);
                            // Trigger actual download here
                          }, 500);
                        }
                      }, 300);
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Generera Premium PDF
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 60}`}
                      strokeDashoffset={`${2 * Math.PI * 60 * (1 - pdfProgress / 100)}`}
                      className="transition-all duration-300"
                    />
                    <defs>
                      <linearGradient id="gradient">
                        <stop offset="0%" stopColor="#9333ea" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{pdfProgress}%</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Genererar din Premium PDF...</h3>
                <p className="text-white/60">Detta tar cirka 30 sekunder</p>
                <div className="mt-6 max-w-sm mx-auto">
                  <div className="text-left space-y-2">
                    {[
                      { text: 'Skapar professionellt omslag...', done: pdfProgress >= 20 },
                      { text: 'Genererar marknadsanalys...', done: pdfProgress >= 40 },
                      { text: 'Beräknar finansiella projektioner...', done: pdfProgress >= 60 },
                      { text: 'Sammanställer konkurrensanalys...', done: pdfProgress >= 80 },
                      { text: 'Slutför rapport...', done: pdfProgress >= 100 }
                    ].map((step, i) => (
                      <div key={i} className={`flex items-center gap-2 transition-all ${step.done ? 'text-green-400' : 'text-white/40'}`}>
                        {step.done ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <div className="w-5 h-5 border-2 border-white/20 rounded-full"></div>
                        )}
                        <span className="text-sm">{step.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
} 