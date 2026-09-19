import type { Core } from "@strapi/strapi";

const PUBLIC_READ_PERMISSIONS: Record<string, string[]> = {
  "site-setting": ["find"],
  product: ["find", "findOne"],
  article: ["find", "findOne"],
  page: ["find", "findOne"],
};

async function setPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db
    .query("plugin::users-permissions.role")
    .findOne({ where: { type: "public" } });
  if (!publicRole) return;

  for (const [controller, actions] of Object.entries(PUBLIC_READ_PERMISSIONS)) {
    for (const action of actions) {
      const actionId = `api::${controller}.${controller}.${action}`;
      const existing = await strapi.db
        .query("plugin::users-permissions.permission")
        .findOne({ where: { action: actionId, role: publicRole.id } });
      if (existing) continue;

      await strapi.db.query("plugin::users-permissions.permission").create({
        data: { action: actionId, role: publicRole.id },
      });
    }
  }
}

const SITE_SETTINGS_SEED = {
  companyName: "ASF Agro Industry",
  tagline: "Animal Feed Processing P/S",
  phonePrimary: "+251 905 468 080",
  phoneSecondary: "+251 911 540 903",
  emailPrimary: "argawabili@gmail.com",
  emailSecondary: "merihunb@gmail.com",
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
    { label: "Contact", href: "/contact" },
  ],
  headerCtaLabel: "Talk to us →",
  headerCtaHref: "/contact",
  footerLinks: [
    { label: "About", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
};

const HOME_PAGE_SEED = {
  title: "Home",
  slug: "home",
  sections: [
    {
      __component: "sections.hero",
      eyebrow: "Agro processing · Agriculture · Agribusiness",
      headingLine1: "Growing agriculture.",
      headingLine2: "Empowering farmers.",
      subtitle:
        "ASF develops practical, scientific and reliable agro-processing solutions, with animal feed production at the heart of our work.",
      primaryButtonLabel: "Explore products →",
      primaryButtonHref: "/products",
      secondaryButtonLabel: "Discover ASF",
      secondaryButtonHref: "/about",
      imageStyle: "disc-spin",
    },
    {
      __component: "sections.mission-glance",
      missionHeading: "Our mission",
      missionBody:
        "Based on need assessment, we innovate, develop and implement scientific & reliable agro-processing solutions to transform the lives of farmers particularly livestock farmers & agribusiness sector in Ethiopia and beyond.",
      glanceEyebrow: "At a glance",
      glanceHeading: "A practical agro-industry partner built for growth.",
      glanceBody:
        "ASF operates in animal feed production, dairy and poultry farms, with an expanding portfolio planned across cereal processing, livestock slaughter, and livestock medicine & equipment supply.",
      cards: [
        {
          label: "Vision 2030",
          text:
            "Our vision is to become one of the most reliable companies in agro processing, agriculture and agribusiness in the Eastern Africa Subcontinent, in the year 2030.",
        },
        {
          label: "600 quintals/day",
          text: "Stated current Tulu Bolo feed production capacity.",
        },
      ],
    },
    {
      __component: "sections.feature-grid",
      eyebrow: "Our business",
      heading: "Focused today. Expanding tomorrow.",
      items: [
        {
          icon: "🌾",
          title: "Animal Feed Production",
          text: "Dairy, fattening, poultry and other livestock feed form the core of ASF's production plan.",
        },
        {
          icon: "🐄",
          title: "Dairy & Poultry Farms",
          text: "Farming activities complement feed production and strengthen the integrated livestock approach.",
        },
        {
          icon: "⚙",
          title: "Future Portfolio",
          text: "Cereal processing, export-standard livestock slaughter, and livestock medicine & equipment supply are planned additions.",
        },
      ],
    },
    {
      __component: "sections.stats-band",
      eyebrow: "Scale",
      heading: "Production designed to grow with demand.",
      dark: true,
      stats: [
        { value: "600", label: "Quintals/day current capacity" },
        { value: "410k", label: "Quintals — Year 1 plan" },
        { value: "610k", label: "Quintals — Year 2 plan" },
        { value: "750k", label: "Quintals — Year 3 plan" },
      ],
    },
  ],
};

const ABOUT_PAGE_SEED = {
  title: "About",
  slug: "about",
  sections: [
    {
      __component: "sections.intro",
      eyebrow: "About ASF",
      heading: "Agro-processing built around real agricultural needs.",
      body: "Argaw, Solomon & Friends (ASF) is focused on practical solutions for farmers, livestock production and the wider agribusiness sector.",
    },
    {
      __component: "sections.story-panel",
      eyebrow: "Our story",
      heading: "From animal feed toward an integrated agro-industry platform.",
      bodyParagraph1:
        "ASF currently operates in animal feed production, dairy and poultry farms. Its stated upcoming portfolio includes cereal processing, an export-standard livestock slaughter house, and livestock medicine and equipment supply.",
      bodyParagraph2:
        "Our vision is to become one of the most reliable companies in agro processing, agriculture and agribusiness in the Eastern Africa Subcontinent, in the year 2030.",
      panelBadge: "Ethiopia · Vision 2030",
      panelTitle: "Reliable solutions for a stronger livestock value chain.",
      panelText:
        "From feed production to future integrated agro-processing, ASF is building for farmers, production and sustainable growth.",
    },
    {
      __component: "sections.video",
      eyebrow: "See it in action",
      heading: "Inside the Tulu Bolo factory.",
      caption: "A short tour of our production line, from intake to finished feed.",
    },
    {
      __component: "sections.feature-grid",
      eyebrow: "What guides us",
      heading: "Four principles behind the ASF approach.",
      items: [
        { title: "Farmer-centered", text: "Solutions are grounded in assessed agricultural needs." },
        { title: "Scientific", text: "Nutrition and production expertise support the operating model." },
        { title: "Reliable", text: "The company aims to deliver dependable agro-processing solutions." },
        { title: "Growth-minded", text: "Capacity and business portfolio are planned to expand over time." },
      ],
    },
  ],
};

const PRODUCTS_SEED: {
  name: string;
  slug: string;
  stage: "Current" | "Growth" | "Planned" | "Future";
  description: string;
  details: string[];
}[] = [
  {
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
    name: "Cereal Processing",
    slug: "cereal-processing",
    stage: "Planned",
    description: "Part of ASF's upcoming additional business portfolio.",
    details: [],
  },
  {
    name: "Livestock & Agribusiness Services",
    slug: "livestock-agribusiness-services",
    stage: "Planned",
    description:
      "Planned export-standard livestock slaughter house and livestock medicine & equipment supply.",
    details: [],
  },
];

const ARTICLES_SEED: {
  title: string;
  slug: string;
  excerpt: string;
  category: "Feed & Nutrition" | "Expansion" | "Agriculture" | "Company News";
}[] = [
  {
    title: "Why quality feed matters across the livestock value chain",
    slug: "why-quality-feed-matters",
    excerpt: "Replace these starter cards with live posts from Strapi CMS.",
    category: "Feed & Nutrition",
  },
  {
    title: "ASF's next chapter at Bulbula Integrated Agro Industry Park",
    slug: "next-chapter-at-bulbula",
    excerpt: "Replace these starter cards with live posts from Strapi CMS.",
    category: "Expansion",
  },
  {
    title: "Connecting farmers, markets and agro-processing",
    slug: "connecting-farmers-markets-agro-processing",
    excerpt: "Replace these starter cards with live posts from Strapi CMS.",
    category: "Agriculture",
  },
];

async function seedSiteSettings(strapi: Core.Strapi) {
  const existing = await strapi.documents("api::site-setting.site-setting").findFirst();
  if (existing) return;
  await strapi.documents("api::site-setting.site-setting").create({ data: SITE_SETTINGS_SEED });
}

async function seedProducts(strapi: Core.Strapi) {
  const existing = await strapi.documents("api::product.product").findFirst();
  if (existing) return;
  for (const product of PRODUCTS_SEED) {
    await strapi
      .documents("api::product.product")
      .create({ data: product, status: "published" });
  }
}

async function seedArticles(strapi: Core.Strapi) {
  const existing = await strapi.documents("api::article.article").findFirst();
  if (existing) return;
  for (const article of ARTICLES_SEED) {
    await strapi
      .documents("api::article.article")
      .create({ data: article, status: "published" });
  }
}

async function seedPages(strapi: Core.Strapi) {
  const existing = await strapi.documents("api::page.page").findFirst();
  if (existing) return;
  for (const page of [HOME_PAGE_SEED, ABOUT_PAGE_SEED]) {
    await strapi.documents("api::page.page").create({ data: page as any, status: "published" });
  }
}

export default {
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await setPublicPermissions(strapi);
    await seedSiteSettings(strapi);
    await seedProducts(strapi);
    await seedArticles(strapi);
    await seedPages(strapi);
  },
};
