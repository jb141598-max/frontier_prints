import { AdminShell } from '@/components/admin/admin-shell';
import { ProductManager } from '@/components/admin/product-manager';
import { getServiceSupabaseClient } from '@/lib/supabase/server';
import type { Category, ProductWithRelations } from '@/types/domain';

export default async function AdminProductsPage() {
  const supabase = getServiceSupabaseClient();

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase
      .from('products')
      .select('*, categories:categories(id, name, slug), product_images(*), product_options(*)')
      .order('created_at', { ascending: false })
  ]);

  return (
    <AdminShell title="Products" subtitle="Manage product cards and request field toggles.">
      <ProductManager
        initialProducts={(products || []) as ProductWithRelations[]}
        categories={(categories || []) as Category[]}
      />
    </AdminShell>
  );
}
