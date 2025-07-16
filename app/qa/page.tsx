"use client";
import Image from 'next/image';
import { useState } from 'react';

interface QAItem {
  q: string;
  a: string;
}

const qaData: QAItem[] = [
  { q: '1. What is FrejFund in a nutshell?', a: 'FrejFund is an end-to-end platform for AI analysis, investment pitching and investor matching.' },
  { q: '2. How do you create a business analysis – and how long does it take?', a: 'You fill out an interactive questionnaire, upload your pitch/PDF. Get AI pitch & Analysis – which can be downloaded as PDF.' },
  { q: '3. Is it open to companies outside the EU – does this mean investors can connect internationally on the same terms?', a: 'Yes, but you are responsible for following local regulations. The platform is built for export, but investors are primarily EU-based.' },
  { q: '4. How is data protection handled? (GDPR)', a: 'All data is stored in the EU and never shared without approval. We follow Schrems II and have DPA with OpenAI.' },
  { q: '5. Can you upload Excel and PDF?', a: 'Yes, you can upload Excel and PDF to the analysis.' },
  { q: '6. How does investor matching work?', a: 'The AI matches you with relevant investors based on your analysis and preferences.' },
  { q: '7. How long does it take to get a response?', a: 'Usually within 24 hours, sometimes faster.' },
  { q: '8. How many investors are on the platform?', a: 'Over 70 active investors and networks.' },
  { q: '9. What does it cost?', a: 'Basic analysis is free. Premium analysis and investor matching have a fee.' },
  { q: '10. Which investors get to see my pitch?', a: 'Only those you choose to share with.' },
  { q: '11. Can I invite the team to fill it out?', a: 'Yes, you can invite co-founders and team members.' },
  { q: '12. How is my pitch and data protected?', a: 'All data is encrypted and never shared without your approval.' },
  { q: '13. How is personal data handled?', a: 'We follow GDPR and Schrems II. All data is stored in the EU.' },
  { q: '14. Can I get help improving my pitch?', a: 'Yes, the AI provides concrete improvement suggestions and templates.' },
  { q: '15. Can investors contact me directly?', a: 'Yes, if you approve it.' },
  { q: '16. Can investors see who else has pitched?', a: 'No, only those you share with.' },
  { q: '17. How does the Premium analysis work?', a: 'You get a deeper AI analysis, more data points and a professional PDF report.' },
  { q: '18. Can you use FrejFund for grant applications?', a: 'Yes, the analysis can be used as a basis for e.g. Vinnova, Almi, EU SME, EIC Accelerator.' },
  { q: '19. Can you use FrejFund for due diligence?', a: 'Yes, the report can be used as a basis for due diligence.' },
  { q: '20. Who is behind FrejFund?', a: 'Team and investors with backgrounds from AI, startups, venture capital and law.' },
  { q: '21. How do I contact support or give feedback?', a: 'Email support@frejfund.com.' },
  { q: '22. Which languages are supported?', a: 'Swedish and English.' },
  { q: '23. How do I report bugs or errors?', a: 'Email support@frejfund.com.' },
  { q: '24. What happens if I\'m not satisfied?', a: 'Forms, support and the Pitch-Fix guide are available to help you – with clarification and path to product development.' },
];

export default function QA() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-2 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#16475b] tracking-widest text-center mb-10 mt-2 uppercase">Q&amp;A</h1>
      {/* Background image */}
      <Image
        src="/bakgrund.png"
        alt="Q&A background"
        fill
        className="object-cover -z-10"
        priority
      />
      <div className="w-full max-w-3xl mx-auto bg-white/90 rounded-3xl shadow-xl p-8 border border-gray-200 backdrop-blur-md">
        <div className="flex flex-col gap-4">
          {qaData.map((item, i) => (
            <div key={i} className="rounded-2xl bg-white/80 border border-gray-200 shadow-md overflow-hidden">
              <button
                className="w-full text-left px-6 py-4 font-bold text-lg text-[#16475b] flex justify-between items-center focus:outline-none"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-controls={`qa-answer-${i}`}
              >
                <span>{item.q}</span>
                <span className={`ml-4 transition-transform ${open === i ? 'rotate-90' : ''}`}>▶</span>
              </button>
              {open === i && (
                <div id={`qa-answer-${i}`} className="px-6 pb-4 text-gray-800 text-base animate-fade-in">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 