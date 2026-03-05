import { cookies } from 'next/headers';
import { requireAdminCreds } from '@/lib/env';
import { verifyAdminSessionToken } from '@/lib/auth';

const ADMIN_COOKIE = 'frontier_admin_session';

export async function apiRequireAdminAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE)?.value;
    if (!token) {
      return false;
    }

    const { emails, password, secret } = requireAdminCreds();
    return verifyAdminSessionToken(token, emails, password, secret);
  } catch {
    return false;
  }
}
