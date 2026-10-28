"use client";

import { useState } from "react";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { ANNOUNCEMENT_BADGES, ANNOUNCEMENT_LIMITS, ANNOUNCEMENT_TONES, type Announcement, type AnnouncementTone } from "@/config/announcement";
import { saveAnnouncement } from "@/app/admin/actions";
import { btnCls, inputCls, Label } from "@/components/admin/ui";

/** Edit form with a live preview. Length limits are enforced here AND on the server, so the bar can never overflow. */
export function AnnouncementForm({ initial, lastSaved }: { initial: Announcement; lastSaved?: string }) {
  const [a, setA] = useState<Announcement>(initial);
  const set = <K extends keyof Announcement>(k: K, v: Announcement[K]) => setA((cur) => ({ ...cur, [k]: v }));
  const left = ANNOUNCEMENT_LIMITS.message - a.message.length;

  return (
    <form action={saveAnnouncement} className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-steel">Live preview</p>
        <div className="mt-2 overflow-hidden rounded-lg border border-steel/20 bg-white">
          {a.message.trim() ? <AnnouncementBar a={a} /> : <div className="flex h-9 items-center justify-center text-xs text-steel">Type a message to see the bar</div>}
        </div>
        <p className="mt-1.5 text-xs text-steel">{a.enabled ? "This bar is shown on the website." : "Switched off: visitors do not see it."}</p>
      </div>

      <label className="flex items-center gap-3 rounded-lg border border-steel/20 bg-white p-3 text-sm font-medium text-navy">
        <input type="checkbox" name="enabled" checked={a.enabled} onChange={(e) => set("enabled", e.target.checked)} className="h-5 w-5 accent-[#d76b0f]" />
        Show the announcement bar on the website
      </label>

      <Label text={`Message (max ${ANNOUNCEMENT_LIMITS.message} characters)`}>
        <input name="message" value={a.message} maxLength={ANNOUNCEMENT_LIMITS.message} onChange={(e) => set("message", e.target.value.replace(/\s+/g, " "))} className={inputCls} placeholder="e.g. Free site delivery on scaffolding orders above Rs 50,000" />
        <span className={`mt-1 block text-right text-xs ${left <= 10 ? "font-semibold text-furnace" : "text-steel"}`}>{left} left</span>
      </Label>

      <div className="grid gap-4 sm:grid-cols-3">
        <Label text="Tag">
          <select name="badge" value={a.badge} onChange={(e) => set("badge", e.target.value)} className={inputCls}>
            <option value="">No tag</option>
            {ANNOUNCEMENT_BADGES.map((b) => <option key={b}>{b}</option>)}
          </select>
        </Label>
        <Label text="Colour">
          <select name="tone" value={a.tone} onChange={(e) => set("tone", e.target.value as AnnouncementTone)} className={inputCls}>
            {ANNOUNCEMENT_TONES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </Label>
        <Label text={`Link text (max ${ANNOUNCEMENT_LIMITS.linkLabel})`}>
          <input name="link_label" value={a.link_label} maxLength={ANNOUNCEMENT_LIMITS.linkLabel} onChange={(e) => set("link_label", e.target.value)} className={inputCls} placeholder="Learn more" />
        </Label>
      </div>

      <Label text="Link address (optional)">
        <input name="link_url" value={a.link_url} onChange={(e) => set("link_url", e.target.value.trim())} className={inputCls} placeholder="/products   or   https://wa.me/917566666603" />
        <span className="mt-1 block text-xs text-steel">Use a page on this site (starts with /) or a full https:// link. Leave empty for a plain message.</span>
      </Label>

      <div className="flex items-center gap-4">
        <button className={btnCls}>Save announcement</button>
        {lastSaved && <span className="text-xs text-steel">Last saved {lastSaved}</span>}
      </div>
    </form>
  );
}
