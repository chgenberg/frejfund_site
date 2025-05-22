"use client";
import { useState, useEffect } from "react";

let openLoginModal: (() => void) | null = null;
export function useLoginModal() {
  return () => {
    if (openLoginModal) openLoginModal();
  };
}

export default function LoginModal() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    openLoginModal = () => {
      setOpen(true);
      setTab('login');
      setForm({ email: '', password: '', confirm: '' });
      setError('');
    };
    return () => { openLoginModal = null; };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (tab === 'login') {
        if (form.email === 'demo@frejfund.com' && form.password === 'demo123') {
          setError('');
          setOpen(false);
          alert('Inloggning lyckades! (Mock)');
        } else {
          setError('Fel e-post eller lösenord. Testa demo@frejfund.com / demo123');
        }
      } else {
        if (!form.email.includes('@') || form.password.length < 6) {
          setError('Ange giltig e-post och minst 6 tecken i lösenord.');
        } else if (form.password !== form.confirm) {
          setError('Lösenorden matchar inte.');
        } else {
          setError('');
          setOpen(false);
          alert('Registrering lyckades! (Mock)');
        }
      }
      setLoading(false);
    }, 1200);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white/95 rounded-3xl shadow-2xl border border-white/20 px-8 py-10 max-w-sm w-full flex flex-col items-center animate-fade-in relative">
        <button
          className="absolute top-4 right-4 text-[#16475b] text-2xl font-bold hover:text-[#0d2a36] focus:outline-none"
          onClick={() => setOpen(false)}
          aria-label="Stäng"
        >
          ×
        </button>
        <div className="flex gap-4 mb-6">
          <button
            className={`font-bold text-lg px-2 pb-1 border-b-2 transition-all uppercase tracking-widest ${tab === 'login' ? 'text-[#16475b] border-[#16475b]' : 'text-gray-400 border-transparent'}`}
            onClick={() => { setTab('login'); setError(''); }}
          >
            LOGGA IN
          </button>
          <button
            className={`font-bold text-lg px-2 pb-1 border-b-2 transition-all uppercase tracking-widest ${tab === 'register' ? 'text-[#16475b] border-[#16475b]' : 'text-gray-400 border-transparent'}`}
            onClick={() => { setTab('register'); setError(''); }}
          >
            REGISTRERA
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <label className="font-semibold text-[#16475b]" htmlFor="email">E-post</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#16475b]/40 text-gray-800 bg-white"
            placeholder="din@email.se"
            autoComplete="username"
          />
          <label className="font-semibold text-[#16475b]" htmlFor="password">Lösenord</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            className="rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#16475b]/40 text-gray-800 bg-white"
            placeholder="••••••••"
            autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
          />
          {tab === 'register' && (
            <>
              <label className="font-semibold text-[#16475b]" htmlFor="confirm">Bekräfta lösenord</label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                required
                value={form.confirm}
                onChange={handleChange}
                className="rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#16475b]/40 text-gray-800 bg-white"
                placeholder="Bekräfta lösenord"
                autoComplete="new-password"
              />
            </>
          )}
          {error && <div className="text-red-500 text-sm font-semibold text-center mt-2">{error}</div>}
          <button
            type="submit"
            className="mt-4 bg-[#16475b] text-white font-bold rounded-full px-8 py-3 shadow-lg hover:bg-[#133a4a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#16475b]/40 text-lg tracking-widest uppercase"
            disabled={loading}
          >
            {loading ? (tab === 'login' ? 'Loggar in...' : 'Registrerar...') : (tab === 'login' ? 'LOGGA IN' : 'REGISTRERA')}
          </button>
        </form>
      </div>
    </div>
  );
} 