import { NextResponse } from 'next/server';
import { setAdminSession } from '@/lib/auth';
import { requireAdminCreds } from '@/lib/env';

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');

  const admin = requireAdminCreds();

  if (email !== admin.email || password !== admin.password) {
    return NextResponse.redirect(new URL('/admin/login?error=invalid', request.url));
  }

  await setAdminSession();
  return NextResponse.redirect(new URL('/admin', request.url));
}
