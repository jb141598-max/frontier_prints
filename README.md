# Frontier Prints

3D print shop website with:
- Public storefront and product pages
- Dynamic request submission flow (no online payment)
- Admin panel for categories, products, and request status
- Supabase-backed data layer
- Resend email notification on new requests

## Stack
- Next.js (App Router, TypeScript)
- Tailwind CSS
- Supabase (Postgres)
- Resend (transactional email)

## Quick Start
1. Copy env file:
```bash
cp .env.example .env.local
```

2. Fill required values in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `RESEND_API_KEY` (optional for local if you skip email)
- `RESEND_FROM_EMAIL` (optional for local if you skip email)
- `OWNER_NOTIFICATION_EMAIL` (optional for local if you skip email)

3. Install and run:
```bash
npm install
npm run dev
```

## Supabase Setup
1. Open Supabase SQL editor.
2. Run [schema.sql](/Users/james/Documents/GitHub/frontier_prints/supabase/schema.sql).
3. Run [seed.sql](/Users/james/Documents/GitHub/frontier_prints/supabase/seed.sql) for sample data.

## Request API
`POST /api/requests`

Payload:
```json
{
  "productId": "uuid",
  "customerName": "Jane Doe",
  "customerEmail": "jane@example.com",
  "quantity": 2,
  "selectedSize": "Medium",
  "selectedMaterial": "PLA",
  "selectedColorDesign": "Black",
  "otherNotes": "Need by Friday"
}
```

Rules:
- Name and email are always required.
- Optional fields are accepted only when enabled for the selected product.
- Honeypot field `website` and IP rate limit are applied.

## Admin Panel
- Login: `/admin/login`
- Uses `ADMIN_EMAIL` + `ADMIN_PASSWORD`
- Session cookie protected routes:
  - `/admin/categories`
  - `/admin/products`
  - `/admin/requests`

## Netlify Deployment
1. Connect repo to Netlify (already done).
2. Set build command: `npm run build`
3. Set publish directory: `.next` (Netlify Next.js runtime handles this automatically)
4. Add environment variables from `.env.example`.
5. Deploy `main` branch.

## Notes
- No online payment is implemented by design.
- Request submission stores data first, then attempts email notification.
- If email fails, the request is still saved.
