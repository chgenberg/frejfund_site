'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import AuthModal from './AuthModal'

export default function Header() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')

  useEffect(() => {
    checkUser()
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/10 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 w-full">
            {/* Hamburgarmeny längst till vänster */}
            <button className="flex items-center justify-center w-12 h-12 text-white/80 hover:text-white focus:outline-none" aria-label="Öppna meny">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>

            {/* Tom flex-grow för att trycka ut resten till höger */}
            <div className="flex-grow" />

            {/* Knappar och logotyp till höger */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 text-white/80 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                  >
                    Logga ut
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Skapa konto
                  </button>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-4 py-2 text-white/80 hover:text-white transition-colors"
                  >
                    Logga in
                  </button>
                </>
              )}
              {/* Logotyp längst till höger */}
              <Link href="/" className="ml-2 flex items-center">
                <img src="/logo.png" alt="FrejFund logotyp" className="h-10 w-auto" style={{ maxHeight: 40 }} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
      />
    </>
  )
} 