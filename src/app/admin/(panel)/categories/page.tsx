import { requireAdmin } from "@/lib/admin";
import { deleteCategory, saveCategory } from "../../actions";
import { btnCls, ConfirmDelete, inputCls, Label } from "@/components/admin/ui";

export const metadata = { title: "Categories" };

// Private admin page: always fetches live data, never prerendered.
export const instant = false;

export default async function CategoriesPage() {
  const { supabase } = await requireAdmin();
  const { data: cats } = await supabase.from("categories").select("*, products(count)").order("sort");
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-navy">Categories</h1>
      <div className="mt-6 space-y-3">
        {(cats ?? []).map((c) => (
          <div key={c.id} className="rounded-xl bg-white p-4 shadow-sm">
            <form action={saveCategory} className="grid gap-3 sm:grid-cols-[1fr_1fr_90px_auto] sm:items-end">
              <input type="hidden" name="id" value={c.id} />
              <Label text="Name"><input name="name" defaultValue={c.name} required className={inputCls} /></Label>
              <Label text="URL slug"><input name="slug" defaultValue={c.slug} className={inputCls} /></Label>
              <Label text="Order"><input name="sort" type="number" defaultValue={c.sort} className={inputCls} /></Label>
              <button className={btnCls}>Save</button>
            </form>
            <div className="mt-2 flex items-center justify-between text-xs text-steel">
              <span>{c.products?.[0]?.count ?? 0} products</span>
              {(c.products?.[0]?.count ?? 0) === 0 && <ConfirmDelete action={deleteCategory} id={c.id} message={`Delete category "${c.name}"?`} />}
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-semibold text-navy">Add category</h2>
      <form action={saveCategory} className="mt-3 grid gap-3 rounded-xl bg-white p-4 shadow-sm sm:grid-cols-[1fr_1fr_90px_auto] sm:items-end">
        <Label text="Name"><input name="name" required className={inputCls} /></Label>
        <Label text="URL slug (optional)"><input name="slug" className={inputCls} /></Label>
        <Label text="Order"><input name="sort" type="number" defaultValue={(cats?.length ?? 0) + 1} className={inputCls} /></Label>
        <button className={btnCls}>Add</button>
      </form>
    </div>
  );
}
