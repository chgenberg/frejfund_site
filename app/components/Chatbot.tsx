"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const EXAMPLES = [
  "Hur fungerar FrejFunds AI-analys?",
  "Vad kostar tjänsten?",
  "Hur skyddas mina personuppgifter?",
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hej! Jag är FrejFunds AI-medarbetare. Hur kan jag hjälpa dig idag?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [feedback, setFeedback] = useState<{ [key: number]: 'up' | 'down' | null }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [messages, open, minimized]);

  const sendMessage = async (msg: string) => {
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setLoading(true);
    setTyping(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Tyvärr, något gick fel. Försök igen senare." }]);
    }
    setLoading(false);
    setTyping(false);
  };

  const handleFeedback = (idx: number, value: 'up' | 'down') => {
    setFeedback((prev) => ({ ...prev, [idx]: value }));
  };

  // Animation classes
  const popupAnim = open && !minimized ? "animate-chatbot-popup" : "";

  return (
    <>
      {/* Floating chat button */}
      {!open && (
        <button
          className="fixed bottom-6 right-6 z-50 bg-[#16475b] hover:bg-[#133a4a] text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl transition-all focus:outline-none"
          onClick={() => { setOpen(true); setMinimized(false); }}
          aria-label="Öppna chattbot"
        >
          💬
        </button>
      )}

      {/* Chat popup */}
      {open && (
        <div className={`fixed bottom-6 right-6 z-50 w-[95vw] max-w-sm sm:max-w-md bg-[#16475b] text-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/10 ${popupAnim}`}
          style={{ display: minimized ? "none" : "flex" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/20 bg-[#16475b]">
            <span className="font-bold text-lg flex items-center gap-2">
              <Image src="/avatar.png" alt="Bot" width={28} height={28} className="rounded-full bg-white/10" />
              FrejFund AI
            </span>
            <div className="flex gap-2">
              <button
                className="text-white/70 hover:text-white text-xl font-bold focus:outline-none"
                onClick={() => setMinimized(true)}
                aria-label="Minimera chatt"
                title="Minimera"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect y="9" width="20" height="2" rx="1" fill="currentColor" /></svg>
              </button>
              <button
                className="text-white/70 hover:text-white text-2xl font-bold focus:outline-none"
                onClick={() => setOpen(false)}
                aria-label="Stäng chatt"
                title="Stäng"
              >
                ×
              </button>
            </div>
          </div>

          {/* Example questions */}
          <div className="px-6 pt-4 pb-2 flex flex-wrap gap-2">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                className="bg-white/10 hover:bg-white/20 text-white text-sm rounded-full px-4 py-2 transition-colors border border-white/10"
                onClick={() => sendMessage(ex)}
                disabled={loading}
              >
                {ex}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 px-6 py-2 overflow-y-auto max-h-72 custom-scrollbar">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`my-2 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <Image src="/avatar.png" alt="Bot" width={28} height={28} className="rounded-full bg-white/10 mr-2 flex-shrink-0" />
                )}
                {msg.role === "user" && (
                  <span className="rounded-full bg-white/20 text-white w-7 h-7 flex items-center justify-center mr-2 flex-shrink-0">🧑‍💻</span>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 max-w-[80%] text-sm whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-white/20 text-white"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {msg.content}
                  {/* Feedback for bot answers */}
                  {msg.role === "assistant" && i !== 0 && (
                    <div className="flex gap-1 mt-2">
                      <button
                        className={`p-1 rounded-full hover:bg-white/20 transition-colors ${feedback[i] === 'up' ? 'bg-white/20' : ''}`}
                        onClick={() => handleFeedback(i, 'up')}
                        aria-label="Bra svar"
                        type="button"
                      >
                        👍
                      </button>
                      <button
                        className={`p-1 rounded-full hover:bg-white/20 transition-colors ${feedback[i] === 'down' ? 'bg-white/20' : ''}`}
                        onClick={() => handleFeedback(i, 'down')}
                        aria-label="Dåligt svar"
                        type="button"
                      >
                        👎
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {/* Typing indicator */}
            {typing && (
              <div className="my-2 flex justify-start items-center gap-2">
                <Image src="/avatar.png" alt="Bot" width={28} height={28} className="rounded-full bg-white/10 mr-2 flex-shrink-0" />
                <div className="rounded-2xl px-4 py-2 bg-white/10 text-white text-sm flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:0ms]"></span>
                  <span className="inline-block w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:150ms]"></span>
                  <span className="inline-block w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:300ms]"></span>
                  <span className="ml-2">Skriver...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            className="flex items-center gap-2 px-6 py-4 border-t border-white/20 bg-[#16475b]"
            onSubmit={e => {
              e.preventDefault();
              if (!loading) sendMessage(input);
            }}
          >
            <input
              className="flex-1 rounded-full px-4 py-2 text-[#16475b] bg-white placeholder:text-[#16475b]/60 focus:outline-none text-sm"
              type="text"
              placeholder="Skriv din fråga..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              className="bg-white text-[#16475b] rounded-full px-4 py-2 font-bold text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
              disabled={loading || !input.trim()}
            >
              Skicka
            </button>
          </form>
        </div>
      )}

      {/* Minimized button */}
      {open && minimized && (
        <button
          className="fixed bottom-6 right-6 z-50 bg-[#16475b] hover:bg-[#133a4a] text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl transition-all focus:outline-none border-2 border-white/20"
          onClick={() => setMinimized(false)}
          aria-label="Maximera chattbot"
        >
          <Image src="/avatar.png" alt="Bot" width={32} height={32} className="rounded-full" />
        </button>
      )}

      {/* Animations */}
      <style jsx global>{`
        @keyframes chatbot-popup {
          0% { transform: scale(0.8) translateY(40px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-chatbot-popup {
          animation: chatbot-popup 0.35s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </>
  );
} 