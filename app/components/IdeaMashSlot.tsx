"use client";
import { useState, useRef } from "react";
import Image from "next/image";

const TARGETS = [
  "Studenter",
  "Seniorer",
  "Småföretag",
  "Miljöaktivister",
  "Digitala nomader",
  "Föräldrar",
  "Musiker",
  "E-handlare",
  "Idrottare",
  "Lantbrukare",
];
const TECHS = [
  "AI",
  "Blockchain",
  "IoT",
  "App",
  "Webbplattform",
  "3D-printing",
  "AR/VR",
  "Chattbot",
  "Wearables",
  "Automatisering",
];
const MODELS = [
  "Abonnemang",
  "Freemium",
  "Marknadsplats",
  "Pay-per-use",
  "Licens",
  "Reklamfinansierad",
  "Crowdfunding",
  "Konsulttjänst",
  "Plattform",
  "SaaS",
];

function getRandom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function IdeaMashSlot() {
  const [spinning, setSpinning] = useState(false);
  const [target, setTarget] = useState(getRandom(TARGETS));
  const [tech, setTech] = useState(getRandom(TECHS));
  const [model, setModel] = useState(getRandom(MODELS));
  const [result, setResult] = useState<{ pitch: string; name: string } | null>(null);
  const [error, setError] = useState("");
  const [leverDown, setLeverDown] = useState(false);
  const leverRef = useRef<HTMLDivElement>(null);

  const spin = async () => {
    setSpinning(true);
    setResult(null);
    setError("");
    setLeverDown(true);
    setTimeout(() => setLeverDown(false), 400);
    // Animate slots
    let t = 0;
    const spinTime = 1200;
    const interval = 60;
    const steps = spinTime / interval;
    const spinAnim = setInterval(() => {
      setTarget(getRandom(TARGETS));
      setTech(getRandom(TECHS));
      setModel(getRandom(MODELS));
      t++;
      if (t > steps) {
        clearInterval(spinAnim);
        // Pick final
        const finalTarget = getRandom(TARGETS);
        const finalTech = getRandom(TECHS);
        const finalModel = getRandom(MODELS);
        setTarget(finalTarget);
        setTech(finalTech);
        setModel(finalModel);
        // Call API
        fetch("/api/idea-mash", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target: finalTarget, tech: finalTech, model: finalModel }),
        })
          .then(res => res.json())
          .then(data => {
            if (data.pitch && data.name) {
              setResult({ pitch: data.pitch, name: data.name });
            } else {
              setError("Kunde inte generera en idé just nu.");
            }
            setSpinning(false);
          })
          .catch(() => {
            setError("Kunde inte generera en idé just nu.");
            setSpinning(false);
          });
      }
    }, interval);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-16 px-2">
      {/* Slot machine body */}
      <div className="relative flex flex-col items-center">
        {/* Lamps top */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {[...Array(7)].map((_, i) => (
            <span
              key={i}
              className="w-4 h-4 rounded-full bg-white shadow-[0_0_8px_2px_#7edcff] border-2 border-[#16475b]"
              style={{ filter: `blur(${i % 2 === 0 ? 0 : 1}px)` }}
            />
          ))}
        </div>
        {/* Slot machine main */}
        <div className="relative flex flex-col items-center justify-center bg-[#16475b] rounded-[2.5rem] shadow-2xl border-4 border-white/20 px-12 pt-20 pb-16 min-w-[420px] max-w-full" style={{ boxShadow: '0 8px 40px #16475b55' }}>
          {/* Brain icon */}
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-10">
            <Image src="/brain.png" alt="Brain" width={70} height={50} className="opacity-90" />
          </div>
          {/* Slot windows or result */}
          {result ? (
            <div className="flex flex-col items-center justify-center bg-white/95 rounded-2xl shadow-xl border border-white/20 px-6 py-8 w-full max-w-md min-h-[120px] animate-fade-in z-20">
              <div className="text-[#16475b] text-2xl font-extrabold mb-2">{result.name}</div>
              <div className="text-gray-800 text-lg leading-relaxed">{result.pitch}</div>
            </div>
          ) : (
            <div className="flex flex-row gap-8 bg-[#eaf6fa] rounded-2xl shadow-inner px-8 py-12 border-2 border-[#7edcff] relative z-10 mb-2">
              {[target, tech, model].map((word, i) => (
                <div
                  key={i}
                  className="w-36 h-28 flex items-center justify-center text-xs md:text-sm font-extrabold text-[#16475b] bg-white rounded-xl shadow-lg border-2 border-[#7edcff] mx-2 select-none transition-all duration-200 overflow-hidden"
                  style={{ fontFamily: 'Nunito, sans-serif', letterSpacing: '0.01em', textShadow: '0 2px 8px #7edcff44', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                >
                  <span className="truncate w-full text-center flex items-center justify-center h-full">{word}</span>
                </div>
              ))}
            </div>
          )}
          {/* Spin button inside machine */}
          <button
            className="mt-2 bg-gradient-to-br from-[#7edcff] to-[#16475b] text-white font-extrabold text-lg md:text-xl rounded-full px-10 md:px-14 py-4 md:py-6 shadow-2xl border-4 border-white hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none z-20"
            style={{ boxShadow: '0 0 24px #7edcff99' }}
            onClick={spinning ? undefined : spin}
            disabled={spinning}
          >
            {spinning ? "Snurrar..." : "SPIN!"}
          </button>
          {/* Lever (spak) */}
          <div
            ref={leverRef}
            className={`absolute right-[-56px] top-1/2 -translate-y-1/2 flex flex-col items-center z-20 select-none`}
            style={{ userSelect: 'none' }}
          >
            <div
              className={`w-5 h-32 bg-gradient-to-b from-[#eaf6fa] to-[#7edcff] rounded-full border-2 border-[#16475b] shadow-lg transition-transform duration-300 ${leverDown ? 'translate-y-10 rotate-12' : ''}`}
              style={{ transformOrigin: 'top center' }}
            />
            <button
              className={`w-12 h-12 bg-gradient-to-br from-[#7edcff] to-[#16475b] border-4 border-white rounded-full shadow-xl mt-[-10px] transition-all duration-200 ${leverDown ? 'scale-90' : ''}`}
              style={{ boxShadow: '0 0 16px #7edcff99' }}
              onClick={spinning ? undefined : spin}
              aria-label="Dra i spaken"
              disabled={spinning}
            />
          </div>
          {/* Lamps right */}
          <div className="absolute right-[-40px] top-12 flex flex-col gap-3 z-10">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="w-4 h-4 rounded-full bg-white shadow-[0_0_8px_2px_#7edcff] border-2 border-[#16475b]" />
            ))}
          </div>
          {/* Lamps left */}
          <div className="absolute left-[-40px] top-12 flex flex-col gap-3 z-10">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="w-4 h-4 rounded-full bg-white shadow-[0_0_8px_2px_#7edcff] border-2 border-[#16475b]" />
            ))}
          </div>
        </div>
      </div>
      {error && (
        <div className="text-red-400 font-semibold mt-4">{error}</div>
      )}
      {/* Glow effect */}
      <style jsx>{`
        .slot-glow {
          box-shadow: 0 0 32px 8px #7edcff99, 0 0 0 8px #16475b22;
        }
      `}</style>
    </div>
  );
} 