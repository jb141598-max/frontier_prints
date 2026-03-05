import { NextResponse } from 'next/server';
import { loginWithPassword } from '@/lib/auth';

export async function POST(request: Request) {
  const formData = await request.formData();
  const identifier = String(formData.get('identifier') || formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  const ok = await loginWithPassword(identifier, password);
  if (!ok) {
    return NextResponse.redirect(new URL('/admin/login?error=invalid', request.url));
  }

  return NextResponse.redirect(new URL('/admin', request.url));
}
