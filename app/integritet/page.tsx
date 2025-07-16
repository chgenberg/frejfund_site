"use client";
import Image from 'next/image';
import React from 'react';

export default function IntegritetPage() {
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
          Privacy Policy
          <span className="block text-lg font-normal text-gray-600 mt-2">GDPR</span>
        </h1>
        
        <div className="space-y-10 text-gray-800">
          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">1. Who is the data controller?</h2>
            <p className="leading-relaxed">Christopher Genberg AB, Södra Skjutbanevägen 10, 439 55 Åsa, Sweden, is the data controller for the processing of your personal data.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">2. What data do we collect and why?</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border-b p-3 text-left text-sm font-semibold text-gray-600">Category</th>
                    <th className="border-b p-3 text-left text-sm font-semibold text-gray-600">Examples</th>
                    <th className="border-b p-3 text-left text-sm font-semibold text-gray-600">Purpose</th>
                    <th className="border-b p-3 text-left text-sm font-semibold text-gray-600">Legal basis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3 text-sm">Contact information</td>
                    <td className="p-3 text-sm">name, email</td>
                    <td className="p-3 text-sm">account creation, communications</td>
                    <td className="p-3 text-sm">Contract & legitimate interest</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3 text-sm">Business data</td>
                    <td className="p-3 text-sm">analysis form responses, pitch PDFs</td>
                    <td className="p-3 text-sm">AI analysis, report generation, service evaluation and improvement</td>
                    <td className="p-3 text-sm">Contract & legitimate interest</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3 text-sm">Technical data</td>
                    <td className="p-3 text-sm">IP address, cookie ID, logs</td>
                    <td className="p-3 text-sm">security, statistics</td>
                    <td className="p-3 text-sm">Legitimate interest</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3 text-sm">Payment data</td>
                    <td className="p-3 text-sm">transaction ID from Stripe/Klarna</td>
                    <td className="p-3 text-sm">billing</td>
                    <td className="p-3 text-sm">Legal obligation & contract</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">3. How long is information stored?</h2>
            <p className="leading-relaxed">We store business data for 24 months after the last login, or earlier if you request deletion. Accounting records are kept for 7 years as required by law.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">4. Third parties & transfers outside the EU</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>OpenAI Ireland Ltd. (AI processing) – data centers in the EU.</li>
              <li>Stripe Payments Europe – payments.</li>
              <li>Amazon Web Services EU-West (Ireland) – hosting.</li>
              <li>Transfers outside the EU only occur with valid safeguards (EU standard contractual clauses).</li>
            </ul>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">5. Your rights</h2>
            <p className="leading-relaxed">You have the right to access, rectification, erasure, restriction, data portability and objection under GDPR. Contact privacy@frejfund.com. If you believe we process your data incorrectly, you can complain to the Swedish Authority for Privacy Protection (IMY).</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">6. Cookies</h2>
            <p className="leading-relaxed">See separate Cookie Policy.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">7. Contact</h2>
            <p className="leading-relaxed">
              Email: <a href="mailto:privacy@frejfund.com" className="text-[#16475b] hover:underline">privacy@frejfund.com</a><br />
              Phone: <a href="tel:+46812345678" className="text-[#16475b] hover:underline">+46 8 123 456 78</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 