import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { productGroups } from "@/config/content";
import { getCategoryCards } from "@/lib/data";
import { PageHero } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Products",
  description: "Cuplock, Ringlock, H-Frame, Pipe & Coupler, MS formwork and lifts: every product with sizes and specifications from SV Products Pvt. Ltd.",
};

type Card = Awaited<ReturnType<typeof getCategoryCards>>[number];

function RangeCard({ c, first }: { c: Card; first?: boolean }) {
  return (
    <Link
      href={`/products/${c.slug}`}
      className="group overflow-hidden rounded-2xl border border-forge/30 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-32 bg-cream sm:h-56">
        {c.image && <Image src={c.image} alt={c.name} fill priority={first} sizes="(min-width:1024px) 33vw, 50vw" className="object-contain p-3 sm:p-4" />}
      </div>
      <div className="flex items-center justify-between gap-2 border-t-4 border-forge bg-navy px-3 py-3 text-white sm:px-5 sm:py-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-snug tracking-wide sm:text-xl">{c.name}</h3>
          <p className="text-[11px] text-forge sm:text-xs">{c.count} product types</p>
        </div>
        <ArrowRight className="hidden shrink-0 text-forge transition group-hover:translate-x-1 sm:block" />
      </div>
    </Link>
  );
}

async function List() {
  const cards = await getCategoryCards();
  const listed = new Set(productGroups.flatMap((g) => g.slugs));
  const groups = [
    ...productGroups.map((g) => ({ title: g.title, items: g.slugs.map((s) => cards.find((c) => c.slug === s)).filter((c): c is Card => !!c) })),
    { title: "More products", items: cards.filter((c) => !listed.has(c.slug)) },
  ].filter((g) => g.items.length);

  return (
    <div className="mt-8 space-y-10 sm:mt-10 sm:space-y-14">
      {groups.map((g) => (
        <section key={g.title}>
          <div className="flex items-end justify-between gap-4 border-b-2 border-navy/10 pb-3">
            <h2 className="text-xl font-bold text-navy sm:text-3xl">{g.title}</h2>
            <p className="text-sm text-steel">{g.items.length} {g.items.length === 1 ? "range" : "ranges"}</p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-6 lg:grid-cols-3">
            {g.items.map((c, i) => (
              <RangeCard key={c.id} c={c} first={i < 2} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <>
      <PageHero title="All" accent="Products" crumb="Products" text="Choose a range to see every product, size and specification." />
      <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6">
        <Suspense fallback={<div className="mt-10 h-64 animate-pulse rounded-2xl bg-mist" />}>
          <List />
        </Suspense>
      </div>
    </>
  );
}
