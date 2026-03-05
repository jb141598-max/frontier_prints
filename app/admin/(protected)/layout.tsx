import { requireAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireAdminAuth();
  return <>{children}</>;
}
