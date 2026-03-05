import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { requireAdminCreds } from '@/lib/env';

const ADMIN_COOKIE = 'frontier_admin_session';
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

function createSignature(email: string, password: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(`${email}:${password}`)
    .digest('hex');
}

export async function setAdminSession() {
  const { email, password, secret } = requireAdminCreds();
  const token = createSignature(email, password, secret);
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ONE_WEEK_SECONDS
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const { email, password, secret } = requireAdminCreds();
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!cookieToken) {
    return false;
  }

  const expectedToken = createSignature(email, password, secret);
  if (cookieToken.length !== expectedToken.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(cookieToken), Buffer.from(expectedToken));
}

export async function requireAdminAuth() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    redirect('/admin/login');
  }
}
