import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Phone } from "@phosphor-icons/react/ssr";
import { FaWhatsapp } from "react-icons/fa6";
import { about, process as steps, services, stats } from "@/config/content";
import { site } from "@/config/site";
import { Eyebrow, LineIcon } from "./ui";
import { Reveal, Stagger, StaggerItem } from "./motion";

/** Dark service columns: big thin line icons, rule, text, arrow (Industrium style). */
export function ServicesGrid({ limit }: { limit?: number }) {
  const list = limit ? services.slice(0, limit) : services;
  return (
    <Stagger className="-mx-4 mt-9 flex scroll-pl-4 snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mt-14 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 xl:grid-cols-5">
      {list.map((s) => (
        <StaggerItem key={s.slug} className="h-auto w-[78%] shrink-0 snap-start sm:h-full sm:w-auto">
          <Link href={`/services#${s.slug}`} className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-5 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0">
            <div className="flex items-end gap-4 border-b border-white/15 pb-5 transition group-hover:border-furnace">
              <LineIcon name={s.icon} size={52} className="shrink-0 text-furnace transition duration-300 group-hover:-translate-y-1" />
              <h3 className="text-lg font-semibold leading-snug">{s.title}</h3>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-white/65">{s.short}</p>
            <ArrowDownRight size={22} weight="bold" className="mt-auto pt-5 text-white/70 transition group-hover:translate-x-1 group-hover:translate-y-1 group-hover:text-forge" />
          </Link>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/** Numbered steps joined by a rule - no boxes. Works on light or dark backgrounds. */
export function ProcessSteps() {
  return (
    <Stagger className="mt-8 grid gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
      {steps.map((s, i) => (
        <StaggerItem key={s.title}>
          <div className="group relative flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm sm:block sm:rounded-none sm:border-t-2 sm:border-navy/15 sm:bg-transparent sm:p-0 sm:pt-6 sm:shadow-none sm:transition sm:hover:border-furnace">
            <span className="shrink-0 text-4xl font-extrabold leading-none text-transparent [-webkit-text-stroke:1.5px_var(--color-furnace)] sm:text-6xl">{String(i + 1).padStart(2, "0")}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-3 sm:mt-5">
                <LineIcon name={s.icon} size={30} className="shrink-0 text-navy transition group-hover:text-furnace" />
                <h3 className="text-lg font-semibold text-navy">{s.title}</h3>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-steel sm:mt-2">{s.text}</p>
            </div>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export function Stats() {
  if (!stats.length) return null;
  return (
    <section className="bg-navy-dark py-10 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 text-center sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-4xl font-bold text-forge">{s.value}</p>
            <p className="mt-1 text-sm text-white/70">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const aboutPills = [
  { label: "Cuplock", cls: "left-[-2%] top-[22%] -rotate-6" },
  { label: "Ringlock", cls: "right-[-2%] top-[10%] rotate-6" },
  { label: "H-Frame", cls: "left-[-4%] top-[52%] rotate-3" },
  { label: "Pipe & Coupler", cls: "right-[-3%] top-[44%] -rotate-3" },
  { label: "MS Formwork", cls: "left-[6%] bottom-[7%] -rotate-3" },
  { label: "Rental & Training", cls: "right-[2%] bottom-[3%] rotate-3" },
];

/** About band: gold background, navy circle with the scaffold frames breaking out, floating labels, big numbers. */
export function AboutPreview({ stats: s3 }: { stats?: { value: string; label: string }[] }) {
  const numbers = s3 ?? [];
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-forge via-forge to-sun py-20 text-navy-dark sm:py-28">
      <div aria-hidden className="absolute -left-24 top-10 h-64 w-64 rounded-full border-[28px] border-white/20" />
      <div aria-hidden className="absolute -bottom-20 right-10 h-56 w-56 rounded-full bg-furnace/25 blur-2xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
        {/* circle composition */}
        <Reveal x={-40} y={0}>
          <div className="relative mx-auto aspect-square w-full max-w-[460px]">
            <div aria-hidden className="absolute inset-[7%] rounded-full bg-navy-dark shadow-2xl" />
            <div aria-hidden className="absolute inset-[7%] rounded-full opacity-40 [background-image:repeating-conic-gradient(from_0deg_at_50%_100%,var(--color-forge)_0deg_2deg,transparent_2deg_10deg)] [mask-image:radial-gradient(circle_at_50%_100%,#000_10%,transparent_75%)]" />
            <div className="absolute inset-[7%] [clip-path:inset(-62%_-6%_0_-6%_round_0_0_50%_50%)]">
              <Image src="/products/a31.png" alt="H-Frame scaffolding frames" fill sizes="(min-width:1024px) 440px, 90vw" className="object-contain object-bottom drop-shadow-[0_24px_30px_rgba(0,0,0,0.45)]" priority={false} />
            </div>
            {aboutPills.map((p) => (
              <span key={p.label} className={`absolute ${p.cls} whitespace-nowrap rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-navy-dark shadow-lg transition hover:scale-105 sm:px-5 sm:py-2.5 sm:text-sm`}>
                {p.label}
              </span>
            ))}
          </div>
        </Reveal>

        {/* copy */}
        <Reveal x={40} y={0}>
          <p className="text-sm font-semibold text-navy-dark/80"><span className="mr-1">.</span>About {site.shortName}</p>
          <h2 className="mt-3 text-4xl font-extrabold leading-[1.05] sm:text-6xl">
            Who is{" "}
            <span className="mt-2 inline-block -rotate-1 rounded-xl bg-navy-dark px-4 py-1 text-forge shadow-lg sm:mt-3">{site.shortName}</span>
            ?
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-dark/85">{about.intro}</p>

          {numbers.length > 0 && (
            <div className="mt-9 grid max-w-xl grid-cols-3 gap-4">
              {numbers.map((n) => (
                <div key={n.label}>
                  <p className="text-4xl font-extrabold leading-none text-navy-dark sm:text-5xl">{n.value}</p>
                  <p className="mt-2 text-xs font-medium leading-snug text-navy-dark/75 sm:text-sm">{n.label}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link href="/about" className="group flex items-stretch overflow-hidden rounded-lg bg-navy-dark text-white transition hover:bg-furnace">
              <span className="px-6 py-4 font-semibold">More about us</span>
              <span className="flex w-12 items-center justify-center bg-white/10"><ArrowUpRight size={20} weight="bold" className="transition group-hover:rotate-45" /></span>
            </Link>
            {site.primaryPhone && (
              <a href={`tel:${site.primaryPhone.number}`} className="flex items-center gap-3 transition hover:text-furnace">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/70"><Phone size={22} weight="fill" className="text-furnace" /></span>
                <span className="text-sm leading-tight text-navy-dark/80">Call us<span className="block text-base font-bold text-navy-dark">{site.primaryPhone.display}</span></span>
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Cta() {
  return (
    <section className="relative overflow-hidden bg-navy-dark py-12 text-white sm:py-16">
      <div aria-hidden className="absolute -bottom-6 left-1/4 h-14 w-14 bg-furnace" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:items-center">
        <div>
          <Eyebrow light>Get in touch</Eyebrow>
          <h2 className="mt-2 max-w-2xl text-3xl font-bold sm:text-4xl">Need scaffolding or shuttering material for your site?</h2>
          <p className="mt-2 text-white/70">Tell us your requirement &ndash; we will get back to you with a quotation.</p>
        </div>
        <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
          <Link href={site.cta.href} className="group flex items-stretch justify-between overflow-hidden rounded-lg bg-furnace text-white transition hover:bg-forge hover:text-navy-dark">
            <span className="px-7 py-4 font-semibold">{site.cta.label}</span>
            <span className="flex w-14 items-center justify-center bg-black/15"><ArrowUpRight size={20} weight="bold" className="transition group-hover:rotate-45" /></span>
          </Link>
          {site.primaryPhone && (
            <a href={`tel:${site.primaryPhone.number}`} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-6 py-4 font-semibold transition hover:bg-white/10"><Phone size={18} weight="bold" className="text-forge" />{site.primaryPhone.display}</a>
          )}
          {site.whatsappUrl && (
            <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25d366] px-6 py-4 font-semibold text-white transition hover:opacity-90"><FaWhatsapp size={22} />WhatsApp</a>
          )}
        </div>
      </div>
    </section>
  );
}
