import { useState } from 'react';

interface SectionFeedbackProps {
  section: string;
  text: string;
}

export default function SectionFeedback({ section, text }: SectionFeedbackProps) {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetFeedback = async () => {
    setLoading(true);
    setError('');
    setFeedback('');
    try {
      const res = await fetch('/api/ai-section-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, text })
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback(data.feedback);
      } else {
        setError(data.error || 'Kunde inte hämta feedback.');
      }
    } catch {
      setError('Något gick fel. Försök igen.');
    }
    setLoading(false);
  };

  return (
    <div className="my-2">
      <button
        onClick={handleGetFeedback}
        disabled={loading || !text}
        className="px-4 py-2 bg-[#16475b] text-white rounded hover:bg-[#2a6b8a] disabled:opacity-50"
      >
        {loading ? 'Hämtar feedback...' : 'Hämta AI-feedback'}
      </button>
      {feedback && <div className="mt-2 text-sm text-[#16475b]">{feedback}</div>}
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
    </div>
  );
} 