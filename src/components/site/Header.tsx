"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Clock, Envelope, List, MapPin, Phone, X } from "@phosphor-icons/react";
import { FaWhatsapp } from "react-icons/fa6";
import { site } from "@/config/site";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Socials } from "./Socials";
import { ScrollProgress } from "./motion";
import { SiteLink } from "./SiteLink";
import { AnnouncementBar } from "./AnnouncementBar";
import type { Announcement } from "@/config/announcement";

/** Keeps page content below the fixed header on every page except Home (where the hero sits under it). */
export function HeaderSpacer({ announcement }: { announcement?: boolean }) {
  const home = usePathname() === "/";
  if (home) return null;
  return <div aria-hidden className={announcement ? "h-[100px] lg:h-[148px]" : "h-[68px] lg:h-[112px]"} />;
}

export function Header({ announcement }: { announcement?: Announcement | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  // the menu is "open for" a specific path, so it closes automatically when the route changes
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;
  const setOpen = (v: boolean | ((o: boolean) => boolean)) => setOpenFor((cur) => ((typeof v === "function" ? v(cur === pathname) : v) ? pathname : null));
  const phone = site.primaryPhone;
  const home = pathname === "/";
  const solid = scrolled || !home || open;

  // smart header: slides away when scrolling down, returns when scrolling up
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - last) > 6) {
        setHidden(y > 320 && y > last);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <ScrollProgress />
      <header className={`fixed inset-x-0 top-0 z-50 transition-transform duration-300 ${hidden && !open ? "-translate-y-full" : "translate-y-0"}`}>
        {/* announcement bar (editable in Admin > Announcement); folds away once the page is scrolled */}
        {announcement && (
          <div className={`overflow-hidden transition-all duration-300 ${scrolled ? "max-h-0 opacity-0" : "max-h-9 opacity-100"}`}>
            <AnnouncementBar a={announcement} />
          </div>
        )}
        {/* info bar */}
        <div className={`hidden overflow-hidden bg-charcoal/95 text-xs text-white/80 transition-all duration-300 lg:block ${scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"}`}>
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2.5">
            <div className="flex items-center gap-6">
              {site.addressOneLine && <span className="flex items-center gap-2"><MapPin size={15} weight="fill" className="text-forge" />{site.addressOneLine}</span>}
              {site.hours && <span className="flex items-center gap-2"><Clock size={15} weight="fill" className="text-forge" />{site.hours}</span>}
            </div>
            <div className="flex items-center gap-6">
              {site.email && <a href={`mailto:${site.email}`} className="flex items-center gap-2 transition hover:text-forge"><Envelope size={15} weight="fill" className="text-forge" />{site.email}</a>}
              {phone && <a href={`tel:${phone.number}`} className="flex items-center gap-2 transition hover:text-forge"><Phone size={15} weight="fill" className="text-forge" />{phone.display}</a>}
            </div>
          </div>
        </div>

        <div className={`transition-all duration-300 ${solid ? "border-b-2 border-forge bg-navy-dark/92 shadow-xl backdrop-blur-xl" : "border-b-2 border-white/10 bg-gradient-to-b from-navy-dark/70 to-transparent"}`}>
          <div className={`mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 transition-all duration-300 sm:px-6 ${scrolled ? "py-2" : "py-3"}`}>
            <Link href="/" className="flex shrink-0 items-center gap-2 sm:gap-3" aria-label={site.name}>
              <Image src={site.logo} alt="" width={52} height={60} priority className={`w-auto transition-all duration-300 ${scrolled ? "h-9 sm:h-10" : "h-10 sm:h-[52px]"}`} />
              <span className="whitespace-nowrap text-base font-bold leading-none text-white sm:text-xl">
                {site.shortName}
                {site.suffix && <span className="mt-1 block text-[10px] font-medium tracking-[0.32em] text-forge">{site.suffix}</span>}
              </span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {site.nav.map((n) => {
                const active = isActive(n.href);
                return (
                  <SiteLink key={n.href} href={n.href} soon className={`group relative px-4 py-2 text-sm font-medium uppercase tracking-wider transition-colors ${active ? "text-forge" : "text-white/85 hover:text-white"}`}>
                    {n.label}
                    <span className={`absolute inset-x-4 -bottom-0.5 h-0.5 origin-left bg-forge transition-transform duration-300 ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                  </SiteLink>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-3">
              <ThemeSwitcher />
              <SiteLink href={site.cta.href} className="group hidden items-stretch overflow-hidden whitespace-nowrap rounded-lg bg-furnace text-sm font-semibold text-white transition hover:bg-forge hover:text-navy-dark sm:inline-flex">
                <span className="px-6 py-3">{site.cta.label}</span>
                <span className="flex w-12 items-center justify-center bg-black/15"><ArrowUpRight size={18} weight="bold" className="transition group-hover:rotate-45" /></span>
              </SiteLink>
              {phone && (
                <a href={`tel:${phone.number}`} aria-label="Call us" className="flex h-10 w-10 items-center justify-center rounded-lg bg-furnace text-white transition hover:bg-forge hover:text-navy-dark sm:hidden">
                  <Phone size={22} weight="fill" />
                </a>
              )}
              <button
                type="button"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/30 bg-white/10 text-white transition hover:bg-white/20 sm:h-11 sm:w-11 lg:hidden"
              >
                {open ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
              </button>
            </div>
          </div>
        </div>

      </header>

        {/* full-screen menu (mobile / tablet) */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 overflow-y-auto bg-navy-dark px-5 pb-10 pt-[88px] lg:hidden"
            >
              <div aria-hidden className="pointer-events-none absolute -right-10 top-10 h-52 w-4 rotate-[30deg] bg-furnace" />
              <nav className="relative flex flex-col">
                {site.nav.map((n, i) => (
                  <motion.div key={n.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i + 0.08 }}>
                    <SiteLink href={n.href} soon className={`group flex items-center gap-4 border-b border-white/10 py-4 text-2xl font-bold ${isActive(n.href) ? "text-forge" : "text-white"}`}>
                      <span className="w-8 text-sm font-medium tabular-nums text-white/35">{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex-1">{n.label}</span>
                      <ArrowRight size={20} weight="bold" className="text-forge" />
                    </SiteLink>
                  </motion.div>
                ))}
              </nav>

              <div className="relative mt-8 grid gap-3">
                <SiteLink href={site.cta.href} className="flex items-stretch overflow-hidden rounded-xl bg-furnace text-white">
                  <span className="flex-1 px-6 py-4 text-center font-semibold">{site.cta.label}</span>
                  <span className="flex w-14 items-center justify-center bg-black/15"><ArrowUpRight size={20} weight="bold" /></span>
                </SiteLink>
                <div className="grid grid-cols-2 gap-3">
                  {phone && <a href={`tel:${phone.number}`} className="flex items-center justify-center gap-2 rounded-xl border border-white/25 py-3.5 text-sm font-medium text-white"><Phone size={18} weight="fill" className="text-forge" />Call</a>}
                  {site.whatsappUrl && <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-[#25d366] py-3.5 text-sm font-medium text-white"><FaWhatsapp size={20} />WhatsApp</a>}
                </div>
              </div>

              <div className="relative mt-8 space-y-3 text-sm text-white/70">
                {site.email && <p className="flex items-center gap-3"><Envelope size={18} weight="fill" className="text-forge" />{site.email}</p>}
                {site.addressOneLine && <p className="flex items-start gap-3"><MapPin size={18} weight="fill" className="mt-0.5 shrink-0 text-forge" />{site.addressOneLine}</p>}
              </div>
              <div className="relative mt-6"><Socials /></div>
            </motion.div>
          )}
        </AnimatePresence>
    </>
  );
}
