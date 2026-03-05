import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiRequireAdminAuth } from '@/lib/api-auth';
import { getServiceSupabaseClient } from '@/lib/supabase/server';

const schema = z.object({
  status: z.enum(['new', 'reviewing', 'quoted', 'completed', 'closed'])
});

export async function PATCH(request: Request, context: { params: Promise<Record<string, string>> }) {
  if (!(await apiRequireAdminAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const params = await context.params;
  const id = params.id;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const supabase = getServiceSupabaseClient();
  const { error } = await supabase.from('requests').update({ status: parsed.data.status }).eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
