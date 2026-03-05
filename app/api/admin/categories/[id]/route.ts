import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiRequireAdminAuth } from '@/lib/api-auth';
import { getServiceSupabaseClient } from '@/lib/supabase/server';

const schema = z.object({
  is_active: z.boolean()
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await apiRequireAdminAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const supabase = getServiceSupabaseClient();
  const { error } = await supabase.from('categories').update(parsed.data).eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
