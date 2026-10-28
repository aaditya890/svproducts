"use client";

import { useActionState } from "react";
import { CheckCircle, SpinnerGap } from "@phosphor-icons/react";
import { submitApplication, type ApplyState } from "./actions";

const initial: ApplyState = { ok: false, message: "" };
const input =
  "w-full rounded-md border border-steel/30 bg-white px-3 py-2 text-sm outline-none transition focus:border-furnace focus:ring-2 focus:ring-forge/40";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-navy">
      {label}
      <div className="mt-1">{children}</div>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

/** Short application form shown under the job card when the card's "Apply now" button is pressed. */
export function ApplyForm({ jobId, jobTitle, open, onClose }: { jobId: string; jobTitle: string; open: boolean; onClose: () => void }) {
  const [state, action, pending] = useActionState(submitApplication, initial);
  const e = state.errors ?? {};

  if (state.ok) {
    return (
      <div className="mt-4 rounded-xl border border-forge bg-cream p-5 text-center">
        <CheckCircle className="mx-auto text-furnace" size={36} />
        <p className="mt-2 font-semibold text-navy">Application sent</p>
        <p className="mt-1 text-sm text-steel">{state.message}</p>
      </div>
    );
  }

  if (!open) return null;

  return (
    <div className="mt-4">
      {(
        <form action={action} className="space-y-3 rounded-xl border border-forge/40 bg-cream/60 p-4 sm:p-5">
          <p className="text-sm font-semibold text-navy">Apply for: {jobTitle}</p>
          <input type="hidden" name="job_id" value={jobId} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Your name *" error={e.name}><input name="name" className={input} autoComplete="name" /></Field>
            <Field label="Phone / WhatsApp *" error={e.phone}><input name="phone" className={input} autoComplete="tel" inputMode="tel" /></Field>
            <Field label="Email" error={e.email}><input name="email" type="email" className={input} autoComplete="email" /></Field>
            <Field label="Qualification" error={e.qualification}><input name="qualification" className={input} placeholder="e.g. ITI, Diploma, B.Tech" /></Field>
            <Field label="Experience" error={e.experience}><input name="experience" className={input} placeholder="e.g. 3 years" /></Field>
            <Field label="Resume link (optional)" error={e.resume_link}><input name="resume_link" className={input} placeholder="https://drive.google.com/..." /></Field>
          </div>
          <Field label="Message (optional)" error={e.message}><textarea name="message" rows={3} className={input} placeholder="Anything you would like us to know" /></Field>
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          {state.message && !state.ok && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p>}
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-md bg-furnace px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy disabled:opacity-60">
              {pending && <SpinnerGap className="animate-spin" size={16} />} Send application
            </button>
            <button type="button" onClick={onClose} className="text-sm font-medium text-steel hover:text-navy">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
