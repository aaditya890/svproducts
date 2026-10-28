import type { Metadata } from "next";
import { Suspense } from "react";
import { Briefcase, CalendarBlank, GraduationCap, MapPin, UsersThree } from "@phosphor-icons/react/ssr";
import { site } from "@/config/site";
import { getOpenJobs } from "@/lib/data";
import { PageHero } from "@/components/site/ui";
import { ApplyForm } from "./ApplyForm";

export const metadata: Metadata = {
  title: "Careers",
  description: "Current job openings at SV Products Pvt. Ltd.",
};

const fmt = (d: string) => new Date(`${d}T00:00:00+05:30`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });

async function Openings() {
  const jobs = await getOpenJobs();

  if (!jobs.length) {
    return (
      <div className="rounded-2xl border border-forge/30 bg-cream p-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy text-forge"><Briefcase size={26} /></span>
        <h2 className="mt-4 text-2xl font-bold text-navy">No current openings</h2>
        <p className="mx-auto mt-2 max-w-md text-steel">We do not have any open positions right now. Please check again soon{site.email ? <>, or write to us at <a href={`mailto:${site.email}`} className="font-semibold text-furnace hover:underline">{site.email}</a></> : null}.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {jobs.map((j) => (
        <article key={j.id} className="overflow-hidden rounded-2xl border border-forge/30 bg-white shadow-sm">
          <div className="border-b-4 border-forge bg-cream px-5 py-4 sm:px-6">
            <h2 className="text-xl font-bold text-navy sm:text-2xl">{j.title}</h2>
            {j.location && <p className="mt-1 flex items-center gap-1.5 text-sm text-steel"><MapPin size={15} weight="fill" className="text-furnace" />{j.location}</p>}
          </div>
          <div className="p-5 sm:p-6">
            {j.description && <p className="whitespace-pre-line break-words leading-relaxed text-steel">{j.description}</p>}
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              {j.qualification && (
                <div className="flex gap-2"><GraduationCap size={20} className="mt-0.5 shrink-0 text-furnace" /><div><dt className="font-semibold text-navy">Qualification</dt><dd className="break-words text-steel">{j.qualification}</dd></div></div>
              )}
              <div className="flex gap-2"><UsersThree size={20} className="mt-0.5 shrink-0 text-furnace" /><div><dt className="font-semibold text-navy">Vacancies</dt><dd className="text-steel">{j.vacancies}</dd></div></div>
              <div className="flex gap-2"><CalendarBlank size={20} className="mt-0.5 shrink-0 text-furnace" /><div><dt className="font-semibold text-navy">Opening date</dt><dd className="text-steel">{fmt(j.opening_date)}</dd></div></div>
              <div className="flex gap-2"><CalendarBlank size={20} className="mt-0.5 shrink-0 text-furnace" /><div><dt className="font-semibold text-navy">Closing date</dt><dd className="text-steel">{fmt(j.closing_date)}</dd></div></div>
            </dl>
            <ApplyForm jobId={j.id} jobTitle={j.title} />
          </div>
        </article>
      ))}
    </div>
  );
}

export default function CareersPage() {
  return (
    <>
      <PageHero title="Join our" accent="team" crumb="Careers" text="Current openings at SV Products Pvt. Ltd." />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-mist" />}>
          <Openings />
        </Suspense>
      </div>
    </>
  );
}
