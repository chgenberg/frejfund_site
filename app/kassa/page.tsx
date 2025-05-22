import { useSearchParams } from 'next/navigation';

const PACKAGE_INFO = {
  gold: {
    name: 'Gold',
    price: '990 kr / analys eller 5 990 kr / år',
    color: '#16475b',
    features: [
      'Fullt AI-formulär (30 min)',
      'PDF full + interaktiv dashboard',
      '10 Pitch-Pingvinen-inspelningar/månad',
      'Branschspecifika benchmarks',
      'Investor radar & partner-rabatter',
    ],
  },
  black: {
    name: 'Black',
    price: '24 900 kr / år + 2 % success-fee',
    color: '#000',
    features: [
      'Fullt AI-formulär + due diligence-modul',
      'PDF full, deck-export, dataroom-länk',
      'Obegränsat Pitch-Pingvinen + TTS-svar',
      'Internationella benchmarks & simuleringar',
      'Dedikerad CSM & partner-rabatter',
    ],
  },
};

export default function Checkout() {
  const params = useSearchParams();
  const paket = params.get('paket') as 'gold' | 'black';
  const info = PACKAGE_INFO[paket] || PACKAGE_INFO.gold;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 bg-[#eaf6fa]">
      <div className="max-w-xl w-full bg-white/95 rounded-3xl shadow-xl border border-[#7edcff] p-8 mt-8">
        <h1 className="text-3xl font-extrabold text-[#16475b] mb-6 text-center uppercase tracking-widest">Kassa</h1>
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold mb-2" style={{ color: info.color }}>{info.name}-paketet</h2>
          <p className="mb-2 font-semibold">{info.price}</p>
          <ul className="text-left mx-auto max-w-xs list-disc list-inside text-sm mt-2 mb-2 text-[#16475b]">
            {info.features.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
        <button
          className="bg-[#16475b] text-white font-bold rounded-full px-8 py-3 shadow hover:bg-[#7edcff] hover:text-[#16475b] transition-colors text-lg tracking-widest uppercase w-full"
          onClick={() => alert('Tack för din beställning! (Demo)')}
        >
          SLUTFÖR BESTÄLLNING
        </button>
      </div>
    </div>
  );
} 