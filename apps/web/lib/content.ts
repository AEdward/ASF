export interface SiteSettings {
  companyName: string;
  tagline: string;
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  heroPanelBadge: string;
  heroPanelTitle: string;
  heroPanelText: string;
  mission: string;
  vision: string;
  visionLabel: string;
  currentCapacityLabel: string;
  currentCapacityValue: string;
  aboutIntro: string;
  aboutStory: string;
  phonePrimary: string;
  phoneSecondary: string;
  emailPrimary: string;
  emailSecondary: string;
  headOffice: string;
  factoryAddress: string;
  expansionAddress: string;
  productionStats: { value: string; label: string }[];
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

// Fallback content mirrors the real ASF Agro Industry company profile, so the
// site reads correctly even before Strapi has been seeded or if it is
// temporarily unreachable.
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: "ASF Agro Industry",
  tagline: "Animal Feed Processing P/S",
  heroBadge: "Ethiopia · Vision 2030",
  heroTitleLine1: "Growing agriculture.",
  heroTitleLine2: "Empowering farmers.",
  heroSubtitle:
    "ASF develops practical, scientific and reliable agro-processing solutions, with animal feed production at the heart of our work.",
  heroPanelBadge: "Ethiopia · Vision 2030",
  heroPanelTitle: "Reliable solutions for a stronger livestock value chain.",
  heroPanelText:
    "From feed production to future integrated agro-processing, ASF is building for farmers, production and sustainable growth.",
  mission:
    "Based on need assessment, we innovate, develop and implement scientific & reliable agro-processing solutions to transform the lives of farmers particularly livestock farmers & agribusiness sector in Ethiopia and beyond.",
  vision:
    "Our vision is to become one of the most reliable companies in agro processing, agriculture and agribusiness in the Eastern Africa Subcontinent, in the year 2030.",
  visionLabel: "Vision 2030",
  currentCapacityLabel: "600 quintals/day",
  currentCapacityValue: "Stated current Tulu Bolo feed production capacity.",
  aboutIntro:
    "Argaw, Solomon & Friends (ASF) is focused on practical solutions for farmers, livestock production and the wider agribusiness sector.",
  aboutStory:
    "ASF currently operates in animal feed production, dairy and poultry farms. Its stated upcoming portfolio includes cereal processing, an export-standard livestock slaughter house, and livestock medicine and equipment supply.",
  phonePrimary: "+251 905 468 080",
  phoneSecondary: "+251 911 540 903",
  emailPrimary: "argawabili@gmail.com",
  emailSecondary: "merihunb@gmail.com",
  headOffice: "Akaki Kality Woreda 05, near Kality Maseltegna, Addis Ababa, Ethiopia",
  factoryAddress:
    "Operational Factory: Tulu Bolo Town, South West Shoa Zone, Oromia Region. Warehouse: Welete, Sheger City.",
  expansionAddress:
    "Expansion site (in progress): Bulbula Integrated Agro Industry Park, 160km south of Addis Ababa, near Zeway City on the highway to Hawassa.",
  productionStats: [
    { value: "600", label: "Quintals/day current capacity" },
    { value: "410k", label: "Quintals — Year 1 plan" },
    { value: "610k", label: "Quintals — Year 2 plan" },
    { value: "750k", label: "Quintals — Year 3 plan" },
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
