import { getSupabaseClient } from '../../lib/supabase';

export async function getUser() {
  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function claimAnonymousAnalyses(user: { id: string; email: string } | null) {
  if (!user?.email || !user?.id) return;
  
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('analyses')
    .update({ user_id: user.id, is_anonymous: false })
    .eq('anonymous_email', user.email);
  
  if (error) {
    console.error('Error claiming analyses:', error);
  }
}

// Anropa denna funktion när användaren loggar in
export function setupAuthListener() {
  const supabase = getSupabaseClient();
  return supabase.auth.onAuthStateChange(async (event: string, session: any) => {
    if (event === 'SIGNED_IN' && session?.user) {
      await claimAnonymousAnalyses(session.user);
    }
  });
} 