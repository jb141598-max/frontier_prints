import { NextResponse } from 'next/server';
import { loginWithSocial } from '@/lib/auth';

export async function POST(request: Request) {
  const formData = await request.formData();
  const identifier = String(formData.get('identifier') || '').trim().toLowerCase();
  const providerRaw = String(formData.get('provider') || '').trim().toLowerCase();

  const provider = providerRaw === 'google' || providerRaw === 'microsoft' ? providerRaw : null;
  if (!provider) {
    return NextResponse.redirect(new URL('/admin/login?error=provider', request.url));
  }

  const result = await loginWithSocial(provider, identifier);
  if (!result.ok) {
    return NextResponse.redirect(new URL(`/admin/login?error=${encodeURIComponent(result.error || 'social')}`, request.url));
  }

  return NextResponse.redirect(new URL('/admin', request.url));
}
