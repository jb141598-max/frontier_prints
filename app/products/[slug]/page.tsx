import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/ui/site-header';
import { RequestForm } from '@/components/storefront/request-form';
import { getActiveProductBySlug } from '@/lib/data';

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const product = await getActiveProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const heroImage = product.product_images?.[0];

  return (
    <div className="space-y-8">
      <SiteHeader />

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="card overflow-hidden">
          <div className="aspect-square bg-slate-100">
            {heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={heroImage.image_url} alt={heroImage.alt_text || product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">No image yet</div>
            )}
          </div>
          <div className="space-y-3 p-6">
            <p className="text-xs uppercase tracking-wide text-brand-base">{product.categories?.name || 'Uncategorized'}</p>
            <h1 className="text-3xl font-bold text-brand-ink">{product.name}</h1>
            <p className="text-sm text-slate-600">{product.description || 'High-quality 3D print model.'}</p>
            <p className="text-base font-semibold text-brand-ink">
              {product.base_price ? `Starting at $${product.base_price}` : 'Custom quote'}
            </p>
          </div>
        </article>

        <RequestForm product={product} />
      </section>
    </div>
  );
}
