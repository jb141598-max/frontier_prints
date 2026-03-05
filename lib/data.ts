import type { Category, ProductWithRelations, RequestWithProduct, RequestStatus } from '@/types/domain';
import { getServerSupabaseClient, getServiceSupabaseClient } from '@/lib/supabase/server';

const productSelect = `
  *,
  categories:categories(id, name, slug),
  product_images:product_images(*),
  product_options:product_options(*)
`;

export async function getActiveCategories(): Promise<Category[]> {
  const supabase = getServerSupabaseClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return data as Category[];
}

export async function getActiveProducts() {
  const supabase = getServerSupabaseClient();
  const { data, error } = await supabase
    .from('products')
    .select(productSelect)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as ProductWithRelations[];
}

export async function getActiveProductsByCategorySlug(slug: string) {
  const supabase = getServerSupabaseClient();
  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      categories:categories!inner(id, name, slug),
      product_images:product_images(*),
      product_options:product_options(*)
    `
    )
    .eq('is_active', true)
    .eq('categories.slug', slug)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as ProductWithRelations[];
}

export async function getActiveProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const supabase = getServerSupabaseClient();
  const { data, error } = await supabase
    .from('products')
    .select(productSelect)
    .eq('is_active', true)
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return data as ProductWithRelations;
}

export async function getProductById(id: string): Promise<ProductWithRelations | null> {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase.from('products').select(productSelect).eq('id', id).single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return data as ProductWithRelations;
}

export async function getRequestsForAdmin(): Promise<RequestWithProduct[]> {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase
    .from('requests')
    .select('*, products:products(id, name, slug)')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as RequestWithProduct[];
}

export async function updateRequestStatus(id: string, status: RequestStatus) {
  const supabase = getServiceSupabaseClient();
  const { error } = await supabase.from('requests').update({ status }).eq('id', id);
  if (error) {
    throw error;
  }
}
