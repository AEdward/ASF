export interface SiteSettings {
  companyName: string;
  tagline: string;
  phonePrimary: string;
  phoneSecondary: string;
  emailPrimary: string;
  emailSecondary: string;
  headOffice: string;
  factoryAddress: string;
  expansionAddress: string;
  navLinks: { label: string; href: string }[];
  headerCtaLabel: string;
  headerCtaHref: string;
  footerLinks: { label: string; href: string }[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  stage: "Current" | "Growth" | "Planned" | "Future";
  description: string;
  details: string[];
  imageUrl?: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImageUrl?: string;
}

export interface JobVacancy {
  id: number;
  title: string;
  slug: string;
  location?: string;
  employmentType?: string;
  summary?: string;
  description?: string;
  requirements: string[];
  postedAt?: string;
}

// Fallback content mirrors the real ASF Agro Industry company profile, so the
// site reads correctly even before Strapi has been seeded or if it is
// temporarily unreachable.
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: "ASF Agro Industry",
  tagline: "Animal Feed Processing P/S",
  phonePrimary: "0976177236",
  phoneSecondary: "0911540903 / 0911200732",
  emailPrimary: "merihun@asfagro.com",
  emailSecondary: "argaw@asfagro.com",
  headOffice: "Akaki Kality Woreda 05, near Kality Maseltegna, Addis Ababa, Ethiopia",
  factoryAddress:
    "Operational Factory: Tulu Bolo Town, South West Shoa Zone, Oromia Region. Warehouse: Welete, Sheger City.",
  expansionAddress:
    "Expansion site (in progress): Bulbula Integrated Agro Industry Park, 160km south of Addis Ababa, near Zeway City on the highway to Hawassa.",
  navLinks: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Blog", href: "/blog" },
  ],
  headerCtaLabel: "Talk to us →",
  headerCtaHref: "/contact",
  footerLinks: [
    { label: "About", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/careers" },
  ],
};

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Dairy Feed",
    slug: "dairy-feed",
    stage: "Current",
    description: "Part of the Tulu Bolo animal feed production portfolio.",
    details: [
      "Current stated capacity: 400 quintals/day",
      "Year 1 plan: 100,000 quintals",
      "Year 3 plan: 180,000 quintals",
    ],
  },
  {
    id: 2,
    name: "Fattening Feed",
    slug: "fattening-feed",
    stage: "Current",
    description: "Feed designed within ASF's livestock production focus.",
    details: [
      "Current stated capacity: 200 quintals/day",
      "Year 1 plan: 60,000 quintals",
      "Year 3 plan: 120,000 quintals",
    ],
  },
  {
    id: 3,
    name: "Poultry Feed",
    slug: "poultry-feed",
    stage: "Growth",
    description: "A major planned growth category in the production plan.",
    details: [
      "3-month plan: 25,000 quintals",
      "Year 1 plan: 210,000 quintals",
      "Year 3 plan: 370,000 quintals",
    ],
  },
  {
    id: 4,
    name: "Other Livestock Feed",
    slug: "other-livestock-feed",
    stage: "Future",
    description: "An additional livestock feed category in the multi-year plan.",
    details: [
      "Year 1 plan: 40,000 quintals",
      "Year 2 plan: 60,000 quintals",
      "Year 3 plan: 80,000 quintals",
    ],
  },
  {
    id: 5,
    name: "Cereal Processing",
    slug: "cereal-processing",
    stage: "Planned",
    description: "Part of ASF's upcoming additional business portfolio.",
    details: [],
  },
  {
    id: 6,
    name: "Livestock & Agribusiness Services",
    slug: "livestock-agribusiness-services",
    stage: "Planned",
    description:
      "Planned export-standard livestock slaughter house and livestock medicine & equipment supply.",
    details: [],
  },
];

export const DEFAULT_ARTICLES: Article[] = [
  {
    id: 1,
    title: "Why quality feed matters across the livestock value chain",
    slug: "why-quality-feed-matters",
    excerpt: "Replace these starter cards with live posts from Strapi CMS.",
    category: "Feed & Nutrition",
  },
  {
    id: 2,
    title: "ASF's next chapter at Bulbula Integrated Agro Industry Park",
    slug: "next-chapter-at-bulbula",
    excerpt: "Replace these starter cards with live posts from Strapi CMS.",
    category: "Expansion",
  },
  {
    id: 3,
    title: "Connecting farmers, markets and agro-processing",
    slug: "connecting-farmers-markets-agro-processing",
    excerpt: "Replace these starter cards with live posts from Strapi CMS.",
    category: "Agriculture",
  },
];

// No open positions are seeded — real vacancies are added by ASF staff through the CMS.
export const DEFAULT_JOB_VACANCIES: JobVacancy[] = [];
