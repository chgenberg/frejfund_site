import { supabase } from './supabase';

export async function claimAnonymousAnalyses(user: { id: string; email: string } | null) {
  if (!user?.email || !user?.id) return;
  
  const { data, error } = await supabase
    .from('analyses')
    .update({ 
      user_id: user.id, 
      anonymous: false 
    })
    .eq('anonymous_email', user.email)
    .is('user_id', null);

  if (error) {
    console.error('Kunde inte koppla analyser:', error);
  }
  
  return data;
}

// Anropa denna funktion när användaren loggar in
export function setupAuthListener() {
  return supabase.auth.onAuthStateChange(async (event: string, session: any) => {
    if (event === 'SIGNED_IN' && session?.user) {
      await claimAnonymousAnalyses(session.user);
    }
  });
} 