import { requireAdmin } from "@/lib/admin";

const cell = (v: unknown) => {
  const s = v == null ? "" : String(v);
  // quote everything and neutralise spreadsheet formulas (=, +, -, @)
  return `"${(/^[=+\-@]/.test(s) ? "'" + s : s).replace(/"/g, '""')}"`;
};

/** Admin only: download all quote requests as a CSV file (opens in Excel / Google Sheets). */
export async function GET() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(5000);
  const head = ["Date (IST)", "Status", "Name", "Phone", "Email", "Company", "City", "Product", "Requirement", "Notes"];
  const rows = (data ?? []).map((r) => {
    const items = Array.isArray(r.items) ? (r.items as { product?: string }[]) : [];
    return [
      new Date(r.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      r.status, r.name, r.phone, r.email, r.company, r.city, items.map((i) => i.product).join("; "), r.message, r.notes,
    ].map(cell).join(",");
  });
  return new Response("﻿" + [head.map(cell).join(","), ...rows].join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="quote-requests-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
