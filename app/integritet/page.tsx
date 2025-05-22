"use client";
import Image from 'next/image';

export default function Privacy() {
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
          Integritetspolicy
          <span className="block text-lg font-normal text-gray-600 mt-2">GDPR</span>
        </h1>
        
        <div className="space-y-10 text-gray-800">
          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">1. Vem är personuppgiftsansvarig?</h2>
            <p className="leading-relaxed">FrejFund AB (org.nr 559999-9999), Storgatan 1, 111 22 Stockholm, är personuppgiftsansvarig för behandling av dina personuppgifter.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">2. Vilka uppgifter samlar vi in och varför?</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border-b p-3 text-left text-sm font-semibold text-gray-600">Kategori</th>
                    <th className="border-b p-3 text-left text-sm font-semibold text-gray-600">Exempel</th>
                    <th className="border-b p-3 text-left text-sm font-semibold text-gray-600">Ändamål</th>
                    <th className="border-b p-3 text-left text-sm font-semibold text-gray-600">Laglig grund</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3 text-sm">Kontaktuppgifter</td>
                    <td className="p-3 text-sm">namn, e-post</td>
                    <td className="p-3 text-sm">kontoskapande, utskick</td>
                    <td className="p-3 text-sm">Avtal & intresseavvägning</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3 text-sm">Affärsdata</td>
                    <td className="p-3 text-sm">svar i analysformulär, pitch-pdf</td>
                    <td className="p-3 text-sm">AI-analys, rapportgenerering</td>
                    <td className="p-3 text-sm">Avtal</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3 text-sm">Teknisk data</td>
                    <td className="p-3 text-sm">IP-adress, cookie-ID, loggar</td>
                    <td className="p-3 text-sm">säkerhet, statistik</td>
                    <td className="p-3 text-sm">Berättigat intresse</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3 text-sm">Betaldata</td>
                    <td className="p-3 text-sm">transaktions-ID från Stripe/Klarna</td>
                    <td className="p-3 text-sm">fakturering</td>
                    <td className="p-3 text-sm">Rättslig skyldighet & avtal</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">3. Hur länge sparas informationen?</h2>
            <p className="leading-relaxed">Vi sparar affärsdata i 24 månader efter senaste inloggning, eller tidigare om du begär radering. Bokföringsuppgifter sparas enligt lag i 7 år.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">4. Tredje parter & överföring utanför EU</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>OpenAI Ireland Ltd. (AI-processning) – datacenter i EU.</li>
              <li>Stripe Payments Europe – betalningar.</li>
              <li>Amazon Web Services EU-West (Irland) – hosting.</li>
              <li>Överföringar utanför EU sker endast med giltiga skyddsmekanismer (EU-standardavtalsklausuler).</li>
            </ul>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">5. Dina rättigheter</h2>
            <p className="leading-relaxed">Du har rätt till tillgång, rättelse, radering, begränsning, dataportabilitet och invändning enligt GDPR. Kontakta privacy@frejfund.com. Om du anser att vi behandlar dina uppgifter felaktigt kan du klaga hos IMY.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">6. Cookies</h2>
            <p className="leading-relaxed">Se separat Cookiepolicy.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">7. Kontakt</h2>
            <p className="leading-relaxed">
              E-post: <a href="mailto:privacy@frejfund.com" className="text-[#16475b] hover:underline">privacy@frejfund.com</a><br />
              Telefon: <a href="tel:+46812345678" className="text-[#16475b] hover:underline">+46 8 123 456 78</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 