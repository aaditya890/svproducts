-- 0007: one-line announcement bar shown at the top of the website, editable in Admin > Announcement.
-- Run once in the Supabase SQL editor. Safe to run again.
create table if not exists public.site_announcement (
  id int primary key default 1 check (id = 1),          -- single row
  enabled boolean not null default false,
  badge text not null default 'NEW',                       -- short tag: NEW / OFFER / NOTICE / UPDATE
  message text not null default '' check (char_length(message) <= 90),
  link_label text not null default '' check (char_length(link_label) <= 20),
  link_url text not null default '' check (link_url = '' or link_url ~ '^(/|https://)'),
  tone text not null default 'gold' check (tone in ('gold','navy','fire')),
  updated_at timestamptz not null default now()
);
alter table public.site_announcement enable row level security;

drop policy if exists "public read announcement" on public.site_announcement;
drop policy if exists "admin write announcement" on public.site_announcement;
create policy "public read announcement" on public.site_announcement for select using (true);
create policy "admin write announcement" on public.site_announcement for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant select on public.site_announcement to anon, authenticated;
grant insert, update on public.site_announcement to authenticated;

insert into public.site_announcement (id, enabled, badge, message, link_label, link_url, tone)
values (1, false, 'NEW', 'Now supplying MS formwork and lifts - ask for a quote today', 'Products', '/products', 'gold')
on conflict (id) do nothing;
