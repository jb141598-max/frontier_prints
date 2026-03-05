import Link from 'next/link';

interface Props {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function AdminShell({ title, subtitle, children }: Props) {
  return (
    <div className="space-y-6">
      <header className="card flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-brand-base">Admin Panel</p>
          <h1 className="text-2xl font-bold text-brand-ink">{title}</h1>
          {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
        </div>
        <nav className="flex flex-wrap gap-2 text-sm">
          <Link href="/admin" className="btn-secondary">
            Back to Dashboard
          </Link>
          <Link href="/admin/categories" className="btn-secondary">
            Categories
          </Link>
          <Link href="/admin/products" className="btn-secondary">
            Products
          </Link>
          <Link href="/admin/requests" className="btn-secondary">
            Requests
          </Link>
          <form action="/api/admin/logout" method="post">
            <button type="submit" className="btn-primary">
              Logout
            </button>
          </form>
        </nav>
      </header>
      {children}
    </div>
  );
}
