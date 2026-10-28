import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { bulkAddVariants, deleteProduct, deleteVariant, saveVariant } from "../../../actions";
import { ProductForm } from "@/components/admin/ProductForm";
import { btnCls, btnGhost, ConfirmDelete, ImageUploader, inputCls, Label } from "@/components/admin/ui";

export const metadata = { title: "Edit product" };

// Private admin page: always fetches live data, never prerendered.
export const instant = false;

export default async function EditProductPage({ params, searchParams }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  const sp = await searchParams;
  const { supabase } = await requireAdmin();
  const [{ data: product }, { data: cats }, { data: variants }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("id,name").order("sort"),
    supabase.from("product_variants").select("*").eq("product_id", id).order("sort"),
  ]);
  if (!product) notFound();
  const cols: string[] = product.spec_columns ?? [];
  const grid = { gridTemplateColumns: `minmax(180px,2fr) ${cols.map(() => "minmax(90px,1fr)").join(" ")} 70px auto` };

  return (
    <div className="max-w-6xl">
      <Link href="/admin/products" className="text-sm text-furnace hover:underline">&larr; Products</Link>
      <div className="mb-6 mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-navy">{product.name}</h1>
        {sp.saved && <span className="inline-flex items-center gap-1 text-sm font-medium text-green-700"><CheckCircle2 size={16} /> Saved</span>}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <ProductForm product={product} categories={cats ?? []} />
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-steel">Product image</h2>
          <ImageUploader productId={product.id} current={product.image_path} />
        </div>
      </div>

      <section className="mt-8 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-navy">Size variants ({variants?.length ?? 0})</h2>
        {cols.length === 0 && <p className="mt-2 rounded-md bg-cream px-3 py-2 text-sm text-steel">Tip: add table columns above (e.g. &ldquo;Length in mm&rdquo;) so each variant can have its own values.</p>}
        <div className="mt-4 overflow-x-auto">
          <div className="min-w-[720px] space-y-2">
            <div className="grid gap-2 px-1 text-xs font-semibold uppercase tracking-wide text-steel" style={grid}>
              <span>Name</span>{cols.map((c) => <span key={c}>{c}</span>)}<span>Order</span><span />
            </div>
            {(variants ?? []).map((v) => (
              <div key={v.id} className="grid items-center gap-2" style={grid}>
                <form id={`v-${v.id}`} action={saveVariant} className="contents">
                  <input type="hidden" name="id" value={v.id} />
                  <input type="hidden" name="product_id" value={product.id} />
                  <input name="name" defaultValue={v.name} required className={inputCls} />
                  {cols.map((c) => <input key={c} name={`spec:${c}`} defaultValue={String(v.specs?.[c] ?? "")} className={inputCls} />)}
                  <input name="sort" type="number" defaultValue={v.sort} className={inputCls} />
                  <button className={btnGhost}>Save</button>
                </form>
                <span className="col-span-full -mt-1 flex justify-end">
                  <ConfirmDelete action={deleteVariant} id={v.id} label="Remove" message={`Remove "${v.name}"?`} />
                </span>
              </div>
            ))}
            <form action={saveVariant} className="grid items-center gap-2 rounded-lg bg-cream p-2" style={grid}>
              <input type="hidden" name="product_id" value={product.id} />
              <input name="name" required placeholder="New variant name" className={inputCls} />
              {cols.map((c) => <input key={c} name={`spec:${c}`} placeholder={c} className={inputCls} />)}
              <input name="sort" type="number" defaultValue={(variants?.length ?? 0)} className={inputCls} />
              <button className={btnCls}>Add</button>
            </form>
          </div>
        </div>

        <details className="mt-6 rounded-lg border border-steel/20 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-navy">Paste many variants at once</summary>
          <form action={bulkAddVariants} className="mt-3 space-y-3">
            <input type="hidden" name="product_id" value={product.id} />
            <input type="hidden" name="cols" value={cols.join("|")} />
            <Label text={`One per line:  Name${cols.map((c) => ` | ${c}`).join("")}`}>
              <textarea name="lines" rows={6} className={`${inputCls} font-mono`} placeholder={`Example 1.5mtr${cols.map(() => " | 1500").join("")}`} />
            </Label>
            <button className={btnCls}>Add all</button>
          </form>
        </details>
      </section>

      <div className="mt-8 flex justify-end">
        <ConfirmDelete action={deleteProduct} id={product.id} label="Delete this product" message={`Delete "${product.name}" and all its variants? This cannot be undone.`} />
      </div>
    </div>
  );
}
