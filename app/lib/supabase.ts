import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Analysis {
  id: string
  user_id: string | null
  created_at: string
  updated_at: string
  company_name: string
  industry: string | null
  score: number
  answers: any
  insights: any
  action_items: any
  is_premium: boolean
  premium_analysis: any
  title: string | null
  description: string | null
  anonymous: boolean
  anonymous_email: string | null
  has_website: boolean | null
  website_url: string | null
  bransch: string | null
  omrade: string | null
} 