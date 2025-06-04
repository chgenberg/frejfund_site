import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types för våra tabeller
export interface Analysis {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  company_name: string
  industry?: string
  score: number
  answers: any
  insights?: any
  action_items?: any
  is_premium: boolean
  premium_analysis?: any
  title?: string
  description?: string
}

export interface Payment {
  id: string
  user_id: string
  analysis_id: string
  created_at: string
  amount: number
  currency: string
  payment_method?: string
  payment_id?: string
  status: string
} 