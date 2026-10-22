"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, CaretDown } from "@phosphor-icons/react";
import { FaWhatsapp } from "react-icons/fa6";
import { site } from "@/config/site";
import { SiteLink } from "./SiteLink";

const quick = [
  { n: "01", title: "Scaffolding systems", text: "Cuplock, Ringlock, H-Frame & more", href: "/products" },
  { n: "02", title: "Rental service", text: "Short and long term on rent", href: "/services#rental" },
  { n: "03", title: "Training & certification", text: "Competent person, erector, inspector", href: "/services#training" },
];

export function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 700], [0, 120]);
  const fade = useTransform(scrollY, [0, 400], [1, 0]);

  const words = site.heroTitle;
  const wordVariants = {
    hidden: { opacity: 0, y: 40 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.15 + i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } }),
  };
  const up = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.7 },
  });

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-navy-dark text-white lg:min-h-[min(100svh,860px)]">
      {/* real site photo with parallax */}
      <motion.div style={reduce ? undefined : { y: yBg }} className="absolute inset-x-0 -top-10 -z-30 h-[calc(100%+120px)]">
        <Image src="/hero/site.jpg" alt="" fill priority sizes="100vw" className="object-cover object-[70%_center] grayscale-[20%] brightness-110" />
      </motion.div>
      {/* colour + readability overlays */}
      <div aria-hidden className="absolute inset-0 -z-20 bg-gradient-to-r from-navy-dark via-navy-dark/75 to-navy-dark/20" />
      <div aria-hidden className="absolute inset-0 -z-20 bg-gradient-to-t from-navy-dark via-transparent to-navy-dark/60" />
      <div aria-hidden className="absolute inset-0 -z-20 bg-navy/20 mix-blend-multiply" />
      {/* background lines: rays + grid */}
      <div
        aria-hidden
        className="absolute -right-[40vmax] top-[-25%] -z-10 h-[120vmax] w-[120vmax] opacity-[0.17]"
        style={{ background: "repeating-conic-gradient(from 0deg at 50% 50%, var(--color-forge) 0deg 2.2deg, transparent 2.2deg 9deg)", WebkitMaskImage: "radial-gradient(circle, #000 4%, transparent 52%)", maskImage: "radial-gradient(circle, #000 4%, transparent 52%)" }}
      />
      <div aria-hidden className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:56px_56px]" />
      {/* flat accent blocks */}
      <div aria-hidden className="absolute bottom-0 right-0 -z-10 hidden h-28 w-28 rounded-tl-3xl bg-furnace lg:block" />

      {/* content */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-start px-4 pb-10 pt-28 sm:px-6 lg:justify-center lg:pb-32 lg:pt-36">
        <motion.span {...up(0)} className="inline-flex w-fit items-center gap-2 rounded-md border border-forge/40 bg-white/5 px-4 py-1.5 text-[11px] font-medium tracking-wide text-forge backdrop-blur sm:text-xs">
          <span className="h-2 w-2 bg-forge" />
          Scaffolding &bull; Shuttering &bull; Rental &bull; Training
        </motion.span>

        <h1 className="mt-6 text-[2.7rem] font-extrabold leading-[1.02] sm:text-6xl xl:text-7xl">
          {words.map((w, i) => (
            <span key={w} className="block overflow-hidden pb-1">
              <motion.span custom={i} variants={wordVariants} initial={reduce ? "show" : "hidden"} animate="show" className={`block ${i === 1 ? "bg-gradient-to-r from-forge via-sun to-forge bg-clip-text text-transparent" : ""}`}>
                {w}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p {...up(0.55)} className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
          {site.heroText}
        </motion.p>

        <motion.div {...up(0.7)} className="mt-8 flex flex-wrap items-stretch gap-3">
          <SiteLink href="/products" className="group flex items-stretch overflow-hidden rounded-lg bg-forge text-navy-dark transition hover:bg-sun">
            <span className="px-6 py-4 font-semibold">Browse products</span>
            <span className="flex w-12 items-center justify-center bg-black/10"><ArrowRight size={20} weight="bold" className="transition group-hover:translate-x-1" /></span>
          </SiteLink>
          <SiteLink href={site.cta.href} className="flex items-center rounded-lg border border-white/40 bg-white/5 px-6 py-4 font-semibold backdrop-blur transition hover:bg-white/15">
            {site.cta.label}
          </SiteLink>
          {site.whatsappUrl && (
            <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp us" className="flex w-14 items-center justify-center rounded-lg bg-[#25d366] text-white transition hover:bg-[#1ebe5a]">
              <FaWhatsapp size={28} />
            </a>
          )}
        </motion.div>

        <motion.ul {...up(0.9)} className="mt-8 hidden flex-wrap gap-x-8 gap-y-2 text-sm text-white/75 sm:flex">
          {["Steel & aluminium systems", "Purchase or rental", "Training & certification"].map((t) => (
            <li key={t} className="flex items-center gap-2"><span className="h-2 w-2 rotate-45 bg-forge" />{t}</li>
          ))}
        </motion.ul>

        {/* mobile / tablet quick links - fills the screen under the buttons */}
        <motion.div {...up(1)} className="mt-9 grid gap-2.5 lg:hidden">
          {quick.map((q) => (
            <SiteLink key={q.n} href={q.href} className="group flex items-center gap-4 rounded-xl border border-white/15 bg-navy-dark/60 px-4 py-3.5 backdrop-blur-md transition active:bg-furnace">
              <span className="text-2xl font-extrabold text-transparent [-webkit-text-stroke:1.2px_var(--color-forge)]">{q.n}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold leading-tight">{q.title}</span>
                <span className="block truncate text-xs text-white/60">{q.text}</span>
              </span>
              <ArrowUpRight size={20} weight="bold" className="shrink-0 text-forge" />
            </SiteLink>
          ))}
        </motion.div>
      </div>

      {/* quick links strip (desktop) */}
      <div className="absolute inset-x-0 bottom-0 hidden lg:block">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_1fr_1fr_7rem] px-6">
          {quick.map((q) => (
            <SiteLink key={q.n} href={q.href} className="group flex items-center justify-between gap-4 border-l border-t border-white/15 bg-navy-dark/70 px-7 py-6 backdrop-blur-md transition first:rounded-tl-xl hover:bg-furnace">
              <span className="flex items-center gap-5">
                <span className="text-3xl font-extrabold text-transparent [-webkit-text-stroke:1.2px_var(--color-forge)] group-hover:[-webkit-text-stroke:1.2px_white]">{q.n}</span>
                <span>
                  <span className="block font-semibold">{q.title}</span>
                  <span className="block text-xs text-white/60 group-hover:text-white/90">{q.text}</span>
                </span>
              </span>
              <ArrowUpRight size={22} weight="bold" className="shrink-0 text-forge transition group-hover:rotate-45 group-hover:text-white" />
            </SiteLink>
          ))}
          <div />
        </div>
      </div>

      {/* scroll cue */}
      <motion.a href="#range" style={{ opacity: fade }} className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 flex-col items-center text-white/60 transition hover:text-forge lg:hidden" aria-label="Scroll down">
        <CaretDown size={22} weight="bold" />
      </motion.a>
    </section>
  );
}

/** Infinite product ticker under the hero (pure CSS, pauses on hover). */
export function Ticker({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y-4 border-forge bg-navy-dark py-4 text-white" aria-hidden>
      <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-10 pr-10 hover:[animation-play-state:paused]">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.25em]">
            {t}
            <span className="h-2 w-2 rotate-45 bg-furnace" />
          </span>
        ))}
      </div>
    </div>
  );
}
