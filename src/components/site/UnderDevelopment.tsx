"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BellRinging } from "@phosphor-icons/react";
import { site } from "@/config/site";
import { Reveal } from "./motion";
import { isLive } from "./SiteLink";

/**
 * "Website under development" notice that sits right under the hero.
 * It hides itself once every page in the menu is live (see livePages in src/config/site.ts).
 */
export function UnderDevelopment() {
  const reduce = useReducedMotion();
  if (site.nav.every((n) => isLive(n.href))) return null;

  return (
    <section id="status" className="relative overflow-hidden bg-white text-navy-dark">
      {/* construction tape */}
      <div aria-hidden className="h-2.5 [background:repeating-linear-gradient(-45deg,var(--color-forge)_0_14px,var(--color-navy-dark)_14px_28px)]" />
      <div aria-hidden className="absolute inset-0 top-2.5 opacity-[0.05] [background-image:linear-gradient(var(--color-navy-dark)_1px,transparent_1px),linear-gradient(90deg,var(--color-navy-dark)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14">
        <Reveal>
          <div role="status" className="inline-flex items-center gap-3 rounded-lg border border-furnace/30 bg-furnace/10 py-2 pl-2 pr-4">
            <motion.span
              className="flex h-9 w-9 origin-top items-center justify-center rounded-md bg-furnace text-white"
              animate={reduce ? undefined : { rotate: [0, 16, -14, 10, -6, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 3.2 }}
            >
              <BellRinging size={20} weight="fill" />
            </motion.span>
            <span className="text-sm font-semibold">Notice: website under development</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
