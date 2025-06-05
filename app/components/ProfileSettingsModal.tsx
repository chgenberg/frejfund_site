"use client"
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function ProfileSettingsModal({ open, onClose, userEmail, setUserEmail }: { open: boolean, onClose: () => void, userEmail: string, setUserEmail: (email: string) => void }) {
  const [email, setEmail] = useState(userEmail);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
      setMessage('E-post uppdaterad!');
      setUserEmail(email);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage('Lösenord uppdaterat!');
      setPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl font-bold">×</button>
        <h2 className="text-2xl font-bold mb-6 text-center text-[#16475b]">Profilinställningar</h2>
        <form onSubmit={handleEmailChange} className="mb-6">
          <label className="block mb-2 font-semibold text-gray-900">E-postadress</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded mb-2 text-gray-900" />
          <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-all" disabled={loading}>Uppdatera e-post</button>
        </form>
        <form onSubmit={handlePasswordChange}>
          <label className="block mb-2 font-semibold text-gray-900">Nytt lösenord</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded mb-2 text-gray-900" />
          <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-all" disabled={loading}>Uppdatera lösenord</button>
        </form>
        {message && <div className="mt-4 text-green-700 text-center font-semibold">{message}</div>}
        {error && <div className="mt-4 text-red-700 text-center font-semibold">{error}</div>}
      </div>
    </div>
  );
} 