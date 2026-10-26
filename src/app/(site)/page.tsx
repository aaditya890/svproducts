import { Suspense } from "react";
import { Cube, HardHat, ShieldCheck, Stack } from "@phosphor-icons/react/ssr";
import { getShowcase } from "@/lib/data";
import { faqs, showcaseSlugs } from "@/config/content";
import { AboutPreview, Cta, ProcessSteps, ServicesGrid, Stats } from "@/components/site/sections";
import { Hero, Ticker } from "@/components/site/Hero";
import { ProductShowcase } from "@/components/site/ProductShowcase";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { Eyebrow, Faq, MoreLink } from "@/components/site/ui";

const features = [
  { icon: ShieldCheck, title: "Safety first", text: "Every product is built around safe working at height." },
  { icon: Stack, title: "Full range", text: "Cuplock, Ringlock, H-Frame, Pipe & Coupler, formwork and lifts." },
  { icon: Cube, title: "Supply & rental", text: "Buy or rent scaffolding and shuttering material for any site." },
  { icon: HardHat, title: "Training", text: "Scaffolding training and certification for your team." },
];

const tickerItems = ["Cuplock Scaffolding", "Ringlock Scaffolding", "H-Frame Scaffolding", "Pipe & Coupler", "MS Formwork", "Shuttering Material", "Rental Service", "Training & Certification"];

async function About() {
  const ranges = await getShowcase();
  const types = ranges.reduce((n, r) => n + r.items.length, 0);
  const sizes = ranges.reduce((n, r) => n + r.items.reduce((m, i) => m + i.sizes, 0), 0);
  return (
    <AboutPreview
      stats={[
        { value: `${types}+`, label: "Product types" },
        { value: `${sizes}+`, label: "Sizes listed" },
        { value: String(ranges.length), label: "Product ranges" },
      ]}
    />
  );
}

async function Range() {
  const ranges = await getShowcase();
  // featured ranges only, in the order set in content.ts (the full list lives on /products)
  const featured = showcaseSlugs.map((s) => ranges.find((r) => r.slug === s)).filter((r): r is (typeof ranges)[number] => !!r);
  return <ProductShowcase ranges={featured.length ? featured : ranges} />;
}

export default function Home() {
  return (
    <>
      <Hero />
      <Ticker items={tickerItems} />
      <Stats />

      {/* why us - line icons in columns */}
      <section className="bg-white py-10 sm:py-20">
        <Stagger className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 sm:gap-x-10 sm:gap-y-12 sm:px-6 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <StaggerItem key={title}>
              <div className="group h-full rounded-2xl bg-mist p-4 sm:rounded-none sm:bg-transparent sm:p-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4 sm:border-b sm:border-navy/15 sm:pb-5 sm:transition sm:group-hover:border-furnace">
                  <Icon weight="light" className="size-10 shrink-0 text-furnace transition duration-300 group-hover:-translate-y-1 sm:size-[54px]" />
                  <h3 className="text-base font-semibold leading-snug text-navy-dark sm:text-lg">{title}</h3>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-steel sm:mt-5 sm:text-sm">{text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <Suspense fallback={<AboutPreview />}>
        <About />
      </Suspense>

      {/* products */}
      <section id="range" className="relative overflow-hidden bg-navy-dark py-12 text-white sm:py-24">
        <div aria-hidden className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Eyebrow light>Our range</Eyebrow>
                <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">Scaffolding systems for <span className="text-forge">every height</span></h2>
              </div>
              <MoreLink href="/products" light>Full catalogue</MoreLink>
            </div>
          </Reveal>
          <Suspense fallback={<div className="mt-12 h-[600px] animate-pulse bg-white/5" />}>
            <Range />
          </Suspense>
        </div>
      </section>

      {/* services */}
      <section className="relative overflow-hidden bg-[#0d1736] py-12 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <Eyebrow light>What we do</Eyebrow>
              <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">Everything you need for working at height</h2>
            </div>
          </Reveal>
          <ServicesGrid />
          <div className="mt-6 text-center sm:mt-14"><MoreLink href="/services" light>More services</MoreLink></div>
        </div>
      </section>

      {/* process */}
      <section className="bg-mist py-12 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Eyebrow>Simple process</Eyebrow>
                <h2 className="mt-3 text-3xl font-bold leading-tight text-navy-dark sm:text-5xl">From enquiry to <span className="text-furnace">site delivery</span></h2>
              </div>
              <MoreLink href="/quote">Request a quote</MoreLink>
            </div>
          </Reveal>
          <ProcessSteps />
        </div>
      </section>

      {/* faq */}
      <section className="bg-white py-12 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>Questions</Eyebrow>
              <h2 className="mt-3 text-3xl font-bold text-navy-dark sm:text-5xl">Frequently asked questions</h2>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 sm:mt-12"><Faq items={faqs} /></Reveal>
        </div>
      </section>

      <Cta />
    </>
  );
}
