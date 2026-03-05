import { isAdminAuthenticated } from '@/lib/auth';

export async function apiRequireAdminAuth() {
  return isAdminAuthenticated();
}
