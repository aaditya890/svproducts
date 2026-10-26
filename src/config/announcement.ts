/** Announcement bar: shared limits + options (used by the website and by Admin > Announcement). */
export const ANNOUNCEMENT_LIMITS = { message: 90, linkLabel: 20 } as const;
export const ANNOUNCEMENT_BADGES = ["NEW", "OFFER", "NOTICE", "UPDATE", "HOLIDAY"] as const;
export const ANNOUNCEMENT_TONES = [
  { value: "gold", label: "Gold" },
  { value: "navy", label: "Navy" },
  { value: "fire", label: "Orange" },
] as const;

export type AnnouncementTone = (typeof ANNOUNCEMENT_TONES)[number]["value"];
export type Announcement = {
  enabled: boolean;
  badge: string;
  message: string;
  link_label: string;
  link_url: string;
  tone: AnnouncementTone;
};
