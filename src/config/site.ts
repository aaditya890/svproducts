/**
 * SV PRODUCTS - SINGLE SOURCE OF TRUTH
 * ------------------------------------------------------------------
 * Change company details HERE ONLY. Header, footer, contact page, quote page,
 * page titles, SEO and the WhatsApp button all read from this file.
 * Leave a value as "" (empty) and it is simply hidden on the website.
 */

export const siteConfig = {
  company: {
    name: "SV PRODUCTS PVT. LTD.",
    shortName: "SV PRODUCTS",
    suffix: "PVT. LTD.",
    tagline: "Scaffolding | Shuttering Material | Rental Service | Training & Certification",
    heroTitle: ["SCAFFOLDING", "& SHUTTERING"],
    heroText:
      "Safe, reliable scaffolding and formwork solutions – supply, rental and training – for every height and every site.",
    description:
      "Steel and aluminium scaffolding, shuttering material, rental service and training & certification.",
    foundedYear: "",            // e.g. "2020"
    gstNumber: "",              // e.g. "22ABCDE1234F1Z5"
    cinNumber: "",
  },

  contact: {
    phones: [
      { label: "Sales", number: "+917566666603", display: "+91 75666 66603" },
      // { label: "Support", number: "+91XXXXXXXXXX", display: "+91 XXXXX XXXXX" },
    ],
    whatsapp: "917566666603",   // digits only, with country code
    whatsappMessage: "Hello SV Products, I would like a quotation.",
    email: "info@svproducts.in",
    salesEmail: "",
    address: {
      line1: "Unit: Buchipar",
      line2: "",
      city: "Bhatapara",
      state: "Chhattisgarh",
      pincode: "",              // add the PIN code here
      country: "India",
      mapUrl: "",               // Google Maps share link (optional)
    },
    hours: "Mon - Sat: 9:00 AM - 6:00 PM",
  },

  socials: {
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    twitter: "",
  },

  site: {
    url: "https://www.svproducts.in",
    logo: "/brand/logo-symbol.png",
    logoFull: "/brand/logo-full.png",
  },

  nav: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/products", label: "Products" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ],

  cta: { label: "Get a Quote", href: "/quote" },

  /**
   * PAGE SWITCH - which internal pages are published.
   * Links to pages that are not "live" show as disabled (greyed, not clickable).
   * Add a path here when that page is ready, e.g. "/about".
   * Locally you can turn every page on by setting NEXT_PUBLIC_ALL_PAGES=true in .env.local.
   */
  livePages: ["/"],
} as const;

// ---- helpers used by the components (no need to edit) -----------------------
const a = siteConfig.contact.address;

export const site = {
  ...siteConfig.company,
  ...siteConfig.contact,
  socials: siteConfig.socials,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.site.url,
  logo: siteConfig.site.logo,
  logoFull: siteConfig.site.logoFull,
  nav: siteConfig.nav,
  cta: siteConfig.cta,
  pages: { allLive: process.env.NEXT_PUBLIC_ALL_PAGES === "true", live: siteConfig.livePages as readonly string[] },
  primaryPhone: siteConfig.contact.phones[0],
  addressLines: [a.line1, a.line2, [a.city, a.pincode].filter(Boolean).join(" - "), [a.state, a.country].filter(Boolean).join(", ")].filter(Boolean),
  addressOneLine: [a.line1, a.line2, a.city, a.state, a.pincode, a.country].filter(Boolean).join(", "),
  whatsappUrl: siteConfig.contact.whatsapp
    ? `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(siteConfig.contact.whatsappMessage)}`
    : "",
};
