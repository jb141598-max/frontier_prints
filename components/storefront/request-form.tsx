'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ProductWithRelations } from '@/types/domain';

interface Props {
  product: ProductWithRelations;
}

export function RequestForm({ product }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const sizeOptions = useMemo(
    () => product.product_options.filter((option) => option.option_type === 'size' && option.is_active),
    [product.product_options]
  );
  const materialOptions = useMemo(
    () => product.product_options.filter((option) => option.option_type === 'material' && option.is_active),
    [product.product_options]
  );
  const colorOptions = useMemo(
    () => product.product_options.filter((option) => option.option_type === 'color_design' && option.is_active),
    [product.product_options]
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      productId: product.id,
      customerName: formData.get('customerName'),
      customerEmail: formData.get('customerEmail'),
      quantity: formData.get('quantity') || undefined,
      selectedSize: formData.get('selectedSize') || undefined,
      selectedMaterial: formData.get('selectedMaterial') || undefined,
      selectedColorDesign: formData.get('selectedColorDesign') || undefined,
      otherNotes: formData.get('otherNotes') || undefined,
      website: formData.get('website') || ''
    };

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Could not submit request.');
        return;
      }

      const data = await response.json();
      router.push(`/request/confirmation?requestId=${data.requestId}`);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="card space-y-4 p-6" onSubmit={onSubmit}>
      <h2 className="text-2xl font-semibold text-brand-ink">Submit Request</h2>

      <div className="hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" autoComplete="off" tabIndex={-1} />
      </div>

      <div>
        <label htmlFor="customerName" className="label">
          Name *
        </label>
        <input id="customerName" name="customerName" className="input" required maxLength={80} />
      </div>

      <div>
        <label htmlFor="customerEmail" className="label">
          Email *
        </label>
        <input id="customerEmail" name="customerEmail" className="input" required type="email" maxLength={120} />
      </div>

      {product.allow_quantity && (
        <div>
          <label htmlFor="quantity" className="label">
            Quantity
          </label>
          <input id="quantity" name="quantity" className="input" type="number" min={1} max={100} />
        </div>
      )}

      {product.allow_size && (
        <div>
          <label htmlFor="selectedSize" className="label">
            Size
          </label>
          <select id="selectedSize" name="selectedSize" className="input">
            <option value="">Select size</option>
            {sizeOptions.map((option) => (
              <option key={option.id} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {product.allow_material && (
        <div>
          <label htmlFor="selectedMaterial" className="label">
            Material
          </label>
          <select id="selectedMaterial" name="selectedMaterial" className="input">
            <option value="">Select material</option>
            {materialOptions.map((option) => (
              <option key={option.id} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {product.allow_color_design && (
        <div>
          <label htmlFor="selectedColorDesign" className="label">
            Color / Design
          </label>
          <select id="selectedColorDesign" name="selectedColorDesign" className="input">
            <option value="">Select option</option>
            {colorOptions.map((option) => (
              <option key={option.id} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {product.allow_other_notes && (
        <div>
          <label htmlFor="otherNotes" className="label">
            Other notes
          </label>
          <textarea id="otherNotes" name="otherNotes" className="input min-h-24" maxLength={1000} />
        </div>
      )}

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <button type="submit" className="btn-primary w-full" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
}
