/**
 * PAGE CONTENT - edit the wording of About, Services, Process, FAQ here.
 * (Company name, phone, address etc. live in site.ts.)
 * icon names: package, hammer, calendar, graduation, ruler, shield, layers, truck, wrench, check, phone, clipboard
 */
export type IconName =
  | "package" | "hammer" | "calendar" | "graduation" | "ruler" | "shield" | "layers" | "truck" | "wrench" | "check" | "phone" | "clipboard";

export const about = {
  headline: "Welcome to SV PRODUCTS PVT. LTD.",
  intro:
    "We are a reputed organisation specializing in providing effective solutions in the field of scaffolding and formworks. We are a one stop station for all the scaffolding and formwork solutions along with their accessories.",
  paragraphs: [
    "Our organization is committed to excellence, safety, and innovation, making us the preferred choice for customers seeking reliable products and services in the construction and maintenance industry.",
    "We take immense pride in our expertise in designing, manufacturing, and supplying scaffolding and formworks that meet the highest industry standards. Our team of dedicated professionals works diligently to deliver superior products that enhance safety, efficiency, and productivity on construction sites.",
    "With a customer-centric approach, we aim to build strong and long-lasting relationships with our clients by offering exceptional customer service and tailored solutions to meet their unique requirements. We prioritize transparency, ethical business practices, and sustainability in all our operations.",
  ],
  mission:
    "Our mission is to empower the construction industry with safe and efficient scaffolding and formworks. We strive for excellence, promote safety, foster innovation, build strong partnerships, and empower our employees for mutual growth and success.",
  vision:
    "Our vision is to revolutionize the construction industry with cutting-edge solutions. We aim to expand globally, invest in research and development, promote sustainability, and ensure customer satisfaction at every step.",
  values: [
    { icon: "shield", title: "Safety first", text: "Every product is built around safe working at height." },
    { icon: "check", title: "Quality material", text: "Finest raw materials with skilled craftsmanship." },
    { icon: "ruler", title: "Tailored solutions", text: "Systems and designs to match your project needs." },
    { icon: "package", title: "One stop shop", text: "Scaffolding, formwork, rental and know-how in one place." },
  ] as { icon: IconName; title: string; text: string }[],
};

/** Optional numbers strip on the home page. Leave empty [] to hide it. Example: { value: "500+", label: "Projects supplied" } */
export const stats: { value: string; label: string }[] = [];

export const services: { slug: string; icon: IconName; title: string; short: string; points: string[] }[] = [
  {
    slug: "scaffolding",
    icon: "layers",
    title: "Scaffolding",
    short: "Steel scaffolding systems for every height, load and site.",
    points: [
      "Cuplock, Ringlock, H-Frame and Pipe & Coupler systems",
      "Aluminium mobile scaffolding towers (single and double width)",
      "Base jacks, U-head jacks, ledgers, braces, platforms and jali",
      "Available in bare, painted and galvanized finishes",
    ],
  },
  {
    slug: "shuttering",
    icon: "hammer",
    title: "Shuttering Material",
    short: "Shuttering material and accessories for slab, beam and column work.",
    points: [
      "Formwork and shuttering accessories for building and infrastructure projects",
      "Props, plates and supporting components",
      "Ask us for items not listed in the catalogue",
    ],
  },
  {
    slug: "rental",
    icon: "calendar",
    title: "Rental Service",
    short: "Scaffolding and shuttering on rent for short and long term needs.",
    points: [
      "Short-term and long-term rental",
      "Pay only for the period you need the material",
      "Share your project details for availability and rental terms",
    ],
  },
  {
    slug: "training",
    icon: "graduation",
    title: "Training & Certification",
    short: "Practical scaffolding training and certification for your team.",
    points: [
      "Competent Person and Scaffolding Inspector",
      "Scaffold Erector and hands-on practical training",
      "Design and loading awareness",
    ],
  },
  {
    slug: "custom",
    icon: "ruler",
    title: "Customised Solutions",
    short: "Design & build in steel and aluminium for special structures.",
    points: [
      "Customised steel and aluminium scaffolding to your drawings",
      "Tall towers, cantilever platforms, truck ladders and joint towers",
      "Engineering support from design to supply",
    ],
  },
];

export const process: { icon: IconName; title: string; text: string }[] = [
  { icon: "phone", title: "Tell us your need", text: "Call, WhatsApp or send the quote form with your project details." },
  { icon: "clipboard", title: "Get your quotation", text: "We suggest the right system and share a clear, itemised quote." },
  { icon: "truck", title: "Supply or rent", text: "Material is dispatched to your site, on purchase or on rental." },
  { icon: "wrench", title: "Support on site", text: "Guidance on erection and safe use, plus training if you need it." },
];

/**
 * Product groups shown as headings on /products. A range (category) that is not listed here still
 * appears, under "More products". Slugs are the category slugs from the database.
 */
export const productGroups: { title: string; slugs: string[] }[] = [
  { title: "MS Scaffolding", slugs: ["cuplock", "ringlock", "h-frame", "pipe-coupler", "universal-components"] },
  { title: "Aluminium Scaffolding", slugs: ["single-width-towers", "double-width-towers", "customized-aluminium-scaffolds"] },
  { title: "Shuttering & Formwork", slugs: ["aluminium-formwork", "ms-formwork"] },
  { title: "Lifts (MEWP)", slugs: ["boom-lifts", "scissor-lifts", "personal-lifts"] },
];

/** Ranges used in the home-page product showcase (keep it to about 7 so the panels stay readable). */
export const showcaseSlugs = ["cuplock", "ringlock", "h-frame", "pipe-coupler", "double-width-towers", "aluminium-formwork", "ms-formwork"];

export const faqs: { q: string; a: string }[] = [
  { q: "Do you supply scaffolding on rent as well as for sale?", a: "Yes. Most of our scaffolding and shuttering material is available both for purchase and on rental. Contact us with your duration and quantity for availability." },
  { q: "Which scaffolding systems do you offer?", a: "Steel Cuplock, Ringlock, H-Frame and Pipe & Coupler systems with universal components, plus aluminium mobile scaffolding towers and customised solutions." },
  { q: "Can you supply items that are not in the catalogue?", a: "Yes, please send us your requirement or drawing and we will tell you what we can supply or make." },
  { q: "Do you provide training and certification?", a: "Yes. We offer scaffolding training such as Competent Person, Inspector, Erector, hands-on and design/loading awareness. Ask us for the next schedule." },
  { q: "How do I get a quotation?", a: "Use the Request a Quote form, call or WhatsApp us. Tell us the system, quantity, working height and whether you need purchase or rental." },
];
