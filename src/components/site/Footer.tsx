import Image from "next/image";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { Clock, Envelope as Mail, MapPin, Phone } from "@phosphor-icons/react/ssr";
import { site } from "@/config/site";
import { Socials } from "./Socials";
import { QuoteCta, SiteLink } from "./SiteLink";

async function Year() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  return (
    <footer className="mt-auto bg-navy-dark text-white/80">
      <div className="h-1.5 bg-gradient-to-r from-furnace via-forge to-sun" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <Image src={site.logo} alt={site.shortName} width={64} height={74} className="h-16 w-auto rounded-lg" />
          <p className="mt-4 text-xl font-semibold text-white">{site.name}</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed">{site.tagline}</p>
          <Socials className="mt-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-forge">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {site.nav.map((n) => (
              <li key={n.href}><SiteLink href={n.href} soon className="hover:text-forge">{n.label}</SiteLink></li>
            ))}
            <li><QuoteCta className="hover:text-forge">{site.cta.label}</QuoteCta></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-forge">Contact</h3>
          <ul className="mt-3 space-y-3 text-sm">
            {site.addressLines.length > 0 && (
              <li className="flex gap-3">
                <MapPin size={20} weight="fill" className="mt-0.5 shrink-0 text-forge" />
                <span>{site.addressLines.map((l) => (<span key={l} className="block">{l}</span>))}</span>
              </li>
            )}
            {site.phones.map((p) => (
              <li key={p.number} className="flex gap-3">
                <Phone size={20} weight="fill" className="shrink-0 text-forge" />
                <a href={`tel:${p.number}`} className="hover:text-forge">{p.display}{p.label ? ` (${p.label})` : ""}</a>
              </li>
            ))}
            {site.email && (
              <li className="flex gap-3"><Mail size={20} weight="fill" className="shrink-0 text-forge" /><a href={`mailto:${site.email}`} className="hover:text-forge">{site.email}</a></li>
            )}
            {site.hours && <li className="flex gap-3"><Clock size={20} weight="fill" className="shrink-0 text-forge" />{site.hours}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50">
        &copy; <Year /> {site.name}. All rights reserved.
        {site.gstNumber && <span className="ml-3">GSTIN: {site.gstNumber}</span>}
      </div>
    </footer>
  );
}
