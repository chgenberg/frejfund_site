import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export const getSupabaseClient = () => {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return supabaseClient;
};


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
  title?: string
  description?: string
  is_premium: boolean
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