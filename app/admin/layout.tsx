import { requireAdminAuth } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminAuth();
  return <>{children}</>;
}
