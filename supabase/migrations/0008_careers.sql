-- 0008: Careers. Job openings (managed in Admin > Jobs) and the applications people send (Admin > Applications).
-- Run once in the Supabase SQL editor. Safe to run again.

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 120),
  description text not null default '' check (char_length(description) <= 2000),
  qualification text not null default '' check (char_length(qualification) <= 500),
  vacancies int not null default 1 check (vacancies between 1 and 999),
  location text not null default '' check (char_length(location) <= 100),
  opening_date date not null default current_date,
  closing_date date not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  check (closing_date >= opening_date)
);

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  job_id uuid references public.jobs(id) on delete set null,
  job_title text not null default '',
  name text not null check (char_length(name) between 2 and 120),
  phone text not null check (char_length(phone) between 7 and 20),
  email text check (email is null or char_length(email) <= 160),
  qualification text check (qualification is null or char_length(qualification) <= 200),
  experience text check (experience is null or char_length(experience) <= 100),
  resume_link text check (resume_link is null or (char_length(resume_link) <= 300 and resume_link ~ '^https://')),
  message text check (message is null or char_length(message) <= 2000),
  status text not null default 'new' check (status in ('new','shortlisted','interview','hired','rejected')),
  notes text
);
create index if not exists job_applications_job_idx on public.job_applications (job_id);

alter table public.jobs enable row level security;
alter table public.job_applications enable row level security;

drop policy if exists "public read jobs" on public.jobs;
drop policy if exists "admin write jobs" on public.jobs;
drop policy if exists "anyone can apply" on public.job_applications;
drop policy if exists "admin read applications" on public.job_applications;
drop policy if exists "admin update applications" on public.job_applications;
drop policy if exists "admin delete applications" on public.job_applications;

create policy "public read jobs" on public.jobs for select using (is_active or public.is_admin());
create policy "admin write jobs" on public.jobs for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "anyone can apply" on public.job_applications for insert to anon, authenticated with check (true);
create policy "admin read applications" on public.job_applications for select to authenticated using (public.is_admin());
create policy "admin update applications" on public.job_applications for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin delete applications" on public.job_applications for delete to authenticated using (public.is_admin());

grant select on public.jobs to anon, authenticated;
grant insert, update, delete on public.jobs to authenticated;
grant insert on public.job_applications to anon, authenticated;
grant select, update, delete on public.job_applications to authenticated;
