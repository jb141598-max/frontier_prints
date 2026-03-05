'use client';

import { useState } from 'react';
import type { Category, ProductWithRelations } from '@/types/domain';

interface Props {
  initialProducts: ProductWithRelations[];
  categories: Category[];
}

export function ProductManager({ initialProducts, categories }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [error, setError] = useState<string | null>(null);

  async function createProduct(formData: FormData) {
    setError(null);
    const payload = {
      category_id: String(formData.get('category_id') || ''),
      name: String(formData.get('name') || ''),
      slug: String(formData.get('slug') || ''),
      description: String(formData.get('description') || ''),
      base_price: formData.get('base_price') ? Number(formData.get('base_price')) : null,
      image_url: String(formData.get('image_url') || ''),
      allow_quantity: Boolean(formData.get('allow_quantity')),
      allow_size: Boolean(formData.get('allow_size')),
      allow_material: Boolean(formData.get('allow_material')),
      allow_color_design: Boolean(formData.get('allow_color_design')),
      allow_other_notes: Boolean(formData.get('allow_other_notes')),
      size_options: String(formData.get('size_options') || ''),
      material_options: String(formData.get('material_options') || ''),
      color_design_options: String(formData.get('color_design_options') || '')
    };

    const response = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || 'Failed to create product.');
      return;
    }

    const data = await response.json();
    setProducts([data.product, ...products]);
  }

  async function toggleProduct(id: string, isActive: boolean) {
    setError(null);
    const response = await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !isActive })
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || 'Failed to update product.');
      return;
    }

    setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, is_active: !isActive } : product)));
  }

  return (
    <div className="space-y-6">
      <section className="card p-5">
        <h2 className="text-lg font-semibold text-brand-ink">New Product</h2>
        <form
          className="mt-4 grid gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            await createProduct(new FormData(event.currentTarget));
            event.currentTarget.reset();
          }}
        >
          <select name="category_id" className="input" required>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input name="name" className="input" placeholder="Product name" required />
          <input name="slug" className="input" placeholder="product-slug" required />
          <textarea name="description" className="input min-h-24" placeholder="Description" />
          <input name="base_price" type="number" step="0.01" className="input" placeholder="Base price" />
          <input name="image_url" className="input" placeholder="Image URL" />

          <div className="grid gap-3 rounded-xl border border-slate-200 p-3 md:grid-cols-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="allow_quantity" /> Quantity
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="allow_size" /> Size
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="allow_material" /> Material
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="allow_color_design" /> Color / Design
            </label>
            <label className="flex items-center gap-2 text-sm md:col-span-2">
              <input type="checkbox" name="allow_other_notes" /> Other notes
            </label>
          </div>

          <input name="size_options" className="input" placeholder="Size options (comma-separated)" />
          <input name="material_options" className="input" placeholder="Material options (comma-separated)" />
          <input name="color_design_options" className="input" placeholder="Color/design options (comma-separated)" />

          <button type="submit" className="btn-primary">
            Create Product
          </button>
        </form>
      </section>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <section className="card p-5">
        <h2 className="text-lg font-semibold text-brand-ink">All Products</h2>
        <div className="mt-4 space-y-3">
          {products.map((product) => (
            <article key={product.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-brand-ink">{product.name}</h3>
                  <p className="text-xs text-slate-500">/{product.slug}</p>
                </div>
                <button
                  type="button"
                  className="btn-secondary text-sm"
                  onClick={() => toggleProduct(product.id, product.is_active)}
                >
                  {product.is_active ? 'Archive' : 'Activate'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
