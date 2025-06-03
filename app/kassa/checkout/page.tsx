"use client";
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: ''
  });

  const handleMockPayment = () => {
    setIsProcessing(true);
    
    // Simulera betalningsprocess
    setTimeout(() => {
      // Markera att användaren har betalat för premium
      const pendingAnalysis = localStorage.getItem('pendingPremiumAnalysis');
      if (pendingAnalysis) {
        const data = JSON.parse(pendingAnalysis);
        localStorage.setItem('pendingPremiumAnalysis', JSON.stringify({
          ...data,
          hasPaid: true,
          paymentDate: new Date().toISOString()
        }));
      }
      
      // Redirect till success-sidan
      router.push('/kassa/success');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#04111d] relative flex items-center justify-center px-4 py-20">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 237, 255, 0.2) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(120, 237, 255, 0.15) 0%, transparent 50%)`
        }}></div>
      </div>

      <div className="max-w-5xl w-full mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Vänster sida - Produktinfo */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-6">Premium AI-Analys</h2>
            
            <div className="space-y-6">
              {/* Vad ingår */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Vad ingår:</h3>
                {[
                  { icon: '📊', title: '50+ sidor djupanalys', desc: 'Detaljerad genomgång av alla affärsaspekter' },
                  { icon: '🎯', title: 'Branschspecifika insikter', desc: 'Jämförelser med 100+ framgångsrika startups' },
                  { icon: '💡', title: 'AI-genererade strategier', desc: 'Konkreta handlingsplaner för varje område' },
                  { icon: '📈', title: 'Finansiella projektioner', desc: '3-års prognos med olika scenarion' },
                  { icon: '🏆', title: 'Investerarperspektiv', desc: 'Analys från 50+ svenska investerares synvinkel' },
                  { icon: '📄', title: 'Professionell PDF', desc: 'Designad rapport redo för investerare' },
                  { icon: '🚀', title: 'Pitch deck-mallar', desc: '10 anpassade slides baserat på din data' },
                  { icon: '📞', title: '30 min expertsamtal', desc: 'Boka tid med våra affärsrådgivare' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <h4 className="font-semibold text-white">{feature.title}</h4>
                      <p className="text-white/60 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Garanti */}
              <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
                <p className="text-green-300 font-semibold mb-1">✅ 100% Nöjdhetsgaranti</p>
                <p className="text-white/70 text-sm">Inte nöjd? Pengarna tillbaka inom 30 dagar.</p>
              </div>
            </div>
          </div>

          {/* Höger sida - Betalningsformulär */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Slutför köp</h3>
            
            <form onSubmit={(e) => { e.preventDefault(); handleMockPayment(); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Förnamn</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                    value={customerInfo.firstName}
                    onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Efternamn</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                    value={customerInfo.lastName}
                    onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">E-post</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Företag</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                  value={customerInfo.company}
                  onChange={(e) => setCustomerInfo({...customerInfo, company: e.target.value})}
                />
              </div>

              {/* Pris sammanfattning */}
              <div className="bg-white/5 rounded-xl p-4 mt-6">
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Premium AI-Analys</span>
                  <span className="text-white">197 kr</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Moms (25%)</span>
                  <span className="text-white">49 kr</span>
                </div>
                <div className="border-t border-white/20 mt-3 pt-3">
                  <div className="flex justify-between">
                    <span className="text-xl font-semibold text-white">Totalt</span>
                    <span className="text-xl font-semibold text-white">246 kr</span>
                  </div>
                </div>
              </div>

              {/* Klarna kommer här */}
              <div className="bg-gradient-to-r from-pink-500/20 to-pink-600/20 rounded-xl p-4 border border-pink-500/30 text-center">
                <p className="text-pink-300 font-medium mb-2">🛍️ Betala tryggt med Klarna</p>
                <p className="text-white/60 text-sm">Faktura, delbetalning eller kortbetalning</p>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Behandlar betalning...
                  </span>
                ) : (
                  'Betala 246 kr'
                )}
              </button>

              <p className="text-white/40 text-xs text-center mt-4">
                Genom att slutföra köpet godkänner du våra <a href="/villkor" className="underline">villkor</a> och <a href="/integritet" className="underline">integritetspolicy</a>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 