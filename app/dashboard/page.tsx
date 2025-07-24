"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getSupabaseClient, Analysis } from '../../lib/supabase'
import BusinessPlanWizard from '../components/BusinessPlanWizard'
import ProfileSettingsModal from '../components/ProfileSettingsModal'
import Link from 'next/link'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

export default function Dashboard() {
  const router = useRouter()
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [showWizard, setShowWizard] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    checkUser()
    fetchAnalyses()
    // Scroll to top when dashboard loads
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const checkUser = async () => {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
    } else {
      setUserEmail(user.email || '')
    }
  }

  const fetchAnalyses = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAnalyses(data || [])
    } catch (error) {
      console.error('Error fetching analyses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut()
    router.push('/')
  }

  const totalAnalyses = analyses.length
  const averageScore = analyses.length > 0 
    ? Math.round(analyses.reduce((sum, a) => sum + a.score, 0) / analyses.length)
    : 0

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <Image
        src="/bakgrund.png"
        alt="Bakgrund"
        fill
        className="object-cover -z-10"
        priority
      />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link
                href="/"
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Tillbaka till startsidan
              </Link>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowProfile(true)}
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all border border-white/20"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                    <path d="M4 20c0-4 4-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </button>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-white/80 hover:text-white transition-colors font-semibold border border-white/20 rounded-lg"
                >
                  Logga ut
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h3 className="text-white/60 text-sm mb-1">Totalt antal analyser</h3>
              <p className="text-3xl font-bold text-white">{totalAnalyses}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h3 className="text-white/60 text-sm mb-1">Genomsnittlig poäng</h3>
              <p className="text-3xl font-bold text-white">{averageScore}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h3 className="text-white/60 text-sm mb-1">Senaste analysen</h3>
              <p className="text-3xl font-bold text-white">
                {analyses[0]?.created_at 
                  ? new Date(analyses[0].created_at).toLocaleDateString('sv-SE')
                  : '-'}
              </p>
            </div>
          </div>

          {/* New Analysis Button */}
          <div className="mb-8">
            <button
              onClick={() => setShowWizard(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
            >
              Ny Analys
            </button>
          </div>

          {/* Analyses List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="text-white/60 mt-4">Laddar analyser...</p>
            </div>
          ) : analyses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60">Du har inga sparade analyser än.</p>
              <button
                onClick={() => setShowWizard(true)}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
              >
                Skapa din första analys
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="group"
                >
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                          {analysis.company_name}
                        </h3>
                        <p className="text-white/60 text-sm">{analysis.industry}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">Score</span>
                        <span className="text-white font-semibold">{analysis.score}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">Date</span>
                        <span className="text-white/80 text-sm">
                          {new Date(analysis.created_at).toLocaleDateString('sv-SE')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Link
                        href={`/dashboard/analysis/${analysis.id}`}
                        className="block w-full px-4 py-2 bg-white/10 text-white text-center rounded-lg hover:bg-white/20 transition-colors"
                      >
                        View Analysis
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Business Plan Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowWizard(false)} />
            <div className="inline-block w-full max-w-4xl p-6 my-8 text-left align-middle transition-all transform bg-[#04111d] shadow-xl rounded-2xl border border-white/10">
              <BusinessPlanWizard open={showWizard} onClose={() => setShowWizard(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Profile Settings Modal */}
      {showProfile && (
        <ProfileSettingsModal
          open={showProfile}
          onClose={() => setShowProfile(false)}
          userEmail={userEmail}
          setUserEmail={setUserEmail}
        />
      )}
    </div>
  )
} 