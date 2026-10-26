import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getCategories } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");
  const pages = ["", "/about", "/products", "/services", "/contact", "/quote"].filter((p) => site.pages.live.includes(p || "/"));
  const categories = await getCategories();
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 })),
    ...categories.map((c) => ({ url: `${base}/products/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.9 })),
  ];
}
