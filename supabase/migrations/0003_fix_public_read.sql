-- 0003: FIX. The "public read products" policy calls is_admin(), but anonymous visitors
-- were not allowed to execute it -> "permission denied for function is_admin" on the public site.
-- is_admin() is harmless for anon: it simply returns false (no email in the token).
grant execute on function public.is_admin() to anon;
