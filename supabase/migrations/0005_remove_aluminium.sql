-- 0005: remove the aluminium product ranges (towers, customised aluminium scaffolds, aluminium formwork).
-- Deleting a category also deletes its products and their variants (ON DELETE CASCADE).
-- Run once in the Supabase SQL editor. Safe to run again (it just finds nothing to delete).
delete from public.categories
where slug in ('single-width-towers','double-width-towers','customized-aluminium-scaffolds','aluminium-formwork');
