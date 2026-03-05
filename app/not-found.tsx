import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <section className="mx-auto mt-16 max-w-xl space-y-4 text-center">
      <h1 className="text-4xl font-bold text-brand-ink">Page not found</h1>
      <p className="text-sm text-slate-600">That page does not exist or is no longer available.</p>
      <Link href="/" className="btn-primary">
        Back to home
      </Link>
    </section>
  );
}
