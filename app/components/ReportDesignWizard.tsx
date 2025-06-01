import React, { useState } from 'react';

const FONT_OPTIONS = [
  { name: 'Inter', fontFamily: 'Inter, sans-serif', google: 'Inter' },
  { name: 'Montserrat', fontFamily: 'Montserrat, sans-serif', google: 'Montserrat' },
  { name: 'Playfair Display', fontFamily: 'Playfair Display, serif', google: 'Playfair+Display' },
  { name: 'Roboto Slab', fontFamily: 'Roboto Slab, serif', google: 'Roboto+Slab' },
  { name: 'Pacifico', fontFamily: 'Pacifico, cursive', google: 'Pacifico' },
];

export default function ReportDesignWizard({ onConfirm }: { onConfirm: (design: any) => void }) {
  const [primary, setPrimary] = useState('#16475b');
  const [secondary, setSecondary] = useState('#7edcff');
  const [accent, setAccent] = useState('#eaf6fa');
  const [font, setFont] = useState(FONT_OPTIONS[0]);

  // Dynamically load Google Font for preview
  React.useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`;
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, [font]);

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-0 animate-fadeIn flex flex-col">
        <div className="p-8 overflow-y-auto" style={{ maxHeight: '70vh' }}>
          <h2 className="text-2xl font-bold text-[#16475b] mb-6 text-center">Välj design för din rapport</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-shrink-0">
            {/* Färgval */}
            <div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Primärfärg</label>
                <input type="color" value={primary} onChange={e => setPrimary(e.target.value)} className="w-16 h-10 rounded-lg border-2 border-gray-200" />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Sekundärfärg</label>
                <input type="color" value={secondary} onChange={e => setSecondary(e.target.value)} className="w-16 h-10 rounded-lg border-2 border-gray-200" />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Accentfärg</label>
                <input type="color" value={accent} onChange={e => setAccent(e.target.value)} className="w-16 h-10 rounded-lg border-2 border-gray-200" />
              </div>
            </div>
            {/* Fontval */}
            <div>
              <label className="block font-semibold mb-2">Fontstil</label>
              <div className="flex flex-col gap-2">
                {FONT_OPTIONS.map(opt => (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setFont(opt)}
                    className={`rounded-xl px-4 py-2 border-2 ${font.name === opt.name ? 'border-[#16475b] bg-[#eaf6fa]' : 'border-gray-200 bg-white'} transition-all`}
                    style={{ fontFamily: opt.fontFamily }}
                  >
                    {opt.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Preview */}
          <div className="mt-8 p-4 rounded-2xl shadow-inner border border-gray-100 bg-gray-50 max-h-40 md:max-h-64 overflow-auto flex-shrink-0">
            <div style={{ fontFamily: font.fontFamily }}>
              <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 rounded-full border-8 flex items-center justify-center text-4xl font-bold mb-2" style={{ borderColor: secondary, background: accent, color: primary }}>78</div>
                <div className="text-lg font-medium text-center mt-2" style={{ color: primary }}>Bra! Er affärsplan är lovande men behöver vissa förbättringar.</div>
              </div>
              <h1 className="text-3xl font-extrabold mb-2" style={{ color: primary }}>Affärsanalys</h1>
              <h2 className="text-xl font-semibold mb-1">Företagsnamn AB</h2>
              <div className="text-gray-500 mb-2">2025-06-01</div>
              <hr className="my-4" style={{ borderColor: secondary }} />
              <h2 className="text-xl font-bold mb-2" style={{ color: secondary }}>Sammanfattning</h2>
              <p className="mb-2">Detta är en förhandsvisning av din rapport. Dina färg- och fontval kommer att användas i hela PDF:en.</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4 py-6 bg-white/95 rounded-b-2xl border-t border-gray-100 sticky bottom-0 z-20">
          <button
            onClick={() => onConfirm({ primary, secondary, accent, font })}
            className="px-8 py-3 bg-gradient-to-r from-[#16475b] to-[#2a6b8a] text-white font-bold rounded-full hover:shadow-lg transition-all"
          >
            Bekräfta design
          </button>
        </div>
      </div>
    </div>
  );
} 