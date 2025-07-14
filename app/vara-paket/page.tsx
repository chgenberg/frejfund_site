"use client";
import { useState } from 'react';
import CapitalChanceCalculator from '../components/CapitalChanceCalculator';

export default function VaraPaket() {
  const [input, setInput] = useState<number>(1500000);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-2 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#16475b] tracking-widest text-center mb-10 mt-2 uppercase">VÅRA PAKET</h1>
      {/* ... rest of the component */}
    </div>
  );
} 