import type { Metadata } from "next";
import { Suspense } from "react";
import { Briefcase } from "@phosphor-icons/react/ssr";
import { site } from "@/config/site";
import { getOpenJobs } from "@/lib/data";
import { PageHero } from "@/components/site/ui";
import { JobCard } from "./JobCard";

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
    <div className="space-y-4 sm:space-y-5">
      {jobs.map((j) => (
        <JobCard
          key={j.id}
          job={{
            id: j.id,
            title: j.title,
            location: j.location,
            qualification: j.qualification,
            description: j.description,
            vacancies: j.vacancies,
            openingLabel: fmt(j.opening_date),
            closingLabel: fmt(j.closing_date),
            daysLeft: j.daysLeft,
          }}
        />
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
