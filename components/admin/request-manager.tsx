'use client';

import { useState } from 'react';
import type { RequestStatus, RequestWithProduct } from '@/types/domain';

const statuses: RequestStatus[] = ['new', 'reviewing', 'quoted', 'completed', 'closed'];

export function RequestManager({ initialRequests }: { initialRequests: RequestWithProduct[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(id: string, status: RequestStatus) {
    setError(null);
    const response = await fetch(`/api/admin/requests/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || 'Failed to update status.');
      return;
    }

    setRequests((prev) => prev.map((request) => (request.id === id ? { ...request, status } : request)));
  }

  return (
    <div className="space-y-4">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {requests.map((request) => (
        <article key={request.id} className="card p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-brand-ink">{request.products?.name || 'Unknown Product'}</h2>
              <p className="text-sm text-slate-600">
                {request.customer_name} ({request.customer_email})
              </p>
              <p className="mt-1 text-xs text-slate-500">{new Date(request.created_at).toLocaleString()}</p>
            </div>
            <select
              className="input max-w-44"
              value={request.status}
              onChange={(event) => updateStatus(request.id, event.target.value as RequestStatus)}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            <p>Quantity: {request.quantity || 'n/a'}</p>
            <p>Size: {request.selected_size || 'n/a'}</p>
            <p>Material: {request.selected_material || 'n/a'}</p>
            <p>Color/Design: {request.selected_color_design || 'n/a'}</p>
          </div>
          {request.other_notes && <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{request.other_notes}</p>}
        </article>
      ))}
    </div>
  );
}
