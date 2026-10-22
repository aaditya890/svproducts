import { Header, HeaderSpacer } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { site } from "@/config/site";

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

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <HeaderSpacer />
      <main className="flex-1 overflow-x-clip">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
