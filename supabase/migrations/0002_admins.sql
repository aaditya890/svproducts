-- 0002: admin allow-list. Only people listed here can edit the catalogue or read quote requests.
-- (Before this, ANY signed-in user could write. Run this file BEFORE using the admin panel.)

create table if not exists public.admins (
  email text primary key,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
-- no policies on purpose: nobody can read/write this table through the API; only the function below reads it.

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins a where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- >>> EDIT THIS LINE: put YOUR admin login email (the one you create in Supabase > Authentication > Users)
insert into public.admins (email) values ('svproducts.in@gmail.com') on conflict do nothing;

-- Replace the broad "any authenticated user" policies with admin-only ones
drop policy if exists "admin write categories" on public.categories;
drop policy if exists "admin write products" on public.products;
drop policy if exists "admin write variants" on public.product_variants;
drop policy if exists "admin read quotes" on public.quote_requests;
drop policy if exists "admin update quotes" on public.quote_requests;
drop policy if exists "admin manage product images" on storage.objects;

create policy "admin write categories" on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin write products" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin write variants" on public.product_variants for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin read quotes" on public.quote_requests for select to authenticated using (public.is_admin());
create policy "admin update quotes" on public.quote_requests for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin delete quotes" on public.quote_requests for delete to authenticated using (public.is_admin());
create policy "admin manage product images" on storage.objects for all to authenticated
  using (bucket_id = 'products' and public.is_admin()) with check (bucket_id = 'products' and public.is_admin());

-- admins also need to see inactive products and delete quotes
drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products for select using (is_active or public.is_admin());
grant delete on public.quote_requests to authenticated;
