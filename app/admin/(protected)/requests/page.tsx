import { AdminShell } from '@/components/admin/admin-shell';
import { RequestManager } from '@/components/admin/request-manager';
import { getRequestsForAdmin } from '@/lib/data';

export default async function AdminRequestsPage() {
  const requests = await getRequestsForAdmin();

  return (
    <AdminShell title="Requests" subtitle="Review submissions and update status.">
      <RequestManager initialRequests={requests} />
    </AdminShell>
  );
}
