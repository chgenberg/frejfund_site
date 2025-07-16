'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you can add logic to handle the form
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
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#16475b] tracking-widest text-center mb-10 mt-2 uppercase">CONTACT</h1>
      {/* Background Image */}
      <div className="w-full max-w-sm">
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold text-[#16475b] tracking-wide">Have questions?</h2>
          <p className="text-[#16475b]/80 mt-1">Fill out the form and we'll get back to you shortly.</p>
        </div>
        {/* Contact form */}
        <div className="w-full mt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white/90 rounded-2xl shadow-md border border-gray-100 p-6">
            <label className="font-semibold text-[#16475b]" htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#16475b]/40 text-gray-800 bg-white"
              placeholder="Your name"
            />
            <label className="font-semibold text-[#16475b]" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#16475b]/40 text-gray-800 bg-white"
              placeholder="your@email.com"
            />
            <label className="font-semibold text-[#16475b]" htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#16475b]/40 text-gray-800 bg-white resize-none"
              placeholder="Your message..."
            />
            <button
              type="submit"
              className="bg-[#16475b] text-white rounded-xl px-6 py-3 font-bold hover:bg-[#16475b]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#16475b]/40"
            >
              Send message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 