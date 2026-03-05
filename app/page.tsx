import Link from 'next/link';
import { SiteHeader } from '@/components/ui/site-header';
import { ProductCard } from '@/components/storefront/product-card';
import { getActiveProducts } from '@/lib/data';

export default async function HomePage() {
  let products = [];
  try {
    products = await getActiveProducts();
  } catch {
    products = [];
  }

  return (
    <div>
      <SiteHeader />

      <section className="mb-10 grid gap-6 rounded-3xl bg-brand-ink p-8 text-white shadow-card md:grid-cols-2">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-wider text-brand-sand">School-ready custom models</p>
          <h1 className="text-4xl font-bold leading-tight">Get your 3D print request submitted in minutes.</h1>
          <p className="max-w-xl text-sm text-slate-100">
            Pick a model, choose available options, and submit your request. No online payment yet. We follow up manually.
          </p>
          <Link href="/categories" className="btn bg-brand-accent text-white hover:bg-orange-700">
            Browse Catalog
          </Link>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
          <h2 className="mb-2 text-xl font-semibold">How it works</h2>
          <ol className="space-y-2 text-sm text-slate-100">
            <li>1. Choose a pre-made model from the catalog.</li>
            <li>2. Select options set by the owner (size, material, color, etc.).</li>
            <li>3. Submit your request and get confirmation instantly.</li>
          </ol>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-brand-ink">Featured Prints</h2>
          <Link href="/categories" className="btn-secondary text-sm">
            View all
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="card p-6 text-sm text-slate-600">
            No products yet. Add your first product from the admin panel.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
