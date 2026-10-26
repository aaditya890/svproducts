import type { Metadata } from "next";
import { Suspense } from "react";
import { QuoteForm } from "./QuoteForm";

export const metadata: Metadata = { title: "Request a Quote" };

async function Form({ searchParams }: { searchParams: PageProps<"/quote">["searchParams"] }) {
  const sp = await searchParams;
  const product = typeof sp.product === "string" ? sp.product : undefined;
  return <QuoteForm product={product} />;
}

export default function QuotePage({ searchParams }: PageProps<"/quote">) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-5xl font-bold text-navy">
        Request a <span className="text-furnace">Quote</span>
      </h1>
      <p className="mb-8 mt-2 text-steel">Tell us what you need and our team will get back to you with a quotation.</p>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-mist" />}>
        <Form searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
