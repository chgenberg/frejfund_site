"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Trigger confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#9333EA', '#EC4899', '#3B82F6', '#10B981']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#9333EA', '#EC4899', '#3B82F6', '#10B981']
      });
    }, 250);

    // Show content after delay
    setTimeout(() => setShowContent(true), 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#04111d] relative flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className={`max-w-4xl w-full mx-auto relative z-10 text-center transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Success icon */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-scaleIn">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Main message */}
        <h1 className="text-5xl font-bold text-white mb-6 animate-slideUp">
          Välkommen till eliten! 🎉
        </h1>
        
        <p className="text-2xl text-white/80 mb-8 animate-slideUp animation-delay-200">
          Du tillhör nu de <span className="text-purple-400 font-bold">3%</span> av entreprenörer som faktiskt investerar i sin framgång
        </p>

        {/* Inspirational quote */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 mb-12 animate-slideUp animation-delay-400">
          <blockquote className="text-xl text-white/90 italic mb-4">
            "De som är galna nog att tro att de kan förändra världen är de som faktiskt gör det."
          </blockquote>
          <cite className="text-white/60">- Steve Jobs</cite>
        </div>

        {/* What happens next */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              step: '1',
              title: 'AI-analys startar',
              desc: 'Vår AI analyserar just nu din affärsplan med hjälp av data från 10,000+ framgångsrika startups',
              delay: '600'
            },
            {
              step: '2',
              title: 'Premium-rapport',
              desc: 'Inom 5 minuter får du tillgång till din personliga 50-sidors affärsanalys',
              delay: '800'
            },
            {
              step: '3',
              title: 'Expertsamtal',
              desc: 'Vårt team kontaktar dig inom 24h för att boka ditt strategisamtal',
              delay: '1000'
            }
          ].map((item) => (
            <div
              key={item.step}
              className={`bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 animate-slideUp animation-delay-${item.delay}`}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">{item.step}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-white/60 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Statistics to inspire */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 mb-12 animate-slideUp animation-delay-1200">
          <h2 className="text-2xl font-bold text-white mb-6">Företag som använt vår Premium-analys:</h2>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-purple-400">87%</div>
              <div className="text-white/60">säkrade finansiering</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-400">3.2x</div>
              <div className="text-white/60">snabbare tillväxt</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400">92%</div>
              <div className="text-white/60">överlevde 3+ år</div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <button
          onClick={() => router.push('/premium-analysis-result')}
          className="px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all text-lg animate-slideUp animation-delay-1400"
        >
          Gå till din Premium-analys →
        </button>

        <p className="text-white/40 text-sm mt-8 animate-slideUp animation-delay-1600">
          Vi har skickat en bekräftelse till din e-post med alla detaljer
        </p>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out;
        }
        
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1200 { animation-delay: 1.2s; }
        .animation-delay-1400 { animation-delay: 1.4s; }
        .animation-delay-1600 { animation-delay: 1.6s; }
      `}</style>
    </div>
  );
} 