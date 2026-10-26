import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import type { Announcement } from "@/config/announcement";
import { isLive } from "./SiteLink";

const tones = {
  gold: { bar: "bg-forge text-navy-dark", badge: "bg-navy-dark text-forge", dot: "bg-furnace", link: "text-navy-dark decoration-navy-dark/40 hover:decoration-navy-dark", dots: "text-navy-dark/25" },
  navy: { bar: "bg-navy-dark text-white", badge: "bg-forge text-navy-dark", dot: "bg-navy-dark", link: "text-forge decoration-forge/40 hover:decoration-forge", dots: "text-white/20" },
  fire: { bar: "bg-furnace text-white", badge: "bg-white text-furnace", dot: "bg-furnace", link: "text-white decoration-white/50 hover:decoration-white", dots: "text-white/30" },
} as const;

/**
 * One compact line (32 px tall on phones, 36 px on desktop): [badge] message  link >
 * The message is clipped with "..." when it is too long, so a long text can never break the layout.
 */
export function AnnouncementBar({ a }: { a: Announcement }) {
  const t = tones[a.tone] ?? tones.gold;
  const external = a.link_url.startsWith("https://");
  const showLink = !!a.link_url && !!a.link_label && (external || isLive(a.link_url));
  const linkInner = (
    <>
      <span className="hidden sm:inline">{a.link_label}</span>
      <ArrowRight size={13} weight="bold" className="shrink-0 transition group-hover:translate-x-0.5" aria-label={a.link_label} />
    </>
  );
  const linkCls = `group ml-1 flex shrink-0 items-center gap-1 font-semibold underline underline-offset-4 transition ${t.link}`;

  return (
    <div role="region" aria-label="Announcement" className={`relative h-8 overflow-hidden text-xs sm:h-9 sm:text-[13px] ${t.bar}`}>
      {/* soft shine that sweeps across now and then */}
      <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent [animation:announce-shine_7s_ease-in-out_infinite]" />
      {/* dotted corners */}
      <span aria-hidden className={`pointer-events-none absolute inset-y-0 left-0 hidden w-24 items-center overflow-hidden font-mono text-[9px] leading-[6px] tracking-[3px] sm:flex ${t.dots}`}>{"::::::::::::::::::::::::"}</span>
      <span aria-hidden className={`pointer-events-none absolute inset-y-0 right-0 hidden w-24 items-center justify-end overflow-hidden font-mono text-[9px] leading-[6px] tracking-[3px] sm:flex ${t.dots}`}>{"::::::::::::::::::::::::"}</span>

      <div className="relative mx-auto flex h-full max-w-3xl items-center justify-center gap-2 px-4">
        {a.badge && (
          <span className={`flex shrink-0 items-center gap-1.5 rounded px-1.5 py-0.5 text-[10px] font-bold leading-none tracking-wider ${t.badge}`}>
            <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${t.dot}`} />
            {a.badge}
          </span>
        )}
        <p className="min-w-0 truncate font-medium">{a.message}</p>
        {showLink &&
          (external ? (
            <a href={a.link_url} target="_blank" rel="noopener noreferrer" className={linkCls}>{linkInner}</a>
          ) : (
            <Link href={a.link_url} className={linkCls}>{linkInner}</Link>
          ))}
      </div>
    </div>
  );
}
