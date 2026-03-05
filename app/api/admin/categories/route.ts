import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiRequireAdminAuth } from '@/lib/api-auth';
import { getServiceSupabaseClient } from '@/lib/supabase/server';

const schema = z.object({
  name: z.string().min(2).max(80),
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
  description: z.string().max(300).optional()
});

export async function POST(request: Request) {
  if (!(await apiRequireAdminAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase
    .from('categories')
    .insert({
      ...parsed.data,
      is_active: true
    })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ category: data }, { status: 201 });
}
