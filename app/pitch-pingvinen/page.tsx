"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import PitchGenerator from '../components/PitchGenerator';

export default function PitchPingvinen() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [listening, setListening] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [progress, setProgress] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    setFeedback("");
    setScore(null);
    setAudioUrl(null);
    setRecording(true);
    setListening(false);
    setShowPopup(false);
    setProgress(0);
    chunks.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new window.MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };
    mediaRecorder.onstop = () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
      setProgress(0);
      const blob = new Blob(chunks.current, { type: 'audio/webm' });
      setAudioUrl(URL.createObjectURL(blob));
      setListening(true);
      // Send to API for real feedback
      const formData = new FormData();
      formData.append('audio', blob, 'pitch.webm');
      fetch('/api/pitch-pingvinen', {
        method: 'POST',
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          setScore(data.score);
          setFeedback(data.feedback);
          setListening(false);
          setShowPopup(true);
        })
        .catch(() => {
          setScore(Math.floor(Math.random() * 41) + 60);
          setFeedback('Kunde inte analysera pitchen. Försök igen!');
          setListening(false);
          setShowPopup(true);
        });
    };
    mediaRecorder.start();
    // Progress bar logic
    let elapsed = 0;
    progressInterval.current = setInterval(() => {
      elapsed += 100;
      setProgress(Math.min(elapsed / 20000, 1));
      if (elapsed >= 20000) {
        if (mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
          setRecording(false);
        }
        if (progressInterval.current) clearInterval(progressInterval.current);
      }
    }, 100);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (progressInterval.current) clearInterval(progressInterval.current);
      setProgress(0);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-extrabold text-[#16475b] tracking-widest text-center mb-10 mt-2 uppercase">PITCH-PINGVINEN</h1>
      
      {/* Bakgrundsbild */}
      <Image
        src="/bakgrund.png"
        alt="Bakgrund"
        fill
        className="object-cover -z-10"
        priority
      />

      <div className="w-full max-w-6xl flex flex-col gap-12">
        {/* Huvudfunktion: Pitch-Pingvinen */}
        <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto mb-2 bg-white/90 rounded-3xl shadow-xl p-10 border border-gray-200">
          <h2 className="text-2xl font-bold text-[#16475b] mb-4 text-center">Spela in din pitch</h2>
          <p className="text-[#16475b] text-center mb-4 text-lg font-medium">
            Tryck på mikrofonen och berätta din idé på max 20 sekunder.<br />
            <span className="font-semibold">Tips:</span> Fokusera på <span className="underline">vad du löser för kunden</span> (värdeerbjudande), varför just du/ni är rätt team och vad som gör idén unik.
          </p>
          <ul className="text-[#16475b] text-sm mb-4 bg-[#eaf6fa] rounded-xl p-4 border border-[#7edcff]/30 w-full max-w-md mx-auto">
            <li><b>Värdeerbjudande:</b> Vad får kunden ut? (Ex: "Vi hjälper småföretag att spara tid på bokföring.")</li>
            <li><b>Unikhet:</b> Vad gör er annorlunda än konkurrenterna?</li>
            <li><b>Team:</b> Varför är ni rätt personer att lyckas?</li>
          </ul>
          <Image src="/pingvin.png" alt="Pitch-Pingvinen" width={120} height={120} className={listening ? "animate-pulse" : ""} />
          <button
            className={`w-24 h-24 rounded-full flex items-center justify-center bg-[#16475b] text-white text-4xl shadow-lg border-4 border-white transition-all ${recording ? 'animate-pulse' : ''}`}
            onClick={recording ? stopRecording : startRecording}
            aria-label={recording ? "Stoppa inspelning" : "Starta inspelning"}
            disabled={listening}
          >
            {recording ? (
              <span className="material-icons" style={{ fontSize: 28 }}>stop</span>
            ) : (
              <Image src="/mic.png" alt="Mikrofon" width={44} height={44} style={{ filter: 'invert(1)' }} />
            )}
          </button>
          {/* Progress bar */}
          {recording && (
            <div className="w-full max-w-xs h-3 bg-[#eaf6fa] rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-[#7edcff] rounded-full transition-all duration-100"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          )}
          {audioUrl && (
            <audio controls src={audioUrl} className="mt-2" />
          )}
          {listening && <div className="text-[#16475b] font-bold animate-pulse mt-2">Pingvinen lyssnar...</div>}
          {/* Popup overlay for score/feedback */}
          {showPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="bg-white rounded-3xl shadow-2xl border border-[#7edcff]/30 px-10 py-12 max-w-xs w-full flex flex-col items-center animate-fade-in relative">
                <button
                  className="absolute top-4 right-4 text-[#16475b] text-2xl font-bold hover:text-[#0d2a36] focus:outline-none"
                  onClick={() => setShowPopup(false)}
                  aria-label="Stäng"
                >
                  ×
                </button>
                <div className="relative w-28 h-28 mb-2">
                  <svg className="w-full h-full" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" stroke="#eaf6fa" strokeWidth="12" fill="none" />
                    <circle
                      cx="60" cy="60" r="54"
                      stroke="#7edcff"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={339.292}
                      strokeDashoffset={339.292 - ((score || 0) / 100) * 339.292}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1s' }}
                    />
                    <text x="50%" y="54%" textAnchor="middle" dy=".3em" fontSize="2em" fill="#16475b" fontWeight="bold">{score}%</text>
                  </svg>
                </div>
                <div className="text-[#16475b] text-lg font-bold text-center mt-2">{feedback}</div>
              </div>
            </div>
          )}
        </div>
        {/* Inspiration/AI pitch-generator */}
        <div className="bg-gradient-to-br from-[#7edcff]/90 to-[#16475b]/90 text-white rounded-2xl shadow-xl border border-[#7edcff]/40 p-8 max-w-2xl mx-auto mt-2 flex flex-col items-center">
          <h3 className="text-2xl font-extrabold mb-2 text-center">Behöver du inspiration?</h3>
          <p className="text-white/90 text-center mb-4 text-lg">Låt AI skapa ett pitch-manus åt dig!<br />Fyll i tre snabba fält och få ett färdigt manus på 30 sekunder.<br /><span className='text-[#ffe066] font-semibold'>Tips: Testa olika värdeerbjudanden för att se vad som låter bäst!</span></p>
          <PitchGenerator />
        </div>
      </div>
    </div>
  );
} 