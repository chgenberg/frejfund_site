"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLoginModal } from './LoginModal';

export default function OverlayNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <>
      {/* Hamburgarmeny */}
      <div className="fixed top-6 left-6 z-50 flex flex-row items-center gap-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col justify-center items-center w-9 h-9 bg-transparent border-none p-0 focus:outline-none group"
          aria-label="Meny"
        >
          <span className="block w-7 h-0.5 my-0.5 rounded bg-white transition-all duration-200 group-hover:bg-gray-300" />
          <span className="block w-7 h-0.5 my-0.5 rounded bg-white transition-all duration-200 group-hover:bg-gray-300" />
          <span className="block w-7 h-0.5 my-0.5 rounded bg-white transition-all duration-200 group-hover:bg-gray-300" />
        </button>
        <button
          onClick={useLoginModal()}
          className="ml-2 px-5 py-2 bg-[#16475b] text-white font-bold rounded-full shadow-md hover:bg-[#133a4a] transition-colors text-sm tracking-wide uppercase focus:outline-none focus:ring-2 focus:ring-[#16475b]/40"
          style={{ letterSpacing: '0.08em' }}
        >
          LOGGA IN
        </button>
        {isOpen && (
          <div className="absolute left-8 top-12 w-60 bg-[#16475b] backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl animate-fade-in p-2">
            <div className="py-2">
              <Link 
                href="/" 
                className="block px-6 py-3 hover:bg-white/10 transition-colors text-base tracking-wide text-center uppercase"
                onClick={() => setIsOpen(false)}
              >
                HEM
              </Link>
              <Link 
                href="/om-oss" 
                className="block px-6 py-3 hover:bg-white/10 transition-colors text-base tracking-wide text-center uppercase"
                onClick={() => setIsOpen(false)}
              >
                OM OSS
              </Link>
              <Link 
                href="/pitch-pingvinen" 
                className="block px-6 py-3 hover:bg-white/10 transition-colors text-base tracking-wide text-center uppercase"
                onClick={() => setIsOpen(false)}
              >
                PITCH-PINGVINEN
              </Link>
              <Link 
                href="/qa" 
                className="block px-6 py-3 hover:bg-white/10 transition-colors text-base tracking-wide text-center uppercase"
                onClick={() => setIsOpen(false)}
              >
                Q&A
              </Link>
              <Link 
                href="/kontakt" 
                className="block px-6 py-3 hover:bg-white/10 transition-colors text-base tracking-wide text-center uppercase"
                onClick={() => setIsOpen(false)}
              >
                KONTAKT
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Logotyp */}
      <div className="fixed top-6 right-6 z-50 h-14 w-44 flex items-center justify-end">
        {!logoError ? (
          <Image
            src="/logo.png"
            alt="Frejfund Logo"
            fill
            sizes="(max-width: 768px) 120px, 180px"
            className="object-contain"
            priority
            onError={() => setLogoError(true)}
          />
        ) : (
          <span className="text-white text-xl font-bold">Frejfund</span>
        )}
      </div>
    </>
  );
} 