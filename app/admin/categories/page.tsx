import { AdminShell } from '@/components/admin/admin-shell';
import { CategoryManager } from '@/components/admin/category-manager';
import { getServiceSupabaseClient } from '@/lib/supabase/server';
import type { Category } from '@/types/domain';

export default async function AdminCategoriesPage() {
  const supabase = getServiceSupabaseClient();
  const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: false });

  return (
    <AdminShell title="Categories" subtitle="Create and manage storefront categories.">
      <CategoryManager initialCategories={(data || []) as Category[]} />
    </AdminShell>
  );
}
