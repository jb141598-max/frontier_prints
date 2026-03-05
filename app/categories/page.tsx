import Link from 'next/link';
import { SiteHeader } from '@/components/ui/site-header';
import { ProductCard } from '@/components/storefront/product-card';
import { getActiveCategories, getActiveProducts, getActiveProductsByCategorySlug } from '@/lib/data';

export default async function CategoriesPage({
  searchParams
}: {
  searchParams: { category?: string };
}) {
  const selectedCategory = searchParams.category;
  let categories = [];
  let products = [];

  try {
    categories = await getActiveCategories();
    products = selectedCategory ? await getActiveProductsByCategorySlug(selectedCategory) : await getActiveProducts();
  } catch {
    categories = [];
    products = [];
  }

  return (
    <div className="space-y-8">
      <SiteHeader />

      <section className="card p-6">
        <h1 className="text-3xl font-bold text-brand-ink">Shop Categories</h1>
        <p className="mt-2 text-sm text-slate-600">Choose a category, then submit a request for any model you like.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/categories" className={`btn-secondary text-sm ${!selectedCategory ? 'bg-brand-base text-white' : ''}`}>
            All
          </Link>
          {categories.map((category: { id: string; slug: string; name: string }) => (
            <Link
              key={category.id}
              href={`/categories?category=${category.slug}`}
              className={`btn-secondary text-sm ${selectedCategory === category.slug ? 'bg-brand-base text-white' : ''}`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
