import Link from "next/link";
import { AlertTriangle, Boxes, Briefcase, FolderTree, Inbox, Layers, Phone, TrendingUp, UserCheck } from "lucide-react";
import { requireAdmin } from "@/lib/admin";

// Private admin page: always fetches live data, never prerendered.
export const instant = false;

const statuses = ["new", "contacted", "quoted", "closed"] as const;
const statusBar: Record<string, string> = { new: "bg-furnace", contacted: "bg-forge", quoted: "bg-navy", closed: "bg-steel/40" };
const DAY = 86_400_000;
const istDay = (d: Date | number) => new Date(d).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // YYYY-MM-DD in India time

export default async function Dashboard() {
  const { supabase, user } = await requireAdmin();
  const count = async (table: string) => {
    const { count: c } = await supabase.from(table).select("*", { count: "exact", head: true });
    return c ?? 0;
  };
  // one parallel batch = one round trip to the database instead of four in a row
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const [products, variants, categories, { data: leads }, { count: openJobs }, { count: newApps }, { count: totalApps }] = await Promise.all([
    count("products"),
    count("product_variants"),
    count("categories"),
    supabase.from("quote_requests").select("id,created_at,name,phone,status,message,city,items").order("created_at", { ascending: false }).limit(1000),
    supabase.from("jobs").select("*", { count: "exact", head: true }).eq("is_active", true).lte("opening_date", today).gte("closing_date", today),
    supabase.from("job_applications").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("job_applications").select("*", { count: "exact", head: true }),
  ]);
  const all = leads ?? [];
  const now = new Date().getTime();

  const byStatus = Object.fromEntries(statuses.map((s) => [s, all.filter((l) => l.status === s).length])) as Record<string, number>;
  const last7 = all.filter((l) => now - new Date(l.created_at).getTime() < 7 * DAY).length;
  const prev7 = all.filter((l) => { const t = now - new Date(l.created_at).getTime(); return t >= 7 * DAY && t < 14 * DAY; }).length;
  const needsFollowUp = all.filter((l) => l.status === "new" && now - new Date(l.created_at).getTime() > DAY);

  // leads per day, last 14 days (India time)
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now - (13 - i) * DAY);
    return { key: istDay(d), label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" }), n: 0 };
  });
  for (const l of all) {
    const d = days.find((x) => x.key === istDay(l.created_at));
    if (d) d.n++;
  }
  const peak = Math.max(1, ...days.map((d) => d.n));

  // most requested products
  const tally = new Map<string, number>();
  for (const l of all) {
    const items = Array.isArray(l.items) ? (l.items as { product?: string }[]) : [];
    for (const i of items) if (i.product) tally.set(i.product, (tally.get(i.product) ?? 0) + 1);
  }
  const top = [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const trend = last7 - prev7;
  const cards = [
    { label: "New leads", value: byStatus.new, icon: Inbox, href: "/admin/quotes?status=new", hot: byStatus.new > 0, sub: byStatus.new ? "waiting for your reply" : "all caught up" },
    { label: "Leads this week", value: last7, icon: TrendingUp, href: "/admin/quotes", sub: `${trend >= 0 ? "+" : ""}${trend} vs last week` },
    { label: "Products", value: products, icon: Boxes, href: "/admin/products", sub: `${variants} sizes listed` },
    { label: "Categories", value: categories, icon: FolderTree, href: "/admin/categories", sub: "product ranges" },
    { label: "Open jobs", value: openJobs ?? 0, icon: Briefcase, href: "/admin/jobs", sub: "on the Careers page now" },
    { label: "Job applications", value: totalApps ?? 0, icon: UserCheck, href: "/admin/applications", hot: (newApps ?? 0) > 0, sub: `${newApps ?? 0} new` },
  ];
  const name = user.email.split("@")[0];

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
      <p className="mt-1 text-sm text-steel">Welcome back, {name}. {all.length} lead{all.length === 1 ? "" : "s"} in total.</p>

      {needsFollowUp.length > 0 && (
        <Link href="/admin/quotes?status=new" className="mt-4 flex items-center gap-3 rounded-xl border border-furnace/40 bg-furnace/10 px-4 py-3 text-sm text-navy transition hover:bg-furnace/15">
          <AlertTriangle size={18} className="shrink-0 text-furnace" />
          <span><b>{needsFollowUp.length}</b> new lead{needsFollowUp.length === 1 ? " has" : "s have"} been waiting more than a day. Reply to them first.</span>
        </Link>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, href, hot, sub }) => (
          <Link key={label} href={href} className={`rounded-xl border-t-4 bg-white p-5 shadow-sm transition hover:shadow-md ${hot ? "border-furnace" : "border-forge"}`}>
            <Icon className="text-furnace" />
            <p className="mt-3 text-3xl font-bold text-navy">{value}</p>
            <p className="text-sm font-medium text-navy">{label}</p>
            <p className="text-xs text-steel">{sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-navy">Leads, last 14 days</h2>
          <div className="mt-5 flex h-36 items-end gap-1.5" role="img" aria-label="Leads per day for the last 14 days">
            {days.map((d) => (
              <div key={d.key} className="flex h-full flex-1 flex-col justify-end" title={`${d.label}: ${d.n}`}>
                {d.n > 0 && <span className="mb-1 text-center text-[10px] font-semibold text-navy">{d.n}</span>}
                <div className={`w-full rounded-t ${d.n ? "bg-furnace" : "bg-mist"}`} style={{ height: `${d.n ? Math.max(8, (d.n / peak) * 100) : 4}%` }} />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-steel"><span>{days[0].label}</span><span>{days[13].label}</span></div>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-navy">Lead status</h2>
          <ul className="mt-4 space-y-3">
            {statuses.map((s) => (
              <li key={s}>
                <Link href={`/admin/quotes?status=${s}`} className="block">
                  <div className="flex justify-between text-sm"><span className="capitalize text-navy">{s}</span><b className="text-navy">{byStatus[s]}</b></div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-mist"><div className={`h-full rounded-full ${statusBar[s]}`} style={{ width: `${all.length ? (byStatus[s] / all.length) * 100 : 0}%` }} /></div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-navy">Latest leads</h2>
            <Link href="/admin/quotes" className="text-sm font-medium text-furnace hover:underline">View all</Link>
          </div>
          <ul className="mt-3 divide-y">
            {all.slice(0, 6).map((q) => {
              const items = Array.isArray(q.items) ? (q.items as { product?: string }[]) : [];
              return (
                <li key={q.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                  <span className="min-w-0">
                    <b className="text-navy">{q.name}</b>
                    <span className="block truncate text-xs text-steel">{items[0]?.product ? `${items[0].product} · ` : ""}{q.city ? `${q.city} · ` : ""}{new Date(q.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" })}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <a href={`tel:${q.phone}`} aria-label={`Call ${q.name}`} className="rounded-md border border-steel/30 p-1.5 text-navy hover:bg-mist"><Phone size={14} /></a>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${q.status === "new" ? "bg-furnace text-white" : "bg-cream text-furnace"}`}>{q.status}</span>
                  </span>
                </li>
              );
            })}
            {!all.length && <li className="py-6 text-center text-sm text-steel">No leads yet. They appear here as soon as someone submits the quote form.</li>}
          </ul>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-semibold text-navy"><Layers size={16} className="text-furnace" /> Most requested products</h2>
          <ul className="mt-3 divide-y">
            {top.map(([p, n]) => (
              <li key={p} className="flex items-center justify-between gap-3 py-2.5 text-sm"><span className="truncate text-navy">{p}</span><b className="rounded-full bg-cream px-2 text-furnace">{n}</b></li>
            ))}
            {!top.length && <li className="py-6 text-center text-sm text-steel">No product requests yet.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
