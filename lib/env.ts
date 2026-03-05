function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  resendApiKey: process.env.RESEND_API_KEY,
  resendFromEmail: process.env.RESEND_FROM_EMAIL,
  ownerNotificationEmail: process.env.OWNER_NOTIFICATION_EMAIL,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  adminSessionSecret: process.env.ADMIN_SESSION_SECRET,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
};

export function requireSupabasePublic() {
  return {
    url: required('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: required('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  };
}

export function requireSupabaseService() {
  return {
    url: required('NEXT_PUBLIC_SUPABASE_URL'),
    serviceRoleKey: required('SUPABASE_SERVICE_ROLE_KEY')
  };
}

export function requireAdminCreds() {
  return {
    email: required('ADMIN_EMAIL'),
    password: required('ADMIN_PASSWORD'),
    secret: required('ADMIN_SESSION_SECRET')
  };
}
