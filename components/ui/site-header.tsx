import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 shadow-card backdrop-blur">
      <Link href="/" className="text-xl font-bold text-brand-ink">
        Frontier Prints
      </Link>
      <nav className="flex items-center gap-3 text-sm font-medium">
        <Link href="/categories" className="btn-secondary">
          Shop
        </Link>
        <Link href="/admin" className="btn-primary">
          Admin
        </Link>
      </nav>
    </header>
  );
}
