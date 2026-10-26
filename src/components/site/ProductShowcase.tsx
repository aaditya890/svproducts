"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import type { ShowcaseRange } from "@/lib/data";

const pad = (n: number) => String(n).padStart(2, "0");

function PanelBody({ range, index }: { range: ShowcaseRange; index: number }) {
  const reduce = useReducedMotion();
  const [pi, setPi] = useState(0);
  const withImg = range.items.filter((i) => i.image);
  const item = withImg[pi] ?? withImg[0];
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="relative flex h-full min-w-0 flex-col p-5 sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-furnace"><span className="mr-1">.</span>{range.items.length} product types</p>
          <h3 className="mt-1 text-3xl font-bold leading-tight text-navy-dark sm:text-4xl">{range.name}</h3>
        </div>
        <span aria-hidden className="select-none text-6xl font-extrabold leading-none text-navy/10 sm:text-8xl">{pad(index + 1)}</span>
      </div>

      <div className="relative mt-2 grid min-h-0 flex-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        {/* item list */}
        <ul className="order-2 divide-y divide-navy/10 self-end md:order-1">
          {withImg.slice(0, 6).map((it, i) => (
            <li key={it.slug}>
              <button
                onClick={() => setPi(i)}
                onMouseEnter={() => setPi(i)}
                className={`group flex w-full items-center justify-between gap-3 py-2.5 text-left text-sm transition ${i === pi ? "font-semibold text-furnace" : "text-navy/70 hover:text-navy"}`}
              >
                <span className="flex items-center gap-3">
                  <span className="w-6 text-xs tabular-nums opacity-60">{it.code ?? pad(i + 1)}</span>
                  <span>{it.name}</span>
                </span>
                <ArrowUpRight size={16} weight="bold" className={`shrink-0 transition ${i === pi ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`} />
              </button>
            </li>
          ))}
          <li className="pt-4">
            <Link href={`/products/${range.slug}`} className="group inline-flex items-center gap-2 border-b border-furnace pb-1 text-sm font-semibold uppercase tracking-wide text-furnace transition hover:text-navy">
              View all {range.name} <ArrowUpRight size={16} weight="bold" className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </li>
        </ul>

        {/* stage */}
        <div className="relative order-1 h-[240px] md:order-2 md:h-auto md:min-h-[300px]">
          <div aria-hidden className="absolute inset-x-6 bottom-2 top-8 bg-furnace/10" />
          <AnimatePresence mode="wait">
            {item && (
              <motion.div
                key={item.slug}
                initial={reduce ? false : { opacity: 0, y: 24, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image src={item.image!} alt={item.name} fill sizes="(min-width:1024px) 480px, 90vw" className="object-contain mix-blend-multiply drop-shadow-xl" />
              </motion.div>
            )}
          </AnimatePresence>
          {item && (
            <Link href={`/quote?product=${encodeURIComponent(item.name)}`} className="absolute bottom-0 right-0 z-10 flex items-center gap-2 rounded-lg bg-furnace px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-dark">
              Get quote <ArrowUpRight size={16} weight="bold" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ProductShowcase({ ranges }: { ranges: ShowcaseRange[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="mt-8 sm:mt-12">
      {/* mobile / tablet: tabs + one panel */}
      <div className="lg:hidden">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none]">
          {ranges.map((r, i) => (
            <button key={r.id} onClick={() => setActive(i)} className={`flex shrink-0 items-center gap-2 border px-4 py-2.5 text-sm font-semibold transition ${i === active ? "border-furnace bg-furnace text-white" : "border-white/25 text-white/80"}`}>
              <span className="text-xs opacity-70">{pad(i + 1)}</span>{r.name}
            </button>
          ))}
        </div>
        <div className="bg-white">
          <PanelBody key={ranges[active].id} range={ranges[active]} index={active} />
        </div>
      </div>

      {/* desktop: expanding panels */}
      <div className="hidden h-[600px] gap-3 lg:flex">
        {ranges.map((r, i) => {
          const on = i === active;
          const thumb = r.items.find((x) => x.image)?.image;
          return (
            <div
              key={r.id}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className={`relative min-w-0 cursor-pointer overflow-hidden bg-white transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? "grow-[7]" : "grow-[1]"} basis-0`}
            >
              {on ? (
                <PanelBody range={r} index={i} />
              ) : (
                <div className="relative flex h-full flex-col items-center justify-between py-6">
                  <span className="text-4xl font-extrabold text-navy/15">{pad(i + 1)}</span>
                  {thumb && (
                    <div className="relative h-40 w-full">
                      <Image src={thumb} alt="" fill sizes="120px" className="object-contain p-3 opacity-80 mix-blend-multiply" />
                    </div>
                  )}
                  <span className="text-lg font-bold text-navy-dark [text-orientation:mixed] [writing-mode:vertical-rl] rotate-180">{r.name}</span>
                  <span className="flex h-9 w-9 items-center justify-center bg-furnace text-white"><ArrowUpRight size={16} weight="bold" /></span>
                </div>
              )}
              {on && <span aria-hidden className="absolute left-0 top-0 h-1.5 w-full bg-furnace" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
