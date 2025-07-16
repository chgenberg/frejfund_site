"use client";
import Image from 'next/image';

export default function Terms() {
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
          Terms and Conditions
        </h1>
        
        <div className="space-y-10 text-gray-800">
          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Service</h2>
            <p className="leading-relaxed">FrejFund is a cloud-based platform for AI-based business analysis and investor matching.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Account & Authorization</h2>
            <p className="leading-relaxed">You are responsible for keeping your login credentials confidential. Accounts may not be shared.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Payment</h2>
            <p className="leading-relaxed">Prices are shown excluding VAT. Payment is made via Stripe/Klarna.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Data Protection</h2>
            <p className="leading-relaxed">We process data according to our <a href="/integritet" className="text-[#16475b] hover:underline">Privacy Policy</a>. Information that customers enter in the analysis is stored for evaluation and analysis to improve our service.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Intellectual Property Rights</h2>
            <p className="leading-relaxed">All code, graphics and report engine belong to Christopher Genberg AB. You own your input data and generated reports.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Limitation of Liability</h2>
            <p className="leading-relaxed">The service is provided &quot;as is&quot;. FrejFund is not liable for indirect damages or lost profits. The liability ceiling corresponds to fees you have paid in the last 12 months.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Force Majeure</h2>
            <p className="leading-relaxed">We are not liable for events beyond our reasonable control.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Disputes</h2>
            <p className="leading-relaxed">Swedish law applies. Disputes are decided by Stockholm District Court.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Cookies</h2>
            <p className="mb-4">
                This website uses cookies to improve your experience. By using the website, you agree to our use of cookies.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 