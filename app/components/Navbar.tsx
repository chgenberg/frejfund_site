'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black text-white">
      <div className="flex flex-row justify-between items-center w-full px-6 py-4">
        {/* Hamburger Menu */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col justify-center items-center w-12 h-12 bg-transparent border-none p-0 focus:outline-none group"
            aria-label="Meny"
          >
            <span className="block w-9 h-1 my-1 rounded bg-white transition-all duration-200 group-hover:bg-gray-300" />
            <span className="block w-9 h-1 my-1 rounded bg-white transition-all duration-200 group-hover:bg-gray-300" />
            <span className="block w-9 h-1 my-1 rounded bg-white transition-all duration-200 group-hover:bg-gray-300" />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-44 bg-black/95 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl animate-fade-in">
              <div className="py-2">
                <Link 
                  href="/" 
                  className="block px-6 py-3 hover:bg-white/10 transition-colors text-base tracking-wide text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Hem
                </Link>
                <Link 
                  href="/om-oss" 
                  className="block px-6 py-3 hover:bg-white/10 transition-colors text-base tracking-wide text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Om oss
                </Link>
                <Link 
                  href="/kontakt" 
                  className="block px-6 py-3 hover:bg-white/10 transition-colors text-base tracking-wide text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Kontakt
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Logo */}
        <div className="h-8 w-28 relative flex-shrink-0 flex items-center justify-end">
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
            <span className="text-white text-lg font-bold">Frejfund</span>
          )}
        </div>
      </div>
    </nav>
  );
}

// Extra: Fade-in animation för dropdown
// Lägg till i app/globals.css:
// @keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: none; } }
// .animate-fade-in { animation: fade-in 0.2s ease; } 