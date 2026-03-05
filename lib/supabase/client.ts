import { createClient } from '@supabase/supabase-js';
import { requireSupabasePublic } from '@/lib/env';

export function getBrowserSupabaseClient() {
  const { url, anonKey } = requireSupabasePublic();
  return createClient(url, anonKey);
}
