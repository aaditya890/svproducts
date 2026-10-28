import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Target } from "@phosphor-icons/react/ssr";
import { about, services } from "@/config/content";
import { getShowcase } from "@/lib/data";
import { site } from "@/config/site";
import { Cta } from "@/components/site/sections";
import { Icon, PageHero, Section, SectionHeading } from "@/components/site/ui";

/** Live numbers + range links from the catalogue. */
async function Catalogue() {
  const ranges = await getShowcase();
  const types = ranges.reduce((n, r) => n + r.items.length, 0);
  const sizes = ranges.reduce((n, r) => n + r.items.reduce((m, i) => m + i.sizes, 0), 0);
  const stats = [{ v: `${types}+`, l: "Product types" }, { v: `${sizes}+`, l: "Sizes listed" }, { v: String(ranges.length), l: "Product ranges" }];
  return (
    <section className="bg-navy-dark py-10 text-white sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-3 gap-3 text-center">
          {stats.map((s) => (
            <div key={s.l} className="rounded-2xl border border-white/10 bg-white/5 px-2 py-5">
              <p className="text-3xl font-extrabold text-forge sm:text-5xl">{s.v}</p>
              <p className="mt-1 text-xs text-white/70 sm:text-sm">{s.l}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {ranges.map((r) => (
            <Link key={r.id} href={`/products/${r.slug}`} className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/85 transition hover:border-forge hover:text-forge">{r.name}</Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export const metadata: Metadata = { title: "About Us", description: about.intro };

export default function AboutPage() {
  return (
    <>
      <PageHero title="About" accent="Us" crumb="About Us" text={site.tagline} />

      <Section>
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_360px]">
          <div>
            <SectionHeading title={about.headline} />
            <p className="mt-5 text-lg font-medium leading-relaxed text-navy">{about.intro}</p>
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 20)} className="mt-4 leading-relaxed text-steel">{p}</p>
            ))}
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-navy-dark to-navy p-8 text-center shadow-xl">
            <Image src={site.logoFull} alt={site.name} width={300} height={270} className="mx-auto h-auto w-64 rounded-2xl" />
            <p className="mt-5 text-lg font-semibold text-white">{site.name}</p>
            <p className="mt-1 text-xs text-forge">{site.addressOneLine}</p>
          </div>
        </div>
      </Section>

      <Suspense fallback={<div className="h-48 bg-navy-dark" />}>
        <Catalogue />
      </Suspense>

      <Section tone="cream">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border-l-8 border-furnace bg-white p-6 shadow-sm sm:p-8">
            <Target className="text-furnace" size={34} />
            <h2 className="mt-3 text-2xl font-bold text-navy">Our <span className="text-furnace">Mission</span></h2>
            <p className="mt-3 leading-relaxed text-steel">{about.mission}</p>
          </div>
          <div className="rounded-2xl border-l-8 border-forge bg-white p-6 shadow-sm sm:p-8">
            <Eye className="text-furnace" size={34} />
            <h2 className="mt-3 text-2xl font-bold text-navy">Our <span className="text-furnace">Vision</span></h2>
            <p className="mt-3 leading-relaxed text-steel">{about.vision}</p>
          </div>
        </div>
      </Section>

      <Section tone="cream">
        <SectionHeading center eyebrow="What we do" title="Our" accent="services" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-5">
          {services.map((s) => (
            <Link key={s.slug} href={`/services#${s.slug}`} className="group rounded-2xl bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-5">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-furnace/10 text-furnace"><Icon name={s.icon} /></span>
              <h3 className="mt-3 text-sm font-semibold text-navy sm:text-base">{s.title}</h3>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading center eyebrow="What we stand for" title="Our" accent="values" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-6 lg:grid-cols-4">
          {about.values.map((v) => (
            <div key={v.title} className="rounded-2xl border-t-4 border-forge bg-cream p-4 text-center sm:p-6">
              <span className="mx-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-navy text-forge"><Icon name={v.icon} /></span>
              <h3 className="mt-3 text-base font-semibold text-navy sm:mt-4 sm:text-lg">{v.title}</h3>
              <p className="mt-1 text-[13px] text-steel sm:text-sm">{v.text}</p>
            </div>
          ))}
        </div>
      </Section>
      <Cta />
    </>
  );
}
