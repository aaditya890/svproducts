import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { ArrowDownRight } from "@phosphor-icons/react/ssr";
import { Check, ClipboardText as ClipboardList, GraduationCap, Hammer, Stack as Layers, CalendarCheck as CalendarClock, Package, Phone, Ruler, ShieldCheck, Truck, Wrench, CaretDown as ChevronDown } from "@phosphor-icons/react/ssr";
import type { IconName } from "@/config/content";
import { isLive } from "./SiteLink";

const icons: Record<IconName, ComponentType<{ className?: string; size?: number; weight?: "duotone" | "regular" | "bold" | "fill" }>> = {
  package: Package, hammer: Hammer, calendar: CalendarClock, graduation: GraduationCap, ruler: Ruler, shield: ShieldCheck,
  layers: Layers, truck: Truck, wrench: Wrench, check: Check, phone: Phone, clipboard: ClipboardList,
};

export function Icon({ name, className, size = 28, weight = "duotone" }: { name: IconName; className?: string; size?: number; weight?: "duotone" | "regular" | "bold" | "fill" | "light" }) {
  const C = icons[name];
  return <C className={className} size={size} weight={weight as "duotone"} />;
}

/** Large thin line icon (Industrium style): crisp at 48px+, uses the accent colour. */
export function LineIcon({ name, className = "text-furnace", size = 56 }: { name: IconName; className?: string; size?: number }) {
  return <Icon name={name} size={size} weight="light" className={className} />;
}

/** Small orange label with a leading dot, e.g. ". Services" */
export function Eyebrow({ children, light }: { children: ReactNode; light?: boolean }) {
  return <p className={`text-sm font-medium ${light ? "text-forge" : "text-furnace"}`}><span className="mr-1">.</span>{children}</p>;
}

/** Underlined uppercase link with a diagonal arrow, e.g. "MORE SERVICES ↘" */
export function MoreLink({ href, children, light }: { href: string; children: ReactNode; light?: boolean }) {
  if (!isLive(href)) return null; // page not published yet
  return (
    <Link href={href} className={`group inline-flex items-center gap-2 border-b pb-1 text-sm font-semibold uppercase tracking-wide transition ${light ? "border-forge text-forge hover:text-white" : "border-furnace text-furnace hover:text-navy"}`}>
      {children}
      <ArrowDownRight size={16} weight="bold" className="transition group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
    </Link>
  );
}

export function SectionHeading({ eyebrow, title, accent, text, center }: { eyebrow?: string; title: string; accent?: string; text?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.3em] text-furnace">{eyebrow}</p>}
      <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
        {title} {accent && <span className="text-furnace">{accent}</span>}
      </h2>
      {text && <p className="mt-3 text-steel">{text}</p>}
    </div>
  );
}

export function PageHero({ title, accent, crumb, parent, text }: { title: string; accent?: string; crumb: string; parent?: { href: string; label: string }; text?: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-dark text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/hero/site.webp" srcSet="/hero/site-960.webp 960w, /hero/site.webp 1920w" sizes="100vw" alt="" fetchPriority="high" decoding="async" className="absolute inset-0 -z-30 h-full w-full object-cover object-[70%_center] brightness-110" />
      <div aria-hidden className="absolute inset-0 -z-20 bg-gradient-to-r from-navy-dark via-navy-dark/85 to-navy-dark/55" />
      <div aria-hidden className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:56px_56px]" />
      <div aria-hidden className="absolute bottom-0 right-0 -z-10 h-12 w-12 rounded-tl-2xl bg-furnace sm:h-16 sm:w-16" />
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-14">
        <nav aria-label="Breadcrumb" className="inline-flex flex-wrap items-center gap-x-2 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/70 backdrop-blur sm:text-sm">
          <Link href="/" className="hover:text-forge">Home</Link>
          {parent && (<><span aria-hidden>/</span><Link href={parent.href} className="hover:text-forge">{parent.label}</Link></>)}
          <span aria-hidden>/</span><span className="text-forge">{crumb}</span>
        </nav>
        <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] sm:text-6xl">
          {title} {accent && <span className="bg-gradient-to-r from-forge via-sun to-forge bg-clip-text text-transparent">{accent}</span>}
        </h1>
        {text && <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">{text}</p>}
      </div>
    </section>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-navy/10 overflow-hidden border border-navy/15 border-t-4 border-t-furnace bg-white">
      {items.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-navy hover:bg-cream">
            {f.q}
            <ChevronDown className="shrink-0 text-furnace transition group-open:rotate-180" size={20} />
          </summary>
          <p className="px-5 pb-5 text-sm leading-relaxed text-steel">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function Section({ children, tone = "white", id }: { children: ReactNode; tone?: "white" | "cream" | "navy"; id?: string }) {
  const bg = tone === "cream" ? "bg-cream" : tone === "navy" ? "bg-navy text-white" : "bg-white";
  return (
    <section id={id} className={`${bg} py-10 sm:py-16`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">{children}</div>
    </section>
  );
}
