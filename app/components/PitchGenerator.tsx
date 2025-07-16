"use client";

import { useState } from 'react';

interface PitchFormData {
  product: string;
  targetAudience: string;
  value: string;
  ask?: string;
}

export default function PitchGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [pitch, setPitch] = useState<string | null>(null);
  const [formData, setFormData] = useState<PitchFormData>({
    product: '',
    targetAudience: '',
    value: '',
    ask: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPitch(null);

    try {
      const response = await fetch('/api/generate-pitch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to generate pitch');
      
      const data = await response.json();
      setPitch(data.pitch);
    } catch (error) {
      console.error('Error generating pitch:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
          <input
            type="text"
            placeholder="What are you selling?"
            value={formData.product}
            onChange={(e) => setFormData({ ...formData, product: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#7edcff]"
            required
          />
        </div>
        <div className="col-span-1">
          <input
            type="text"
            placeholder="Who is your target audience?"
            value={formData.targetAudience}
            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#7edcff]"
            required
          />
        </div>
        <div className="col-span-1">
          <input
            type="text"
            placeholder="What is your value proposition?"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#7edcff]"
            required
          />
        </div>
        <div className="col-span-1">
          <input
            type="text"
            placeholder="What do you want? (optional)"
            value={formData.ask}
            onChange={(e) => setFormData({ ...formData, ask: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#7edcff]"
          />
        </div>
        <div className="col-span-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#7edcff] text-[#16475b] font-bold py-3 rounded-lg hover:bg-[#16475b] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating pitch...' : 'Create EPIC pitch'}
          </button>
        </div>
      </form>

      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-[#16475b] mb-4">Preparing an EPIC pitch...</h3>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#7edcff] rounded-full animate-pulse" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pitch Result */}
      {pitch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#16475b] rounded-2xl p-8 max-w-2xl w-full mx-4 relative text-white">
            <button
              onClick={() => setPitch(null)}
              className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-[#7edcff] focus:outline-none"
            >
              ×
            </button>
            <div className="prose prose-lg max-w-none prose-invert">
              <h3 className="text-xl font-bold mb-4">Your EPIC pitch</h3>
              <p className="whitespace-pre-line">{pitch}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 