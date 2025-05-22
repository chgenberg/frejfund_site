"use client";
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        {/* Separator line */}
        <div className="h-px bg-white mb-8" />
        
        {/* Footer links */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <Link 
            href="/integritet" 
            className="text-white hover:text-gray-300 transition-colors uppercase"
          >
            INTEGRITET
          </Link>
          <Link 
            href="/cookies" 
            className="text-white hover:text-gray-300 transition-colors uppercase"
          >
            COOKIES
          </Link>
          <Link 
            href="/villkor" 
            className="text-white hover:text-gray-300 transition-colors uppercase"
          >
            VILLKOR
          </Link>
          <Link 
            href="/dpa" 
            className="text-white hover:text-gray-300 transition-colors uppercase"
          >
            DPA
          </Link>
          <Link 
            href="/pitch-pingvinen" 
            className="text-white hover:text-gray-300 transition-colors uppercase"
          >
            PITCH-PINGVINEN
          </Link>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-white/80 text-sm">
          © 2025 FrejFund AB – en del av Founder Tribe
        </div>
      </div>
    </footer>
  );
} 