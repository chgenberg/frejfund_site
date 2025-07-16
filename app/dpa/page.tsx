"use client";
import Image from 'next/image';

export default function DPA() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12">
      <Image
        src="/bakgrund.png"
        alt="Background"
        fill
        className="object-cover -z-10"
        priority
      />
      <div className="w-full max-w-4xl mx-auto bg-white/95 rounded-3xl shadow-xl p-8 md:p-12 border border-white/20 backdrop-blur-md">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-12 text-center text-[#16475b] tracking-tight">
          Data Processing Agreement
          <span className="block text-lg font-normal text-gray-600 mt-2">DPA</span>
        </h1>
        
        <div className="space-y-10 text-gray-800">
          <p className="text-sm italic text-gray-600 bg-white/50 rounded-2xl p-6 border border-gray-100">
            Only applies if the customer uploads personal data (e.g., customer lists in a CSV for market benchmarking).
          </p>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Parties</h2>
            <p className="leading-relaxed">Data Controller = Customer; Data Processor = Christopher Genberg AB.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Nature & Purpose of Processing</h2>
            <p className="leading-relaxed">AI-based analysis of file attachments uploaded by the customer.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Categories of Personal Data</h2>
            <p className="leading-relaxed">Names, email addresses, titles, and business statistics.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Sub-processors</h2>
            <p className="leading-relaxed">OpenAI, AWS, Stripe – see <a href="/integritet" className="text-[#16475b] hover:underline">Privacy Policy</a>. Customer approves these.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Security Measures</h2>
            <p className="leading-relaxed">Encryption in transit (TLS 1.3) & at rest (AES-256). Role-based access control, 2FA for staff.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Incident Reporting</h2>
            <p className="leading-relaxed">FrejFund informs the customer within 48 hours after discovering a personal data incident.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Processor Assistance</h2>
            <p className="leading-relaxed">FrejFund assists the customer upon request with data subject access requests, deletion, etc.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Data Retention</h2>
            <p className="leading-relaxed">Data is deleted or anonymized 30 days after contract termination, unless law requires longer storage.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Audit</h2>
            <p className="leading-relaxed">Customer has the right to annual audit or SOC 2 report.</p>
          </section>
        </div>
      </div>
    </div>
  );
} 