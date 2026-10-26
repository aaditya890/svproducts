import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCategories, getCategoryWithProducts } from "@/lib/data";
import { QuoteLink } from "@/components/site/SiteLink";
import { PageHero } from "@/components/site/ui";

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[category]">): Promise<Metadata> {
  const { category } = await params;
  const data = await getCategoryWithProducts(category);
  return { title: data ? data.category.name : "Products" };
}

async function Content({ params }: { params: PageProps<"/products/[category]">["params"] }) {
  const { category } = await params;
  const data = await getCategoryWithProducts(category);
  if (!data) notFound();
  // products with a size table get a full section; products that are just a photo + name get a card
  const sized = data.products.filter((p) => p.product_variants.length > 0);
  const cards = data.products.filter((p) => p.product_variants.length === 0);
  return (
    <>
      <PageHero title={data.category.name} crumb={data.category.name} parent={{ href: "/products", label: "Products" }} text={`${data.products.length} product types`} />
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6">
        {sized.map((p) => {
          const cols = ["Name", ...p.spec_columns];
          return (
            <section key={p.id} id={p.slug} className="overflow-hidden rounded-2xl border border-forge/30 bg-white shadow-sm">
              <div className="flex flex-wrap items-center gap-3 border-b-4 border-forge bg-cream px-5 py-3">
                {p.code && <span className="rounded bg-furnace px-2 py-0.5 text-xs font-bold text-white">{p.code}</span>}
                <h2 className="text-2xl font-semibold uppercase text-navy">{p.name}</h2>
                <QuoteLink product={p.name} className="ml-auto rounded-md bg-navy px-4 py-1.5 text-sm font-semibold text-white hover:bg-furnace">
                  Request quote
                </QuoteLink>
              </div>
              <div className="grid gap-6 p-5 lg:grid-cols-[1fr_320px]">
                <div className="max-h-[28rem] overflow-auto rounded-lg border border-mist">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-navy text-left text-white">
                      <tr>
                        {cols.map((c, i) => (
                          <th key={c} className={`px-3 py-2 font-semibold ${i ? "text-center" : ""}`}>
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {p.product_variants.map((v) => (
                        <tr key={v.id} className="odd:bg-white even:bg-cream/60">
                          <td className="px-3 py-1.5">{v.name}</td>
                          {p.spec_columns.map((c) => (
                            <td key={c} className="px-3 py-1.5 text-center font-semibold text-navy">
                              {String(v.specs[c] ?? "-")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {p.note && <p className="border-t px-3 py-2 text-xs italic text-steel">{p.note}</p>}
                </div>
                {p.image_path && (
                  <div className="relative h-72 rounded-xl border border-forge/30 bg-white lg:h-full lg:min-h-64">
                    <Image src={p.image_path} alt={p.name} fill sizes="320px" className="object-contain p-3" />
                  </div>
                )}
              </div>
            </section>
          );
        })}

        {cards.length > 0 && (
          <section>
            {sized.length > 0 && <h2 className="mb-5 border-b-2 border-navy/10 pb-3 text-2xl font-bold text-navy">More in this range</h2>}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {cards.map((p, idx) => (
                <article key={p.id} id={p.slug} className="group flex flex-col overflow-hidden rounded-2xl border border-forge/30 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative h-56 bg-cream">
                    {p.image_path && <Image src={p.image_path} alt={p.name} fill priority={idx < 4} sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-contain p-3" />}
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-3 border-t-4 border-forge px-4 py-3">
                    <h3 className="text-base font-semibold leading-snug text-navy">{p.name}</h3>
                    <QuoteLink product={p.name} className="shrink-0 rounded-md bg-navy px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-furnace">
                      Quote
                    </QuoteLink>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export default function CategoryPage({ params }: PageProps<"/products/[category]">) {
  return (
    <Suspense fallback={<div className="mx-auto mt-10 h-96 max-w-7xl animate-pulse rounded-2xl bg-mist" />}>
      <Content params={params} />
    </Suspense>
  );
}
