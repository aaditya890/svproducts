import Link from "next/link";
import { Header, HeaderSpacer } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { site } from "@/config/site";
import { SiteLink } from "@/components/site/SiteLink";

export default function NotFound() {
  return (
    <>
      <Header />
      <HeaderSpacer />
      <main className="flex flex-1 flex-col items-center justify-center bg-cream px-6 py-24 text-center">
        <p className="text-8xl font-extrabold text-furnace">404</p>
        <h1 className="mt-4 text-3xl font-bold text-navy">This page could not be found</h1>
        <p className="mt-2 max-w-md text-steel">The page you are looking for may have moved or no longer exists.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/" className="rounded-md bg-navy px-6 py-3 font-semibold text-white hover:bg-furnace">Back to home</Link>
          <Link href="/products" className="rounded-md border border-navy px-6 py-3 font-semibold text-navy hover:bg-navy hover:text-white">View products</Link>
          <SiteLink href={site.cta.href} className="rounded-md bg-furnace px-6 py-3 font-semibold text-white hover:bg-navy">{site.cta.label}</SiteLink>
        </div>
      </main>
      <Footer />
    </>
  );
}
