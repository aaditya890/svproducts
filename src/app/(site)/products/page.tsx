import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { productGroups } from "@/config/content";
import { getCategoryCards } from "@/lib/data";

export const metadata: Metadata = { title: "Products" };

type Card = Awaited<ReturnType<typeof getCategoryCards>>[number];

function RangeCard({ c }: { c: Card }) {
  return (
    <Link
      href={`/products/${c.slug}`}
      className="group overflow-hidden rounded-2xl border border-forge/30 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-56 bg-cream">
        {c.image && <Image src={c.image} alt={c.name} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-contain p-4" />}
      </div>
      <div className="flex items-center justify-between border-t-4 border-forge bg-navy px-5 py-4 text-white">
        <div>
          <h3 className="text-xl font-semibold tracking-wide">{c.name}</h3>
          <p className="text-xs text-forge">{c.count} product types</p>
        </div>
        <ArrowRight className="text-forge transition group-hover:translate-x-1" />
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
    <div className="mt-10 space-y-14">
      {groups.map((g) => (
        <section key={g.title}>
          <div className="flex items-end justify-between gap-4 border-b-2 border-navy/10 pb-3">
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">{g.title}</h2>
            <p className="text-sm text-steel">{g.items.length} {g.items.length === 1 ? "range" : "ranges"}</p>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map((c) => (
              <RangeCard key={c.id} c={c} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-5xl font-bold text-navy">
        All <span className="text-furnace">Products</span>
      </h1>
      <p className="mt-2 text-steel">Choose a range to see every product.</p>
      <Suspense fallback={<div className="mt-10 h-64 animate-pulse rounded-2xl bg-mist" />}>
        <List />
      </Suspense>
    </div>
  );
}
