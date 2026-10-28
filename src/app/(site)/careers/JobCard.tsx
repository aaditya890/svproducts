"use client";

import { useState } from "react";
import { CalendarBlank, CaretDown, GraduationCap, MapPin, PaperPlaneTilt, UsersThree } from "@phosphor-icons/react";
import { ApplyForm } from "./ApplyForm";

export type JobCardData = {
  id: string;
  title: string;
  location: string;
  qualification: string;
  description: string;
  vacancies: number;
  openingLabel: string;
  closingLabel: string;
  daysLeft: number;
};

/** One job: key facts always visible, the description hides behind a "Details" toggle. */
export function JobCard({ job }: { job: JobCardData }) {
  const [details, setDetails] = useState(false);
  const [applying, setApplying] = useState(false);
  const urgent = job.daysLeft <= 7;

  return (
    <article className="overflow-hidden rounded-2xl border border-forge/40 border-l-[6px] border-l-furnace bg-white shadow-sm transition hover:shadow-lg">
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <h2 className="min-w-0 break-words text-xl font-bold leading-tight text-navy sm:text-2xl">{job.title}</h2>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${urgent ? "bg-furnace text-white" : "bg-cream text-furnace"}`}>
            {job.daysLeft <= 0 ? "Closes today" : job.daysLeft === 1 ? "1 day left" : `${job.daysLeft} days left`}
          </span>
        </div>

        {job.location && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-steel"><MapPin size={16} weight="fill" className="shrink-0 text-furnace" />{job.location}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-navy/5 px-3 py-1.5 font-medium text-navy">
            <UsersThree size={16} className="text-furnace" /> {job.vacancies} {job.vacancies === 1 ? "vacancy" : "vacancies"}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-navy/5 px-3 py-1.5 font-medium text-navy">
            <CalendarBlank size={16} className="text-furnace" /> Closes {job.closingLabel}
          </span>
        </div>

        {job.qualification && (
          <p className="mt-4 flex items-start gap-2 text-sm text-navy">
            <GraduationCap size={18} className="mt-0.5 shrink-0 text-furnace" />
            <span className="min-w-0 break-words"><b>Qualification:</b> {job.qualification}</span>
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
          <button
            type="button"
            onClick={() => setDetails((v) => !v)}
            aria-expanded={details}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-navy/25 px-5 py-3 text-sm font-semibold text-navy transition hover:bg-navy hover:text-white"
          >
            {details ? "Hide details" : "Details"}
            <CaretDown size={16} weight="bold" className={`transition-transform ${details ? "rotate-180" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => setApplying((v) => !v)}
            aria-expanded={applying}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-furnace px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy"
          >
            Apply now <PaperPlaneTilt size={16} weight="fill" />
          </button>
        </div>

        {details && (
          <div className="mt-4 rounded-xl bg-cream/70 p-4 text-sm">
            {job.description ? (
              <p className="whitespace-pre-line break-words leading-relaxed text-steel">{job.description}</p>
            ) : (
              <p className="text-steel">No further details. Contact us for more information.</p>
            )}
            <p className="mt-3 border-t border-forge/40 pt-3 text-xs text-steel">
              Opening date: <b className="text-navy">{job.openingLabel}</b> &nbsp;|&nbsp; Closing date: <b className="text-navy">{job.closingLabel}</b>
            </p>
          </div>
        )}

        <ApplyForm jobId={job.id} jobTitle={job.title} open={applying} onClose={() => setApplying(false)} />
      </div>
    </article>
  );
}
