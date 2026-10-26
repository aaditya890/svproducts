import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Envelope as Mail, MapPin, Phone } from "@phosphor-icons/react/ssr";
import { FaWhatsapp } from "react-icons/fa6";
import { site } from "@/config/site";
import { Socials } from "@/components/site/Socials";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const items = [
    site.addressLines.length > 0 && { icon: MapPin, label: "Address", value: site.addressLines.join(", "), href: site.address.mapUrl || undefined },
    ...site.phones.map((p) => ({ icon: Phone, label: p.label || "Phone", value: p.display, href: `tel:${p.number}` })),
    site.whatsappUrl && { icon: FaWhatsapp, label: "WhatsApp", value: "Chat with us", href: site.whatsappUrl },
    site.email && { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    site.hours && { icon: Clock, label: "Working hours", value: site.hours, href: undefined },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string; href?: string }[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-bold text-navy sm:text-5xl">
        Contact <span className="text-furnace">Us</span>
      </h1>
      <p className="mt-2 text-steel">{site.name}</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {items.map(({ icon: Icon, label, value, href }) => {
          const body = (
            <div className="flex h-full items-start gap-4 rounded-xl border-t-4 border-forge bg-cream p-5">
              <Icon className="mt-1 shrink-0 text-furnace" size={26} />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-steel">{label}</p>
                <p className="mt-1 font-semibold text-navy">{value}</p>
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
      <div className="mt-8 flex flex-wrap items-center gap-6">
        <Link href={site.cta.href} className="inline-block rounded-md bg-furnace px-7 py-3 font-semibold text-white hover:bg-navy">
          {site.cta.label}
        </Link>
        <div className="rounded-full bg-navy px-2 py-1"><Socials /></div>
      </div>
    </div>
  );
}
