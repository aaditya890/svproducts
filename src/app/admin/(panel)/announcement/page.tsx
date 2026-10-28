import { requireAdmin } from "@/lib/admin";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import type { Announcement } from "@/config/announcement";

export const metadata = { title: "Announcement" };

// Private admin page: always fetches live data, never prerendered.
export const instant = false;

const empty: Announcement = { enabled: false, badge: "NEW", message: "", link_label: "", link_url: "", tone: "gold" };

export default async function AnnouncementPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("site_announcement").select("*").eq("id", 1).maybeSingle();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-navy">Announcement bar</h1>
      <p className="mt-1 text-sm text-steel">One short line at the very top of every page: offers, holiday notice, new products. Keep it brief.</p>
      {error ? (
        <div className="mt-6 rounded-xl border border-furnace/40 bg-furnace/10 p-5 text-sm text-navy">
          <b>Setup needed.</b> The announcement table does not exist yet. Open Supabase &gt; SQL Editor and run the file <code>supabase/migrations/0007_announcement.sql</code>, then reload this page.
        </div>
      ) : (
        <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">
          <AnnouncementForm
            initial={data ? { enabled: data.enabled, badge: data.badge, message: data.message, link_label: data.link_label, link_url: data.link_url, tone: data.tone } : empty}
            lastSaved={data?.updated_at ? new Date(data.updated_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }) : undefined}
          />
        </div>
      )}
    </div>
  );
}
