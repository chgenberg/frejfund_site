"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase, Analysis } from '../../lib/supabase'
import BusinessPlanWizard from '../components/BusinessPlanWizard'
import PremiumModal from '../components/PremiumModal'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

function ProfileSettingsModal({ open, onClose, userEmail, setUserEmail }: { open: boolean, onClose: () => void, userEmail: string, setUserEmail: (email: string) => void }) {
  const [email, setEmail] = useState(userEmail);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
      setMessage('E-post uppdaterad!');
      setUserEmail(email);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage('Lösenord uppdaterat!');
      setPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl font-bold">×</button>
        <h2 className="text-2xl font-bold mb-6 text-center text-[#16475b]">Profilinställningar</h2>
        <form onSubmit={handleEmailChange} className="mb-6">
          <label className="block mb-2 font-semibold">E-postadress</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded mb-2" />
          <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-all" disabled={loading}>Uppdatera e-post</button>
        </form>
        <form onSubmit={handlePasswordChange}>
          <label className="block mb-2 font-semibold">Nytt lösenord</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded mb-2" />
          <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-all" disabled={loading}>Uppdatera lösenord</button>
        </form>
        {message && <div className="mt-4 text-green-600 text-center">{message}</div>}
        {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter()
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [filterPremium, setFilterPremium] = useState<'all' | 'premium' | 'standard'>('all')
  const [showWizard, setShowWizard] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showPremiumModal, setShowPremiumModal] = useState(false)

  useEffect(() => {
    checkUser()
    fetchAnalyses()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
    } else {
      setUserEmail(user.email || '')
    }
  }

  const fetchAnalyses = async () => {
    try {
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
    await supabase.auth.signOut()
    router.push('/')
  }

  const filteredAnalyses = analyses.filter(analysis => {
    if (filterPremium === 'all') return true
    if (filterPremium === 'premium') return analysis.is_premium
    return !analysis.is_premium
  })

  const totalAnalyses = analyses.length
  const premiumAnalyses = analyses.filter(a => a.is_premium).length
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
        {/* Profilinställningsknapp borttagen, modal öppnas nu från OverlayNavbar */}
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
          {/* DASHBOARD-rubrik centrerad ovanför statistikrutorna */}
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 uppercase tracking-widest text-center mb-10">
            DASHBOARD
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Totalt antal analyser</p>
                  <p className="text-3xl font-bold text-white mt-2">{totalAnalyses}</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Premium-analyser</p>
                  <p className="text-3xl font-bold text-white mt-2">{premiumAnalyses}</p>
                </div>
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Genomsnittlig poäng</p>
                  <p className="text-3xl font-bold text-white mt-2">{averageScore}/100</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={() => setFilterPremium('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterPremium === 'all'
                  ? 'bg-purple-500/30 text-white border border-purple-500/50'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
              }`}
            >
              Alla analyser
            </button>
            <button
              onClick={() => setFilterPremium('premium')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterPremium === 'premium'
                  ? 'bg-purple-500/30 text-white border border-purple-500/50'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
              }`}
            >
              Premium
            </button>
            <button
              onClick={() => setFilterPremium('standard')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterPremium === 'standard'
                  ? 'bg-purple-500/30 text-white border border-purple-500/50'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
              }`}
            >
              Standard
            </button>
          </div>

          {/* Analyses List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-12 w-12 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : filteredAnalyses.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-12 border border-white/10 text-center">
              <svg className="w-16 h-16 text-white/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-white/60 text-lg">Inga analyser hittades</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnalyses.map((analysis) => (
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
                      {analysis.is_premium && (
                        <button 
                          onClick={() => setShowPremiumModal(true)}
                          className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
                        >
                          Premium
                        </button>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/60 text-sm">Poäng</span>
                        <span className="text-white font-bold">{analysis.score}/100</span>
                      </div>
                      <div className="bg-black/30 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            analysis.score >= 85 ? 'bg-green-500' :
                            analysis.score >= 70 ? 'bg-yellow-500' :
                            analysis.score >= 50 ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${analysis.score}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-white/40 text-sm">
                      <span>{new Date(analysis.created_at).toLocaleDateString('sv-SE')}</span>
                      <span className="group-hover:text-purple-400 transition-colors">
                        Se analys →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Create New Analysis CTA */}
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowWizard(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Skapa ny analys
            </button>
          </div>
          {/* BusinessPlanWizard-modal */}
          <BusinessPlanWizard open={showWizard} onClose={() => setShowWizard(false)} />
          {/* Premium Modal */}
          <PremiumModal open={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
        </main>
      </div>
    </div>
  )
} 