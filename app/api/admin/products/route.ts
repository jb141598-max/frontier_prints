import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiRequireAdminAuth } from '@/lib/api-auth';
import { getServiceSupabaseClient } from '@/lib/supabase/server';

const schema = z.object({
  category_id: z.string().uuid(),
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(140).regex(/^[a-z0-9-]+$/),
  description: z.string().max(2000).optional(),
  base_price: z.number().nullable().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  allow_quantity: z.boolean(),
  allow_size: z.boolean(),
  allow_material: z.boolean(),
  allow_color_design: z.boolean(),
  allow_other_notes: z.boolean(),
  size_options: z.string().optional(),
  material_options: z.string().optional(),
  color_design_options: z.string().optional()
});

function parseOptions(raw: string | undefined) {
  return (raw || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

export async function POST(request: Request) {
  if (!(await apiRequireAdminAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = getServiceSupabaseClient();
  const { image_url, size_options, material_options, color_design_options, ...productPayload } = parsed.data;

  const { data: product, error } = await supabase
    .from('products')
    .insert({
      ...productPayload,
      is_active: true
    })
    .select('*, categories:categories(id, name, slug), product_images(*), product_options(*)')
    .single();

  if (error || !product) {
    return NextResponse.json({ error: error?.message || 'Failed to create product' }, { status: 500 });
  }

  if (image_url) {
    await supabase.from('product_images').insert({
      product_id: product.id,
      image_url,
      sort_order: 0
    });
  }

  const optionInserts = [
    ...parseOptions(size_options).map((label, index) => ({ product_id: product.id, option_type: 'size', label, sort_order: index })),
    ...parseOptions(material_options).map((label, index) => ({
      product_id: product.id,
      option_type: 'material',
      label,
      sort_order: index
    })),
    ...parseOptions(color_design_options).map((label, index) => ({
      product_id: product.id,
      option_type: 'color_design',
      label,
      sort_order: index
    }))
  ];

  if (optionInserts.length > 0) {
    await supabase.from('product_options').insert(optionInserts);
  }

  const { data: fullProduct } = await supabase
    .from('products')
    .select('*, categories:categories(id, name, slug), product_images(*), product_options(*)')
    .eq('id', product.id)
    .single();

  return NextResponse.json({ product: fullProduct }, { status: 201 });
}
