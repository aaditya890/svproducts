import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from "react-icons/fa6";
import type { IconType } from "react-icons";
import { site } from "@/config/site";

const icons: Record<string, { label: string; Icon: IconType }> = {
  facebook: { label: "Facebook", Icon: FaFacebookF },
  instagram: { label: "Instagram", Icon: FaInstagram },
  linkedin: { label: "LinkedIn", Icon: FaLinkedinIn },
  youtube: { label: "YouTube", Icon: FaYoutube },
  twitter: { label: "X / Twitter", Icon: FaXTwitter },
};

export function Socials({ className = "", size = 16 }: { className?: string; size?: number }) {
  const entries = Object.entries(site.socials).filter(([k, url]) => url && icons[k]);
  if (!entries.length) return null;
  return (
    <div className={`flex gap-2 ${className}`}>
      {entries.map(([key, url]) => {
        const { label, Icon } = icons[key];
        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white/80 transition hover:border-furnace hover:bg-furnace hover:text-white"
          >
            <Icon size={size} />
          </a>
        );
      })}
    </div>
  );
}
