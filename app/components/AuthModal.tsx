'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'login' | 'signup'
  redirectTo?: string
  onSuccess?: () => void
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login', redirectTo, onSuccess }: AuthModalProps) {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    : (typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined);

  useEffect(() => {
    setMode(defaultMode)
  }, [defaultMode])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
          },
        })
        if (error) throw error
        setMessage('Kolla din e-post för att bekräfta ditt konto!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        
        // Success - close modal and redirect/callback
        onClose()
        if (onSuccess) {
          onSuccess()
        } else if (redirectTo) {
          router.push(redirectTo)
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      })
      if (error) throw error
      setMessage('Kolla din e-post för en magic link!')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-purple-900/90 via-black/90 to-purple-900/90 rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl animate-slideUp">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            FrejFund
          </h2>
          <p className="text-white/60 mt-2">
            {mode === 'login' ? 'Välkommen tillbaka!' : 'Skapa ditt konto'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-white/80 text-sm font-medium mb-2">
              E-postadress
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="din@email.se"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-white/80 text-sm font-medium mb-2">
              Lösenord
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              minLength={6}
            />
          </div>
          
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          
          {message && (
            <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-xl">
              <p className="text-green-300 text-sm">{message}</p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${
              loading
                ? 'bg-gray-500/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:scale-105'
            } text-white`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Vänta...
              </span>
            ) : (
              <span>{mode === 'login' ? 'Logga in' : 'Skapa konto'}</span>
            )}
          </button>
        </form>

        {/* Magic Link Option */}
        <div className="mt-4">
          <button
            onClick={handleMagicLink}
            disabled={loading || !email}
            className="w-full py-2 text-white/60 hover:text-white text-sm transition-colors"
          >
            Eller få en magic link via e-post
          </button>
        </div>

        {/* Toggle mode */}
        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            {mode === 'login' ? 'Har du inget konto?' : 'Har du redan ett konto?'}
            {' '}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              {mode === 'login' ? 'Skapa konto' : 'Logga in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
} 