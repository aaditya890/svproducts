import Link from "next/link";
import { Download, Mail, Phone } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { deleteQuote, saveQuoteNote, setQuoteStatus } from "../../actions";
import { btnCls, btnGhost, ConfirmDelete } from "@/components/admin/ui";

export const metadata = { title: "Quote requests" };
const statuses = ["new", "contacted", "quoted", "closed"] as const;
const statusStyle: Record<string, string> = {
  new: "bg-furnace text-white",
  contacted: "bg-forge/30 text-navy-dark",
  quoted: "bg-navy/10 text-navy",
  closed: "bg-mist text-steel",
};

// Private admin page: always fetches live data, never prerendered.
export const instant = false;

export default async function QuotesPage({ searchParams }: PageProps<"/admin/quotes">) {
  const { supabase } = await requireAdmin();
  const sp = await searchParams;
  const filter = typeof sp.status === "string" && (statuses as readonly string[]).includes(sp.status) ? sp.status : "";
  const search = typeof sp.q === "string" ? sp.q.trim().slice(0, 60).replace(/[,()%*]/g, " ") : "";

  let q = supabase.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(200);
  if (filter) q = q.eq("status", filter);
  if (search) q = q.or(`name.ilike.%${search}%,phone.ilike.%${search}%,company.ilike.%${search}%,city.ilike.%${search}%,message.ilike.%${search}%`);

  // the list and the per-status counts are fetched together (one round trip)
  const [{ data: quotes }, { data: statusRows }] = await Promise.all([q, supabase.from("quote_requests").select("status").limit(5000)]);
  const countOf: Record<string, number> = Object.fromEntries(statuses.map((s) => [s, 0]));
  for (const r of statusRows ?? []) countOf[r.status] = (countOf[r.status] ?? 0) + 1;
  const total = statusRows?.length ?? 0;
  const href = (status: string) => `/admin/quotes?${new URLSearchParams({ ...(status ? { status } : {}), ...(search ? { q: search } : {}) }).toString()}`;

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-navy">Quote requests <span className="text-base font-medium text-steel">({total})</span></h1>
        <a href="/admin/quotes/export" className={btnGhost}><Download size={15} /> Export CSV</a>
      </div>

      <form className="mt-4 flex gap-2" action="/admin/quotes">
        {filter && <input type="hidden" name="status" value={filter} />}
        <input name="q" defaultValue={search} placeholder="Search name, phone, company, city, product..." className="w-full max-w-md rounded-md border border-steel/30 bg-white px-3 py-2 text-sm outline-none focus:border-furnace focus:ring-2 focus:ring-forge/40" />
        <button className={btnCls}>Search</button>
        {search && <Link href={href(filter)} className={btnGhost}>Clear</Link>}
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {[["", "All", total], ...statuses.map((s) => [s, s[0].toUpperCase() + s.slice(1), countOf[s]])].map(([v, l, n]) => (
          <Link key={String(v)} href={href(String(v))} className={`rounded-full px-4 py-1.5 text-sm font-medium ${filter === v ? "bg-navy text-white" : "bg-white text-navy shadow-sm hover:bg-cream"}`}>
            {l} <span className={filter === v ? "text-forge" : "text-furnace"}>{n}</span>
          </Link>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {(quotes ?? []).map((r) => {
          const items = Array.isArray(r.items) ? (r.items as { product?: string }[]) : [];
          const waText = encodeURIComponent(`Hello ${r.name}, this is SV Products regarding your quotation request${items[0]?.product ? ` for ${items[0].product}` : ""}.`);
          const waNumber = r.phone.replace(/\D/g, "").replace(/^(\d{10})$/, "91$1");
          return (
            <article key={r.id} className={`rounded-xl bg-white p-5 shadow-sm ${r.status === "new" ? "border-l-4 border-furnace" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-navy">{r.name}{r.company ? ` · ${r.company}` : ""}</h2>
                  <p className="text-xs text-steel">{new Date(r.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })}{r.city ? ` · ${r.city}` : ""}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle[r.status] ?? "bg-cream text-furnace"}`}>{r.status}</span>
              </div>
              {items.length > 0 && <p className="mt-2 text-sm"><b className="text-navy">Product:</b> {items.map((i) => i.product).join(", ")}</p>}
              <p className="mt-2 whitespace-pre-wrap text-sm text-steel">{r.message}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a href={`tel:${r.phone}`} className={btnGhost}><Phone size={15} /> {r.phone}</a>
                <a href={`https://wa.me/${waNumber}?text=${waText}`} target="_blank" rel="noopener noreferrer" className={btnGhost}>WhatsApp</a>
                {r.email && <a href={`mailto:${r.email}`} className={btnGhost}><Mail size={15} /> {r.email}</a>}
                <form action={setQuoteStatus} className="ml-auto flex items-center gap-2">
                  <input type="hidden" name="id" value={r.id} />
                  <select name="status" defaultValue={r.status} className="rounded-md border border-steel/30 bg-white px-2 py-2 text-sm">
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button className={btnGhost}>Update</button>
                </form>
                <ConfirmDelete action={deleteQuote} id={r.id} label="" message="Delete this request permanently?" />
              </div>
              {"notes" in r && (
                <form action={saveQuoteNote} className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <input type="hidden" name="id" value={r.id} />
                  <textarea name="notes" defaultValue={r.notes ?? ""} rows={1} placeholder="Internal note (only you see this): quoted price, follow-up date..." className="min-h-10 w-full flex-1 rounded-md border border-steel/30 bg-white px-3 py-2 text-sm outline-none focus:border-furnace focus:ring-2 focus:ring-forge/40" />
                  <button className={btnGhost}>Save note</button>
                </form>
              )}
            </article>
          );
        })}
        {!quotes?.length && <p className="rounded-xl bg-white p-10 text-center text-steel shadow-sm">No quote requests{filter ? ` with status "${filter}"` : ""}{search ? ` matching "${search}"` : ""}.</p>}
      </div>
    </div>
  );
}
