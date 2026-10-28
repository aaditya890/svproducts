import Link from "next/link";
import { Download, Mail, Phone } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { deleteApplication, saveApplicationNote, setApplicationStatus } from "../../actions";
import { btnCls, btnGhost, ConfirmDelete } from "@/components/admin/ui";

export const metadata = { title: "Job applications" };

// Private admin page: always fetches live data, never prerendered.
export const instant = false;

const statuses = ["new", "shortlisted", "interview", "hired", "rejected"] as const;
const statusStyle: Record<string, string> = {
  new: "bg-furnace text-white",
  shortlisted: "bg-forge/30 text-navy-dark",
  interview: "bg-navy/10 text-navy",
  hired: "bg-green-100 text-green-800",
  rejected: "bg-mist text-steel",
};

export default async function ApplicationsPage({ searchParams }: PageProps<"/admin/applications">) {
  const { supabase } = await requireAdmin();
  const sp = await searchParams;
  const filter = typeof sp.status === "string" && (statuses as readonly string[]).includes(sp.status) ? sp.status : "";
  const jobFilter = typeof sp.job === "string" && /^[0-9a-f-]{36}$/i.test(sp.job) ? sp.job : "";
  const search = typeof sp.q === "string" ? sp.q.trim().slice(0, 60).replace(/[,()%*]/g, " ") : "";

  let q = supabase.from("job_applications").select("*").order("created_at", { ascending: false }).limit(300);
  if (filter) q = q.eq("status", filter);
  if (jobFilter) q = q.eq("job_id", jobFilter);
  if (search) q = q.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%,job_title.ilike.%${search}%,qualification.ilike.%${search}%`);

  // list + overview in one round trip
  const [{ data: apps, error }, { data: all }, { data: jobs }] = await Promise.all([
    q,
    supabase.from("job_applications").select("job_id,job_title,status").limit(5000),
    supabase.from("jobs").select("id,title").order("created_at", { ascending: false }),
  ]);

  if (error) {
    return (
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-navy">Job applications</h1>
        <div className="mt-6 rounded-xl border border-furnace/40 bg-furnace/10 p-5 text-sm text-navy">
          <b>Setup needed.</b> The careers tables do not exist yet. Run <code>supabase/migrations/0008_careers.sql</code> in the Supabase SQL Editor, then reload this page.
        </div>
      </div>
    );
  }

  const rows = all ?? [];
  const total = rows.length;
  const countOf: Record<string, number> = Object.fromEntries(statuses.map((s) => [s, 0]));
  for (const r of rows) countOf[r.status] = (countOf[r.status] ?? 0) + 1;

  // applications per job (a deleted job keeps its title)
  const perJob = new Map<string, { title: string; total: number; fresh: number; id: string | null }>();
  for (const r of rows) {
    const key = r.job_id ?? `t:${r.job_title}`;
    const cur = perJob.get(key) ?? { title: r.job_title || "(deleted job)", total: 0, fresh: 0, id: r.job_id };
    cur.total++;
    if (r.status === "new") cur.fresh++;
    perJob.set(key, cur);
  }
  const overview = [...perJob.values()].sort((a, b) => b.total - a.total);

  const href = (over: Record<string, string>) => {
    const p = new URLSearchParams({ ...(filter ? { status: filter } : {}), ...(jobFilter ? { job: jobFilter } : {}), ...(search ? { q: search } : {}), ...over });
    for (const [k, v] of [...p.entries()]) if (!v) p.delete(k);
    return `/admin/applications${p.toString() ? `?${p}` : ""}`;
  };

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-navy">Job applications <span className="text-base font-medium text-steel">({total} received)</span></h1>
        <a href="/admin/applications/export" className={btnGhost}><Download size={15} /> Export CSV</a>
      </div>

      {overview.length > 0 && (
        <section className="mt-5 rounded-xl bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-steel">Applications by job</h2>
          <ul className="mt-3 divide-y">
            {overview.map((o) => (
              <li key={o.id ?? o.title} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                {o.id ? <Link href={href({ job: o.id })} className="font-medium text-navy hover:text-furnace">{o.title}</Link> : <span className="font-medium text-navy">{o.title}</span>}
                <span className="text-steel"><b className="text-navy">{o.total}</b> received{o.fresh ? <span className="ml-2 rounded-full bg-furnace px-2 py-0.5 text-xs font-semibold text-white">{o.fresh} new</span> : null}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <form className="mt-5 flex flex-wrap gap-2" action="/admin/applications">
        {filter && <input type="hidden" name="status" value={filter} />}
        <input name="q" defaultValue={search} placeholder="Search name, phone, email, job, qualification..." className="w-full max-w-md rounded-md border border-steel/30 bg-white px-3 py-2 text-sm outline-none focus:border-furnace focus:ring-2 focus:ring-forge/40" />
        <select name="job" defaultValue={jobFilter} className="rounded-md border border-steel/30 bg-white px-2 py-2 text-sm">
          <option value="">All jobs</option>
          {(jobs ?? []).map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
        <button className={btnCls}>Search</button>
        {(search || jobFilter) && <Link href={href({ q: "", job: "" })} className={btnGhost}>Clear</Link>}
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {[["", "All", total], ...statuses.map((s) => [s, s[0].toUpperCase() + s.slice(1), countOf[s]])].map(([v, l, n]) => (
          <Link key={String(v)} href={href({ status: String(v) })} className={`rounded-full px-4 py-1.5 text-sm font-medium ${filter === v ? "bg-navy text-white" : "bg-white text-navy shadow-sm hover:bg-cream"}`}>
            {l} <span className={filter === v ? "text-forge" : "text-furnace"}>{n}</span>
          </Link>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {(apps ?? []).map((a) => {
          const waNumber = a.phone.replace(/\D/g, "").replace(/^(\d{10})$/, "91$1");
          const waText = encodeURIComponent(`Hello ${a.name}, this is SV Products regarding your application for ${a.job_title || "the job"}.`);
          return (
            <article key={a.id} className={`rounded-xl bg-white p-5 shadow-sm ${a.status === "new" ? "border-l-4 border-furnace" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-navy">{a.name}</h2>
                  <p className="text-sm text-furnace">{a.job_title || "(deleted job)"}</p>
                  <p className="text-xs text-steel">{new Date(a.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle[a.status] ?? "bg-cream text-furnace"}`}>{a.status}</span>
              </div>
              {(a.qualification || a.experience) && (
                <p className="mt-2 text-sm text-navy">{a.qualification ? <><b>Qualification:</b> {a.qualification}</> : null}{a.qualification && a.experience ? " · " : ""}{a.experience ? <><b>Experience:</b> {a.experience}</> : null}</p>
              )}
              {a.message && <p className="mt-2 whitespace-pre-wrap break-words text-sm text-steel">{a.message}</p>}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a href={`tel:${a.phone}`} className={btnGhost}><Phone size={15} /> {a.phone}</a>
                <a href={`https://wa.me/${waNumber}?text=${waText}`} target="_blank" rel="noopener noreferrer" className={btnGhost}>WhatsApp</a>
                {a.email && <a href={`mailto:${a.email}`} className={btnGhost}><Mail size={15} /> {a.email}</a>}
                {a.resume_link && <a href={a.resume_link} target="_blank" rel="noopener noreferrer" className={btnGhost}>Resume</a>}
                <form action={setApplicationStatus} className="ml-auto flex items-center gap-2">
                  <input type="hidden" name="id" value={a.id} />
                  <select name="status" defaultValue={a.status} className="rounded-md border border-steel/30 bg-white px-2 py-2 text-sm">
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button className={btnGhost}>Update</button>
                </form>
                <ConfirmDelete action={deleteApplication} id={a.id} label="" message="Delete this application permanently?" />
              </div>
              <form action={saveApplicationNote} className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input type="hidden" name="id" value={a.id} />
                <textarea name="notes" defaultValue={a.notes ?? ""} rows={1} placeholder="Internal note (only you see this): interview date, feedback..." className="min-h-10 w-full flex-1 rounded-md border border-steel/30 bg-white px-3 py-2 text-sm outline-none focus:border-furnace focus:ring-2 focus:ring-forge/40" />
                <button className={btnGhost}>Save note</button>
              </form>
            </article>
          );
        })}
        {!apps?.length && <p className="rounded-xl bg-white p-10 text-center text-steel shadow-sm">No applications{filter ? ` with status "${filter}"` : ""}{search ? ` matching "${search}"` : ""} yet.</p>}
      </div>
    </div>
  );
}
