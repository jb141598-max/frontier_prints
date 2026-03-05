import { createClient } from '@supabase/supabase-js';
import { requireSupabasePublic, requireSupabaseService } from '@/lib/env';

export function getServerSupabaseClient() {
  const { url, anonKey } = requireSupabasePublic();
  return createClient(url, anonKey, {
    auth: {
      persistSession: false
    }
  });
}

export function getServiceSupabaseClient() {
  const { url, serviceRoleKey } = requireSupabaseService();
  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false
    }
  });
}
