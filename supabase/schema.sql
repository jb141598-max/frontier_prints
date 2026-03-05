create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null,
  slug text not null unique,
  description text,
  base_price numeric(10,2),
  is_active boolean not null default true,
  allow_quantity boolean not null default false,
  allow_size boolean not null default false,
  allow_material boolean not null default false,
  allow_color_design boolean not null default false,
  allow_other_notes boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order int not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_options (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  option_type text not null check (option_type in ('size', 'material', 'color_design')),
  label text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete restrict,
  customer_name text not null,
  customer_email text not null,
  status text not null default 'new' check (status in ('new', 'reviewing', 'quoted', 'completed', 'closed')),
  quantity int,
  selected_size text,
  selected_material text,
  selected_color_design text,
  other_notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_products_category_active on public.products (category_id, is_active);
create index if not exists idx_products_slug on public.products (slug);
create index if not exists idx_requests_status_created on public.requests (status, created_at desc);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
before update on public.categories
for each row execute function public.handle_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.handle_updated_at();

drop trigger if exists set_requests_updated_at on public.requests;
create trigger set_requests_updated_at
before update on public.requests
for each row execute function public.handle_updated_at();

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_options enable row level security;
alter table public.requests enable row level security;

-- Public browse policies
drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories"
on public.categories for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public can read images for active products" on public.product_images;
create policy "Public can read images for active products"
on public.product_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.products p
    where p.id = product_images.product_id and p.is_active = true
  )
);

drop policy if exists "Public can read options for active products" on public.product_options;
create policy "Public can read options for active products"
on public.product_options for select
to anon, authenticated
using (
  is_active = true and exists (
    select 1 from public.products p
    where p.id = product_options.product_id and p.is_active = true
  )
);

-- Service role bypasses RLS automatically. Keep requests insert restricted to service role endpoints.
