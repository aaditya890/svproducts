-- SV Products: initial schema
create extension if not exists pgcrypto;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  sort int not null default 0
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  code text,                      -- catalogue code e.g. A.1.1
  slug text unique not null,
  name text not null,
  description text,
  image_path text,                -- storage path or /products/xx.png
  note text,
  spec_columns text[] not null default '{}',
  is_active boolean not null default true,
  sort int not null default 0
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  specs jsonb not null default '{}'::jsonb,   -- {"Length in mm": 500, "Dia": 48}
  sort int not null default 0
);
create index on public.products (category_id, sort);
create index on public.product_variants (product_id, sort);

create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  company text,
  city text,
  message text,
  items jsonb not null default '[]'::jsonb,   -- [{product, variant, qty}]
  status text not null default 'new' check (status in ('new','contacted','quoted','closed'))
);

-- Row level security
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.quote_requests enable row level security;

create policy "public read categories" on public.categories for select using (true);
create policy "public read products" on public.products for select using (is_active);
create policy "public read variants" on public.product_variants for select using (true);

create policy "admin write categories" on public.categories for all to authenticated using (true) with check (true);
create policy "admin write products" on public.products for all to authenticated using (true) with check (true);
create policy "admin write variants" on public.product_variants for all to authenticated using (true) with check (true);

-- anyone may submit a quote; only signed-in admins may read/manage them
create policy "anyone can request quote" on public.quote_requests for insert to anon, authenticated with check (true);
create policy "admin read quotes" on public.quote_requests for select to authenticated using (true);
create policy "admin update quotes" on public.quote_requests for update to authenticated using (true) with check (true);

-- Storage bucket for product images (public read)
insert into storage.buckets (id, name, public) values ('products', 'products', true) on conflict do nothing;
create policy "public read product images" on storage.objects for select using (bucket_id = 'products');
create policy "admin manage product images" on storage.objects for all to authenticated using (bucket_id = 'products') with check (bucket_id = 'products');

-- Data API access (needed because "Automatically expose new tables" is switched OFF).
-- RLS policies above still decide which rows each role can see or change.
grant usage on schema public to anon, authenticated;
grant select on public.categories, public.products, public.product_variants to anon, authenticated;
grant insert, update, delete on public.categories, public.products, public.product_variants to authenticated;
grant insert on public.quote_requests to anon, authenticated;
grant select, update on public.quote_requests to authenticated;
