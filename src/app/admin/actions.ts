"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, slugify } from "@/lib/admin";
import { ANNOUNCEMENT_BADGES, ANNOUNCEMENT_LIMITS } from "@/config/announcement";

export type LoginState = { error: string };

// ---------------------------------------------------------------- auth
export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = z.object({ email: z.email(), password: z.string().min(1) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter a valid email and password." };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    if (error.code === "email_not_confirmed") return { error: "This user's email is not confirmed yet. In Supabase > Authentication > Users, open the user and confirm it (or recreate it with Auto Confirm ticked)." };
    if (error.code === "invalid_credentials") return { error: "Incorrect email or password. If you are sure they are right, reset the password in Supabase > Authentication > Users." };
    return { error: `Sign-in failed: ${error.message}` };
  }
  const { data: ok } = await supabase.rpc("is_admin");
  if (!ok) {
    await supabase.auth.signOut();
    return { error: "This account is not an admin. Ask the site owner to add your email." };
  }
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

function refresh() {
  updateTag("catalogue"); // public pages show the change immediately
  revalidatePath("/admin", "layout");
}

const str = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");
const num = (v: FormDataEntryValue | null, d = 0) => {
  const n = Number(str(v));
  return Number.isFinite(n) ? n : d;
};

// ---------------------------------------------------------------- categories
export async function saveCategory(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(formData.get("id"));
  const name = str(formData.get("name"));
  if (!name) throw new Error("Category name is required");
  const row = {
    name,
    slug: slugify(str(formData.get("slug")) || name),
    description: str(formData.get("description")) || null,
    sort: num(formData.get("sort")),
  };
  const { error } = id ? await supabase.from("categories").update(row).eq("id", id) : await supabase.from("categories").insert(row);
  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteCategory(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("categories").delete().eq("id", str(formData.get("id")));
  if (error) throw new Error(error.message);
  refresh();
}

// ---------------------------------------------------------------- products
export async function saveProduct(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(formData.get("id"));
  const name = str(formData.get("name"));
  const category_id = str(formData.get("category_id"));
  if (!name || !category_id) throw new Error("Name and category are required");
  const code = str(formData.get("code")) || null;
  const row = {
    name,
    category_id,
    code,
    slug: slugify(str(formData.get("slug")) || `${name}-${code ?? ""}`),
    description: str(formData.get("description")) || null,
    note: str(formData.get("note")) || null,
    spec_columns: str(formData.get("spec_columns")).split(",").map((s) => s.trim()).filter(Boolean),
    is_active: formData.get("is_active") === "on",
    sort: num(formData.get("sort")),
  };
  if (id) {
    const { error } = await supabase.from("products").update(row).eq("id", id);
    if (error) throw new Error(error.message);
    refresh();
    redirect(`/admin/products/${id}?saved=1`);
  }
  const { data, error } = await supabase.from("products").insert(row).select("id").single();
  if (error) throw new Error(error.message);
  refresh();
  redirect(`/admin/products/${data.id}?saved=1`);
}

export async function deleteProduct(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("products").delete().eq("id", str(formData.get("id")));
  if (error) throw new Error(error.message);
  refresh();
  redirect("/admin/products");
}

/** Called by the browser uploader after the file is in Supabase Storage. */
export async function setProductImage(productId: string, publicUrl: string) {
  const { supabase } = await requireAdmin();
  const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/`;
  if (publicUrl && !publicUrl.startsWith(base)) throw new Error("Invalid image URL");
  const { error } = await supabase.from("products").update({ image_path: publicUrl || null }).eq("id", productId);
  if (error) throw new Error(error.message);
  refresh();
}

// ---------------------------------------------------------------- variants
export async function saveVariant(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(formData.get("id"));
  const product_id = str(formData.get("product_id"));
  const name = str(formData.get("name"));
  if (!name) throw new Error("Variant name is required");
  const specs: Record<string, string | number> = {};
  for (const [k, v] of formData.entries()) {
    if (!k.startsWith("spec:") || typeof v !== "string" || v.trim() === "") continue;
    const val = v.trim();
    specs[k.slice(5)] = /^-?\d+(\.\d+)?$/.test(val) ? Number(val) : val;
  }
  const row = { product_id, name, specs, sort: num(formData.get("sort")) };
  const { error } = id ? await supabase.from("product_variants").update(row).eq("id", id) : await supabase.from("product_variants").insert(row);
  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteVariant(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("product_variants").delete().eq("id", str(formData.get("id")));
  if (error) throw new Error(error.message);
  refresh();
}

/** Paste many rows at once. Each line:  Name | value1 | value2   (values follow the product's spec columns). */
export async function bulkAddVariants(formData: FormData) {
  const { supabase } = await requireAdmin();
  const product_id = str(formData.get("product_id"));
  const cols = str(formData.get("cols")).split("|").map((s) => s.trim()).filter(Boolean);
  const { data: last } = await supabase.from("product_variants").select("sort").eq("product_id", product_id).order("sort", { ascending: false }).limit(1);
  let sort = (last?.[0]?.sort ?? -1) + 1;
  const rows = str(formData.get("lines"))
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, ...vals] = line.split("|").map((s) => s.trim());
      const specs: Record<string, string | number> = {};
      cols.forEach((c, i) => {
        const v = vals[i];
        if (v) specs[c] = /^-?\d+(\.\d+)?$/.test(v) ? Number(v) : v;
      });
      return { product_id, name, specs, sort: sort++ };
    })
    .filter((r) => r.name);
  if (!rows.length) return;
  const { error } = await supabase.from("product_variants").insert(rows);
  if (error) throw new Error(error.message);
  refresh();
}

// ---------------------------------------------------------------- announcement bar
const announcementSchema = z.object({
  enabled: z.boolean(),
  badge: z.enum(["", ...ANNOUNCEMENT_BADGES]),
  message: z.string().trim().max(ANNOUNCEMENT_LIMITS.message, `Message must be ${ANNOUNCEMENT_LIMITS.message} characters or fewer`),
  link_label: z.string().trim().max(ANNOUNCEMENT_LIMITS.linkLabel),
  link_url: z.string().trim().max(300).refine((u) => u === "" || /^\/(?!\/)/.test(u) || /^https:\/\//.test(u), "Link must start with / or https://"),
  tone: z.enum(["gold", "navy", "fire"]),
});

export async function saveAnnouncement(formData: FormData) {
  const { supabase } = await requireAdmin();
  const parsed = announcementSchema.safeParse({
    enabled: formData.get("enabled") === "on",
    badge: str(formData.get("badge")),
    message: str(formData.get("message")).replace(/\s+/g, " "),
    link_label: str(formData.get("link_label")),
    link_url: str(formData.get("link_url")),
    tone: str(formData.get("tone")) || "gold",
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid announcement");
  const d = parsed.data;
  if (d.enabled && !d.message) throw new Error("Write a message before switching the bar on.");
  const { error } = await supabase.from("site_announcement").upsert({ id: 1, ...d, link_label: d.link_url ? d.link_label : "", updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
  updateTag("announcement"); // the website shows the change straight away
  revalidatePath("/admin", "layout");
}

// ---------------------------------------------------------------- quotes
export async function setQuoteStatus(formData: FormData) {
  const { supabase } = await requireAdmin();
  const status = str(formData.get("status"));
  if (!["new", "contacted", "quoted", "closed"].includes(status)) throw new Error("Invalid status");
  const { error } = await supabase.from("quote_requests").update({ status }).eq("id", str(formData.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/admin", "layout");
}

export async function saveQuoteNote(formData: FormData) {
  const { supabase } = await requireAdmin();
  const notes = str(formData.get("notes")).slice(0, 2000);
  const { error } = await supabase.from("quote_requests").update({ notes: notes || null }).eq("id", str(formData.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/admin", "layout");
}

export async function deleteQuote(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("quote_requests").delete().eq("id", str(formData.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/admin", "layout");
}

// ---------------------------------------------------------------- careers
const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a valid date");
const jobSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(2, "Job title is required").max(120),
  description: z.string().trim().max(600, "Description can be at most 600 characters"),
  qualification: z.string().trim().max(300, "Qualification can be at most 300 characters"),
  vacancies: z.coerce.number().int().min(1, "Vacancies must be at least 1").max(999),
  location: z.string().trim().max(100),
  opening_date: dateStr,
  closing_date: dateStr,
  is_active: z.boolean(),
});

export async function saveJob(formData: FormData) {
  const { supabase } = await requireAdmin();
  const parsed = jobSchema.safeParse({
    id: str(formData.get("id")) || undefined,
    title: str(formData.get("title")),
    description: str(formData.get("description")),
    qualification: str(formData.get("qualification")),
    vacancies: str(formData.get("vacancies")) || "1",
    location: str(formData.get("location")),
    opening_date: str(formData.get("opening_date")),
    closing_date: str(formData.get("closing_date")),
    is_active: formData.get("is_active") === "on",
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid job");
  const { id, ...row } = parsed.data;
  if (row.closing_date < row.opening_date) throw new Error("Closing date must be on or after the opening date.");
  const { error } = id ? await supabase.from("jobs").update(row).eq("id", id) : await supabase.from("jobs").insert(row);
  if (error) throw new Error(error.message);
  updateTag("jobs"); // the careers page shows the change straight away
  revalidatePath("/admin", "layout");
}

export async function deleteJob(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("jobs").delete().eq("id", str(formData.get("id")));
  if (error) throw new Error(error.message);
  updateTag("jobs");
  revalidatePath("/admin", "layout");
}

const appStatuses = ["new", "shortlisted", "interview", "hired", "rejected"];
export async function setApplicationStatus(formData: FormData) {
  const { supabase } = await requireAdmin();
  const status = str(formData.get("status"));
  if (!appStatuses.includes(status)) throw new Error("Invalid status");
  const { error } = await supabase.from("job_applications").update({ status }).eq("id", str(formData.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/admin", "layout");
}

export async function saveApplicationNote(formData: FormData) {
  const { supabase } = await requireAdmin();
  const notes = str(formData.get("notes")).slice(0, 2000);
  const { error } = await supabase.from("job_applications").update({ notes: notes || null }).eq("id", str(formData.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/admin", "layout");
}

export async function deleteApplication(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("job_applications").delete().eq("id", str(formData.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/admin", "layout");
}
