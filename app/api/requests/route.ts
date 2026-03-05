import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getProductById } from '@/lib/data';
import { env } from '@/lib/env';
import { checkRateLimit } from '@/lib/rate-limit';
import { requestInputSchema, validateAgainstProductConfig } from '@/lib/sql/request-validation';
import { getServiceSupabaseClient } from '@/lib/supabase/server';

function getClientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  return 'unknown';
}

async function sendOwnerNotificationEmail(data: {
  productName: string;
  customerName: string;
  customerEmail: string;
  requestId: string;
}) {
  if (!env.resendApiKey || !env.resendFromEmail || !env.ownerNotificationEmail) {
    return;
  }

  const resend = new Resend(env.resendApiKey);

  await resend.emails.send({
    from: env.resendFromEmail,
    to: env.ownerNotificationEmail,
    subject: `New Frontier Prints request: ${data.productName}`,
    text: `A new request was submitted.\n\nRequest ID: ${data.requestId}\nProduct: ${data.productName}\nCustomer: ${data.customerName}\nEmail: ${data.customerEmail}`
  });
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a minute and retry.' }, { status: 429 });
  }

  try {
    const json = await request.json();
    const parsed = requestInputSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request payload.', details: parsed.error.flatten() }, { status: 400 });
    }

    const input = parsed.data;

    if (input.website) {
      return NextResponse.json({ error: 'Spam check failed.' }, { status: 400 });
    }

    const product = await getProductById(input.productId);
    if (!product || !product.is_active) {
      return NextResponse.json({ error: 'Product not available.' }, { status: 404 });
    }

    validateAgainstProductConfig(product, input);

    const supabase = getServiceSupabaseClient();
    const insertPayload = {
      product_id: input.productId,
      customer_name: input.customerName,
      customer_email: input.customerEmail,
      quantity: product.allow_quantity ? input.quantity || null : null,
      selected_size: product.allow_size ? input.selectedSize || null : null,
      selected_material: product.allow_material ? input.selectedMaterial || null : null,
      selected_color_design: product.allow_color_design ? input.selectedColorDesign || null : null,
      other_notes: product.allow_other_notes ? input.otherNotes || null : null,
      status: 'new'
    };

    const { data, error } = await supabase.from('requests').insert(insertPayload).select('id').single();

    if (error) {
      return NextResponse.json({ error: 'Failed to save request.' }, { status: 500 });
    }

    try {
      await sendOwnerNotificationEmail({
        productName: product.name,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        requestId: data.id
      });
    } catch (emailError) {
      console.error('Email notification failed', emailError);
    }

    return NextResponse.json({ success: true, requestId: data.id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
