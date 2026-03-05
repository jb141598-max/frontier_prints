import Link from 'next/link';
import { SiteHeader } from '@/components/ui/site-header';

export default async function ConfirmationPage({
  searchParams
}: {
  searchParams: Promise<{ requestId?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-8">
      <SiteHeader />
      <section className="card mx-auto max-w-2xl space-y-4 p-8 text-center">
        <p className="mx-auto w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
          Request Sent
        </p>
        <h1 className="text-3xl font-bold text-brand-ink">Thanks, your print request is in.</h1>
        <p className="text-sm text-slate-600">
          We received your submission and will follow up by email. No payment is required at this step.
        </p>
        {params.requestId && (
          <p className="text-xs text-slate-500">
            Reference ID: <span className="font-mono">{params.requestId}</span>
          </p>
        )}
        <div className="pt-2">
          <Link href="/categories" className="btn-primary">
            Browse More Models
          </Link>
        </div>
      </section>
    </div>
  );
}
