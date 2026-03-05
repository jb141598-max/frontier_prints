import { AdminShell } from '@/components/admin/admin-shell';

export default function AdminDashboardPage() {
  return (
    <AdminShell title="Dashboard" subtitle="Quick links for managing the storefront.">
      <section className="grid gap-4 md:grid-cols-3">
        <article className="card p-5">
          <h2 className="text-lg font-semibold text-brand-ink">Categories</h2>
          <p className="mt-1 text-sm text-slate-600">Create, rename, or archive categories.</p>
        </article>
        <article className="card p-5">
          <h2 className="text-lg font-semibold text-brand-ink">Products</h2>
          <p className="mt-1 text-sm text-slate-600">Manage product details and request field toggles.</p>
        </article>
        <article className="card p-5">
          <h2 className="text-lg font-semibold text-brand-ink">Requests</h2>
          <p className="mt-1 text-sm text-slate-600">Review incoming requests and update status.</p>
        </article>
      </section>
    </AdminShell>
  );
}
