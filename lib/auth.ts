import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { requireAdminCreds } from '@/lib/env';

const ADMIN_COOKIE = 'frontier_admin_session';
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

function createSignature(email: string, password: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(`${email.toLowerCase()}:${password}`)
    .digest('hex');
}

function encodeEmail(email: string): string {
  return Buffer.from(email, 'utf8').toString('base64url');
}

function decodeEmail(value: string): string | null {
  try {
    return Buffer.from(value, 'base64url').toString('utf8').toLowerCase();
  } catch {
    return null;
  }
}

export function verifyAdminSessionToken(token: string, emails: string[], password: string, secret: string): boolean {
  const [encodedEmail, signature] = token.split('.');
  if (!encodedEmail || !signature || token.split('.').length !== 2) {
    return false;
  }

  const email = decodeEmail(encodedEmail);
  if (!email || !emails.includes(email)) {
    return false;
  }

  const expectedSignature = createSignature(email, password, secret);
  if (signature.length !== expectedSignature.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

export async function setAdminSession(email: string) {
  const { emails, password, secret } = requireAdminCreds();
  const normalizedEmail = email.trim().toLowerCase();
  if (!emails.includes(normalizedEmail)) {
    throw new Error('Unauthorized admin email.');
  }

  const signature = createSignature(normalizedEmail, password, secret);
  const token = `${encodeEmail(normalizedEmail)}.${signature}`;
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
  try {
    const { emails, password, secret } = requireAdminCreds();
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get(ADMIN_COOKIE)?.value;
    if (!cookieToken) {
      return false;
    }

    return verifyAdminSessionToken(cookieToken, emails, password, secret);
  } catch {
    return false;
  }
}

export async function requireAdminAuth() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    redirect('/admin/login');
  }
}
