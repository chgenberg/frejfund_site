"use client";

export default function Cookies() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl mx-auto bg-white/95 rounded-3xl shadow-xl p-8 md:p-12 border border-white/20 backdrop-blur-md">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-12 text-center text-[#16475b] tracking-tight">
          Cookiepolicy
        </h1>
        <div className="space-y-6 text-gray-800">
          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Användning av Cookies</h2>
            <p className="mb-4">
              Vi använder oss av cookies (kakor) för att förbättra din upplevelse. Genom att använda vår tjänst godkänner du vår användning av cookies.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 