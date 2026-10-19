# SV Products website

Next.js 16 (App Router) + TypeScript + Tailwind CSS 4.

**This release contains the navbar and the hero section only.** Links to pages that are not published yet are shown as disabled.

## Run

    npm install
    npm run dev        # http://localhost:3000

## Where things are

- `src/components/site/Header.tsx` &ndash; navbar (smart hide, mobile menu, scroll progress, theme switcher)
- `src/components/site/Hero.tsx` &ndash; hero section
- `src/components/site/SiteLink.tsx` &ndash; renders disabled links for unpublished pages
- `src/config/site.ts` &ndash; company details, menu, and `livePages` (add a path here when that page is ready)
- `src/config/themes.ts` &ndash; website colour themes

To turn every page link on locally, put `NEXT_PUBLIC_ALL_PAGES=true` in `.env.local`.
