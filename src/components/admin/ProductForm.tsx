import { saveProduct } from "@/app/admin/actions";
import { btnCls, inputCls, Label } from "./ui";

type Cat = { id: string; name: string };
type P = {
  id?: string; name?: string; code?: string | null; slug?: string; category_id?: string; description?: string | null; note?: string | null;
  spec_columns?: string[]; is_active?: boolean; sort?: number;
};

export function ProductForm({ product, categories, defaultCategory }: { product?: P; categories: Cat[]; defaultCategory?: string }) {
  const p = product ?? {};
  return (
    <form action={saveProduct} className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
      {p.id && <input type="hidden" name="id" value={p.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Label text="Product name *"><input name="name" required defaultValue={p.name} className={inputCls} /></Label>
        <Label text="Category *">
          <select name="category_id" required defaultValue={p.category_id ?? defaultCategory ?? ""} className={inputCls}>
            <option value="" disabled>Choose...</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Label>
        <Label text="Catalogue code (e.g. A.1.1)"><input name="code" defaultValue={p.code ?? ""} className={inputCls} /></Label>
        <Label text="URL slug (auto if empty)"><input name="slug" defaultValue={p.slug ?? ""} className={inputCls} /></Label>
        <Label text="Table columns (comma separated)"><input name="spec_columns" defaultValue={(p.spec_columns ?? []).join(", ")} placeholder="Dia, Length in mm" className={inputCls} /></Label>
        <Label text="Display order"><input name="sort" type="number" defaultValue={p.sort ?? 0} className={inputCls} /></Label>
      </div>
      <Label text="Description (optional)"><textarea name="description" rows={3} defaultValue={p.description ?? ""} className={inputCls} /></Label>
      <Label text="Note shown under the table (optional)"><input name="note" defaultValue={p.note ?? ""} className={inputCls} /></Label>
      <label className="flex items-center gap-2 text-sm font-medium text-navy">
        <input type="checkbox" name="is_active" defaultChecked={p.is_active ?? true} className="h-4 w-4 accent-furnace" /> Show on website
      </label>
      <button className={btnCls}>{p.id ? "Save changes" : "Create product"}</button>
    </form>
  );
}
