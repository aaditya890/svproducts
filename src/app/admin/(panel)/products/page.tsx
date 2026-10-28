import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { btnCls } from "@/components/admin/ui";

export const metadata = { title: "Products" };

// Private admin page: always fetches live data, never prerendered.
export const instant = false;

export default async function ProductsAdminPage({ searchParams }: PageProps<"/admin/products">) {
  const { supabase } = await requireAdmin();
  const sp = await searchParams;
  const cat = typeof sp.category === "string" ? sp.category : "";
  const search = typeof sp.q === "string" ? sp.q.trim() : "";
  const { data: cats } = await supabase.from("categories").select("id,name").order("sort");
  let q = supabase.from("products").select("id,name,code,image_path,is_active,category_id,product_variants(count)").order("sort");
  if (cat) q = q.eq("category_id", cat);
  if (search) q = q.ilike("name", `%${search.replace(/[%,]/g, "")}%`);
  const { data: products } = await q;
  const catName = Object.fromEntries((cats ?? []).map((c) => [c.id, c.name]));

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-navy">Products</h1>
        <Link href="/admin/products/new" className={btnCls}><Plus size={16} /> Add product</Link>
      </div>
      <form className="mt-5 flex flex-wrap gap-3">
        <input name="q" defaultValue={search} placeholder="Search by name..." className="w-64 rounded-md border border-steel/30 bg-white px-3 py-2 text-sm" />
        <select name="category" defaultValue={cat} className="rounded-md border border-steel/30 bg-white px-3 py-2 text-sm">
          <option value="">All categories</option>
          {(cats ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="rounded-md bg-white px-4 py-2 text-sm font-medium text-navy shadow-sm hover:bg-cream">Filter</button>
      </form>
      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-navy text-left text-white">
            <tr><th className="px-4 py-3">Product</th><th className="hidden px-4 py-3 sm:table-cell">Category</th><th className="px-4 py-3 text-center">Sizes</th><th className="px-4 py-3 text-center">Status</th></tr>
          </thead>
          <tbody>
            {(products ?? []).map((p) => (
              <tr key={p.id} className="border-t odd:bg-white even:bg-cream/40 hover:bg-cream">
                <td className="px-4 py-2">
                  <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 font-medium text-navy hover:text-furnace">
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border bg-white">
                      {p.image_path && <Image src={p.image_path} alt="" fill sizes="48px" className="object-contain p-1" />}
                    </span>
                    <span>{p.code && <span className="mr-2 rounded bg-furnace px-1.5 py-0.5 text-[10px] font-bold text-white">{p.code}</span>}{p.name}</span>
                  </Link>
                </td>
                <td className="hidden px-4 py-2 text-steel sm:table-cell">{catName[p.category_id]}</td>
                <td className="px-4 py-2 text-center">{p.product_variants?.[0]?.count ?? 0}</td>
                <td className="px-4 py-2 text-center"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{p.is_active ? "Live" : "Hidden"}</span></td>
              </tr>
            ))}
            {!products?.length && <tr><td colSpan={4} className="px-4 py-10 text-center text-steel">No products found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
