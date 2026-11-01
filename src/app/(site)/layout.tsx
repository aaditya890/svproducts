import Script from "next/script";
import { Header, HeaderSpacer } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { site } from "@/config/site";
import { getAnnouncement } from "@/lib/data";

// SEO: local business details come from src/config/site.ts
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  url: site.url,
  image: `${site.url}${site.logoFull}`,
  description: site.description,
  telephone: site.primaryPhone?.number,
  email: site.email || undefined,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.line1,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.pincode || undefined,
    addressCountry: "IN",
  },
};

// Google Analytics (GA4). Public pages only, never /admin. Set NEXT_PUBLIC_GA_ID (e.g. G-XXXXXXXXXX); empty = off.
const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const announcement = await getAnnouncement();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header announcement={announcement} />
      <HeaderSpacer announcement={!!announcement} />
      <main className="flex-1 overflow-x-clip">{children}</main>
      <Footer />
      <WhatsAppButton />
      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      )}
    </>
  );
}
