-- 0006: internal notes on each quote request / lead (shown in Admin > Quote requests).
-- Run once in the Supabase SQL editor. Safe to run again.
alter table public.quote_requests add column if not exists notes text;
