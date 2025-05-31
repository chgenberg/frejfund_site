"use client";
import Image from 'next/image';

export default function Cookies() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12">
      <Image
        src="/bakgrund.png"
        alt="Bakgrund"
        fill
        className="object-cover -z-10"
        priority
      />
      <div className="w-full max-w-4xl mx-auto bg-white/95 rounded-3xl shadow-xl p-8 md:p-12 border border-white/20 backdrop-blur-md">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-12 text-center text-[#16475b] tracking-tight">
          Cookiepolicy
        </h1>
        
        <div className="space-y-10 text-gray-800">
          <div className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border-b p-3 text-left text-sm font-semibold text-gray-600">Typ av cookie</th>
                    <th className="border-b p-3 text-left text-sm font-semibold text-gray-600">Exempel</th>
                    <th className="border-b p-3 text-left text-sm font-semibold text-gray-600">Syfte</th>
                    <th className="border-b p-3 text-left text-sm font-semibold text-gray-600">Lagringstid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3 text-sm">Nödvändiga</td>
                    <td className="p-3 text-sm">__host-next-auth.csrf</td>
                    <td className="p-3 text-sm">inloggning & säkerhet</td>
                    <td className="p-3 text-sm">session</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3 text-sm">Analys</td>
                    <td className="p-3 text-sm">_ga, _hjSession</td>
                    <td className="p-3 text-sm">besöksstatistik</td>
                    <td className="p-3 text-sm">1–24 mån</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3 text-sm">Marknadsföring</td>
                    <td className="p-3 text-sm">fbp, ttclid</td>
                    <td className="p-3 text-sm">riktad annonsering</td>
                    <td className="p-3 text-sm">3 mån</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Hur du hanterar cookies</h2>
            <p className="leading-relaxed">Vid första besöket visas vår cookie-banner. Du kan när som helst ändra eller återkalla samtycke via "Cookieinställningar" i sidfoten eller i din webbläsare. Christopher Genberg AB är personuppgiftsansvarig för behandlingen av cookies.</p>
          </section>
        </div>
      </div>
    </div>
  );
} 