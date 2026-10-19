import Link from "next/link";
import type { ComponentProps } from "react";
import { site } from "@/config/site";

/** True when the page behind this link is published (see livePages in src/config/site.ts). */
export function isLive(href: string) {
  if (site.pages.allLive) return true;
  const path = href.split(/[?#]/)[0] || "/";
  return site.pages.live.includes(path);
}

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string; soon?: boolean };

/** A normal <Link> for live pages; a greyed-out, non-clickable element for pages that are not published yet. */
export function SiteLink({ href, soon, className = "", children, ...rest }: Props) {
  if (isLive(href)) {
    return (
      <Link href={href} className={className} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <span aria-disabled="true" className={`${className} pointer-events-none cursor-not-allowed select-none opacity-45`}>
      {children}
      {soon && <span className="ml-2 rounded bg-white/15 px-1.5 py-0.5 text-[9px] font-semibold normal-case tracking-wide text-white">Soon</span>}
    </span>
  );
}
