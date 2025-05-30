"use client";
import { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter } from 'recharts';
import { FaCheckCircle, FaExclamationTriangle, FaLightbulb, FaChartBar, FaUsers, FaMoneyBill, FaLeaf, FaRoad, FaSignOutAlt, FaDownload, FaRedo, FaFilePdf, FaChevronDown, FaChevronUp, FaUpload } from 'react-icons/fa';

const COLORS = ['#16475b', '#7edcff', '#eaf6fa', '#fbbf24', '#10b981', '#ef4444'];

const sectionConfig = [
  { id: 'problem', title: 'Problem', icon: <FaExclamationTriangle className="text-yellow-500" />, color: 'from-yellow-100 via-white to-yellow-50' },
  { id: 'solution', title: 'Lösning', icon: <FaLightbulb className="text-blue-400" />, color: 'from-blue-100 via-white to-blue-50' },
  { id: 'market', title: 'Marknad', icon: <FaChartBar className="text-blue-600" />, color: 'from-blue-100 via-white to-blue-50' },
  { id: 'business_model', title: 'Affärsmodell', icon: <FaMoneyBill className="text-green-600" />, color: 'from-green-100 via-white to-green-50' },
  { id: 'traction', title: 'Traction', icon: <FaUsers className="text-indigo-600" />, color: 'from-indigo-100 via-white to-indigo-50' },
  { id: 'team', title: 'Team', icon: <FaUsers className="text-pink-600" />, color: 'from-pink-100 via-white to-pink-50' },
  { id: 'financials', title: 'Finansiellt', icon: <FaMoneyBill className="text-green-700" />, color: 'from-green-100 via-white to-green-50' },
  { id: 'risk_esg', title: 'Risk & ESG', icon: <FaLeaf className="text-green-500" />, color: 'from-green-100 via-white to-green-50' },
  { id: 'ask', title: 'Ask/Use of Funds', icon: <FaMoneyBill className="text-yellow-700" />, color: 'from-yellow-100 via-white to-yellow-50' },
  { id: 'roadmap', title: 'Roadmap', icon: <FaRoad className="text-gray-600" />, color: 'from-gray-100 via-white to-gray-50' },
  { id: 'exit', title: 'Exit', icon: <FaSignOutAlt className="text-gray-700" />, color: 'from-gray-100 via-white to-gray-50' }
];

const marketData = [
  { name: 'TAM', value: 1000 },
  { name: 'SAM', value: 300 },
  { name: 'SOM', value: 50 }
];
const useOfFundsData = [
  { name: 'Produkt', value: 50 },
  { name: 'Sälj', value: 30 },
  { name: 'Team', value: 20 }
];
const tractionData = [
  { month: 'Jan', users: 100 },
  { month: 'Feb', users: 200 },
  { month: 'Mar', users: 400 },
  { month: 'Apr', users: 800 },
  { month: 'Maj', users: 1200 }
];
const esgRadarData = [
  { subject: 'Miljö', A: 120, fullMark: 150 },
  { subject: 'Socialt', A: 98, fullMark: 150 },
  { subject: 'Styrning', A: 86, fullMark: 150 }
];

const todoList = [
  { text: 'Öka traction', done: false },
  { text: 'Förbättra differentiering', done: false },
  { text: 'Säkra finansiering', done: false }
];

const strengths = [
  'Stark marknadspotential',
  'Innovativ lösning',
  'Skalbar affärsmodell',
  'Starkt team'
];
const weaknesses = [
  'Begränsad traction',
  'Höga konkurrenter',
  'Osäker finansiering',
  'Behöver fler kundcase'
];

const longAIComment = `Det här området är väl genomarbetat och sticker ut i jämförelse med andra startups. För att ta det till nästa nivå, rekommenderar vi att du kompletterar med fler konkreta exempel och visar på tydliga resultat från marknaden. Tänk på att investerare ofta letar efter bevis på "founder-market fit" och att du kan visa på en skalbarhet i din lösning.\n\nInvestor-insights:\n• Marknaden är stor men konkurrensutsatt – differentiering är avgörande.\n• Tydlig traction och kundcase ökar trovärdigheten.\n• Visa på hur kapitalet ska användas för att driva tillväxt.\n\nTODOs:\n1. Samla fler kundcitat.\n2. Visualisera traction-data.\n3. Förbered en känslighetsanalys för budgeten.`;

const scatterData = [
  { x: 1, y: 3, name: 'Bokio', fill: '#16475b' },
  { x: 2, y: 2, name: 'Fortnox', fill: '#7edcff' },
  { x: 3, y: 4, name: 'FrejFund', fill: '#fbbf24' }
];

const FONT_OPTIONS = [
  { label: 'Sans-serif (Helvetica)', value: 'Helvetica', style: { fontFamily: 'Helvetica, Arial, sans-serif' } },
  { label: 'Serif (Times)', value: 'Times', style: { fontFamily: 'Times New Roman, Times, serif' } },
  { label: 'Monospace (Courier)', value: 'Courier', style: { fontFamily: 'Courier New, Courier, monospace' } },
  { label: 'Modern (Lato)', value: 'Lato', style: { fontFamily: 'Lato, Arial, sans-serif', fontWeight: 700 } },
  { label: 'Handwritten (Pacifico)', value: 'Pacifico', style: { fontFamily: 'Pacifico, cursive' } },
];

export default function TestResultPage() {
  const [todos, setTodos] = useState(todoList);
  const [showMore, setShowMore] = useState<{ [key: string]: boolean }>({});
  const [showModal, setShowModal] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [colors, setColors] = useState(["#16475b", "#7edcff", "#fbbf24"]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const score = 92;
  const scorePie = [
    { name: 'Score', value: score },
    { name: 'Rest', value: 100 - score }
  ];
  const heroRef = useRef<HTMLDivElement>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingMessages = [
    'Analyserar dina resultat...',
    'Skapar en creative studio...',
    'Färdigställer design...',
    'Snart klar...'
  ];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0].value);
  const [logoError, setLogoError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((step) => (step + 1) % loadingMessages.length);
      }, 1800);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  useEffect(() => {
    if (pdfUrl) {
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = 'pitchdeck.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [pdfUrl]);

  const handleTodoToggle = (idx: number) => {
    setTodos(todos => todos.map((t, i) => i === idx ? { ...t, done: !t.done } : t));
  };
  const handleShowMore = (id: string) => {
    setShowMore(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Modal handlers
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'image/png') {
        setLogoError('Endast PNG-filer med transparent bakgrund är tillåtna.');
        setLogoFile(null);
        setLogoPreview(null);
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setLogoError(null);
    }
  };
  const handleColorChange = (idx: number, value: string) => {
    setColors(c => c.map((col, i) => i === idx ? value : col));
  };
  const handleCreatePitchdeck = async () => {
    setIsGenerating(true);
    setPdfUrl(null);
    const formData = new FormData();
    if (logoFile) formData.append('logo', logoFile);
    colors.forEach((c, i) => formData.append(`color${i+1}`, c));
    formData.append('font', selectedFont);
    const res = await fetch('/api/generate-pitchdeck', {
      method: 'POST',
      body: formData
    });
    if (res.ok) {
      const { url } = await res.json();
      setPdfUrl(url);
    } else {
      setPdfUrl(null);
      alert('Kunde inte generera PDF.');
    }
    setIsGenerating(false);
  };

  return (
    <div className="relative">
      {/* Köp pitchdeck-knapp */}
      <div className="max-w-3xl mx-auto flex justify-end mt-8 mb-2">
        <button className="bg-[#16475b] text-white font-bold rounded-full px-6 py-3 shadow-lg hover:bg-[#2a6b8a] transition-colors" onClick={() => setShowModal(true)}>
          Köp pitchdeck som PDF
        </button>
      </div>
      {/* Modal för logotyp och färgval */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border max-w-md w-full p-8 relative animate-fade-in text-black">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-[#111] text-2xl font-bold hover:text-[#2a6b8a] focus:outline-none" aria-label="Stäng">×</button>
            <h2 className="text-2xl font-bold text-[#111] mb-4 text-center">Ladda upp logotyp & välj färger</h2>
            <div className="mb-4 flex flex-col items-center">
              <input
                type="file"
                accept="image/png"
                ref={fileInputRef}
                onChange={handleLogoChange}
                className="hidden"
              />
              <button
                type="button"
                className="flex items-center gap-2 bg-[#eaf6fa] text-[#16475b] font-bold rounded-full px-6 py-3 shadow hover:bg-[#7edcff] transition-colors text-lg mb-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <FaUpload /> Ladda upp logotyp
              </button>
              <div className="text-xs text-[#b91c1c] mt-1">Endast PNG med transparent bakgrund accepteras.</div>
              {logoError && <div className="text-xs text-[#b91c1c] mt-1">{logoError}</div>}
              {logoPreview && <img src={logoPreview} alt="Logo preview" className="h-20 mt-2 rounded shadow border-2 border-[#eaf6fa]" />}
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1 text-[#111]">Signaturfärger (hex)</label>
              <div className="flex gap-2">
                {colors.map((c, i) => (
                  <input key={i} type="color" value={c} onChange={e => handleColorChange(i, e.target.value)} className="w-10 h-10 rounded-full border" />
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                {colors.map((c, i) => (
                  <input key={i} type="text" value={c} onChange={e => handleColorChange(i, e.target.value)} className="w-20 px-2 py-1 border rounded text-sm" />
                ))}
              </div>
            </div>
            {/* Fontval */}
            <div className="mb-4">
              <label className="block font-semibold mb-1 text-[#111]">Välj font för din pitchdeck</label>
              <div className="flex flex-wrap gap-2">
                {FONT_OPTIONS.map((font) => (
                  <button
                    key={font.value}
                    type="button"
                    className={`px-4 py-2 rounded-full border-2 transition-colors ${selectedFont === font.value ? 'border-[#16475b] bg-[#eaf6fa]' : 'border-gray-200 bg-white'} font-bold`}
                    style={font.style}
                    onClick={() => setSelectedFont(font.value)}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              className="bg-[#16475b] text-white font-bold rounded-full px-6 py-3 shadow-lg hover:bg-[#2a6b8a] transition-colors w-full mt-4"
              onClick={handleCreatePitchdeck}
              disabled={isGenerating}
            >
              {isGenerating ? 'Genererar PDF...' : 'Skapa pitchdeck'}
            </button>
            {isGenerating && (
              <div className="mt-6 flex flex-col items-center">
                {/* Loading bar */}
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gradient-to-r from-[#16475b] to-[#7edcff] animate-pulse" style={{ width: `${((loadingStep+1)/loadingMessages.length)*100}%` }}></div>
                </div>
                <div className="text-[#111] text-base font-medium min-h-[1.5em]">{loadingMessages[loadingStep]}</div>
              </div>
            )}
            {/* Snygg popup när PDF är klar */}
            {pdfUrl && !isGenerating && (
              <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="bg-white rounded-3xl shadow-2xl border max-w-sm w-full p-8 flex flex-col items-center animate-fade-in text-black">
                  <FaCheckCircle className="text-green-500 text-5xl mb-4" />
                  <h3 className="text-2xl font-bold mb-2 text-center">Din pitch-deck är klar!</h3>
                  <p className="mb-6 text-center">Du kan nu ladda hem din PDF och använda den direkt i din investerardialog.</p>
                  <a
                    href={pdfUrl}
                    download="pitchdeck.pdf"
                    className="bg-[#16475b] text-white font-bold rounded-full px-6 py-3 shadow-lg hover:bg-[#2a6b8a] transition-colors text-lg"
                  >
                    Ladda hem din pitch-deck
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Hero Header - cloud style */}
      <div ref={heroRef} className="max-w-3xl mx-auto mt-12 mb-12 pt-16 pb-12 px-4 rounded-[3rem] shadow-2xl bg-gradient-to-br from-white via-[#eaf6fa] to-white flex flex-col items-center relative border-4 border-transparent bg-clip-padding" style={{ boxShadow: '0 8px 40px 0 #16475b22, 0 1.5px 0 0 #eaf6fa' }}>
        <div className="w-64 h-64 mb-2 relative flex items-center justify-center" style={{ filter: 'drop-shadow(0 0 24px #7edcff88)' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={scorePie}
                innerRadius={110}
                outerRadius={120}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                isAnimationActive
                stroke="#eaf6fa"
                strokeWidth={6}
              >
                <Cell key="score" fill="#16475b" />
                <Cell key="rest" fill="#eaf6fa" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl font-bold text-[#16475b] drop-shadow-lg">{score}</div>
        </div>
        <div className="mt-4 text-xl text-[#16475b] font-semibold">Baserat på din nuvarande data är caset INVESTOR-READY på nivå {score}/100.</div>
        <div className="mt-2 flex items-center justify-center gap-2 text-[#16475b] text-lg"><FaLightbulb className="text-yellow-400" /> "Stark helhet, men öka traction och visa fler kundcase för att nå toppnivå!"</div>
      </div>

      {/* Analysis Sections - always open, cloud style, gradient border+glow */}
      <div className="max-w-3xl mx-auto flex flex-col gap-12">
        {sectionConfig.map((sec, idx) => (
          <div
            key={sec.id}
            className={`rounded-[2.5rem] shadow-2xl border-4 border-transparent bg-gradient-to-br ${sec.color} px-10 py-10 flex flex-col gap-6 relative`} style={{ boxShadow: '0 8px 40px 0 #16475b22, 0 1.5px 0 0 #eaf6fa' }}
          >
            <div className="flex items-center gap-3 mb-2">
              {sec.icon}
              <span className="text-2xl font-bold text-[#16475b]">{sec.title}</span>
            </div>
            {/* ENTREPRENÖRENS SVAR + GRAFIK PER SEKTION */}
            {sec.id === 'market' && (
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-2 text-[#16475b]">
                  <div><b>TAM:</b> 10 miljarder kr</div>
                  <div><b>SAM:</b> 2 miljarder kr</div>
                  <div><b>SOM:</b> 200 miljoner kr</div>
                  <div className="text-xs text-[#2a6b8a]">Källa: Statista 2023</div>
                </div>
                <div className="flex-1">
                  {/* Stacked Bar Chart */}
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={[
                      { name: 'TAM', value: 1000, fill: '#16475b' },
                      { name: 'SAM', value: 300, fill: '#7edcff' },
                      { name: 'SOM', value: 50, fill: '#fbbf24' }
                    ]}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value">
                        <Cell fill="#16475b" />
                        <Cell fill="#7edcff" />
                        <Cell fill="#fbbf24" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            {sec.id === 'traction' && (
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  {/* Area Chart */}
                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={tractionData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="#16475b" strokeWidth={3} dot={{ r: 5 }} fill="#7edcff" fillOpacity={0.3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 text-[#16475b]">
                  <div><b>MRR:</b> 300kkr</div>
                  <div><b>Nya användare/mån:</b> 1000</div>
                </div>
              </div>
            )}
            {sec.id === 'financials' && (
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  {/* Pie Chart Use of Funds */}
                  <ResponsiveContainer width="100%" height={120}>
                    <PieChart>
                      <Pie data={useOfFundsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} isAnimationActive>
                        {useOfFundsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 text-[#16475b] space-y-2">
                  <div><b>Runway:</b> <span className="inline-block w-32 align-middle"><span className="block h-3 rounded-full bg-gradient-to-r from-[#7edcff] to-[#16475b]" style={{ width: '80%' }}></span></span> 12 månader</div>
                  <div><b>ARPU:</b> 500 kr/mån</div>
                  <div><b>CAC:</b> 2000 kr</div>
                  <div><b>Churn:</b> 5%/månad</div>
                </div>
              </div>
            )}
            {sec.id === 'risk_esg' && (
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  {/* Radar Chart, större och färgglad */}
                  <ResponsiveContainer width="100%" height={180}>
                    <RadarChart cx="50%" cy="50%" outerRadius={80} data={esgRadarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} />
                      <Radar name="ESG" dataKey="A" stroke="#10b981" fill="#7edcff" fillOpacity={0.7} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 text-[#16475b]">
                  <div><b>KPI för impact:</b> CO2 minskat med 10% per kund</div>
                  <div><b>SDG:</b> SDG 12: Hållbar konsumtion</div>
                  <div><b>Jämförelse med bransch:</b> Bättre än snittet</div>
                </div>
              </div>
            )}
            {sec.id === 'team' && (
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 text-[#16475b]">
                  <div><b>Roller:</b> Anna (VD), Erik (CTO)</div>
                  <div><b>Styrkor:</b> Tech + sälj, Visionär + analytiker</div>
                </div>
                <div className="flex-1">
                  {/* Scatter plot för konkurrensmatris (dummy) */}
                  <ResponsiveContainer width="100%" height={120}>
                    <ScatterChart>
                      <XAxis type="number" dataKey="x" name="Pris" />
                      <YAxis type="number" dataKey="y" name="Differentiator" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="Konkurrenter" data={scatterData} fill="#16475b" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            {/* Dummy svar och AI-feedback för övriga sektioner */}
            {['problem', 'solution', 'business_model', 'ask', 'roadmap', 'exit'].includes(sec.id) && (
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 text-[#16475b]">
                  <div className="mb-2"><b>Entreprenörens svar:</b> Exempel på svar för {sec.title.toLowerCase()}.</div>
                  <div className="text-xs text-[#2a6b8a]">(Här visas kundens faktiska svar)</div>
                </div>
                <div className="flex-1 text-[#16475b]">
                  <div className="mb-2 flex items-center gap-2">
                    <FaLightbulb className="text-yellow-400" />
                    <span>
                      {showMore[sec.id] ? longAIComment : longAIComment.slice(0, 180) + '...'}
                      <button className="ml-2 text-[#2a6b8a] underline text-xs" onClick={() => handleShowMore(sec.id)}>
                        {showMore[sec.id] ? 'Läs mindre' : 'Läs mer'} {showMore[sec.id] ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold mt-2"><FaCheckCircle /> Starkt</span>
                </div>
              </div>
            )}
            {/* TODO-lista i sista sektionen */}
            {sec.id === 'exit' && (
              <div className="mt-4">
                <div className="font-bold mb-2 text-[#16475b]">Rekommenderade nästa steg</div>
                <ul className="space-y-2">
                  {todos.map((todo, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <input type="checkbox" checked={todo.done} onChange={() => handleTodoToggle(idx)} className="accent-[#16475b] w-5 h-5 rounded-full" />
                      <span className={todo.done ? 'line-through text-gray-400' : 'text-[#16475b]'}>{todo.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="max-w-3xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gradient-to-br from-white via-[#eaf6fa] to-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-2 border-[#eaf6fa]">
          <FaCheckCircle className="text-green-500 text-3xl mb-2" />
          <h3 className="font-bold text-[#16475b] mb-2">Styrkor</h3>
          <ul className="list-disc pl-5 text-sm text-[#16475b]">
            {strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
        <div className="bg-gradient-to-br from-white via-[#eaf6fa] to-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-2 border-[#eaf6fa]">
          <FaExclamationTriangle className="text-yellow-500 text-3xl mb-2" />
          <h3 className="font-bold text-[#16475b] mb-2">Svagheter</h3>
          <ul className="list-disc pl-5 text-sm text-[#16475b]">
            {weaknesses.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
        <div className="bg-gradient-to-br from-white via-[#eaf6fa] to-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-2 border-[#eaf6fa]">
          <FaLightbulb className="text-blue-400 text-3xl mb-2" />
          <h3 className="font-bold text-[#16475b] mb-2">Action Plan</h3>
          <ul className="list-disc pl-5 text-sm text-[#16475b]">
            {todos.map((t, i) => <li key={i} className={t.done ? 'line-through text-gray-400' : 'text-[#16475b]'}>{t.text}</li>)}
          </ul>
        </div>
      </div>

      {/* ESG-badge om relevant */}
      <div className="max-w-3xl mx-auto mt-6 flex justify-end">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-bold text-sm shadow"><FaLeaf /> Impact-score: Hög</span>
      </div>

      {/* CTA Panel */}
      <div className="max-w-3xl mx-auto mt-10 flex flex-col md:flex-row gap-4 justify-center items-center">
        <button className="flex items-center gap-2 bg-[#16475b] text-white font-bold rounded-full px-6 py-3 shadow-lg hover:bg-[#2a6b8a] transition-colors"><FaDownload /> Ladda ned Pitch-Deck</button>
        <button className="flex items-center gap-2 bg-[#16475b] text-white font-bold rounded-full px-6 py-3 shadow-lg hover:bg-[#2a6b8a] transition-colors"><FaFilePdf /> Exportera Rapport (PDF)</button>
        <button className="flex items-center gap-2 bg-[#16475b] text-white font-bold rounded-full px-6 py-3 shadow-lg hover:bg-[#2a6b8a] transition-colors"><FaRedo /> Förbättra & Räkna om</button>
      </div>
    </div>
  );
} 