import { NextResponse } from 'next/server';
import { setAdminSession } from '@/lib/auth';
import { requireAdminCreds } from '@/lib/env';

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  let admin: ReturnType<typeof requireAdminCreds>;
  try {
    admin = requireAdminCreds();
  } catch {
    return NextResponse.redirect(new URL('/admin/login?error=config', request.url));
  }

  if (!admin.emails.includes(email) || password !== admin.password) {
    return NextResponse.redirect(new URL('/admin/login?error=invalid', request.url));
  }

  await setAdminSession(email);
  return NextResponse.redirect(new URL('/admin', request.url));
}
