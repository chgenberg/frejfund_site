'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Kontakt() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Här kan du lägga till logik för att hantera formuläret
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-2 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#16475b] tracking-widest text-center mb-10 mt-2 uppercase">KONTAKT</h1>
      {/* Bakgrundsbild */}
      <Image
        src="/bakgrund.png"
        alt="Kontakt bakgrund"
        fill
        className="object-cover -z-10"
        priority
      />
      <div className="flex flex-col gap-10 w-full max-w-2xl items-center bg-white/90 rounded-3xl shadow-xl p-10 border border-gray-200 backdrop-blur-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold mb-4 text-[#01121f]">Christopher Genberg AB</h1>
          <p className="text-lg text-gray-800 font-medium mb-2">Södra Skjutbanevägen 10<br />439 55 Åsa, Sverige</p>
          <a href="mailto:info@christophergenberg.se" className="text-lg text-[#16475b] underline font-semibold">info@christophergenberg.se</a>
        </div>
        <div className="w-full h-72 rounded-2xl overflow-hidden shadow-lg border border-gray-300">
          <iframe
            title="Google Maps Södra Skjutbanevägen 10, Åsa"
            src="https://www.google.com/maps?q=Södra+Skjutbanevägen+10,+439+55+Åsa,+Sverige&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        {/* Kontaktformulär */}
        <div className="w-full mt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white/90 rounded-2xl shadow-md border border-gray-100 p-6">
            <label className="font-semibold text-[#16475b]" htmlFor="name">Namn</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#16475b]/40 text-gray-800 bg-white"
              placeholder="Ditt namn"
            />
            <label className="font-semibold text-[#16475b]" htmlFor="email">E-post</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#16475b]/40 text-gray-800 bg-white"
              placeholder="din@email.se"
            />
            <label className="font-semibold text-[#16475b]" htmlFor="message">Meddelande</label>
            <textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              className="rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#16475b]/40 text-gray-800 bg-white min-h-[100px]"
              placeholder="Skriv ditt meddelande här..."
            />
            <button
              type="submit"
              className="mt-2 bg-[#16475b] text-white font-bold rounded-full px-8 py-3 shadow-lg hover:bg-[#133a4a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#16475b]/40"
            >
              Skicka
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 