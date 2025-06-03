'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase, Analysis } from '../../../../lib/supabase'
import BusinessPlanResult from '../../../components/BusinessPlanResult'
import Image from 'next/image'
import Link from 'next/link'

export default function AnalysisDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchAnalysis()
    }
  }, [id])

  const fetchAnalysis = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      if (!data) {
        router.push('/dashboard')
        return
      }

      setAnalysis(data)
    } catch (error) {
      console.error('Error fetching analysis:', error)
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleUpgradeToPremium = () => {
    // Spara analysis ID för uppgradering efter betalning
    localStorage.setItem('upgradeAnalysisId', id)
    router.push('/kassa/checkout')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-purple-900">
        <svg className="animate-spin h-12 w-12 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    )
  }

  if (!analysis) {
    return null
  }

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
                href="/dashboard"
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Tillbaka till dashboard
              </Link>
              
              {!analysis.is_premium && (
                <button
                  onClick={handleUpgradeToPremium}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all"
                >
                  Uppgradera till Premium
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Analysis Content */}
        <div className="py-8">
          <BusinessPlanResult
            score={analysis.score}
            answers={analysis.answers}
            feedback={{}}
            subscriptionLevel={analysis.is_premium ? 'premium' : 'standard'}
          />
        </div>
      </div>
    </div>
  )
} 