import { requireAdmin } from "@/lib/admin";
import { deleteJob, saveJob } from "../../actions";
import { btnCls, ConfirmDelete, inputCls, Label } from "@/components/admin/ui";

export const metadata = { title: "Jobs" };

// Private admin page: always fetches live data, never prerendered.
export const instant = false;

const istToday = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

type Job = { id: string; title: string; description: string; qualification: string; vacancies: number; location: string; opening_date: string; closing_date: string; is_active: boolean };

function JobFields({ j, today }: { j?: Job; today: string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-6">
      <div className="sm:col-span-4"><Label text="Job title *"><input name="title" defaultValue={j?.title} required maxLength={120} className={inputCls} placeholder="e.g. Scaffolding Supervisor" /></Label></div>
      <div className="sm:col-span-2"><Label text="Vacancies *"><input name="vacancies" type="number" min={1} max={999} defaultValue={j?.vacancies ?? 1} required className={inputCls} /></Label></div>
      <div className="sm:col-span-3"><Label text="Opening date *"><input name="opening_date" type="date" defaultValue={j?.opening_date ?? today} required className={inputCls} /></Label></div>
      <div className="sm:col-span-3"><Label text="Closing date *"><input name="closing_date" type="date" defaultValue={j?.closing_date} required className={inputCls} /></Label></div>
      <div className="sm:col-span-6"><Label text="Location"><input name="location" defaultValue={j?.location} maxLength={100} className={inputCls} placeholder="e.g. Bhatapara, Chhattisgarh" /></Label></div>
      <div className="sm:col-span-6"><Label text="Qualification (max 300 characters)"><input name="qualification" defaultValue={j?.qualification} maxLength={300} className={inputCls} placeholder="e.g. ITI / Diploma in Civil, 2 years experience" /></Label></div>
      <div className="sm:col-span-6"><Label text="Description (max 600 characters)"><textarea name="description" defaultValue={j?.description} rows={3} maxLength={600} className={inputCls} placeholder="What the person will do" /></Label></div>
    </div>
  );
}

export default async function JobsPage() {
  const { supabase } = await requireAdmin();
  const today = istToday();
  const [{ data: jobs, error }, { data: apps }] = await Promise.all([
    supabase.from("jobs").select("*").order("closing_date", { ascending: false }),
    supabase.from("job_applications").select("job_id,status"),
  ]);

  if (error) {
    return (
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-navy">Jobs</h1>
        <div className="mt-6 rounded-xl border border-furnace/40 bg-furnace/10 p-5 text-sm text-navy">
          <b>Setup needed.</b> The careers tables do not exist yet. Open Supabase &gt; SQL Editor and run <code>supabase/migrations/0008_careers.sql</code>, then reload this page.
        </div>
      </div>
    );
  }

  const countFor = (id: string) => (apps ?? []).filter((a) => a.job_id === id).length;
  const newFor = (id: string) => (apps ?? []).filter((a) => a.job_id === id && a.status === "new").length;
  const state = (j: Job) => (!j.is_active ? { t: "Hidden", c: "bg-mist text-steel" } : j.opening_date > today ? { t: "Scheduled", c: "bg-navy/10 text-navy" } : j.closing_date < today ? { t: "Closed", c: "bg-mist text-steel" } : { t: "Open", c: "bg-green-100 text-green-800" });

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-navy">Jobs</h1>
      <p className="mt-1 text-sm text-steel">Openings appear on the Careers page between their opening and closing date. When none is open, visitors see &ldquo;No current openings&rdquo;.</p>

      <h2 className="mt-8 text-lg font-semibold text-navy">Add a job</h2>
      <form action={saveJob} className="mt-3 space-y-4 rounded-xl bg-white p-4 shadow-sm sm:p-5">
        <JobFields today={today} />
        <label className="flex items-center gap-2 text-sm text-navy"><input type="checkbox" name="is_active" defaultChecked className="h-4 w-4 accent-[#d76b0f]" /> Show on the website (when inside its dates)</label>
        <button className={btnCls}>Add job</button>
      </form>

      <h2 className="mt-10 text-lg font-semibold text-navy">All jobs ({jobs?.length ?? 0})</h2>
      <div className="mt-3 space-y-4">
        {(jobs ?? []).map((j) => {
          const st = state(j as Job);
          return (
            <div key={j.id} className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${st.c}`}>{st.t}</span>
                <span className="text-xs text-steel">{countFor(j.id)} application{countFor(j.id) === 1 ? "" : "s"}{newFor(j.id) ? ` (${newFor(j.id)} new)` : ""}</span>
              </div>
              <form action={saveJob} className="space-y-4">
                <input type="hidden" name="id" value={j.id} />
                <JobFields j={j as Job} today={today} />
                <label className="flex items-center gap-2 text-sm text-navy"><input type="checkbox" name="is_active" defaultChecked={j.is_active} className="h-4 w-4 accent-[#d76b0f]" /> Show on the website (when inside its dates)</label>
                <button className={btnCls}>Save changes</button>
              </form>
              <div className="mt-3 flex justify-end"><ConfirmDelete action={deleteJob} id={j.id} message={`Delete "${j.title}"? Applications already received are kept.`} /></div>
            </div>
          );
        })}
        {!jobs?.length && <p className="rounded-xl bg-white p-8 text-center text-steel shadow-sm">No jobs yet. Add the first one above.</p>}
      </div>
    </div>
  );
}
