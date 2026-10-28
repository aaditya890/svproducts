"use client";

import { useActionState } from "react";
import { CheckCircle as CheckCircle2, Phone, SpinnerGap as Loader2 } from "@phosphor-icons/react";
import { FaWhatsapp } from "react-icons/fa6";
import { site } from "@/config/site";
import { submitQuote, type QuoteState } from "./actions";

const initial: QuoteState = { ok: false, message: "" };

function Field({ label, name, error, children }: { label: string; name: string; error?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={name} className="block text-sm font-medium text-navy">
      {label}
      <div className="mt-1">{children}</div>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

const input =
  "w-full rounded-md border border-steel/30 bg-white px-3 py-2 text-sm outline-none transition focus:border-furnace focus:ring-2 focus:ring-forge/40";

export function QuoteForm({ product }: { product?: string }) {
  const [state, action, pending] = useActionState(submitQuote, initial);

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-forge bg-cream p-10 text-center">
        <CheckCircle2 className="mx-auto text-furnace" size={48} />
        <h2 className="mt-4 text-3xl font-bold text-navy">Request sent</h2>
        <p className="mt-2 text-steel">{state.message}</p>
        <p className="mt-4 text-sm text-steel">Need it faster? Reach us directly:</p>
        <div className="mt-3 flex flex-wrap justify-center gap-3">
          {site.primaryPhone && (
            <a href={`tel:${site.primaryPhone.number}`} className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-furnace">
              <Phone size={18} weight="fill" /> {site.primaryPhone.display}
            </a>
          )}
          {site.whatsappUrl && (
            <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-[#25d366] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
              <FaWhatsapp size={20} /> WhatsApp
            </a>
          )}
        </div>
      </div>
    );
  }

  const e = state.errors ?? {};
  return (
    <form action={action} className="space-y-4 rounded-2xl border border-forge/30 bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name *" name="name" error={e.name}><input id="name" name="name" className={input} autoComplete="name" /></Field>
        <Field label="Phone / WhatsApp *" name="phone" error={e.phone}><input id="phone" name="phone" className={input} autoComplete="tel" inputMode="tel" /></Field>
        <Field label="Email" name="email" error={e.email}><input id="email" name="email" type="email" className={input} autoComplete="email" /></Field>
        <Field label="Company" name="company" error={e.company}><input id="company" name="company" className={input} autoComplete="organization" /></Field>
        <Field label="City / site location" name="city" error={e.city}><input id="city" name="city" className={input} /></Field>
        <Field label="Product" name="product" error={e.product}><input id="product" name="product" defaultValue={product} autoComplete="off" className={input} placeholder="e.g. Cuplock Vertical" /></Field>
      </div>
      <Field label="Your requirement *" name="message" error={e.message}>
        <textarea id="message" name="message" rows={5} className={input} placeholder="Quantity, sizes, purchase or rental, working height, project details..." />
      </Field>
      {/* honeypot */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      {state.message && !state.ok && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p>}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-md bg-furnace px-6 py-3 font-semibold text-white transition hover:bg-navy disabled:opacity-60"
      >
        {pending && <Loader2 className="animate-spin" size={18} />} Send request
      </button>
    </form>
  );
}
