import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock, Envelope as Mail, MapPin, Phone } from "@phosphor-icons/react/ssr";
import { FaWhatsapp } from "react-icons/fa6";
import { site } from "@/config/site";
import { Socials } from "@/components/site/Socials";
import { PageHero } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call, WhatsApp, email or visit SV Products Pvt. Ltd. for scaffolding and shuttering material.",
};

export default function ContactPage() {
  const place = site.addressOneLine;
  const mapsLink = site.address.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
  const items = [
    site.addressLines.length > 0 && { icon: MapPin, label: "Address", value: site.addressLines.join(", "), href: mapsLink },
    ...site.phones.map((p) => ({ icon: Phone, label: p.label || "Phone", value: p.display, href: `tel:${p.number}` })),
    site.whatsappUrl && { icon: FaWhatsapp, label: "WhatsApp", value: "Chat with us", href: site.whatsappUrl },
    site.email && { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    site.hours && { icon: Clock, label: "Working hours", value: site.hours, href: undefined },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string; href?: string }[];

  return (
    <>
      <PageHero title="Contact" accent="Us" crumb="Contact" text={`${site.name} - call, WhatsApp or visit us.`} />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {items.map(({ icon: Icon, label, value, href }) => {
              const body = (
                <div className="flex h-full items-start gap-4 rounded-xl border-t-4 border-forge bg-cream p-4 sm:p-5">
                  <Icon className="mt-1 shrink-0 text-furnace" size={26} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-steel">{label}</p>
                    <p className="mt-1 break-words font-semibold text-navy">{value}</p>
                  </div>
                </div>
              );
              return href ? (
                <a key={label + value} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="block transition hover:-translate-y-0.5">{body}</a>
              ) : (
                <div key={label + value}>{body}</div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 sm:mt-8 sm:gap-6">
            <Link href={site.cta.href} className="group flex items-stretch overflow-hidden rounded-lg bg-furnace text-white transition hover:bg-navy">
              <span className="px-6 py-3.5 font-semibold">{site.cta.label}</span>
              <span className="flex w-12 items-center justify-center bg-black/15"><ArrowUpRight size={20} weight="bold" className="transition group-hover:rotate-45" /></span>
            </Link>
            <div className="rounded-full bg-navy px-2 py-1"><Socials /></div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-forge/30 bg-cream shadow-sm">
          <iframe
            title={`Map - ${site.shortName}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(place)}&output=embed`}
            className="h-72 w-full border-0 sm:h-96 lg:h-[26rem]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div className="flex flex-wrap items-center justify-between gap-3 border-t-4 border-forge px-5 py-4">
            <p className="text-sm font-medium text-navy">{place}</p>
            <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-furnace">
              <MapPin size={16} weight="fill" /> Get directions
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
