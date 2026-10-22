import { FaWhatsapp } from "react-icons/fa6";
import { site } from "@/config/site";

/** Floating WhatsApp button - static (no jitter), safe-area aware on phones. */
export function WhatsAppButton() {
  if (!site.whatsappUrl) return null;
  return (
    <a
      href={site.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] ring-4 ring-white/20 transition-colors hover:bg-[#1ebe5a]"
    >
      <FaWhatsapp size={32} />
    </a>
  );
}
