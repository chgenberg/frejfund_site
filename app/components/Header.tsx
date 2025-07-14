// Denna komponent används inte längre. Lämna filen tom eller kommentera ut allt innehåll.

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { getSupabaseClient } from '../../lib/supabase'
import AuthModal from './AuthModal'

export default function Header() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = getSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
    
    const { data: authListener } = getSupabaseClient().auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut()
    router.push("/")
  }

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  return (
    <>
      {/* Denna komponent används inte längre. Lämna filen tom eller kommentera ut allt innehåll. */}
    </>
  )
} 