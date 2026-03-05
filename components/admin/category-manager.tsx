'use client';

import { useState } from 'react';
import type { Category } from '@/types/domain';

export function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  async function createCategory(formData: FormData) {
    setError(null);
    setCreating(true);

    const payload = {
      name: String(formData.get('name') || ''),
      slug: String(formData.get('slug') || ''),
      description: String(formData.get('description') || '')
    };

    const response = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || 'Failed to create category.');
      setCreating(false);
      return;
    }

    const data = await response.json();
    setCategories([data.category, ...categories]);
    setCreating(false);
  }

  async function toggleCategory(id: string, isActive: boolean) {
    setError(null);
    const response = await fetch(`/api/admin/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !isActive })
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || 'Failed to update category.');
      return;
    }

    setCategories((prev) => prev.map((category) => (category.id === id ? { ...category, is_active: !isActive } : category)));
  }

  return (
    <div className="space-y-6">
      <section className="card p-5">
        <h2 className="text-lg font-semibold text-brand-ink">New Category</h2>
        <form
          className="mt-4 grid gap-3 md:grid-cols-2"
          onSubmit={async (event) => {
            event.preventDefault();
            await createCategory(new FormData(event.currentTarget));
            event.currentTarget.reset();
          }}
        >
          <input name="name" className="input" placeholder="Name" required />
          <input name="slug" className="input" placeholder="slug-name" required />
          <input name="description" className="input md:col-span-2" placeholder="Description (optional)" />
          <button type="submit" className="btn-primary md:col-span-2" disabled={creating}>
            {creating ? 'Saving...' : 'Create Category'}
          </button>
        </form>
      </section>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <section className="card p-5">
        <h2 className="text-lg font-semibold text-brand-ink">All Categories</h2>
        <div className="mt-4 space-y-3">
          {categories.map((category) => (
            <article key={category.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-brand-ink">{category.name}</h3>
                  <p className="text-xs text-slate-500">/{category.slug}</p>
                </div>
                <button
                  type="button"
                  className="btn-secondary text-sm"
                  onClick={() => toggleCategory(category.id, category.is_active)}
                >
                  {category.is_active ? 'Archive' : 'Activate'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
