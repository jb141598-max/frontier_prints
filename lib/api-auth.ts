import { cookies } from 'next/headers';
import crypto from 'node:crypto';
import { requireAdminCreds } from '@/lib/env';

const ADMIN_COOKIE = 'frontier_admin_session';

export async function apiRequireAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) {
    return false;
  }

  const { email, password, secret } = requireAdminCreds();
  const expected = crypto.createHmac('sha256', secret).update(`${email}:${password}`).digest('hex');

  return token.length === expected.length && crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}
