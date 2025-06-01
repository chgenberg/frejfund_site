"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLoginModal } from './LoginModal';

export default function OverlayNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleLogoError = () => {
    console.error('Logo failed to load');
    setLogoError(true);
  };

  return (
    <>
      {/* Hamburgarmeny */}
      <div className="fixed top-6 left-6 z-[100]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col justify-center items-center w-12 h-12 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20 p-0 focus:outline-none group hover:bg-black/50 transition-all"
          aria-label="Meny"
        >
          <span className="block w-8 h-0.5 my-0.5 rounded bg-white transition-all duration-200 group-hover:bg-gray-200" />
          <span className="block w-8 h-0.5 my-0.5 rounded bg-white transition-all duration-200 group-hover:bg-gray-200" />
          <span className="block w-8 h-0.5 my-0.5 rounded bg-white transition-all duration-200 group-hover:bg-gray-200" />
        </button>
        {isOpen && (
          <div className="absolute left-0 top-14 w-60 bg-[#16475b] backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl animate-fade-in p-2 z-[110]">
            <div className="py-2">
              <Link 
                href="/" 
                className="block px-6 py-3 hover:bg-white/10 transition-colors text-base tracking-wide text-center uppercase text-white"
                onClick={() => setIsOpen(false)}
              >
                HEM
              </Link>
              <Link 
                href="/om-oss" 
                className="block px-6 py-3 hover:bg-white/10 transition-colors text-base tracking-wide text-center uppercase text-white"
                onClick={() => setIsOpen(false)}
              >
                OM OSS
              </Link>
              <Link 
                href="/pitch-pingvinen" 
                className="block px-6 py-3 hover:bg-white/10 transition-colors text-base tracking-wide text-center uppercase text-white"
                onClick={() => setIsOpen(false)}
              >
                PITCH-PINGVINEN
              </Link>
              <Link 
                href="/qa" 
                className="block px-6 py-3 hover:bg-white/10 transition-colors text-base tracking-wide text-center uppercase text-white"
                onClick={() => setIsOpen(false)}
              >
                Q&A
              </Link>
              <Link 
                href="/kontakt" 
                className="block px-6 py-3 hover:bg-white/10 transition-colors text-base tracking-wide text-center uppercase text-white"
                onClick={() => setIsOpen(false)}
              >
                KONTAKT
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Logotyp */}
      <Link href="/" className="fixed top-6 right-6 z-[100] flex items-center justify-end" style={{height: '56px', width: '176px'}}>
        {!logoError ? (
          <div className="relative w-full h-full">
            <Image
              src="/logo.png"
              alt="Frejfund Logo"
              fill
              sizes="(max-width: 768px) 120px, 180px"
              className="object-contain cursor-pointer"
              priority
              onError={handleLogoError}
            />
          </div>
        ) : (
          <span className="text-white text-xl font-bold bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20 cursor-pointer">Frejfund</span>
        )}
      </Link>
    </>
  );
} 