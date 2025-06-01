"use client";
import Link from 'next/link';

export default function TestPaymentFlowPage() {
  return (
    <div className="min-h-screen bg-[#04111d] flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Test Payment Flow</h1>
        
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
              <h2 className="text-xl font-semibold text-white">Resultatssida</h2>
            </div>
            <p className="text-white/60 mb-4">Användaren ser sitt resultat och klickar på "Uppgradera för 197 kr"</p>
            <Link href="/test-result-standalone" className="text-purple-400 hover:text-purple-300 underline">
              → Gå till resultatssidan
            </Link>
          </div>

          {/* Step 2 */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
              <h2 className="text-xl font-semibold text-white">Kassasida</h2>
            </div>
            <p className="text-white/60 mb-4">Användaren fyller i sina uppgifter och betalar via Klarna</p>
            <Link href="/kassa/checkout" className="text-purple-400 hover:text-purple-300 underline">
              → Gå till kassan
            </Link>
          </div>

          {/* Step 3 */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
              <h2 className="text-xl font-semibold text-white">Bekräftelsesida</h2>
            </div>
            <p className="text-white/60 mb-4">Användaren ser en inspirerande bekräftelse med confetti</p>
            <Link href="/kassa/success" className="text-purple-400 hover:text-purple-300 underline">
              → Gå till bekräftelsen
            </Link>
          </div>

          {/* Step 4 */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">4</div>
              <h2 className="text-xl font-semibold text-white">Premium-analys</h2>
            </div>
            <p className="text-white/60 mb-4">Användaren får tillgång till sin djupgående AI-analys</p>
            <Link href="/premium-analysis" className="text-purple-400 hover:text-purple-300 underline">
              → Gå till premium-analysen
            </Link>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
          <h3 className="text-lg font-semibold text-white mb-2">💡 Information</h3>
          <ul className="space-y-2 text-white/60 text-sm">
            <li>• PDF-generering är endast tillgänglig i premium-versionen</li>
            <li>• Bekräftelsesidan har confetti-animation och inspirerande budskap</li>
            <li>• Premium-analysen har 10 olika sektioner med djupgående insikter</li>
            <li>• Popup för åtgärder är nu scrollbar och har maxhöjd</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 