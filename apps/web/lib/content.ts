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
  navLinks: { label: string; href: string; children?: { label: string; href: string }[] }[];
  headerCtaLabel: string;
  headerCtaHref: string;
  footerLinks: { label: string; href: string }[];
  youtubeUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  telegramUrl?: string;
  tiktokUrl?: string;
  linkedinUrl?: string;
  mapEmbedUrl?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  stage: "Current" | "Growth" | "Planned" | "Future";
  description: string;
  details: string[];
  imageUrl?: string;
  body?: string;
  galleryUrls?: string[];
}

export interface Testimonial {
  id: number;
  authorName: string;
  role?: string;
  quote: string;
  photoUrl?: string;
  rating: number;
  featured: boolean;
}

export interface DocumentAsset {
  id: number;
  title: string;
  description?: string;
  fileUrl: string;
  fileName?: string;
  fileSizeKb?: number;
  fileExt?: string;
  thumbnailUrl?: string;
  category: string;
}

export interface FeedRate {
  id: number;
  animalKey: string;
  label: string;
  dailyKgPerAnimal: number;
  bagSizeKg: number;
  recommendedProductSlug?: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImageUrl?: string;
  content?: string;
}

export interface GalleryAlbum {
  id: number;
  title: string;
  slug: string;
  category?: string;
  description?: string;
  imageUrls: string[];
}

export interface Partner {
  id: number;
  name: string;
  logoUrl?: string;
  description?: string;
  websiteUrl?: string;
  category?: string;
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
    {
      label: "About",
      href: "/about",
      children: [
        { label: "Facilities", href: "/facilities" },
        { label: "Quality & Safety", href: "/quality" },
        { label: "Sustainability", href: "/sustainability" },
        { label: "Testimonials", href: "/about/testimonials" },
        { label: "Documents", href: "/documents" },
      ],
    },
    {
      label: "Products",
      href: "/products",
      children: [{ label: "Feed Calculator", href: "/calculator" }],
    },
    { label: "Crop Residue Feed", href: "/crop-residue-feed" },
    { label: "Partners", href: "/partners" },
    { label: "Gallery", href: "/gallery" },
    { label: "News & Blog", href: "/blog" },
  ],
  headerCtaLabel: "Talk to us →",
  headerCtaHref: "/contact",
  footerLinks: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/careers" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
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
    imageUrl: "/products/dairy-feed.webp",
  },
  {
    id: 2,
    name: "Cattle Fattening Feed",
    slug: "cattle-fattening-feed",
    stage: "Current",
    description: "Feed designed within ASF's livestock production focus.",
    details: [
      "Current stated capacity: 200 quintals/day",
      "Year 1 plan: 60,000 quintals",
      "Year 3 plan: 120,000 quintals",
    ],
    imageUrl: "/products/cattle-fattening-feed.webp",
  },
  {
    id: 3,
    name: "Layer Feed",
    slug: "layer-feed",
    stage: "Current",
    description: "Formulated feed for egg-laying hens, part of ASF's poultry feed range.",
    details: [
      "3-month plan: 25,000 quintals",
      "Year 1 plan: 210,000 quintals",
      "Year 3 plan: 370,000 quintals",
    ],
    imageUrl: "/products/layer-feed.webp",
  },
  {
    id: 4,
    name: "Pullet Feed",
    slug: "pullet-feed",
    stage: "Current",
    description: "Formulated feed for pullets, part of ASF's poultry feed range.",
    details: [],
    imageUrl: "/products/pullet-feed.webp",
  },
  {
    id: 5,
    name: "Sheep & Goat Feed",
    slug: "sheep-goat-feed",
    stage: "Current",
    description: "Formulated feed for sheep and goat farmers, part of ASF's livestock feed range.",
    details: [],
    imageUrl: "/products/sheep-goat-feed.webp",
  },
  {
    id: 6,
    name: "Camel Feed",
    slug: "camel-feed",
    stage: "Current",
    description: "Formulated feed for camel farmers, part of ASF's livestock feed range.",
    details: [],
    imageUrl: "/products/camel-feed.webp",
  },
  {
    id: 7,
    name: "Cereal Processing",
    slug: "cereal-processing",
    stage: "Planned",
    description: "Part of ASF's upcoming additional business portfolio.",
    details: [],
  },
  {
    id: 8,
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
    excerpt:
      "ASF's quality controllers and lab technicians support production standards at every stage, from raw material sourcing to the finished feed reaching Ethiopia's livestock farmers.",
    category: "Feed & Nutrition",
  },
  {
    id: 2,
    title: "ASF's next chapter at Bulbula Integrated Agro Industry Park",
    slug: "next-chapter-at-bulbula",
    excerpt:
      "In February 2023, ASF signed an investment agreement for a 271-hectare site at the Bulbula Integrated Agro Industry Park, 160km south of Addis Ababa, laying the groundwork for the company's next phase of growth.",
    category: "Expansion",
  },
  {
    id: 3,
    title: "Connecting farmers, markets and agro-processing",
    slug: "connecting-farmers-markets-agro-processing",
    excerpt:
      "ASF's animal feed reaches livestock farmers and businesses through a distribution network of farmers' unions, cooperatives, wholesalers, retailers and direct sales.",
    category: "Agriculture",
  },
];

// No open positions are seeded — real vacancies are added by ASF staff through the CMS.
export const DEFAULT_JOB_VACANCIES: JobVacancy[] = [];

// Falls back empty only if Strapi is unreachable — the real albums are seeded into the CMS.
export const DEFAULT_GALLERY_ALBUMS: GalleryAlbum[] = [];

// No partners are seeded — real ones are added by ASF staff through the CMS.
export const DEFAULT_PARTNERS: Partner[] = [];

// No testimonials are seeded — real ones are added by ASF staff through the CMS.
export const DEFAULT_TESTIMONIALS: Testimonial[] = [];

// No documents are seeded — real files are uploaded by ASF staff through the CMS.
export const DEFAULT_DOCUMENTS: DocumentAsset[] = [];

// Placeholder daily-intake estimates so the calculator works before ASF sets
// its own rates in the CMS. These are rough industry estimates, not
// ASF-specific formulations, and are clearly labeled as such on the page.
export const DEFAULT_FEED_RATES: FeedRate[] = [
  { id: 1, animalKey: "dairy-cow", label: "Dairy Cow", dailyKgPerAnimal: 8, bagSizeKg: 50, recommendedProductSlug: "dairy-feed" },
  { id: 2, animalKey: "fattening-cattle", label: "Fattening Cattle", dailyKgPerAnimal: 7, bagSizeKg: 50, recommendedProductSlug: "cattle-fattening-feed" },
  { id: 3, animalKey: "layer-hen", label: "Layer Hen", dailyKgPerAnimal: 0.12, bagSizeKg: 50, recommendedProductSlug: "layer-feed" },
  { id: 4, animalKey: "pullet", label: "Pullet", dailyKgPerAnimal: 0.06, bagSizeKg: 50, recommendedProductSlug: "pullet-feed" },
  { id: 5, animalKey: "sheep-goat", label: "Sheep / Goat", dailyKgPerAnimal: 1.2, bagSizeKg: 50, recommendedProductSlug: "sheep-goat-feed" },
  { id: 6, animalKey: "camel", label: "Camel", dailyKgPerAnimal: 6, bagSizeKg: 50, recommendedProductSlug: "camel-feed" },
];
