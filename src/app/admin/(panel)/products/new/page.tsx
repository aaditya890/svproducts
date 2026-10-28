import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = { title: "New product" };

// Private admin page: always fetches live data, never prerendered.
export const instant = false;

export default async function NewProductPage() {
  const { supabase } = await requireAdmin();
  const { data: cats } = await supabase.from("categories").select("id,name").order("sort");
  return (
    <div className="max-w-3xl">
      <Link href="/admin/products" className="text-sm text-furnace hover:underline">&larr; Products</Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold text-navy">Add product</h1>
      <ProductForm categories={cats ?? []} />
      <p className="mt-3 text-xs text-steel">After creating the product you can upload its image and add size variants.</p>
    </div>
  );
}
