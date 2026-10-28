import type { Metadata } from "next";
import { Suspense } from "react";
import { ClipboardText, Clock, Phone, ShieldCheck } from "@phosphor-icons/react/ssr";
import { FaWhatsapp } from "react-icons/fa6";
import { site } from "@/config/site";
import { QuoteForm } from "./QuoteForm";
import { PageHero } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Request a Quote",
  description: "Tell us your scaffolding or shuttering requirement and we will send you a quotation.",
};

async function Form({ searchParams }: { searchParams: PageProps<"/quote">["searchParams"] }) {
  const sp = await searchParams;
  const product = typeof sp.product === "string" ? sp.product.slice(0, 200) : undefined;
  return <QuoteForm product={product} />;
}

const steps = [
  { icon: ClipboardText, title: "Send your requirement", text: "Fill the form with product, quantity and site details." },
  { icon: Clock, title: "We call you back", text: "Our team contacts you within working hours to confirm details." },
  { icon: ShieldCheck, title: "Get your quotation", text: "You receive a clear, itemised quote for purchase or rental." },
];

export default function QuotePage({ searchParams }: PageProps<"/quote">) {
  return (
    <>
      <PageHero title="Request a" accent="Quote" crumb="Quote" text="Tell us what you need and our team will get back to you with a quotation." />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[1fr_340px]">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-mist" />}>
          <Form searchParams={searchParams} />
        </Suspense>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl bg-gradient-to-br from-navy-dark to-navy p-6 text-white shadow-lg">
            <h2 className="text-lg font-bold">What happens next?</h2>
            <ol className="mt-4 space-y-4">
              {steps.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-forge"><Icon size={22} /></span>
                  <span>
                    <span className="block text-sm font-semibold">{i + 1}. {title}</span>
                    <span className="block text-xs leading-relaxed text-white/70">{text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-forge/40 bg-cream p-6">
            <h2 className="text-lg font-bold text-navy">Prefer to talk?</h2>
            <p className="mt-1 text-sm text-steel">{site.hours}</p>
            <div className="mt-4 grid gap-3">
              {site.primaryPhone && (
                <a href={`tel:${site.primaryPhone.number}`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-furnace">
                  <Phone size={18} weight="fill" /> {site.primaryPhone.display}
                </a>
              )}
              {site.whatsappUrl && (
                <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25d366] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                  <FaWhatsapp size={20} /> WhatsApp us
                </a>
              )}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
