import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { ArrowDownRight } from "@phosphor-icons/react/ssr";
import { Check, ClipboardText as ClipboardList, GraduationCap, Hammer, Stack as Layers, CalendarCheck as CalendarClock, Package, Phone, Ruler, ShieldCheck, Truck, Wrench, CaretDown as ChevronDown } from "@phosphor-icons/react/ssr";
import type { IconName } from "@/config/content";

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

export function PageHero({ title, accent, crumb, text }: { title: string; accent?: string; crumb: string; text?: string }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-dark via-navy to-steel text-white">
      <div className="absolute inset-0 opacity-25 [background:repeating-conic-gradient(from_195deg_at_90%_130%,#eabe4d_0_2deg,transparent_2deg_7deg)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <p className="text-sm text-white/60">
          <Link href="/" className="hover:text-forge">Home</Link> / <span className="text-forge">{crumb}</span>
        </p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
          {title} {accent && <span className="text-forge">{accent}</span>}
        </h1>
        {text && <p className="mt-3 max-w-2xl text-white/75">{text}</p>}
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
    <section id={id} className={`${bg} py-16`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">{children}</div>
    </section>
  );
}
