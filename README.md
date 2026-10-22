# SV Products website (svproducts_next)

Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + Supabase.

## Run
    npm install
    copy .env.local.example .env.local   # then fill in the Supabase keys
    npm run dev                          # http://localhost:3000

## Structure
- `src/app/(site)`   public pages (to build)      - `src/app/admin`  admin area (login guarded by `src/proxy.ts`)
- `src/lib/supabase` browser / server / admin clients      - `src/lib/site.ts` company details
- `supabase/migrations` SQL for tables (next step)
- `public/brand` logos, `public/products` 46 product images (transparent PNG)

## Brand colours (Tailwind): forge, furnace, charcoal, sun, rust, steel, navy, navy-dark, cream, mist
