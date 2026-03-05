import { NextResponse } from 'next/server';
import { registerPasswordAccount } from '@/lib/auth';

export async function POST(request: Request) {
  const formData = await request.formData();
  const identifier = String(formData.get('identifier') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  const result = await registerPasswordAccount(identifier, password);
  if (!result.ok) {
    return NextResponse.redirect(new URL(`/admin/login?error=${encodeURIComponent(result.error || 'register')}`, request.url));
  }

  return NextResponse.redirect(new URL('/admin', request.url));
}
