"use client";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import { useState } from "react";

export default function MinaSidor() {
  const { user, logout } = useAuth();
  // Mock data
  const analyser = [
    { title: "AI för e-handel", updated: "2024-05-20", percent: 60 },
  ];
  const rapporter = [];
  const inbox = [
    { msg: "Tips: färdigställ analysen för att få din första score!", date: "2024-05-21" },
  ];
  const [pitchCount] = useState(1);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-2 py-12">
      <Image
        src="/bakgrund.png"
        alt="Bakgrund"
        fill
        className="object-cover -z-10"
        priority
      />
      {/* Top bar */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Image src="/logo.png" alt="Logo" width={120} height={40} className="object-contain" />
        </div>
        <div className="text-[#16475b] font-bold text-lg tracking-widest uppercase">Mina Sidor</div>
        <button onClick={logout} className="bg-[#16475b] text-white rounded-full px-5 py-2 font-bold shadow hover:bg-[#133a4a] transition-colors">Logga ut</button>
      </div>
      <div className="w-full max-w-5xl flex flex-col gap-8">
        {/* 1. Välkomstpanel */}
        <div className="bg-white/95 rounded-2xl shadow-xl border border-white/20 p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-2xl font-extrabold text-[#16475b] mb-1">Välkommen tillbaka, {user?.name || "Gäst"}!</div>
            <span className="inline-block bg-[#7edcff] text-[#16475b] font-bold rounded-full px-4 py-1 text-xs tracking-widest mb-2">SILVER – GRATIS</span>
            <div className="text-gray-700 mb-2">Redo att ta nästa steg?</div>
          </div>
          <button className="bg-[#16475b] text-white font-bold rounded-full px-8 py-3 shadow-lg hover:bg-[#133a4a] transition-colors text-lg tracking-widest uppercase">Kör första analysen</button>
        </div>
        {/* 2. Påbörjade analyser & 3. Historik */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 bg-white/90 rounded-2xl shadow-md border border-white/20 p-6">
            <div className="font-bold text-[#16475b] text-lg mb-4 tracking-widest uppercase">Påbörjade analyser</div>
            {analyser.length === 0 ? (
              <div className="text-gray-400">Inga påbörjade analyser än.</div>
            ) : (
              analyser.map((a, i) => (
                <div key={i} className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-semibold text-[#16475b]">{a.title}</div>
                    <div className="text-xs text-gray-500">Senast sparad: {a.updated}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-600">{a.percent}%</div>
                    <button className="bg-[#7edcff] text-[#16475b] font-bold rounded-full px-4 py-1 text-xs shadow hover:bg-[#16475b] hover:text-white transition-colors">Fortsätt</button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex-1 bg-white/90 rounded-2xl shadow-md border border-white/20 p-6">
            <div className="font-bold text-[#16475b] text-lg mb-4 tracking-widest uppercase">Historik & rapporter</div>
            {rapporter.length === 0 ? (
              <div className="text-gray-400">0 rapporter än – <button className="underline text-[#16475b]">Kör din första analys!</button></div>
            ) : (
              rapporter.map((r, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <span className="text-[#16475b] font-bold">PDF</span>
                  <span className="text-xs text-gray-500">{r.date}</span>
                  <button className="underline text-[#16475b]">Öppna</button>
                </div>
              ))
            )}
          </div>
        </div>
        {/* 4. Uppgradera-teaser */}
        <div className="bg-[#eaf6fa] rounded-2xl shadow border border-[#7edcff] p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="font-bold text-[#16475b] text-lg mb-2 tracking-widest uppercase">Silver vs Gold</div>
          <ul className="flex-1 flex flex-col md:flex-row gap-2 md:gap-8 text-[#16475b] text-sm">
            <li>✔ Obegränsade analyser</li>
            <li>✔ PDF-rapport</li>
            <li className="text-[#bdbdbd] line-through">AI-coach & investerarmatchning (Gold)</li>
          </ul>
          <button className="bg-[#16475b] text-white font-bold rounded-full px-8 py-3 shadow hover:bg-[#133a4a] transition-colors text-sm tracking-widest uppercase">Uppgradera</button>
        </div>
        {/* 5. Pitch-Pingvinen Light */}
        <div className="bg-white/90 rounded-2xl shadow-md border border-white/20 p-6 flex flex-col items-center">
          <div className="font-bold text-[#16475b] text-lg mb-2 tracking-widest uppercase">Pitch-Pingvinen Light</div>
          <button className="w-16 h-16 rounded-full bg-[#16475b] flex items-center justify-center mb-2 shadow-lg border-4 border-white">
            <Image src="/mic.png" alt="Mic" width={32} height={32} style={{ filter: 'invert(1)' }} />
          </button>
          <div className="text-gray-700 text-sm mb-2">Du har {3 - pitchCount} pitchar kvar denna månad.</div>
          <div className="w-24 h-24 mb-2">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" stroke="#eaf6fa" strokeWidth="12" fill="none" />
              <circle
                cx="60" cy="60" r="54"
                stroke="#7edcff"
                strokeWidth="12"
                fill="none"
                strokeDasharray={339.292}
                strokeDashoffset={339.292 - (0.7 * 339.292)}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s' }}
              />
              <text x="50%" y="54%" textAnchor="middle" dy=".3em" fontSize="1.5em" fill="#16475b" fontWeight="bold">70%</text>
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-[#7edcff] text-[#16475b] font-bold rounded-full px-4 py-1 text-xs shadow hover:bg-[#16475b] hover:text-white transition-colors">Spara rapport</button>
            <span className="text-gray-400"><svg width="20" height="20" fill="none"><circle cx="10" cy="10" r="8" stroke="#bdbdbd" strokeWidth="2" /><path d="M6 10l2 2 4-4" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
          </div>
        </div>
        {/* 6. Inbox & 9. Resurser */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 bg-white/90 rounded-2xl shadow-md border border-white/20 p-6">
            <div className="font-bold text-[#16475b] text-lg mb-2 tracking-widest uppercase">Inbox / Notiser</div>
            {inbox.length === 0 ? (
              <div className="text-gray-400">Inga meddelanden än.</div>
            ) : (
              inbox.map((n, i) => (
                <div key={i} className="mb-2 text-gray-700 text-sm flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-[#7edcff] rounded-full"></span>
                  <span>{n.msg}</span>
                  <span className="text-xs text-gray-400">{n.date}</span>
                </div>
              ))
            )}
          </div>
          <div className="flex-1 bg-white/90 rounded-2xl shadow-md border border-white/20 p-6">
            <div className="font-bold text-[#16475b] text-lg mb-2 tracking-widest uppercase">Resurser & Hjälp</div>
            <ul className="text-[#16475b] text-sm flex flex-col gap-2">
              <li><a href="/qa" className="underline">Q&amp;A</a></li>
              <li><a href="#" className="underline">Kunskapsbank / blogg</a></li>
              <li><a href="#" className="underline">Boka introkall (15 min)</a></li>
            </ul>
          </div>
        </div>
        {/* 7. Profil & konto */}
        <div className="bg-white/90 rounded-2xl shadow-md border border-white/20 p-6">
          <div className="font-bold text-[#16475b] text-lg mb-2 tracking-widest uppercase">Profil & Konto</div>
          <div className="text-gray-700 text-sm mb-2">E-post: <span className="font-semibold">{user?.email}</span> <span className="ml-2 text-green-500">Verifierad</span></div>
          <div className="text-gray-700 text-sm mb-2">Företagsnamn: <span className="font-semibold">-</span></div>
          <div className="text-gray-700 text-sm mb-2">Lösenord: <span className="font-semibold">••••••••</span></div>
          <button className="text-red-500 underline text-xs mt-2">Radera konto (GDPR)</button>
        </div>
        {/* 8. Settings – Data & Integritet */}
        <div className="bg-white/90 rounded-2xl shadow-md border border-white/20 p-6">
          <div className="font-bold text-[#16475b] text-lg mb-2 tracking-widest uppercase">Data & Integritet</div>
          <div className="text-gray-700 text-sm mb-2">Ladda ner rådata: <button className="underline text-[#16475b]">JSON</button></div>
          <div className="flex items-center gap-4 mb-2">
            <label className="text-gray-700 text-sm">E-post</label>
            <input type="checkbox" className="accent-[#16475b]" defaultChecked />
            <label className="text-gray-700 text-sm">Cookies</label>
            <input type="checkbox" className="accent-[#16475b]" defaultChecked />
            <label className="text-gray-700 text-sm">Tracking</label>
            <input type="checkbox" className="accent-[#16475b]" />
          </div>
          <div className="text-gray-500 text-xs">Så lagrar vi dina svar (24 mån).</div>
        </div>
      </div>
    </div>
  );
} 