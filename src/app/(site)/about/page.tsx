import type { Metadata } from "next";
import Image from "next/image";
import { Eye, Target } from "@phosphor-icons/react/ssr";
import { about } from "@/config/content";
import { site } from "@/config/site";
import { Cta } from "@/components/site/sections";
import { Icon, PageHero, Section, SectionHeading } from "@/components/site/ui";

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

      <Section tone="cream">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border-l-8 border-furnace bg-white p-8 shadow-sm">
            <Target className="text-furnace" size={34} />
            <h2 className="mt-3 text-2xl font-bold text-navy">Our <span className="text-furnace">Mission</span></h2>
            <p className="mt-3 leading-relaxed text-steel">{about.mission}</p>
          </div>
          <div className="rounded-2xl border-l-8 border-forge bg-white p-8 shadow-sm">
            <Eye className="text-furnace" size={34} />
            <h2 className="mt-3 text-2xl font-bold text-navy">Our <span className="text-furnace">Vision</span></h2>
            <p className="mt-3 leading-relaxed text-steel">{about.vision}</p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading center eyebrow="What we stand for" title="Our" accent="values" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {about.values.map((v) => (
            <div key={v.title} className="rounded-2xl border-t-4 border-forge bg-cream p-6 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy text-forge"><Icon name={v.icon} /></span>
              <h3 className="mt-4 text-lg font-semibold text-navy">{v.title}</h3>
              <p className="mt-1 text-sm text-steel">{v.text}</p>
            </div>
          ))}
        </div>
      </Section>
      <Cta />
    </>
  );
}
