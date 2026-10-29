import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import type { Announcement } from "@/config/announcement";

// Cookie-less client for PUBLIC catalogue data (safe to cache). RLS only exposes active products.
const db = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });

export type Variant = { id: string; name: string; specs: Record<string, string | number>; sort: number };
export type Product = {
  id: string; code: string | null; slug: string; name: string; image_path: string | null;
  note: string | null; spec_columns: string[]; product_variants: Variant[];
};
export type Category = { id: string; slug: string; name: string; description: string | null; sort: number };

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheTag("catalogue");
  cacheLife("hours");
  const { data, error } = await db().from("categories").select("*").order("sort");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getCategoryWithProducts(slug: string) {
  "use cache";
  cacheTag("catalogue");
  cacheLife("hours");
  const { data: cat, error } = await db().from("categories").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  if (!cat) return null;
  const { data: products, error: e2 } = await db()
    .from("products")
    .select("id,code,slug,name,image_path,note,spec_columns,product_variants(id,name,specs,sort)")
    .eq("category_id", cat.id)
    .order("sort");
  if (e2) throw new Error(e2.message);
  const list = (products ?? []).map((p) => ({
    ...p,
    product_variants: [...(p.product_variants ?? [])].sort((a, b) => a.sort - b.sort),
  })) as Product[];
  return { category: cat as Category, products: list };
}

export async function getCategoryCards() {
  "use cache";
  cacheTag("catalogue");
  cacheLife("hours");
  const { data, error } = await db()
    .from("categories")
    .select("id,slug,name,sort,products(image_path,sort)")
    .order("sort");
  if (error) throw new Error(error.message);
  return (data ?? []).map((c) => {
    const ps = [...(c.products ?? [])].sort((a, b) => a.sort - b.sort);
    return { id: c.id, slug: c.slug, name: c.name, count: ps.length, image: ps.find((p) => p.image_path)?.image_path ?? null };
  });
}

export type ShowcaseItem = { slug: string; name: string; code: string | null; image: string | null; sizes: number };
export type ShowcaseRange = { id: string; slug: string; name: string; items: ShowcaseItem[] };

/** Ranges with their products + image, for the interactive home-page showcase. */
export async function getShowcase(): Promise<ShowcaseRange[]> {
  "use cache";
  cacheTag("catalogue");
  cacheLife("hours");
  const { data, error } = await db()
    .from("categories")
    .select("id,slug,name,sort,products(slug,name,code,image_path,sort,product_variants(count))")
    .order("sort");
  if (error) throw new Error(error.message);
  return (data ?? []).map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    items: [...(c.products ?? [])]
      .sort((a, b) => a.sort - b.sort)
      .map((p) => ({ slug: p.slug, name: p.name, code: p.code, image: p.image_path, sizes: p.product_variants?.[0]?.count ?? 0 })),
  }));
}

/** Announcement bar content. Returns null when switched off, empty, or when the table does not exist yet. */
export async function getAnnouncement(): Promise<Announcement | null> {
  "use cache";
  cacheTag("announcement");
  cacheLife("minutes"); // short cache: an edit made in the admin shows on the live site within minutes
  try {
    const { data, error } = await db().from("site_announcement").select("enabled,badge,message,link_label,link_url,tone").eq("id", 1).maybeSingle();
    if (error || !data || !data.enabled || !data.message.trim()) return null;
    return data as Announcement;
  } catch {
    return null;
  }
}

export type Job = {
  id: string; title: string; description: string; qualification: string; vacancies: number;
  location: string; opening_date: string; closing_date: string;
  /** whole days until the closing date (0 = closes today); worked out here, inside the cache, because the page itself may not read the clock */
  daysLeft: number;
};

/** Jobs that are switched on AND whose opening/closing dates include today (India time). Empty list = "no current openings". */
export async function getOpenJobs(): Promise<Job[]> {
  "use cache";
  cacheTag("jobs");
  cacheLife("minutes");
  try {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // YYYY-MM-DD
    const { data, error } = await db()
      .from("jobs")
      .select("id,title,description,qualification,vacancies,location,opening_date,closing_date")
      .eq("is_active", true)
      .lte("opening_date", today)
      .gte("closing_date", today)
      .order("closing_date")
      .order("created_at"); // same closing date: keep the order the jobs were added in
    if (error) return [];
    const dayMs = 86_400_000;
    return (data ?? []).map((j) => ({
      ...j,
      daysLeft: Math.round((new Date(`${j.closing_date}T00:00:00Z`).getTime() - new Date(`${today}T00:00:00Z`).getTime()) / dayMs),
    })) as Job[];
  } catch {
    return [];
  }
}
