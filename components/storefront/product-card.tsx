import Link from 'next/link';
import type { ProductWithRelations } from '@/types/domain';

export function ProductCard({ product }: { product: ProductWithRelations }) {
  const heroImage = product.product_images?.[0];

  return (
    <article className="card overflow-hidden">
      <div className="aspect-[4/3] bg-slate-100">
        {heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroImage.image_url} alt={heroImage.alt_text || product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">No image yet</div>
        )}
      </div>
      <div className="space-y-3 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-base">{product.categories?.name || 'Uncategorized'}</p>
        <h3 className="text-xl font-semibold text-brand-ink">{product.name}</h3>
        <p className="line-clamp-3 text-sm text-slate-600">{product.description || 'High-quality 3D printed model.'}</p>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-brand-ink">
            {product.base_price ? `Starting at $${product.base_price}` : 'Custom quote'}
          </p>
          <Link href={`/products/${product.slug}`} className="btn-primary text-sm">
            Request
          </Link>
        </div>
      </div>
    </article>
  );
}
