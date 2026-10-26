import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "@phosphor-icons/react/ssr";
import { faqs, services } from "@/config/content";
import { Cta, ProcessSteps } from "@/components/site/sections";
import { Faq, Icon, PageHero, Section, SectionHeading } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Services",
  description: "Scaffolding, shuttering material, rental service, training & certification and customised solutions.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero title="Our" accent="Services" crumb="Services" text="Scaffolding, shuttering material, rental, training and customised solutions &ndash; all from one place." />

      <Section>
        <div className="space-y-8">
          {services.map((s, i) => (
            <article key={s.slug} id={s.slug} className="scroll-mt-32 overflow-hidden rounded-2xl border border-forge/30 bg-white shadow-sm">
              <div className={`grid gap-0 md:grid-cols-[260px_1fr] ${i % 2 ? "md:[&>div:first-child]:order-2" : ""}`}>
                <div className="flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-navy-dark to-navy p-8 text-center text-white">
                  <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-forge"><Icon name={s.icon} size={42} /></span>
                  <h2 className="text-2xl font-bold">{s.title}</h2>
                </div>
                <div className="p-8">
                  <p className="text-lg font-medium text-navy">{s.short}</p>
                  <ul className="mt-4 space-y-2">
                    {s.points.map((p) => (
                      <li key={p} className="flex gap-3 text-steel"><Check className="mt-0.5 shrink-0 text-furnace" size={18} />{p}</li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href={`/quote?product=${encodeURIComponent(s.title)}`} className="rounded-md bg-furnace px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy">Enquire now</Link>
                    {s.slug === "scaffolding" && <Link href="/products" className="rounded-md border border-navy px-5 py-2.5 text-sm font-semibold text-navy hover:bg-navy hover:text-white">View products</Link>}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="cream">
        <SectionHeading center eyebrow="Simple process" title="How it" accent="works" />
        <ProcessSteps />
      </Section>

      <Section>
        <SectionHeading center eyebrow="Questions" title="Frequently asked" accent="questions" />
        <div className="mt-10"><Faq items={faqs} /></div>
      </Section>
      <Cta />
    </>
  );
}
