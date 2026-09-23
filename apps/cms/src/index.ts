import type { Core } from "@strapi/strapi";
import path from "path";
import fs from "fs";
import { registerAnalyticsDashboardRoutes } from "./analytics-dashboard";

const PUBLIC_READ_PERMISSIONS: Record<string, string[]> = {
  "site-setting": ["find"],
  product: ["find", "findOne"],
  article: ["find", "findOne"],
  page: ["find", "findOne"],
  "job-vacancy": ["find", "findOne"],
  "gallery-album": ["find", "findOne"],
  partner: ["find", "findOne"],
};

const LOCALES = [
  { code: "am", name: "Amharic (am)" },
  { code: "om", name: "Oromo (om)" },
];

async function seedLocales(strapi: Core.Strapi) {
  for (const locale of LOCALES) {
    const existing = await strapi.db
      .query("plugin::i18n.locale")
      .findOne({ where: { code: locale.code } });
    if (existing) continue;
    await strapi.db.query("plugin::i18n.locale").create({
      data: { ...locale, isDefault: false },
    });
  }
}

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
      ],
    },
    { label: "Products", href: "/products" },
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

// Only the fields marked `localized: true` in the schema need a value here —
// phone/email/hrefs are shared automatically across locales.
const SITE_SETTINGS_LOCALIZED: Record<string, Record<string, unknown>> = {
  am: {
    companyName: "ASF Agro Industry",
    tagline: "የእንስሳት መኖ ማቀነባበሪያ ኃ/የተ/ማ",
    headOffice: "አቃቂ ቂሊጥ ወረዳ 05፣ ቂሊጥ መሠልጠኛ አካባቢ፣ አዲስ አበባ፣ ኢትዮጵያ",
    factoryAddress:
      "ማምረቻ ፋብሪካ፦ ቱሉ ቦሎ ከተማ፣ ደቡብ ምዕራብ ሸዋ ዞን፣ ኦሮሚያ ክልል። መጋዘን፦ ወለቴ፣ ሸገር ከተማ።",
    expansionAddress:
      "የማስፋፊያ ቦታ (በሂደት ላይ)፦ ቡልቡላ የተቀናጀ አግሮ ኢንዱስትሪ ፓርክ፣ ከአዲስ አበባ 160 ኪ.ሜ ደቡብ፣ በዘዋይ ከተማ አቅራቢያ በሃዋሳ መንገድ ላይ።",
    navLinks: [
      { label: "መነሻ", href: "/" },
      {
        label: "ስለ እኛ",
        href: "/about",
        children: [
          { label: "ተቋማት", href: "/facilities" },
          { label: "ጥራት እና ደህንነት", href: "/quality" },
          { label: "ዘላቂነት", href: "/sustainability" },
        ],
      },
      { label: "ምርቶች", href: "/products" },
      { label: "የሰብል ቀሪት መኖ", href: "/crop-residue-feed" },
      { label: "አጋሮች", href: "/partners" },
      { label: "ማዕከለ ስዕላት", href: "/gallery" },
      { label: "ዜና እና ብሎግ", href: "/blog" },
    ],
    headerCtaLabel: "ከእኛ ጋር ይነጋገሩ →",
    footerLinks: [
      { label: "ስለ እኛ", href: "/about" },
      { label: "አግኙን", href: "/contact" },
      { label: "የስራ ቅጥር", href: "/careers" },
      { label: "የግላዊነት ፖሊሲ", href: "/privacy-policy" },
      { label: "የአገልግሎት ውሎች", href: "/terms-of-service" },
    ],
  },
  om: {
    companyName: "ASF Agro Industry",
    tagline: "Warshaa Nyaataa Beeladaa (P/S)",
    headOffice: "Akaki Qaallittii Aanaa 05, naannoo Qaallittii Maasaltanyaa, Finfinnee, Itoophiyaa",
    factoryAddress:
      "Warshaa Hojiirra Jiru: Magaalaa Tuulluu Boolloo, Godina Shawaa Kibba Lixaa, Naannoo Oromiyaa. Buufata Kuusaa: Waleetee, Magaalaa Sheegar.",
    expansionAddress:
      "Bakka Babal'ina (adeemsa irra jiru): Paarkii Warshaalee Qonnaa Walitti Qindaa'e Bulbulaa, kiiloomeetira 160 kibba Finfinnee, naannoo Magaalaa Zeeway karaa gara Hawaasaa.",
    navLinks: [
      { label: "Mana", href: "/" },
      {
        label: "Waa'ee Keenya",
        href: "/about",
        children: [
          { label: "Dhaabbilee", href: "/facilities" },
          { label: "Qulqullina fi Nageenya", href: "/quality" },
          { label: "Itti Fufiinsa", href: "/sustainability" },
        ],
      },
      { label: "Oomishaalee", href: "/products" },
      { label: "Nyaata Hambaa Midhaanii", href: "/crop-residue-feed" },
      { label: "Michoota", href: "/partners" },
      { label: "Suuraalee", href: "/gallery" },
      { label: "Oduu fi Barreeffama", href: "/blog" },
    ],
    headerCtaLabel: "Nu haasofsiisi →",
    footerLinks: [
      { label: "Waa'ee Keenya", href: "/about" },
      { label: "Nu Qunnami", href: "/contact" },
      { label: "Carraa Hojii", href: "/careers" },
      { label: "Imaammata Dhuunfaa", href: "/privacy-policy" },
      { label: "Haala Tajaajilaa", href: "/terms-of-service" },
    ],
  },
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
      __component: "sections.video",
      eyebrow: "See it in action",
      heading: "Inside the Tulu Bolo factory.",
      caption: "A short tour of our production line, from intake to finished feed.",
    },
    {
      __component: "sections.glance",
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

const HOME_PAGE_LOCALIZED: Record<string, Record<string, unknown>> = {
  am: {
    title: "መነሻ",
    sections: [
      {
        __component: "sections.hero",
        eyebrow: "አግሮ ማቀነባበር · ግብርና · አግሪቢዝነስ",
        headingLine1: "ግብርናን ማሳደግ።",
        headingLine2: "አርሶ አደሮችን ማብቃት።",
        subtitle:
          "ASF ተግባራዊ፣ ሳይንሳዊ እና አስተማማኝ የግብርና ማቀነባበሪያ መፍትሄዎችን ያዘጋጃል፣ የእንስሳት መኖ ምርት በስራችን ልብ ውስጥ ነው።",
        primaryButtonLabel: "ምርቶችን ይመልከቱ →",
        primaryButtonHref: "/products",
        secondaryButtonLabel: "ASFን ይወቁ",
        secondaryButtonHref: "/about",
        imageStyle: "disc-spin",
      },
      {
        __component: "sections.video",
        eyebrow: "በተግባር ይመልከቱ",
        heading: "በቱሉ ቦሎ ፋብሪካ ውስጥ።",
        caption: "ከግብዓት እስከ የተጠናቀቀ መኖ ያለውን የምርት መስመራችንን አጭር ዙር።",
      },
      {
        __component: "sections.glance",
        glanceEyebrow: "በጨረፍታ",
        glanceHeading: "ለእድገት የተገነባ ተግባራዊ የአግሮ ኢንዱስትሪ አጋር።",
        glanceBody:
          "ASF በእንስሳት መኖ ምርት፣ በወተትና በዶሮ እርባታ ቦታዎች ይሰራል፣ የሚስፋፋ የስራ ዘርፍም በእህል ማቀነባበሪያ፣ በእንስሳት እርድ እና በእንስሳት መድሃኒት እና መገልገያ አቅርቦት ላይ ታቅዷል።",
        cards: [
          {
            label: "ራዕይ 2030",
            text:
              "ራዕያችን በምስራቅ አፍሪካ ክፍለ አህጉር በአግሮ ማቀነባበር፣ በግብርና እና በአግሪቢዝነስ ውስጥ ከሚታመኑ ኩባንያዎች አንዱ በ2030 መሆን ነው።",
          },
          {
            label: "600 ኩንታል/ቀን",
            text: "የተገለጸው የአሁኑ የቱሉ ቦሎ የመኖ ምርት አቅም።",
          },
        ],
      },
      {
        __component: "sections.feature-grid",
        eyebrow: "የስራ ዘርፎቻችን",
        heading: "ዛሬ ላይ ያተኮርን። ነገ የምናሰፋ።",
        items: [
          {
            icon: "🌾",
            title: "የእንስሳት መኖ ምርት",
            text: "የወተት፣ የማድለብ፣ የዶሮ እና ሌሎች የእንስሳት መኖዎች የASF ምርት ዕቅድ ዋና ክፍል ናቸው።",
          },
          {
            icon: "🐄",
            title: "የወተትና የዶሮ እርባታ ቦታዎች",
            text: "የእርባታ ስራዎች የመኖ ምርትን ያሟሉ እና የተቀናጀውን የእንስሳት አቀራረብ ያጠናክራሉ።",
          },
          {
            icon: "⚙",
            title: "የወደፊት ስራዎች",
            text:
              "የእህል ማቀነባበር፣ ለውጭ ገበያ ደረጃ የእንስሳት እርድ እና የእንስሳት መድሃኒት እና መገልገያ አቅርቦት የታቀዱ ተጨማሪዎች ናቸው።",
          },
        ],
      },
      {
        __component: "sections.stats-band",
        eyebrow: "መጠን",
        heading: "ከፍላጎት ጋር እንዲያድግ የተነደፈ ምርት።",
        dark: true,
        stats: [
          { value: "600", label: "ኩንታል/ቀን የአሁኑ አቅም" },
          { value: "410k", label: "ኩንታል — የ1ኛ ዓመት ዕቅድ" },
          { value: "610k", label: "ኩንታል — የ2ኛ ዓመት ዕቅድ" },
          { value: "750k", label: "ኩንታል — የ3ኛ ዓመት ዕቅድ" },
        ],
      },
    ],
  },
  om: {
    title: "Mana",
    sections: [
      {
        __component: "sections.hero",
        eyebrow: "Adeemsa Qonnaa · Qonna · Daldala Qonnaa",
        headingLine1: "Qonna Guddisuu.",
        headingLine2: "Qonnaan Bultoota Jajjabeessuu.",
        subtitle:
          "ASF furmaata adeemsa qonnaa kan hojiirra oolu, saayinsawaa fi amanamaa ta'e qopheessa; oomishni nyaataa beeladaa onnee hojii keenya ti.",
        primaryButtonLabel: "Oomishaalee Ilaali →",
        primaryButtonHref: "/products",
        secondaryButtonLabel: "ASF Beeki",
        secondaryButtonHref: "/about",
        imageStyle: "disc-spin",
      },
      {
        __component: "sections.video",
        eyebrow: "Hojiirratti Ilaali",
        heading: "Keessa Warshaa Tuulluu Boolloo.",
        caption: "Sirna oomisha keenya kan galtee irraa hanga nyaata xumurameetti argisiisu gabaabaa.",
      },
      {
        __component: "sections.glance",
        glanceEyebrow: "Gabaabinaan",
        glanceHeading: "Michoo Warshaa Qonnaa Guddina Irratti Ijaarame.",
        glanceBody:
          "ASF oomisha nyaata beeladaa, qonna aannanii fi lukkuu keessa hojjeta; kunis adeemsa midhaan, qalma beeladaa, fi dhiyeessii qorichaa fi meeshaalee beeladaa babal'ee karoorfameera.",
        cards: [
          {
            label: "Mul'ata 2030",
            text:
              "Mul'ata keenya kutaa biyyoota Afrikaa Bahaa keessatti dhaabbata amanamaa warshaa qonnaa, qonnaa fi daldala qonnaa keessatti tokko ta'uu, bara 2030 ti.",
          },
          {
            label: "Kuntaal 600/guyyaa",
            text: "Dandeettii oomisha nyaataa Tuulluu Boolloo ammaa ibsame.",
          },
        ],
      },
      {
        __component: "sections.feature-grid",
        eyebrow: "Daldala Keenya",
        heading: "Har'a Xiyyeeffannaa. Boru Babal'ina.",
        items: [
          {
            icon: "🌾",
            title: "Oomisha Nyaata Beeladaa",
            text: "Nyaata aannanii, coosaa, lukkuu fi beeladoota kan biroo karoora oomisha ASF keessatti bu'uura ti.",
          },
          {
            icon: "🐄",
            title: "Qonna Aannanii fi Lukkuu",
            text: "Hojiin qonnaa oomisha nyaataa dabalata; kunis mala beeladoota walitti qindaa'e cimsa.",
          },
          {
            icon: "⚙",
            title: "Karoora Fuulduraa",
            text:
              "Adeemsa midhaanii, qalma beeladaa sadarkaa alergii, fi dhiyeessiin qoricha fi meeshaalee beeladaa dabalata karoorfamaniiru.",
          },
        ],
      },
      {
        __component: "sections.stats-band",
        eyebrow: "Hangaa",
        heading: "Oomishni fedhii waliin guddatuuf qophaa'e.",
        dark: true,
        stats: [
          { value: "600", label: "Kuntaal/guyyaa dandeettii ammaa" },
          { value: "410k", label: "Kuntaal — Karoora Waggaa 1ffaa" },
          { value: "610k", label: "Kuntaal — Karoora Waggaa 2ffaa" },
          { value: "750k", label: "Kuntaal — Karoora Waggaa 3ffaa" },
        ],
      },
    ],
  },
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
      __component: "sections.stats-band",
      eyebrow: "Our impact",
      heading: "Jobs and partnerships created around Tulu Bolo.",
      dark: false,
      stats: [
        { value: "51", label: "Direct jobs created at the Tulu Bolo factory" },
        { value: "465", label: "People engaged across the value chain" },
        { value: "300", label: "Livestock farmers & businesses in our distribution network" },
        { value: "271", label: "Hectares at the Bulbula expansion site" },
      ],
    },
    {
      __component: "sections.mission",
      heading: "Our mission",
      body:
        "Based on need assessment, we innovate, develop and implement scientific & reliable agro-processing solutions to transform the lives of farmers particularly livestock farmers & agribusiness sector in Ethiopia and beyond.",
    },
    {
      __component: "sections.story-panel",
      eyebrow: "Our story",
      heading: "From animal feed toward an integrated agro-industry platform.",
      bodyParagraph1:
        "ASF currently operates in animal feed production, dairy and poultry farms. Its stated upcoming portfolio includes cereal processing, an export-standard livestock slaughter house, and livestock medicine and equipment supply. In February 2023, ASF signed an investment agreement with the Bulbula Integrated Agro Industry Park (Oromia Industry Parks Development Corporation) for a 271-hectare expansion site 160km south of Addis Ababa, alongside food oil, coffee & spices, meat, cereal and vegetable processing industries.",
      bodyParagraph2:
        "Our vision is to become one of the most reliable companies in agro processing, agriculture and agribusiness in the Eastern Africa Subcontinent, in the year 2030.",
      panelBadge: "Ethiopia · Vision 2030",
      panelTitle: "Reliable solutions for a stronger livestock value chain.",
      panelText:
        "From feed production to future integrated agro-processing, ASF is building for farmers, production and sustainable growth.",
    },
    {
      __component: "sections.team-grid",
      eyebrow: "Leadership",
      heading: "The team running ASF's operations.",
      members: [
        {
          name: "Argaw Alaro",
          role: "General Manager",
          qualification: "MA in Economics, BSc in Mathematics",
          experience:
            "More than 15 years in Ethiopian Shipping Lines as a navigator, as a business owner and in project management.",
        },
        {
          name: "Merihun Belayneh",
          role: "Management Team",
          qualification: "MA in Psychology, BA in Marketing",
          experience:
            "More than 15 years as a senior customer officer at Ethiopian Airlines, travel expert at the UN, and as a counselor and business consultant.",
        },
        {
          name: "Suraphel Mekonnen",
          role: "Management Team",
          qualification: "BA in Business, BSc in Architecture",
          experience: "More than 20 years as an international business owner.",
        },
        {
          name: "Meron Mekonnen",
          role: "Management Team",
          qualification: "BA in Business Administration, BA in Computer Information Systems",
          experience: "More than 17 years managing businesses and as an international business owner.",
        },
        {
          name: "Baidemariam Daniel",
          role: "Production Head",
          qualification: "BSc in Animal Science",
          experience: "2 years in livestock production.",
        },
        {
          name: "Dejene Dessie",
          role: "Finance Head",
          qualification: "MA in Finance and Accounting",
          experience: "More than 10 years in finance and tax.",
        },
        {
          name: "Tinsae Demssie",
          role: "Technical Manager",
          qualification: "BSc in Industrial Engineering",
          experience: "More than 6 years in electromechanical works.",
        },
      ],
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
    {
      __component: "sections.feature-grid",
      eyebrow: "How we're organized",
      heading: "Departments behind production and distribution.",
      items: [
        { title: "Finance & Administration", text: "Supports company operations, accounts and tax." },
        {
          title: "Marketing, Sales & Business Development",
          text: "Drives distribution to unions, cooperatives, wholesalers and retailers.",
        },
        { title: "Production", text: "Runs day-to-day feed production at Tulu Bolo." },
        {
          title: "Technical & General Services",
          text: "Maintains equipment and electromechanical operations.",
        },
        { title: "Procurement", text: "Sources raw materials and supplies for production." },
      ],
    },
  ],
};

const ABOUT_PAGE_LOCALIZED: Record<string, Record<string, unknown>> = {
  am: {
    title: "ስለ እኛ",
    sections: [
      {
        __component: "sections.intro",
        eyebrow: "ስለ ASF",
        heading: "በእውነተኛ የግብርና ፍላጎቶች ላይ የተገነባ አግሮ ማቀነባበር።",
        body:
          "አርጋው፣ ሰለሞን እና ጓደኞቻቸው (ASF) ለአርሶ አደሮች፣ ለእንስሳት ምርት እና ለሰፊው አግሪቢዝነስ ዘርፍ ተግባራዊ መፍትሄዎች ላይ ያተኩራል።",
      },
      {
        __component: "sections.stats-band",
        eyebrow: "የኛ ተፅእኖ",
        heading: "በቱሉ ቦሎ አካባቢ የተፈጠሩ የስራ እድሎችና ሽርክናዎች።",
        dark: false,
        stats: [
          { value: "51", label: "በቱሉ ቦሎ ፋብሪካ የተፈጠሩ ቀጥተኛ የስራ እድሎች" },
          { value: "465", label: "በእሴት ሰንሰለቱ ውስጥ የተሳተፉ ሰዎች" },
          { value: "300", label: "በስርጭት መረባችን ውስጥ ያሉ የእንስሳት አርሶ አደሮች እና ንግዶች" },
          { value: "271", label: "በቡልቡላ ማስፋፊያ ቦታ ላይ ያሉ ሄክታሮች" },
        ],
      },
      {
        __component: "sections.mission",
        heading: "ተልእኳችን",
        body:
          "በፍላጎት ግምገማ ላይ በመመስረት፣ በኢትዮጵያ እና ከዚያ ውጭ ያሉ አርሶ አደሮችን በተለይም የእንስሳት አርሶ አደሮችን እና የአግሪቢዝነስ ዘርፍን ህይወት ለመቀየር ሳይንሳዊ እና አስተማማኝ የግብርና ማቀነባበሪያ መፍትሄዎችን እናበልጽጋለን፣ እናዳብራለን እና እናስፈጽማለን።",
      },
      {
        __component: "sections.story-panel",
        eyebrow: "ታሪካችን",
        heading: "ከእንስሳት መኖ ወደ የተቀናጀ የአግሮ ኢንዱስትሪ መደብር።",
        bodyParagraph1:
          "ASF በአሁኑ ጊዜ በእንስሳት መኖ ምርት፣ በወተትና በዶሮ እርባታ ቦታዎች ይሰራል። የተገለጸው መጪ የስራ ዘርፍ የእህል ማቀነባበር፣ ለውጭ ገበያ ደረጃ የእንስሳት እርድ ቤት እና የእንስሳት መድሃኒት እና መገልገያ አቅርቦትን ያካትታል። በየካቲት 2023፣ ASF ከቡልቡላ የተቀናጀ አግሮ ኢንዱስትሪ ፓርክ (የኦሮሚያ ኢንዱስትሪ ፓርኮች ልማት ኮርፖሬሽን) ጋር ከአዲስ አበባ በስተደቡብ 160 ኪ.ሜ የሚገኝ በ271 ሄክታር ላይ ያለ የማስፋፊያ ቦታ ስምምነት ተፈራርሟል፣ ከዘይት ማቀነባበሪያ፣ ቡናና ቅመማ ቅመም፣ ስጋ፣ እህል እና አትክልት ማቀነባበሪያ ኢንዱስትሪዎች ጎን ለጎን።",
        bodyParagraph2:
          "ራዕያችን በምስራቅ አፍሪካ ክፍለ አህጉር በአግሮ ማቀነባበር፣ በግብርና እና በአግሪቢዝነስ ውስጥ ከሚታመኑ ኩባንያዎች አንዱ በ2030 መሆን ነው።",
        panelBadge: "ኢትዮጵያ · ራዕይ 2030",
        panelTitle: "ለጠንካራ የእንስሳት እሴት ሰንሰለት አስተማማኝ መፍትሄዎች።",
        panelText:
          "ከመኖ ምርት ወደ የወደፊት የተቀናጀ አግሮ ማቀነባበር፣ ASF ለአርሶ አደሮች፣ ለምርት እና ለዘላቂ እድገት ይገነባል።",
      },
      {
        __component: "sections.team-grid",
        eyebrow: "አመራር",
        heading: "የASF ስራዎችን የሚመራው ቡድን።",
        members: [
          {
            name: "Argaw Alaro",
            role: "ስራ አስኪያጅ",
            qualification: "በኢኮኖሚክስ ማስተርስ፣ በሂሳብ ትምህርት BSc",
            experience: "በኢትዮጵያ የመርከብ መስመሮች ውስጥ እንደ መርከብ መርከበኛ፣ የንግድ ባለቤት እና በፕሮጀክት አስተዳደር ውስጥ ከ15 ዓመታት በላይ ልምድ።",
          },
          {
            name: "Merihun Belayneh",
            role: "የስራ አመራር ቡድን",
            qualification: "በሳይኮሎጂ ማስተርስ፣ በማርኬቲንግ BA",
            experience:
              "በኢትዮጵያ አየር መንገድ ከፍተኛ የደንበኞች አገልግሎት ባለሙያ፣ በተመድ የጉዞ ኤክስፐርት፣ እና እንደ አማካሪ እና የንግድ አማካሪ ከ15 ዓመታት በላይ ልምድ።",
          },
          {
            name: "Suraphel Mekonnen",
            role: "የስራ አመራር ቡድን",
            qualification: "በንግድ BA፣ በአርክቴክቸር BSc",
            experience: "ከ20 ዓመታት በላይ በአለም አቀፍ የንግድ ባለቤትነት ልምድ።",
          },
          {
            name: "Meron Mekonnen",
            role: "የስራ አመራር ቡድን",
            qualification: "በንግድ አስተዳደር BA፣ በኮምፒውተር ኢንፎርሜሽን ሲስተምስ BA",
            experience: "ከ17 ዓመታት በላይ ንግዶችን በማስተዳደር እና እንደ አለም አቀፍ የንግድ ባለቤት ልምድ።",
          },
          {
            name: "Baidemariam Daniel",
            role: "የምርት ክፍል ኃላፊ",
            qualification: "በእንስሳት ሳይንስ BSc",
            experience: "በእንስሳት ምርት 2 ዓመት ልምድ።",
          },
          {
            name: "Dejene Dessie",
            role: "የፋይናንስ ክፍል ኃላፊ",
            qualification: "በፋይናንስ እና አካውንቲንግ ማስተርስ",
            experience: "ከ10 ዓመታት በላይ በፋይናንስ እና ታክስ ልምድ።",
          },
          {
            name: "Tinsae Demssie",
            role: "ቴክኒካል ማናጀር",
            qualification: "በኢንዱስትሪ ኢንጂነሪንግ BSc",
            experience: "ከ6 ዓመታት በላይ በኤሌክትሮ መካኒካል ስራዎች ልምድ።",
          },
        ],
      },
      {
        __component: "sections.feature-grid",
        eyebrow: "የሚመሩን መርሆች",
        heading: "የASF አካሄድ አራት መርሆች።",
        items: [
          { title: "አርሶ አደር ያተኮረ", text: "መፍትሄዎች በተገመገሙ የግብርና ፍላጎቶች ላይ የተመሰረቱ ናቸው።" },
          { title: "ሳይንሳዊ", text: "የስነ-ምግብ እና የምርት እውቀት የስራ ሞዴሉን ይደግፋል።" },
          { title: "አስተማማኝ", text: "ኩባንያው አስተማማኝ የግብርና ማቀነባበሪያ መፍትሄዎችን ለማቅረብ ያለመዳል።" },
          { title: "እድገት ላይ ያተኮረ", text: "አቅም እና የስራ ዘርፍ በጊዜ ሂደት እንዲሰፉ ታቅዷል።" },
        ],
      },
      {
        __component: "sections.feature-grid",
        eyebrow: "እንዴት እንደተዋቀርን",
        heading: "ምርትና ስርጭትን የሚደግፉ ክፍሎች።",
        items: [
          { title: "ፋይናንስ እና አስተዳደር", text: "የኩባንያ ስራዎችን፣ ሂሳቦችን እና ታክስን ይደግፋል።" },
          { title: "ማርኬቲንግ፣ ሽያጭ እና የንግድ እድገት", text: "ወደ ማህበራት፣ ህብረት ስራ ማህበራት፣ የጅምላ ነጋዴዎች እና ችርቻሮ ነጋዴዎች ስርጭትን ያንቀሳቅሳል።" },
          { title: "ምርት", text: "በቱሉ ቦሎ የቀን ተቀን የመኖ ምርትን ያስኪያዳል።" },
          { title: "ቴክኒካል እና አጠቃላይ አገልግሎቶች", text: "መገልገያዎችን እና የኤሌክትሮ መካኒካል ስራዎችን ይጠብቃል።" },
          { title: "ግዢ", text: "ለምርት የሚያገለግሉ ጥሬ ዕቃዎችን እና አቅርቦቶችን ያቀርባል።" },
        ],
      },
    ],
  },
  om: {
    title: "Waa'ee Keenya",
    sections: [
      {
        __component: "sections.intro",
        eyebrow: "Waa'ee ASF",
        heading: "Adeemsa Qonnaa kan fedhii qonnaa dhugaa irratti ijaarame.",
        body:
          "Argaw, Solomon fi Michoota (ASF) furmaata adeemsawaa qonnaan bultootaaf, oomisha beeladaaf, fi daldala qonnaa balaaf xiyyeeffata.",
      },
      {
        __component: "sections.stats-band",
        eyebrow: "Dhiibbaa Keenya",
        heading: "Hojii fi tumsa naannoo Tulu Bolo uumame.",
        dark: false,
        stats: [
          { value: "51", label: "Hojii kallattii Warshaa Tulu Bolo keessatti uumame" },
          { value: "465", label: "Namoota sarara gatii keessatti hirmaatan" },
          { value: "300", label: "Qonnaan bultoota beeladaa fi daldaltoota network raabsaa keenya keessa jiran" },
          { value: "271", label: "Heektaara bakka Bulbula babal'ina irratti jiru" },
        ],
      },
      {
        __component: "sections.mission",
        heading: "Ergama Keenya",
        body:
          "Madaallii fedhii irratti hundaa'uun, jireenya qonnaan bultootaa, keessumaa qonnaan bultoota beeladaa fi daldala qonnaa Itoophiyaa keessaa fi alaa jijjiiruuf, furmaata adeemsa qonnaa saayinsawaa fi amanamaa ta'e haaraa baafna, guddifna, hojiirra oolchina.",
      },
      {
        __component: "sections.story-panel",
        eyebrow: "Seenaa Keenya",
        heading: "Nyaata Beeladaa irraa gara Waltajjii Warshaa Qonnaa Walitti Qindaa'eetti.",
        bodyParagraph1:
          "ASF yeroo ammaa oomisha nyaata beeladaa, qonna aannanii fi lukkuu keessa hojjeta. Karoorri fuulduraa ibsame adeemsa midhaanii, mana qalma beeladaa sadarkaa alergii, fi dhiyeessii qoricha fi meeshaalee beeladaa dabalata. Guyyaa Guraandhala 2023, ASF Waltajjii Warshaa Qonnaa Walitti Qindaa'e Bulbula (Dhaabbata Guddina Warshaalee Oromiyaa) waliin walta'iinsa investimentii bakka babal'ina heektaara 271, kiloomeetira 160 kibba Finfinnee irraa, dameewwan oomisha zayitaa nyaataa, buna fi urgooftuu, foonii, midhaanii fi muduraa waliin mallatteesse.",
        bodyParagraph2:
          "Mul'ata keenya kutaa biyyoota Afrikaa Bahaa keessatti dhaabbata amanamaa warshaa qonnaa, qonnaa fi daldala qonnaa keessatti tokko ta'uu, bara 2030 ti.",
        panelBadge: "Itoophiyaa · Mul'ata 2030",
        panelTitle: "Furmaata amanamaa sarara gatii beeladaa cimaaf.",
        panelText:
          "Oomisha nyaataa irraa gara adeemsa warshaa qonnaa walitti qindaa'e fuulduraatti, ASF qonnaan bultootaaf, oomishaaf, fi guddina itti fufiinsa qabuuf ijaaraa jira.",
      },
      {
        __component: "sections.team-grid",
        eyebrow: "Hoggansa",
        heading: "Garee hojii ASF geggeessu.",
        members: [
          {
            name: "Argaw Alaro",
            role: "Hoggaa Olaanaa",
            qualification: "MA Ikoonomiksii, BSc Herregaa",
            experience: "Waggaa 15 ol Ehiyoophiyaa Shipping Lines keessatti akka navigeetaraa, abbaa daldalaa fi bulchiinsa piroojeektii keessatti muuxannoo qaba.",
          },
          {
            name: "Merihun Belayneh",
            role: "Garee Hoggansaa",
            qualification: "MA Saayikooloojii, BA Gabaasa",
            experience:
              "Waggaa 15 ol akka ogeessa tajaajila maamiltootaa olaanaa Ehiyoophiyaa Erport, ogeessa imalaa UN keessatti, akkasumas gorsaa fi gorsaa daldalaa ta'uun muuxannoo qaba.",
          },
          {
            name: "Suraphel Mekonnen",
            role: "Garee Hoggansaa",
            qualification: "BA Daldalaa, BSc Arkiteektaraa",
            experience: "Waggaa 20 ol abbaa daldalaa idil-addunyaa ta'uun muuxannoo qaba.",
          },
          {
            name: "Meron Mekonnen",
            role: "Garee Hoggansaa",
            qualification: "BA Bulchiinsa Daldalaa, BA Sirna Odeeffannoo Kompiitaraa",
            experience: "Waggaa 17 ol daldalawwan bulchuu fi abbaa daldalaa idil-addunyaa ta'uun muuxannoo qaba.",
          },
          {
            name: "Baidemariam Daniel",
            role: "Hoggaa Oomishaa",
            qualification: "BSc Saayinsii Beeladaa",
            experience: "Waggaa 2 oomisha beeladaa keessatti muuxannoo qaba.",
          },
          {
            name: "Dejene Dessie",
            role: "Hoggaa Faayinaansii",
            qualification: "MA Faayinaansii fi Herregaa",
            experience: "Waggaa 10 ol faayinaansii fi gibira keessatti muuxannoo qaba.",
          },
          {
            name: "Tinsae Demssie",
            role: "Hoji-gaggeessaa Teeknikaa",
            qualification: "BSc Injinariingii Indastirii",
            experience: "Waggaa 6 ol hojii elektiroo-meekaanikaa keessatti muuxannoo qaba.",
          },
        ],
      },
      {
        __component: "sections.feature-grid",
        eyebrow: "Waan Nu Qajeelchu",
        heading: "Seera Afur Duuba Mala ASF.",
        items: [
          { title: "Qonnaan Bultoota Ijaan Ilaalu", text: "Furmaatawwan fedhii qonnaa madaalame irratti hundaa'u." },
          { title: "Saayinsawaa", text: "Ogummaan nyaataa fi oomishaa mala hojii deggeru." },
          { title: "Amanamaa", text: "Dhaabbatichi furmaata adeemsa qonnaa amanamaa dhiyeessuuf kaka'umsa qaba." },
          { title: "Guddina Yaaduu", text: "Dandeettii fi gareewwan daldalaa yeroo dheeraaf babal'achuuf karoorfamaniiru." },
        ],
      },
      {
        __component: "sections.feature-grid",
        eyebrow: "Akkaataa Nu Ijaaramne",
        heading: "Damee oomishaa fi raabsaa deeggaran.",
        items: [
          { title: "Faayinaansii fi Bulchiinsa", text: "Hojii dhaabbataa, herrega fi gibira deeggara." },
          { title: "Gabaasa, Gurgurtaa fi Guddina Daldalaa", text: "Raabsaa gara waldaalee, kooperetiivota, gurgurtoota gurguddaa fi daldaltoota gaggeessa." },
          { title: "Oomisha", text: "Oomisha nyaata beeladaa guyyuu Tulu Bolo keessatti gaggeessa." },
          { title: "Teeknikaa fi Tajaajila Waliigalaa", text: "Meeshaalee fi hojii elektiroo-meekaanikaa eeggata." },
          { title: "Bittaa", text: "Meeshaalee fi qabeenya oomishaaf barbaachisan dhiyeessa." },
        ],
      },
    ],
  },
};

const FACILITIES_PAGE_SEED = {
  title: "Facilities",
  slug: "facilities",
  sections: [
    {
      __component: "sections.intro",
      eyebrow: "Our Facilities",
      heading: "Two sites, one growing production platform.",
      body: "ASF operates from an operational factory in Tulu Bolo and is expanding into the Bulbula Integrated Agro Industry Park, adding capacity for the years ahead.",
    },
    {
      __component: "sections.story-panel",
      eyebrow: "Tulu Bolo Factory",
      heading: "The operational home of ASF's animal feed production.",
      bodyParagraph1:
        "Located in Tulu Bolo Town, South West Shoa Zone of Oromia Region, the factory currently produces at a combined capacity of 600 quintals per day across dairy, fattening and poultry feed. A warehouse at Welete, Sheger City, supports storage and distribution.",
      bodyParagraph2:
        "Production is planned to grow from 55,000 quintals in the next 3 months to 750,000 quintals by year three, across dairy, fattening, poultry and other livestock feed.",
      panelBadge: "Oromia, Ethiopia",
      panelTitle: "600 quintals/day current capacity.",
      panelText: "Growing toward a combined 750,000 quintals/year by year three of the production plan.",
    },
    {
      __component: "sections.stats-band",
      eyebrow: "Bulbula expansion",
      heading: "A world-class agro industry park, 160km south of Addis Ababa.",
      dark: true,
      stats: [
        { value: "271", label: "Hectares at the Bulbula site" },
        { value: "2021", label: "Park inaugurated" },
        { value: "2023", label: "ASF investment agreement signed" },
        { value: "160km", label: "South of Addis Ababa, near Zeway City" },
      ],
    },
    {
      __component: "sections.story-panel",
      eyebrow: "Expansion site",
      heading: "Bulbula Integrated Agro Industry Park.",
      bodyParagraph1:
        "ASF signed an investment agreement with the Bulbula Integrated Agro Industry Park (Oromia Industry Parks Development Corporation) in February 2023, securing a 271-hectare site 160km south of Addis Ababa, near Zeway City on the highway to Hawassa.",
      bodyParagraph2:
        "The park is fully electrified with reliable water supply, a waste water treatment plant, staff accommodation buildings and green areas, and hosts food oil, coffee & spices, meat, cereal and vegetable processing industries alongside ASF's planned expansion.",
      panelBadge: "271 hectares · Est. 2021",
      panelTitle: "A world-class integrated agro industry park.",
      panelText: "Purpose-built infrastructure supporting ASF's next phase of growth.",
    },
    {
      __component: "sections.feature-grid",
      eyebrow: "Technical capability",
      heading: "The team keeping production running.",
      items: [
        { title: "Technical & Electromechanical", text: "A dedicated technical team maintains equipment and electromechanical operations." },
        { title: "Production Operators", text: "Operators run day-to-day processing at Tulu Bolo." },
        { title: "Quality Control", text: "Quality controllers and lab technicians support production standards." },
      ],
    },
  ],
};

const FACILITIES_PAGE_LOCALIZED: Record<string, Record<string, unknown>> = {
  am: {
    title: "ተቋማት",
    sections: [
      {
        __component: "sections.intro",
        eyebrow: "ተቋሞቻችን",
        heading: "ሁለት ቦታዎች፣ አንድ እያደገ ያለ የምርት መድረክ።",
        body: "ASF በቱሉ ቦሎ ካለው ኦፕሬሽናል ፋብሪካ ይሰራል እና ወደ ቡልቡላ የተቀናጀ አግሮ ኢንዱስትሪ ፓርክ በማስፋፋት ላይ ነው፣ ለወደፊት ዓመታት አቅምን በመጨመር ላይ።",
      },
      {
        __component: "sections.story-panel",
        eyebrow: "የቱሉ ቦሎ ፋብሪካ",
        heading: "የASF የእንስሳት መኖ ምርት ኦፕሬሽናል መኖሪያ።",
        bodyParagraph1:
          "በቱሉ ቦሎ ከተማ፣ ደቡብ ምዕራብ ሸዋ ዞን፣ ኦሮሚያ ክልል የሚገኘው ፋብሪካ በአሁኑ ጊዜ በቀን 600 ኩንታል በወተት፣ ማድለብ እና የዶሮ መኖ ላይ ያመርታል። በወለቴ፣ ሸገር ከተማ የሚገኝ መጋዘን ማከማቻ እና ስርጭትን ይደግፋል።",
        bodyParagraph2:
          "ምርት ከሚቀጥሉት 3 ወራት 55,000 ኩንታል ወደ 750,000 ኩንታል በሦስተኛው ዓመት እንዲያድግ ታቅዷል፣ በወተት፣ ማድለብ፣ ዶሮ እና ሌሎች የእንስሳት መኖ ዘርፎች ውስጥ።",
        panelBadge: "ኦሮሚያ፣ ኢትዮጵያ",
        panelTitle: "በቀን 600 ኩንታል የአሁኑ አቅም።",
        panelText: "በምርት እቅዱ ሦስተኛ ዓመት ወደ 750,000 ኩንታል/ዓመት አጠቃላይ ማደግ።",
      },
      {
        __component: "sections.stats-band",
        eyebrow: "የቡልቡላ ማስፋፊያ",
        heading: "ከአዲስ አበባ 160 ኪ.ሜ ደቡብ የሚገኝ የዓለም ደረጃ የአግሮ ኢንዱስትሪ ፓርክ።",
        dark: true,
        stats: [
          { value: "271", label: "በቡልቡላ ቦታ ላይ ያሉ ሄክታሮች" },
          { value: "2021", label: "ፓርኩ የተመረቀበት" },
          { value: "2023", label: "የASF ኢንቨስትመንት ስምምነት የተፈረመበት" },
          { value: "160ኪ.ሜ", label: "ከአዲስ አበባ ደቡብ፣ ዘዋይ ከተማ አቅራቢያ" },
        ],
      },
      {
        __component: "sections.story-panel",
        eyebrow: "የማስፋፊያ ቦታ",
        heading: "ቡልቡላ የተቀናጀ አግሮ ኢንዱስትሪ ፓርክ።",
        bodyParagraph1:
          "ASF ከቡልቡላ የተቀናጀ አግሮ ኢንዱስትሪ ፓርክ (የኦሮሚያ ኢንዱስትሪ ፓርኮች ልማት ኮርፖሬሽን) ጋር በየካቲት 2023 የኢንቨስትመንት ስምምነት ተፈራርሟል፣ ከአዲስ አበባ በስተደቡብ 160 ኪ.ሜ፣ በዘዋይ ከተማ አቅራቢያ በሃዋሳ መንገድ ላይ የሚገኝ በ271 ሄክታር ቦታ አግኝቷል።",
        bodyParagraph2:
          "ፓርኩ ሙሉ በሙሉ የኤሌክትሪክ አገልግሎት ያለው፣ አስተማማኝ የውሃ አቅርቦት፣ የቆሻሻ ውሃ ማጣሪያ ተክል፣ የሰራተኞች መኖሪያ ህንፃዎች እና አረንጓዴ ቦታዎች ያሉት ሲሆን፣ ከASF የታቀደ ማስፋፊያ ጎን ለጎን የዘይት ማቀነባበሪያ፣ ቡናና ቅመማ ቅመም፣ ስጋ፣ እህል እና አትክልት ማቀነባበሪያ ኢንዱስትሪዎችን ያስተናግዳል።",
        panelBadge: "271 ሄክታር · ከ2021 ጀምሮ",
        panelTitle: "የዓለም ደረጃ የተቀናጀ አግሮ ኢንዱስትሪ ፓርክ።",
        panelText: "ለASF ቀጣይ የእድገት ደረጃ የተዘጋጀ መሠረተ ልማት።",
      },
      {
        __component: "sections.feature-grid",
        eyebrow: "ቴክኒካል አቅም",
        heading: "ምርትን ቀጣይነት ያለው የሚያደርገው ቡድን።",
        items: [
          { title: "ቴክኒካል እና ኤሌክትሮ መካኒካል", text: "የተወሰነ ቴክኒካል ቡድን መገልገያዎችን እና የኤሌክትሮ መካኒካል ስራዎችን ይጠብቃል።" },
          { title: "የምርት ኦፕሬተሮች", text: "ኦፕሬተሮች በቱሉ ቦሎ የቀን ተቀን ማቀነባበርን ያስኪያዳሉ።" },
          { title: "የጥራት ቁጥጥር", text: "የጥራት ተቆጣጣሪዎች እና የላብራቶሪ ቴክኒሻኖች የምርት ደረጃዎችን ይደግፋሉ።" },
        ],
      },
    ],
  },
  om: {
    title: "Dhaabbilee",
    sections: [
      {
        __component: "sections.intro",
        eyebrow: "Dhaabbilee Keenya",
        heading: "Bakka lama, waltajjii oomishaa tokko kan guddataa jiru.",
        body: "ASF warshaa hojiirra jiru Tulu Bolo keessaa hojjeta, Paarkii Warshaa Qonnaa Walitti Qindaa'e Bulbulaatti babal'achaa jira, dandeettii waggoota dhufaniif dabaluun.",
      },
      {
        __component: "sections.story-panel",
        eyebrow: "Warshaa Tulu Bolo",
        heading: "Mana hojii oomisha nyaata beeladaa ASF.",
        bodyParagraph1:
          "Magaalaa Tulu Bolo, Godina Shawaa Kibba Lixaa, Naannoo Oromiyaa keessatti argamu, warshaan kun yeroo ammaa guyyaatti kuintaalii 600 nyaata aannanii, coccoraa fi lukkuu walitti qindaa'ee oomisha.  Buufanni kuusaa Waleetee, Magaalaa Sheegar, kuusaa fi raabsaa deeggara.",
        bodyParagraph2:
          "Oomishni ji'oota 3 dhufan keessatti kuintaalii 55,000 irraa gara kuintaalii 750,000 waggaa sadaffaatti akka guddatu karoorfameera, damee nyaata aannanii, coccoraa, lukkuu fi kan biraa keessatti.",
        panelBadge: "Oromiyaa, Itoophiyaa",
        panelTitle: "Kuintaalii 600/guyyaa dandeettii ammaa.",
        panelText: "Waggaa sadaffaa karoora oomishaa keessatti gara kuintaalii 750,000/waggaa guddachaa.",
      },
      {
        __component: "sections.stats-band",
        eyebrow: "Babal'ina Bulbula",
        heading: "Paarkii warshaa qonnaa sadarkaa addunyaa, kiiloomeetira 160 kibba Finfinnee.",
        dark: true,
        stats: [
          { value: "271", label: "Heektaara bakka Bulbula" },
          { value: "2021", label: "Paarkichi kan eegale" },
          { value: "2023", label: "Walta'iinsi investimentii ASF mallatteeffame" },
          { value: "km 160", label: "Kibba Finfinnee, naannoo Magaalaa Zeeway" },
        ],
      },
      {
        __component: "sections.story-panel",
        eyebrow: "Bakka Babal'inaa",
        heading: "Paarkii Warshaa Qonnaa Walitti Qindaa'e Bulbula.",
        bodyParagraph1:
          "ASF Waltajjii Warshaa Qonnaa Walitti Qindaa'e Bulbula (Dhaabbata Guddina Warshaalee Oromiyaa) waliin Guraandhala 2023 walta'iinsa investimentii mallatteesse, bakka heektaara 271 kiiloomeetira 160 kibba Finfinnee, naannoo Magaalaa Zeeway karaa gara Hawaasaa argate.",
        bodyParagraph2:
          "Paarkichi guutummaatti ibsaa qabu, dhiyeessii bishaanii amanamaa, dhaabbata qulqulleessituu bishaan xurii, buufata jireenyaa hojjettootaa fi naannoo magariisaa qaba, akkasumas dameewwan oomisha zayitaa nyaataa, buna fi urgooftuu, foonii, midhaanii fi muduraa babal'ina ASF waliin qabata.",
        panelBadge: "Heektaara 271 · Bara 2021 irraa",
        panelTitle: "Paarkii warshaa qonnaa walitti qindaa'e sadarkaa addunyaa.",
        panelText: "Bu'uura ijaarsaa marsaa guddina itti aanu ASF deeggaru.",
      },
      {
        __component: "sections.feature-grid",
        eyebrow: "Dandeettii Teeknikaa",
        heading: "Garee oomisha itti fufiinsaan geggeessu.",
        items: [
          { title: "Teeknikaa fi Elektiroo-Meekaanikaa", text: "Gareen teeknikaa addaa meeshaalee fi hojii elektiroo-meekaanikaa eegu." },
          { title: "Hojjettoota Oomishaa", text: "Hojjettoonni Tulu Bolo keessatti adeemsa guyyuu geggeessu." },
          { title: "Toohannaa Qulqullina", text: "Toohattoonni qulqullinaa fi ogeeyyiin laaboraatorii sadarkaa oomishaa deeggaru." },
        ],
      },
    ],
  },
};

const QUALITY_PAGE_SEED = {
  title: "Quality & Safety",
  slug: "quality",
  sections: [
    {
      __component: "sections.intro",
      eyebrow: "Quality & Safety",
      heading: "Scientific standards behind every batch.",
      body: "ASF's production is guided by qualified nutritionists and quality control staff, applying scientific and reliable methods across the feed production process.",
    },
    {
      __component: "sections.feature-grid",
      eyebrow: "How we maintain quality",
      heading: "Roles dedicated to quality across production.",
      items: [
        { title: "Quality Control & Lab", text: "Quality controllers and lab technicians support testing and production standards." },
        { title: "Production Supervision", text: "A production supervisor and technical team oversee day-to-day operations." },
      ],
    },
    {
      __component: "sections.mission",
      heading: "Our quality commitment",
      body: "Every batch reflects ASF's scientific and reliable approach to agro-processing, assessed against real farmer and livestock needs rather than industry defaults.",
    },
    {
      __component: "sections.intro",
      eyebrow: "Certifications",
      heading: "Building toward formal certification.",
      body: "As ASF's quality systems mature, formal certifications will be published here.",
    },
  ],
};

const QUALITY_PAGE_LOCALIZED: Record<string, Record<string, unknown>> = {
  am: {
    title: "ጥራት እና ደህንነት",
    sections: [
      {
        __component: "sections.intro",
        eyebrow: "ጥራት እና ደህንነት",
        heading: "ከእያንዳንዱ ምርት ጀርባ ያለ ሳይንሳዊ ደረጃ።",
        body: "የASF ምርት ብቁ በሆኑ የስነ-ምግብ ባለሙያዎች እና የጥራት ቁጥጥር ሰራተኞች ይመራል፣ በመኖ ምርት ሂደት ውስጥ ሳይንሳዊ እና አስተማማኝ ዘዴዎችን በመተግበር።",
      },
      {
        __component: "sections.feature-grid",
        eyebrow: "ጥራትን እንዴት እንደምንጠብቅ",
        heading: "በምርት ውስጥ ለጥራት የተሰጡ ሚናዎች።",
        items: [
          { title: "የጥራት ቁጥጥር እና ላብራቶሪ", text: "የጥራት ተቆጣጣሪዎች እና የላብራቶሪ ቴክኒሻኖች ምርመራን እና የምርት ደረጃዎችን ይደግፋሉ።" },
          { title: "የምርት ቁጥጥር", text: "የምርት ተቆጣጣሪ እና ቴክኒካል ቡድን የቀን ተቀን ስራዎችን ይቆጣጠራሉ።" },
        ],
      },
      {
        __component: "sections.mission",
        heading: "የጥራት ቁርጠኝነታችን",
        body: "እያንዳንዱ ምርት የASF ሳይንሳዊ እና አስተማማኝ የግብርና ማቀነባበሪያ አካሄድን ያንጸባርቃል፣ ከኢንዱስትሪ ነባሪ ደረጃዎች ይልቅ በእውነተኛ የአርሶ አደር እና የእንስሳት ፍላጎቶች ላይ ተመዝኖ።",
      },
      {
        __component: "sections.intro",
        eyebrow: "ሰርተፊኬቶች",
        heading: "መደበኛ ሰርተፊኬት ወደ ማግኘት እየገሰገስን ነው።",
        body: "የASF የጥራት ስርዓቶች እየበሰሉ ሲሄዱ፣ መደበኛ ሰርተፊኬቶች እዚህ ይታተማሉ።",
      },
    ],
  },
  om: {
    title: "Qulqullina fi Nageenya",
    sections: [
      {
        __component: "sections.intro",
        eyebrow: "Qulqullina fi Nageenya",
        heading: "Sadarkaa saayinsawaa duuba oomisha hunda jiru.",
        body: "Oomishni ASF ogeeyyii nyaataa fi hojjettoota toohannaa qulqullinaa ogummaa qabaniin qajeelfamaa, adeemsa oomisha nyaataa keessatti mala saayinsawaa fi amanamaa fayyadamuun.",
      },
      {
        __component: "sections.feature-grid",
        eyebrow: "Akkaataa qulqullina itti eegnu",
        heading: "Gahee qulqullinaaf kennaman oomisha keessatti.",
        items: [
          { title: "Toohannaa Qulqullinaa fi Laaboraatorii", text: "Toohattoonni qulqullinaa fi ogeeyyiin laaboraatorii qorannoo fi sadarkaa oomishaa deeggaru." },
          { title: "To'annaa Oomishaa", text: "To'ataan oomishaa fi gareen teeknikaa hojii guyyuu to'atu." },
        ],
      },
      {
        __component: "sections.mission",
        heading: "Kakuu Qulqullina Keenya",
        body: "Oomishni hundi mala adeemsa qonnaa saayinsawaa fi amanamaa ASF kan agarsiisu, fedhii qonnaan bultootaa fi beeladaa dhugaa irratti madaalame malee sadarkaa indastirii dhaabaa irratti hin hundoofne.",
      },
      {
        __component: "sections.intro",
        eyebrow: "Ragaawwan",
        heading: "Ragaa dhugaa gara argachuu deemaa jira.",
        body: "Sirni qulqullina ASF guddachaa yommuu deemu, ragaawwan dhugaa asitti maxxanfamu.",
      },
    ],
  },
};

const SUSTAINABILITY_PAGE_SEED = {
  title: "Sustainability",
  slug: "sustainability",
  sections: [
    {
      __component: "sections.intro",
      eyebrow: "Sustainability",
      heading: "Growth that supports farmers, workers and the environment.",
      body: "ASF's expansion is built around job creation, environmental protection and support for Ethiopia's livestock farmers.",
    },
    {
      __component: "sections.stats-band",
      eyebrow: "Local employment",
      heading: "Jobs created, with real gender representation.",
      dark: false,
      stats: [
        { value: "51", label: "Direct jobs at Tulu Bolo (36 men, 15 women)" },
        { value: "465", label: "People engaged across the value chain (305 men, 160 women)" },
        { value: "300", label: "Livestock farmers & businesses reached through distribution" },
      ],
    },
    {
      __component: "sections.feature-grid",
      eyebrow: "Environmental responsibility",
      heading: "Protecting the land ASF operates on.",
      items: [
        {
          title: "Tree planting",
          text: "ASF has carried out tree-planting activities at its factory sites as part of environmental protection efforts.",
        },
        {
          title: "Waste water treatment",
          text: "The Bulbula Integrated Agro Industry Park includes a dedicated waste water treatment plant.",
        },
        { title: "Green infrastructure", text: "Bulbula's park design includes green areas alongside its production facilities." },
      ],
    },
    {
      __component: "sections.feature-grid",
      eyebrow: "Supporting the value chain",
      heading: "Reaching farmers through a wide distribution network.",
      items: [
        { title: "Farmers' unions & cooperatives", text: "Products reach organized farmer groups through direct distribution." },
        { title: "Wholesalers & retailers", text: "A wholesale and retail network extends reach to individual and commercial farmers." },
        { title: "Direct to farmers", text: "ASF also supplies farmers and households directly." },
      ],
    },
  ],
};

const SUSTAINABILITY_PAGE_LOCALIZED: Record<string, Record<string, unknown>> = {
  am: {
    title: "ዘላቂነት",
    sections: [
      {
        __component: "sections.intro",
        eyebrow: "ዘላቂነት",
        heading: "አርሶ አደሮችን፣ ሰራተኞችን እና አካባቢን የሚደግፍ እድገት።",
        body: "የASF ማስፋፊያ በስራ እድል ፈጠራ፣ በአካባቢ ጥበቃ እና ለኢትዮጵያ የእንስሳት አርሶ አደሮች ድጋፍ ላይ የተመሰረተ ነው።",
      },
      {
        __component: "sections.stats-band",
        eyebrow: "የአካባቢ ስራ ስምሪት",
        heading: "የተፈጠሩ የስራ እድሎች፣ በእውነተኛ የፆታ ውክልና።",
        dark: false,
        stats: [
          { value: "51", label: "በቱሉ ቦሎ ቀጥተኛ የስራ እድሎች (36 ወንዶች፣ 15 ሴቶች)" },
          { value: "465", label: "በእሴት ሰንሰለቱ የተሳተፉ ሰዎች (305 ወንዶች፣ 160 ሴቶች)" },
          { value: "300", label: "በስርጭት የተደረሱ የእንስሳት አርሶ አደሮች እና ንግዶች" },
        ],
      },
      {
        __component: "sections.feature-grid",
        eyebrow: "የአካባቢ ኃላፊነት",
        heading: "ASF የሚሰራበትን መሬት መጠበቅ።",
        items: [
          { title: "የዛፍ ተከላ", text: "ASF በአካባቢ ጥበቃ ጥረቶች አካል በፋብሪካ ቦታዎቹ የዛፍ ተከላ ስራዎችን አካሂዷል።" },
          { title: "የቆሻሻ ውሃ ማጣሪያ", text: "ቡልቡላ የተቀናጀ አግሮ ኢንዱስትሪ ፓርክ የተለየ የቆሻሻ ውሃ ማጣሪያ ተክል ያካትታል።" },
          { title: "አረንጓዴ መሠረተ ልማት", text: "የቡልቡላ ፓርክ ንድፍ ከምርት ተቋማቱ ጎን ለጎን አረንጓዴ ቦታዎችን ያካትታል።" },
        ],
      },
      {
        __component: "sections.feature-grid",
        eyebrow: "የእሴት ሰንሰለቱን መደገፍ",
        heading: "በሰፊ የስርጭት መረብ አርሶ አደሮችን መድረስ።",
        items: [
          { title: "የአርሶ አደር ማህበራት እና ህብረት ስራ ማህበራት", text: "ምርቶች በቀጥታ ስርጭት የተደራጁ የአርሶ አደር ቡድኖችን ይደርሳሉ።" },
          { title: "የጅምላ እና ችርቻሮ ነጋዴዎች", text: "የጅምላ እና ችርቻሮ መረብ ለግል እና ለንግድ አርሶ አደሮች ተደራሽነትን ያሰፋል።" },
          { title: "በቀጥታ ለአርሶ አደሮች", text: "ASF እንዲሁም በቀጥታ ለአርሶ አደሮች እና ለቤተሰቦች ያቀርባል።" },
        ],
      },
    ],
  },
  om: {
    title: "Itti Fufiinsa",
    sections: [
      {
        __component: "sections.intro",
        eyebrow: "Itti Fufiinsa",
        heading: "Guddina qonnaan bultoota, hojjettootaa fi naannoo deeggaru.",
        body: "Babal'inni ASF hojii uumuu, eegumsa naannoo fi deeggarsa qonnaan bultoota beeladaa Itoophiyaa irratti ijaarame.",
      },
      {
        __component: "sections.stats-band",
        eyebrow: "Hojii Naannoo",
        heading: "Hojiiwwan uumaman, bakka bu'iinsa saala dhugaa waliin.",
        dark: false,
        stats: [
          { value: "51", label: "Hojii kallattii Tulu Bolo (dhiira 36, dubartoota 15)" },
          { value: "465", label: "Namoota sarara gatii keessatti hirmaatan (dhiira 305, dubartoota 160)" },
          { value: "300", label: "Qonnaan bultoota beeladaa fi daldaltoota raabsaadhaan ga'aman" },
        ],
      },
      {
        __component: "sections.feature-grid",
        eyebrow: "Itti Gaafatamummaa Naannoo",
        heading: "Lafa ASF irratti hojjetu eeguu.",
        items: [
          { title: "Mukaa Dhaabuu", text: "ASF hojii mukaa dhaabuu bakkoota warshaa isaa keessatti akka gahee eegumsa naannoo taasiseera." },
          { title: "Qulqulleessituu Bishaan Xurii", text: "Paarkiin Warshaa Qonnaa Walitti Qindaa'e Bulbula dhaabbata qulqulleessituu bishaan xurii addaa qaba." },
          { title: "Bu'uura Magariisaa", text: "Naqannoon Paarkii Bulbula bakkoota magariisaa dhaabbilee oomishaa waliin qaba." },
        ],
      },
      {
        __component: "sections.feature-grid",
        eyebrow: "Sarara Gatii Deeggaruu",
        heading: "Qonnaan bultoota network raabsaa bal'aan ga'uu.",
        items: [
          { title: "Waldaalee fi Kooperetiivota Qonnaan Bultootaa", text: "Oomishni raabsaa kallattiin garee qonnaan bultoota ijaaraman ga'a." },
          { title: "Daldaltoota Gurguddaa fi Gurgurtaa", text: "Networkiin daldalaa gurguddaa fi gurgurtaa qonnaan bultoota dhuunfaa fi daldalaa ga'uu balbaleessa." },
          { title: "Kallattiin Qonnaan Bultootaaf", text: "ASF kallattiinis qonnaan bultootaa fi maatiiwwaniif dhiyeessa." },
        ],
      },
    ],
  },
};

const CROP_RESIDUE_PAGE_SEED = {
  title: "Crop Residue Feed",
  slug: "crop-residue-feed",
  sections: [
    {
      __component: "sections.hero",
      eyebrow: "Biofermentation Technology",
      headingLine1: "Crop Residue Feed.",
      headingLine2: "Turning residues into feed.",
      subtitle: "Turning crop residues into high-quality animal feed.",
      primaryButtonLabel: "Partner with us →",
      primaryButtonHref: "/contact",
      imageStyle: "logo-3d",
    },
    {
      __component: "sections.intro",
      eyebrow: "The Challenge",
      heading: "Crop residues are already a vital feed source — but their quality is limited.",
      body:
        "Livestock systems across Sub-Saharan Africa and South Asia rely heavily on low-quality cereal crop residues such as rice and wheat straw, which limits productivity and drives high methane emissions. Higher-quality forage crops are often impractical due to land constraints, and poor logistics and high collection costs mean much of the residue is burned instead of used — wasting resources and polluting the air.",
    },
    {
      __component: "sections.story-panel",
      eyebrow: "Project Overview",
      heading: "Turning residues into a scalable feed business.",
      bodyParagraph1:
        "Effective biochemical treatments for improving crop residues already exist, but remain underused on farms due to socioeconomic and logistical barriers. This project promotes scalable business models where enterprises collect and treat residues off-farm, then sell the improved feed to farmers — aligning more closely with farmer preferences and capacities.",
      bodyParagraph2:
        "Through field trials and systems analysis, the project quantifies these benefits to support climate goals and strengthen farming systems in Ethiopia and Nepal.",
      panelBadge: "June 2025 – May 2027",
      panelTitle: "A two-country pilot backed by real field data.",
      panelText:
        "Funded by the Climate and Clean Air Coalition, a UNEP-convened initiative, and led by the World Resources Institute and the International Livestock Research Institute.",
    },
    {
      __component: "sections.feature-grid",
      eyebrow: "Our approach",
      heading: "Three outcomes driving this project.",
      items: [
        { icon: "🌿", title: "Sustainable Feed" },
        { icon: "🐄", title: "Healthy Animals" },
        { icon: "🌍", title: "Better Future" },
      ],
    },
    {
      __component: "sections.rich-text",
      eyebrow: "Project Activities",
      heading: "What the project is doing.",
      width: "wide",
      content: [
        {
          type: "list",
          format: "unordered",
          children: [
            {
              type: "list-item",
              children: [
                {
                  type: "text",
                  text: "Engage local stakeholders in Ethiopia and Nepal by involving government agencies, researchers, cooperatives, and private sector actors through workshops and training during project planning and implementation.",
                },
              ],
            },
            {
              type: "list-item",
              children: [
                {
                  type: "text",
                  text: "Pilot innovative feed technologies in collaboration with local feed manufacturers, and raise awareness among existing and potential entrepreneurs by providing training on crop residue-based feed production. Develop credible scenarios for local businesses to produce crop residue-based feed.",
                },
              ],
            },
            {
              type: "list-item",
              children: [
                {
                  type: "text",
                  text: "Develop self-sustaining business models by integrating real-time project data, desk research, collaboration with local partners, and insights from other aligned initiatives.",
                },
              ],
            },
            {
              type: "list-item",
              children: [
                {
                  type: "text",
                  text: "Advocate for the integration of feed quality traits into crop breeding programs by collaborating with breeding institutions to promote dual-purpose crops that support both food and livestock feed needs.",
                },
              ],
            },
            {
              type: "list-item",
              children: [
                {
                  type: "text",
                  text: "Quantify the environmental and economic benefits of improved crop residue use through emissions modeling, productivity assessments, and cost-benefit analyses to inform national climate strategies.",
                },
              ],
            },
            {
              type: "list-item",
              children: [
                {
                  type: "text",
                  text: "Develop and disseminate project findings as actionable recommendations to inform policy and investment decisions, enabling the scaling and replication of efficient crop residue-based feed interventions across the regions.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      __component: "sections.stats-band",
      eyebrow: "Why it matters",
      heading: "Ethiopia's enteric methane intensity is nearly 8x the USA's, per unit of feed calories (2022).",
      dark: true,
      stats: [
        { value: "1", label: "USA — enteric methane intensity, gCO2e/1000 kCal (2022)" },
        { value: "3.5", label: "Global average — enteric methane intensity, gCO2e/1000 kCal (2022)" },
        { value: "6.2", label: "Nepal — enteric methane intensity, gCO2e/1000 kCal (2022)" },
        { value: "7.8", label: "Ethiopia — enteric methane intensity, gCO2e/1000 kCal (2022)" },
      ],
    },
    {
      __component: "sections.feature-grid",
      eyebrow: "Key messages",
      heading: "Why better feed matters.",
      items: [
        {
          title: "Farmer livelihoods first",
          text: "Better feed leads to healthier animals, higher milk and meat yields, and more stable incomes for smallholder farmers.",
        },
        {
          title: "Untapped nutritional value",
          text: "Crop residues are already a vital feed source, but their digestibility and nutritional value are limited — biochemical treatment or genetic approaches can unlock significant productivity gains.",
        },
        {
          title: "Locally driven business models",
          text: "Interventions must focus on building self-sustaining, locally driven business models that make improved feed solutions accessible and scalable.",
        },
        {
          title: "A better future",
          text: "Producing more food on the same land while reducing methane emissions per unit of output supports both climate action and food security.",
        },
      ],
    },
    {
      __component: "sections.intro",
      eyebrow: "Expected Outcomes",
      heading: "What success looks like by the end of the project.",
      body:
        "Smallholder and commercial farmers will realize the benefits of increased productivity and income, and new business opportunities will emerge around residue treatment. Policymakers will have access to robust evidence supporting the integration of feed quality into agricultural and climate strategies.",
    },
    {
      __component: "sections.columns-block",
      eyebrow: "In collaboration with",
      heading: "Delivered together with leading research institutions.",
      columns: [
        { heading: "ILRI", text: "International Livestock Research Institute" },
        { heading: "WRI", text: "World Resources Institute" },
        {
          heading: "CCAC",
          text: "Climate and Clean Air Coalition — a UNEP-convened initiative funding this project.",
        },
      ],
    },
  ],
};

const CROP_RESIDUE_PAGE_LOCALIZED: Record<string, Record<string, unknown>> = {
  am: {
    title: "የሰብል ቀሪት መኖ",
    sections: [
      {
        __component: "sections.hero",
        eyebrow: "ባዮ-ፈርመንቴሽን ቴክኖሎጂ",
        headingLine1: "የሰብል ቀሪት መኖ።",
        headingLine2: "ቀሪትን ወደ መኖ እንቀይራለን።",
        subtitle: "የሰብል ቀሪትን ወደ ከፍተኛ ጥራት ያለው የእንስሳት መኖ እንቀይራለን።",
        primaryButtonLabel: "ከእኛ ጋር ተባበሩ →",
        primaryButtonHref: "/contact",
        imageStyle: "logo-3d",
      },
      {
        __component: "sections.intro",
        eyebrow: "ተግዳሮት",
        heading: "የሰብል ቀሪት አስቀድሞ ወሳኝ የመኖ ምንጭ ነው — ጥራቱ ግን ውስን ነው።",
        body:
          "በሰሃራ በታች አፍሪካ እና በደቡብ እስያ የሚገኙ የእንስሳት እርባታ ስርዓቶች እንደ ሩዝ እና ስንዴ ገለባ ባሉ ዝቅተኛ ጥራት ያላቸው የሰብል ቀሪቶች ላይ በእጅጉ ይመሰረታሉ፣ ይህም ምርታማነትን ይገድባል እና ከፍተኛ የሚቴን ልቀት ያስከትላል። የተሻለ ጥራት ያላቸው የግጦሽ ሰብሎች በመሬት ውስንነት ምክንያት ብዙ ጊዜ የማይተገበሩ ናቸው፣ እንዲሁም ደካማ ሎጅስቲክስ እና ከፍተኛ የመሰብሰብ ወጪ ብዙዎቹ ቀሪቶች ከመጠቀም ይልቅ እንዲቃጠሉ ያደርጋል — ሀብት እያባከነ እና አየር እየበከለ።",
      },
      {
        __component: "sections.story-panel",
        eyebrow: "የፕሮጀክት አጠቃላይ እይታ",
        heading: "ቀሪትን ወደ ስፍር የሚስፋ የመኖ ስራ መቀየር።",
        bodyParagraph1:
          "የሰብል ቀሪቶችን ለማሻሻል ውጤታማ የባዮ-ኬሚካል ሕክምናዎች አስቀድሞ አሉ፣ ነገር ግን በማህበራዊ-ኢኮኖሚያዊ እና ሎጂስቲክ እንቅፋቶች ምክንያት በእርሻ ላይ አነስተኛ አጠቃቀም አላቸው። ይህ ፕሮጀክት ድርጅቶች ቀሪቶችን ከእርሻ ውጭ ሰብስበው አክመው ለአርሶ አደሮች የተሻሻለውን መኖ የሚሸጡበት ስፍር የሚስፋ የስራ ሞዴሎችን ያበረታታል — ይህም ከአርሶ አደር ምርጫ እና አቅም ጋር በቅርበት ይጣጣማል።",
        bodyParagraph2:
          "በሜዳ ሙከራዎች እና በስርዓት ትንተና በኩል፣ ፕሮጀክቱ በኢትዮጵያ እና ኔፓል የአየር ንብረት ግቦችን ለመደገፍ እና የግብርና ስርዓቶችን ለማጠናከር እነዚህን ጥቅሞች ይለካል።",
        panelBadge: "ሰኔ 2025 – ግንቦት 2027",
        panelTitle: "በእውነተኛ የሜዳ መረጃ የተደገፈ የሁለት ሀገር የሙከራ ፕሮጀክት።",
        panelText:
          "በተባበሩት መንግስታት ድርጅት አካባቢ ጥበቃ ፕሮግራም (UNEP) የተመቻቸ ተነሳሽነት በሆነው የአየር ንብረት እና ንፁህ አየር ጥምረት የተደገፈ፣ በዓለም ሀብቶች ተቋም እና በአለምአቀፍ የእንስሳት ምርምር ተቋም የሚመራ።",
      },
      {
        __component: "sections.feature-grid",
        eyebrow: "አካሄዳችን",
        heading: "ይህን ፕሮጀክት የሚያንቀሳቅሱ ሦስት ውጤቶች።",
        items: [
          { icon: "🌿", title: "ዘላቂ መኖ" },
          { icon: "🐄", title: "ጤናማ እንስሳት" },
          { icon: "🌍", title: "የተሻለ ነገ" },
        ],
      },
      {
        __component: "sections.rich-text",
        eyebrow: "የፕሮጀክት ተግባራት",
        heading: "ፕሮጀክቱ የሚሰራው ምንድን ነው።",
        width: "wide",
        content: [
          {
            type: "list",
            format: "unordered",
            children: [
              {
                type: "list-item",
                children: [
                  {
                    type: "text",
                    text: "በኢትዮጵያ እና ኔፓል የመንግስት ተቋማትን፣ ተመራማሪዎችን፣ ኅብረት ስራ ማህበራትን እና የግል ዘርፍ ተዋንያንን በስልጠናዎች እና በአውደ ጥናቶች በኩል በፕሮጀክት እቅድ እና ትግበራ ወቅት በማሳተፍ የአካባቢ ባለድርሻ አካላትን ማሳተፍ።",
                  },
                ],
              },
              {
                type: "list-item",
                children: [
                  {
                    type: "text",
                    text: "ከአካባቢያዊ የመኖ አምራቾች ጋር በመተባበር ፈጠራ የመኖ ቴክኖሎጂዎችን መሞከር፣ እና ስለ ሰብል ቀሪት-ተኮር የመኖ ምርት ስልጠና በመስጠት በአሁኑ እና በሚፈለጉ ስራ ፈጣሪዎች መካከል ግንዛቤን ማሳደግ። ለአካባቢያዊ ስራዎች ሰብል ቀሪት-ተኮር መኖ ለማምረት አስተማማኝ ሁኔታዎችን ማዘጋጀት።",
                  },
                ],
              },
              {
                type: "list-item",
                children: [
                  {
                    type: "text",
                    text: "የቅርብ ጊዜ የፕሮጀክት መረጃን፣ የጠረጴዛ ምርምርን፣ ከአካባቢያዊ አጋሮች ጋር መተባበርን እና ከሌሎች የተጣጣሙ ተነሳሽነቶች የተገኙ ግንዛቤዎችን በማካተት ራሳቸውን የሚደግፉ የስራ ሞዴሎችን ማዘጋጀት።",
                  },
                ],
              },
              {
                type: "list-item",
                children: [
                  {
                    type: "text",
                    text: "ሁለቱንም የምግብ እና የእንስሳት መኖ ፍላጎቶች የሚደግፉ ድርብ-አገልግሎት ሰብሎችን ለማስተዋወቅ ከዘር ማሻሻያ ተቋማት ጋር በመተባበር የመኖ ጥራት ባህሪያትን ወደ ሰብል ዘር ማሻሻያ ፕሮግራሞች ማካተትን መደገፍ።",
                  },
                ],
              },
              {
                type: "list-item",
                children: [
                  {
                    type: "text",
                    text: "ብሔራዊ የአየር ንብረት ስትራቴጂዎችን ለማሳወቅ በልቀት ሞዴሊንግ፣ በምርታማነት ግምገማዎች እና በወጪ-ጥቅም ትንተናዎች የተሻሻለ የሰብል ቀሪት አጠቃቀም የአካባቢ እና የኢኮኖሚ ጥቅሞችን መለካት።",
                  },
                ],
              },
              {
                type: "list-item",
                children: [
                  {
                    type: "text",
                    text: "በክልሎች ውስጥ ቀልጣፋ የሰብል ቀሪት-ተኮር የመኖ ጣልቃገብነቶችን ማስፋትና መድገምን የሚያስችል የፖሊሲ እና የኢንቨስትመንት ውሳኔዎችን ለማሳወቅ የፕሮጀክት ግኝቶችን እንደ ተግባራዊ ምክሮች ማዘጋጀትና ማሰራጨት።",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        __component: "sections.stats-band",
        eyebrow: "ለምን አስፈላጊ እንደሆነ",
        heading: "ኢትዮጵያ የዩኤስኤ ወደ ገደማ 8 ጊዜ የሚደርስ የሚቴን ልቀት ጥግግት አላት፣ በክፍል የመኖ ካሎሪ (2022)።",
        dark: true,
        stats: [
          { value: "1", label: "ዩኤስኤ — የሚቴን ልቀት ጥግግት፣ gCO2e/1000 kCal (2022)" },
          { value: "3.5", label: "አለምአቀፍ አማካይ — የሚቴን ልቀት ጥግግት፣ gCO2e/1000 kCal (2022)" },
          { value: "6.2", label: "ኔፓል — የሚቴን ልቀት ጥግግት፣ gCO2e/1000 kCal (2022)" },
          { value: "7.8", label: "ኢትዮጵያ — የሚቴን ልቀት ጥግግት፣ gCO2e/1000 kCal (2022)" },
        ],
      },
      {
        __component: "sections.feature-grid",
        eyebrow: "ቁልፍ መልዕክቶች",
        heading: "የተሻለ መኖ ለምን አስፈላጊ ነው።",
        items: [
          {
            title: "አርሶ አደር ህይወት መጀመሪያ",
            text: "የተሻለ መኖ ወደ ጤናማ እንስሳት፣ ከፍተኛ የወተትና ስጋ ምርት እና ለአነስተኛ አርሶ አደሮች የተሻለ የገቢ መረጋጋት ይመራል።",
          },
          {
            title: "ያልተነካ የምግብ ንብረት",
            text: "የሰብል ቀሪቶች አስቀድሞ ወሳኝ የመኖ ምንጭ ናቸው፣ ነገር ግን የመዋሃድ እና የምግብ ንብረት ደረጃቸው ውስን ነው — የባዮ-ኬሚካል ሕክምና ወይም የዘር ማሻሻያ ስልቶች ከፍተኛ የምርታማነት ጥቅም ይክፍታሉ።",
          },
          {
            title: "በአካባቢ የሚመሩ የስራ ሞዴሎች",
            text: "ጣልቃገብነቶች የተሻሻለ የመኖ መፍትሄዎችን ተደራሽ እና ስፍር የሚስፋ የሚያደርጉ ራሳቸውን የሚደግፉ፣ በአካባቢ የሚመሩ የስራ ሞዴሎችን በመገንባት ላይ ማተኮር አለባቸው።",
          },
          {
            title: "የተሻለ ተስፋ",
            text: "በተመሳሳይ መሬት ላይ ተጨማሪ ምግብ ማምረት እና በክፍል ምርት የሚቴን ልቀትን መቀነስ ሁለቱንም የአየር ንብረት ተግባርና የምግብ ዋስትና ይደግፋል።",
          },
        ],
      },
      {
        __component: "sections.intro",
        eyebrow: "የሚጠበቁ ውጤቶች",
        heading: "በፕሮጀክቱ መጨረሻ ስኬት ምን ይመስላል።",
        body:
          "አነስተኛ እና የንግድ አርሶ አደሮች ከጨመረ ምርታማነትና ገቢ ጥቅም ያገኛሉ፣ እና በቀሪት ሕክምና ዙሪያ አዳዲስ የስራ አጋጣሚዎች ይፈጠራሉ። ፖሊሲ አውጪዎች የመኖ ጥራትን ወደ ግብርና እና የአየር ንብረት ስትራቴጂዎች ለማካተት የሚደግፍ ጠንካራ ማስረጃ ያገኛሉ።",
      },
      {
        __component: "sections.columns-block",
        eyebrow: "በጋራ ስራ",
        heading: "ከግንባር ቀደም የምርምር ተቋማት ጋር የሚከናወን።",
        columns: [
          { heading: "ILRI", text: "አለምአቀፍ የእንስሳት ምርምር ተቋም" },
          { heading: "WRI", text: "የዓለም ሀብቶች ተቋም" },
          { heading: "CCAC", text: "የአየር ንብረት እና ንፁህ አየር ጥምረት — ይህን ፕሮጀክት የሚደግፍ በUNEP የተመቻቸ ተነሳሽነት።" },
        ],
      },
    ],
  },
  om: {
    title: "Nyaata Hambaa Midhaanii",
    sections: [
      {
        __component: "sections.hero",
        eyebrow: "Teeknooloojii Baayoo-Foormenteeshinii",
        headingLine1: "Nyaata Hambaa Midhaanii.",
        headingLine2: "Hambaa gara nyaataatti jijjiiruu.",
        subtitle: "Hambaa midhaanii gara nyaata beelladaa qulqullina olaanaa qabuutti jijjiiruu.",
        primaryButtonLabel: "Nu waliin michoomaa →",
        primaryButtonHref: "/contact",
        imageStyle: "logo-3d",
      },
      {
        __component: "sections.intro",
        eyebrow: "Rakkoo",
        heading: "Hambaan midhaanii duraan dursee madda nyaataa barbaachisaa dha — garuu qulqullinni isaa daangeffamaa dha.",
        body:
          "Sirni beelladaa Afrikaa Kibba-Saharaa fi Eeshiyaa Kibbaa keessatti argamu hambaa midhaanii qulqullina gadi aanaa akka cidii ruuzii fi qamadii irratti guddaa hirkata, kunis oomisha daangessee dhibbaa methane guddaa fida. Midhaan nyaataa qulqullina olaanaa qaban baay'inaan daangaa lafaa sababa isaan hin danda'amne. Kanaan alatti, loojistiksii hin gaarii fi gatii walitti qabuu olaanaan hambaan baay'een isaa gubamuu qofa mala — qabeenya balleessuu fi qilleensa xureessuu.",
      },
      {
        __component: "sections.story-panel",
        eyebrow: "Ilaalcha Waliigalaa Pirojeektii",
        heading: "Hambaa gara daldala nyaataa babal'isuu danda'uu jijjiiruu.",
        bodyParagraph1:
          "Yaalii baayoo-keemikaalaa hambaa midhaanii fooyyessuuf gargaaran duraan jiru, garuu rakkoolee hawaasa-dinagdee fi loojistiksii sababaa qonnaan bultoota biratti fayyadamni isaan xiqqaa dha. Pirojeektiin kun daldaltoonni hambaa qabeenya qonnaa alaa walitti qabanii fooyyessanii, ergasii nyaata fooyya'e qonnaan bultootaaf gurguran maodeela daldalaa babal'isuu danda'u kaka'umsa taasisa — kunis fedhii fi dandeettii qonnaan bultoota waliin walsimuu caalaatti dhugoomsa.",
        bodyParagraph2:
          "Qorannoo dirree fi xiinxala sirna keessaan, pirojeektiin kun bu'aawwan kanneen Itoophiyaa fi Nepaal keessatti kaayyoowwan qilleensaaf deeggaruu fi sirna qonnaa jabeessuuf safara.",
        panelBadge: "Waxabajjii 2025 – Caamsaa 2027",
        panelTitle: "Yaalii biyyoota lama, ragaa dirree dhugaa irratti hundaa'e.",
        panelText:
          "Tumsa Qilleensaa fi Qilleensa Qulqulluu, kaka'umsa UNEP-n qindaa'e, waliin Dhaabbata Qabeenya Addunyaa fi Dhaabbata Qorannoo Beelladaa Addunyaa hoogganamu.",
      },
      {
        __component: "sections.feature-grid",
        eyebrow: "Mala Keenya",
        heading: "Bu'aa sadii pirojeektii kana kan geggeessu.",
        items: [
          { icon: "🌿", title: "Nyaata Itti Fufiinsa Qabu" },
          { icon: "🐄", title: "Beelladoota Fayyaa Qaban" },
          { icon: "🌍", title: "Fuulduraa Gaarii" },
        ],
      },
      {
        __component: "sections.rich-text",
        eyebrow: "Hojiiwwan Pirojeektii",
        heading: "Pirojeektiin kun maal hojjechaa jira.",
        width: "wide",
        content: [
          {
            type: "list",
            format: "unordered",
            children: [
              {
                type: "list-item",
                children: [
                  {
                    type: "text",
                    text: "Dhaabbilee mootummaa, qorattoota, kooperatiivota fi hirmaattota sektera dhuunfaa leenjii fi kutaa hojii karaa yeroo karoorfamu fi hojiirra oolutti hirmaachisuun hirmaattota naannoo Itoophiyaa fi Nepaal keessatti hirmaachisuu.",
                  },
                ],
              },
              {
                type: "list-item",
                children: [
                  {
                    type: "text",
                    text: "Teeknooloojii nyaataa haaraa warshaalee nyaataa naannoo waliin ta'uun yaaluu, akkasumas leenjii oomisha nyaata hambaa midhaanii irratti hundaa'e kennuun daldaltoota yeroo ammaa fi kanneen fuula duratti dandeessisuu keessa hubannoo guddisuu. Daldaltoota naannoo nyaata hambaa midhaanii irratti hundaa'e oomishuuf haala amanamaa qopheessuu.",
                  },
                ],
              },
              {
                type: "list-item",
                children: [
                  {
                    type: "text",
                    text: "Ragaa pirojeektii yeroo dhugaa, qorannoo mana keessaa, michoomii hiriyoota naannoo waliin ta'uu fi hubannoo kaka'umsawwan biroo walitti fiduun maodeela daldalaa mataa isaanii of danda'an qopheessuu.",
                  },
                ],
              },
              {
                type: "list-item",
                children: [
                  {
                    type: "text",
                    text: "Midhaan gosa lamaan (nyaataaf fi beelladaaf) deeggaru guddisuuf dhaabbilee wal-jijjiirraa waliin ta'uun amaloota qulqullina nyaataa sagantaalee wal-jijjiirraa midhaanii keessatti hammachiisuuf falmuu.",
                  },
                ],
              },
              {
                type: "list-item",
                children: [
                  {
                    type: "text",
                    text: "Faayidaalee naannoo fi dinagdee fayyadamni hambaa midhaanii fooyya'e qabu, moodelii dhibbaa, madaallii oomishaa fi xiinxala baasii-faayidaa karaa safaruun tarsiimoo qilleensaa biyyaalessaa beeksisuu.",
                  },
                ],
              },
              {
                type: "list-item",
                children: [
                  {
                    type: "text",
                    text: "Argannoowwan pirojeektii akka gorsa hojiirra oolchuu danda'amuutti qopheessuu fi tamsaasuun, murtee imaammataa fi invastimentii beeksisuu, kanaanis naannoo kanneen keessatti tarkaanfiiwwan nyaata hambaa midhaanii irratti hundaa'e bal'isuu fi deebi'anii hojiirra oolchuu danda'amsiisuu.",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        __component: "sections.stats-band",
        eyebrow: "Maaliif barbaachisaa ta'e",
        heading: "Itoophiyaan dhibbaa methane US irra dachaa 8 ol qabaachuu ishee, tokkoo tokkoo kaaloriitti (2022).",
        dark: true,
        stats: [
          { value: "1", label: "USA — ulfaatina dhibbaa methane, gCO2e/1000 kCal (2022)" },
          { value: "3.5", label: "Giddu-galeessa Addunyaa — ulfaatina dhibbaa methane (2022)" },
          { value: "6.2", label: "Nepaal — ulfaatina dhibbaa methane (2022)" },
          { value: "7.8", label: "Itoophiyaa — ulfaatina dhibbaa methane (2022)" },
        ],
      },
      {
        __component: "sections.feature-grid",
        eyebrow: "Ergaawwan Ijoo",
        heading: "Nyaanni fooyya'e maaliif barbaachisaa akka ta'e.",
        items: [
          {
            title: "Jireenya qonnaan bultootaa jalqaba",
            text: "Nyaata fooyya'e gara beelladoota fayyaa qabaniitti, oomisha aannanii fi foonii olaanaatti, akkasumas galii qonnaan bultoota xixiqqaaf jabaataatti geessa.",
          },
          {
            title: "Faayidaa nyaataa hin fayyadamamne",
            text: "Hambaan midhaanii duraan madda nyaataa murteessaa dha, garuu haqamuu fi faayidaan nyaataa isaa daangeffamaa dha — yaalii baayoo-keemikaalaa ykn mala wal-jijjiirraa faayidaa oomishaa guddaa banuu danda'a.",
          },
          {
            title: "Moodela daldalaa naannoon durfamu",
            text: "Tarkaanfiiwwan furmaata nyaataa fooyya'e ga'umsa qabu fi babal'isuu danda'amu taasisuuf moodela daldalaa ofii danda'e, naannoon durfamu ijaaruu irratti xiyyeeffachuu qabu.",
          },
          {
            title: "Fuulduraa gaarii",
            text: "Lafa wal fakkaataa irratti nyaata dabalataa oomishuun, dhibbaa methane gatii tokkoof oomishamuun hir'isuun, tarkaanfii qilleensaa fi nageenya nyaataa lamaan deeggara.",
          },
        ],
      },
      {
        __component: "sections.intro",
        eyebrow: "Bu'aawwan Eegaman",
        heading: "Xumura pirojeektii irratti milkaa'inni maal fakkaata.",
        body:
          "Qonnaan bultoonni xixiqqoo fi daldalaa faayidaa oomisha fi galii dabalataa argatu, gama hambaa midhaanii tiyoo irratti carraawwan daldalaa haaraan uumamu. Murteessitoonni imaammataa ragaa cimaa qulqullina nyaataa gara tarsiimoo qonnaa fi qilleensaatti hammachiisuuf gargaaru argatu.",
      },
      {
        __component: "sections.columns-block",
        eyebrow: "Michoomaan",
        heading: "Dhaabbilee qorannoo addunyaa waliin raawwatamu.",
        columns: [
          { heading: "ILRI", text: "Dhaabbata Qorannoo Beelladaa Addunyaa" },
          { heading: "WRI", text: "Dhaabbata Qabeenya Addunyaa" },
          { heading: "CCAC", text: "Tumsa Qilleensaa fi Qilleensa Qulqulluu — kaka'umsa UNEP-n qindaa'e kan pirojeektii kana deeggaru." },
        ],
      },
    ],
  },
};

const PRODUCTS_SEED: {
  name: string;
  slug: string;
  stage: "Current" | "Growth" | "Planned" | "Future";
  description: string;
  details: string[];
  imageFile?: string;
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
    imageFile: "dairy-feed.webp",
  },
  {
    name: "Cattle Fattening Feed",
    slug: "cattle-fattening-feed",
    stage: "Current",
    description: "Feed designed within ASF's livestock production focus.",
    details: [
      "Current stated capacity: 200 quintals/day",
      "Year 1 plan: 60,000 quintals",
      "Year 3 plan: 120,000 quintals",
    ],
    imageFile: "cattle-fattening-feed.webp",
  },
  {
    name: "Layer Feed",
    slug: "layer-feed",
    stage: "Current",
    description: "Formulated feed for egg-laying hens, part of ASF's poultry feed range.",
    details: [
      "3-month plan: 25,000 quintals",
      "Year 1 plan: 210,000 quintals",
      "Year 3 plan: 370,000 quintals",
    ],
    imageFile: "layer-feed.webp",
  },
  {
    name: "Pullet Feed",
    slug: "pullet-feed",
    stage: "Current",
    description: "Formulated feed for pullets, part of ASF's poultry feed range.",
    details: [],
    imageFile: "pullet-feed.webp",
  },
  {
    name: "Sheep & Goat Feed",
    slug: "sheep-goat-feed",
    stage: "Current",
    description: "Formulated feed for sheep and goat farmers, part of ASF's livestock feed range.",
    details: [],
    imageFile: "sheep-goat-feed.webp",
  },
  {
    name: "Camel Feed",
    slug: "camel-feed",
    stage: "Current",
    description: "Formulated feed for camel farmers, part of ASF's livestock feed range.",
    details: [],
    imageFile: "camel-feed.webp",
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

// Parallel to PRODUCTS_SEED (same order); slug/stage/image are shared across locales.
const PRODUCTS_LOCALIZED: Record<
  string,
  { name: string; description: string; details: string[] }[]
> = {
  am: [
    {
      name: "የወተት መኖ",
      description: "የቱሉ ቦሎ የእንስሳት መኖ ምርት ዘርፍ አካል።",
      details: [
        "የአሁኑ የተገለጸ አቅም፦ 400 ኩንታል/ቀን",
        "የ1ኛ ዓመት ዕቅድ፦ 100,000 ኩንታል",
        "የ3ኛ ዓመት ዕቅድ፦ 180,000 ኩንታል",
      ],
    },
    {
      name: "የከብት ማድለብ መኖ",
      description: "በASF የእንስሳት ምርት ትኩረት ውስጥ የተነደፈ መኖ።",
      details: [
        "የአሁኑ የተገለጸ አቅም፦ 200 ኩንታል/ቀን",
        "የ1ኛ ዓመት ዕቅድ፦ 60,000 ኩንታል",
        "የ3ኛ ዓመት ዕቅድ፦ 120,000 ኩንታል",
      ],
    },
    {
      name: "የሌየር ዶሮ መኖ",
      description: "ለእንቁላል ጣይ ዶሮዎች የተዘጋጀ መኖ፣ የASF የዶሮ መኖ ዘርፍ አካል።",
      details: [
        "የ3 ወር ዕቅድ፦ 25,000 ኩንታል",
        "የ1ኛ ዓመት ዕቅድ፦ 210,000 ኩንታል",
        "የ3ኛ ዓመት ዕቅድ፦ 370,000 ኩንታል",
      ],
    },
    {
      name: "የፑሌት መኖ",
      description: "ለፑሌት ዶሮዎች የተዘጋጀ መኖ፣ የASF የዶሮ መኖ ዘርፍ አካል።",
      details: [],
    },
    {
      name: "የበግና ፍየል መኖ",
      description: "ለበግና ፍየል አርሶ አደሮች የተዘጋጀ መኖ፣ የASF የእንስሳት መኖ ዘርፍ አካል።",
      details: [],
    },
    {
      name: "የግመል መኖ",
      description: "ለግመል አርሶ አደሮች የተዘጋጀ መኖ፣ የASF የእንስሳት መኖ ዘርፍ አካል።",
      details: [],
    },
    {
      name: "የእህል ማቀነባበር",
      description: "የASF መጪ ተጨማሪ የስራ ዘርፍ አካል።",
      details: [],
    },
    {
      name: "የእንስሳት እና አግሪቢዝነስ አገልግሎቶች",
      description: "የታቀደ ለውጭ ገበያ ደረጃ የእንስሳት እርድ ቤት እና የእንስሳት መድሃኒት እና መገልገያ አቅርቦት።",
      details: [],
    },
  ],
  om: [
    {
      name: "Nyaata Aannanii",
      description: "Kutaa karoora oomisha nyaata beeladaa Tuulluu Boolloo.",
      details: [
        "Dandeettii ammaa ibsame: Kuntaal 400/guyyaa",
        "Karoora Waggaa 1ffaa: Kuntaal 100,000",
        "Karoora Waggaa 3ffaa: Kuntaal 180,000",
      ],
    },
    {
      name: "Nyaata Coosaa Sangaa",
      description: "Nyaata xiyyeeffannaa oomisha beeladaa ASF keessatti qophaa'e.",
      details: [
        "Dandeettii ammaa ibsame: Kuntaal 200/guyyaa",
        "Karoora Waggaa 1ffaa: Kuntaal 60,000",
        "Karoora Waggaa 3ffaa: Kuntaal 120,000",
      ],
    },
    {
      name: "Nyaata Lukkuu Hanqaaquu",
      description: "Lukkuu hanqaaquu baaftuuf qophaa'e, kutaa nyaata lukkuu ASF keessaa.",
      details: [
        "Karoora Ji'a 3: Kuntaal 25,000",
        "Karoora Waggaa 1ffaa: Kuntaal 210,000",
        "Karoora Waggaa 3ffaa: Kuntaal 370,000",
      ],
    },
    {
      name: "Nyaata Pulleetii",
      description: "Nyaata pulleetiif qophaa'e, kutaa nyaata lukkuu ASF keessaa.",
      details: [],
    },
    {
      name: "Nyaata Hoolaa fi Reʼee",
      description: "Qonnaan bultoota hoolaa fi reʼee qabaniif nyaata qophaa'e, kutaa sarara nyaata beelladaa ASF.",
      details: [],
    },
    {
      name: "Nyaata Gaalaa",
      description: "Qonnaan bultoota gaalaa qabaniif nyaata qophaa'e, kutaa sarara nyaata beelladaa ASF.",
      details: [],
    },
    {
      name: "Adeemsa Midhaanii",
      description: "Kutaa daldala dabalataa ASF fuulduraaf karoorfame.",
      details: [],
    },
    {
      name: "Tajaajila Beeladaa fi Daldala Qonnaa",
      description: "Mana qalma beeladaa sadarkaa alergii fi dhiyeessii qoricha fi meeshaalee beeladaa karoorfame.",
      details: [],
    },
  ],
};

const ARTICLES_SEED: {
  title: string;
  slug: string;
  excerpt: string;
  category: "Feed & Nutrition" | "Expansion" | "Agriculture" | "Company News";
}[] = [
  {
    title: "Why quality feed matters across the livestock value chain",
    slug: "why-quality-feed-matters",
    excerpt:
      "ASF's quality controllers and lab technicians support production standards at every stage, from raw material sourcing to the finished feed reaching Ethiopia's livestock farmers.",
    category: "Feed & Nutrition",
  },
  {
    title: "ASF's next chapter at Bulbula Integrated Agro Industry Park",
    slug: "next-chapter-at-bulbula",
    excerpt:
      "In February 2023, ASF signed an investment agreement for a 271-hectare site at the Bulbula Integrated Agro Industry Park, 160km south of Addis Ababa, laying the groundwork for the company's next phase of growth.",
    category: "Expansion",
  },
  {
    title: "Connecting farmers, markets and agro-processing",
    slug: "connecting-farmers-markets-agro-processing",
    excerpt:
      "ASF's animal feed reaches livestock farmers and businesses through a distribution network of farmers' unions, cooperatives, wholesalers, retailers and direct sales.",
    category: "Agriculture",
  },
];

// Parallel to ARTICLES_SEED (same order); slug/category/coverImage are shared across locales.
const ARTICLES_LOCALIZED: Record<string, { title: string; excerpt: string }[]> = {
  am: [
    {
      title: "ጥራት ያለው መኖ በእንስሳት እሴት ሰንሰለት ውስጥ ለምን አስፈላጊ ነው",
      excerpt:
        "የASF የጥራት ተቆጣጣሪዎችና የላብራቶሪ ቴክኒሻኖች ከጥሬ ዕቃ አሰባሰብ እስከ የተጠናቀቀው መኖ ለኢትዮጵያ የእንስሳት አርሶ አደሮች እስኪደርስ ድረስ በሁሉም የምርት ደረጃ ላይ ደረጆችን ይደግፋሉ።",
    },
    {
      title: "የASF ቀጣይ ምዕራፍ በቡልቡላ የተቀናጀ አግሮ ኢንዱስትሪ ፓርክ",
      excerpt:
        "በየካቲት 2023 ASF ከቡልቡላ የተቀናጀ አግሮ ኢንዱስትሪ ፓርክ ጋር በ271 ሄክታር ቦታ ላይ የኢንቨስትመንት ስምምነት ፈርሟል፣ ከአዲስ አበባ 160 ኪ.ሜ ደቡብ የሚገኝ፣ ለኩባንያው ቀጣይ የእድገት ምዕራፍ መሠረት በመጣል።",
    },
    {
      title: "አርሶ አደሮችን፣ ገበያዎችን እና አግሮ ማቀነባበርን ማገናኘት",
      excerpt:
        "የASF የእንስሳት መኖ ወደ እንስሳት አርሶ አደሮችና ድርጅቶች የሚደርሰው በአርሶ አደር ማህበራት፣ ኅብረት ስራ ማህበራት፣ አከፋፋዮች እና ችርቻሮ ሻጮች የስርጭት መረብ እንዲሁም በቀጥታ ሽያጭ በኩል ነው።",
    },
  ],
  om: [
    {
      title: "Nyaatni Qulqullina Qabu Sarara Gatii Beeladaa Keessatti Maaliif Barbaachisaa Ta'e",
      excerpt:
        "Toʼannoonni qulqullinaa fi ogeeyyiin laaboraatorii ASF meeshaa jalqabaa walitti qabuu irraa hanga nyaata xumurame qonnaan bultoota Itoophiyaa gaʼutti, sadarkaa hunda irratti sadarkaa oomishaa deeggaru.",
    },
    {
      title: "Boqonnaa Itti Aanu ASF Paarkii Warshaalee Qonnaa Walitti Qindaa'e Bulbulaa keessatti",
      excerpt:
        "Guraandhala 2023, ASF Paarkii Warshaalee Qonnaa Walitti Qindaaʼe Bulbulaa waliin walii galtee investimentii lafa heektaara 271 irratti mallatteesse, kiiloomeetira 160 kibba Finfinnee, kanaanis boqonnaa guddina itti aanuuf hundeeffama kaaʼe.",
    },
    {
      title: "Qonnaan Bultoota, Gabaa fi Adeemsa Qonnaa Walitti Fidu",
      excerpt:
        "Nyaanni beelladaa ASF gara qonnaan bultootaa fi daldaltoota beelladaa kan gaʼu, sarara raabsaa waldaalee qonnaan bultootaa, kooperatiiva, daldaltoota gurguddaa fi gurgurtaa akkasumas gurgurtaa kallattii keessaan.",
    },
  ],
};

const PRIVACY_PAGE_SEED = {
  title: "Privacy Policy",
  slug: "privacy-policy",
  sections: [
    {
      __component: "sections.intro",
      eyebrow: "Privacy Policy",
      heading: "How ASF handles your information.",
      body: "This policy explains what information asfagro.com collects, why, and how it's used. Last updated: September 2026.",
    },
    {
      __component: "sections.rich-text",
      width: "narrow",
      content: [
        { type: "heading", level: 3, children: [{ type: "text", text: "Introduction" }] },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "ASF Agro Industry (\"ASF\", \"we\", \"us\") respects your privacy. This policy explains what information we collect through asfagro.com, how we use it, and the choices you have.",
            },
          ],
        },
        { type: "heading", level: 3, children: [{ type: "text", text: "Information We Collect" }] },
        {
          type: "list",
          format: "unordered",
          children: [
            {
              type: "list-item",
              children: [
                {
                  type: "text",
                  text: "Contact form submissions: the name, email, phone number and message you provide. These are sent to our team by email so we can respond to your enquiry.",
                },
              ],
            },
            {
              type: "list-item",
              children: [
                {
                  type: "text",
                  text: "Basic usage data: the page you visited, its language, and the page you came from, so we can understand how the site is used. This does not identify you personally.",
                },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "We do not use cookies, and we do not use third-party advertising or analytics trackers on this site.",
            },
          ],
        },
        { type: "heading", level: 3, children: [{ type: "text", text: "How We Use Your Information" }] },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "We use the information above to respond to your enquiries, operate and improve asfagro.com, and understand which pages are useful to visitors.",
            },
          ],
        },
        { type: "heading", level: 3, children: [{ type: "text", text: "Sharing of Information" }] },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "We do not sell or rent your personal information. We only share it with staff who need it to respond to you, service providers who help us run this website (such as our hosting and email providers), or when required by law.",
            },
          ],
        },
        { type: "heading", level: 3, children: [{ type: "text", text: "Third-Party Links" }] },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "Our site links to third-party platforms such as YouTube, Facebook, Instagram, Telegram, TikTok and LinkedIn, and may embed a map. Those services have their own privacy practices, which this policy does not cover.",
            },
          ],
        },
        { type: "heading", level: 3, children: [{ type: "text", text: "Data Retention & Security" }] },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "We keep contact enquiries only as long as needed to respond to you and maintain reasonable business records, and we take reasonable technical measures to protect the information we hold. No method of storage or transmission is completely secure.",
            },
          ],
        },
        { type: "heading", level: 3, children: [{ type: "text", text: "Your Rights" }] },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "You can contact us at any time to ask what information we hold about you from a form submission, and to request that it be corrected or deleted, subject to any legitimate business or legal need to keep it.",
            },
          ],
        },
        { type: "heading", level: 3, children: [{ type: "text", text: "Children's Privacy" }] },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "This website is not directed at children, and we do not knowingly collect information from children.",
            },
          ],
        },
        { type: "heading", level: 3, children: [{ type: "text", text: "Changes to This Policy" }] },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "We may update this policy from time to time. The latest version will always be published on this page, and continued use of the site after a change means you accept the update.",
            },
          ],
        },
        { type: "heading", level: 3, children: [{ type: "text", text: "Contact Us" }] },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "For questions about this policy or your information, contact us at merihun@asfagro.com or argaw@asfagro.com, or write to us at Akaki Kality Woreda 05, near Kality Maseltegna, Addis Ababa, Ethiopia.",
            },
          ],
        },
      ],
    },
  ],
};

const PRIVACY_PAGE_LOCALIZED: Record<string, Record<string, unknown>> = {
  am: { title: "የግላዊነት ፖሊሲ" },
  om: { title: "Imaammata Dhuunfaa" },
};

const TERMS_PAGE_SEED = {
  title: "Terms of Service",
  slug: "terms-of-service",
  sections: [
    {
      __component: "sections.intro",
      eyebrow: "Terms of Service",
      heading: "The terms behind using asfagro.com.",
      body: "These terms govern your use of asfagro.com. Last updated: September 2026.",
    },
    {
      __component: "sections.rich-text",
      width: "narrow",
      content: [
        { type: "heading", level: 3, children: [{ type: "text", text: "Acceptance of Terms" }] },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "By accessing or using asfagro.com, you agree to these Terms of Service. If you do not agree, please do not use this site.",
            },
          ],
        },
        { type: "heading", level: 3, children: [{ type: "text", text: "About This Website" }] },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "asfagro.com is an informational website about ASF Agro Industry's animal feed production, facilities and business. It is not an online store, and no purchases or payments are processed on this site.",
            },
          ],
        },
        { type: "heading", level: 3, children: [{ type: "text", text: "Use of Content" }] },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "The text, images, logo and other content on this site belong to ASF Agro Industry or are used with permission. You may view and share this content for personal, non-commercial purposes with attribution. Reproducing or reusing it commercially without our written permission is not allowed.",
            },
          ],
        },
        { type: "heading", level: 3, children: [{ type: "text", text: "Accuracy of Information" }] },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "We try to keep company, product and production information accurate and up to date, but it is provided \"as is\" without warranty of any kind. Production capacities and plans are subject to change. Nothing on this site is a binding offer or contract.",
            },
          ],
        },
        { type: "heading", level: 3, children: [{ type: "text", text: "Contact Form & Communications" }] },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "By submitting our contact form, you confirm the information you provide is accurate and agree not to submit spam, unlawful or misleading content. We aim to respond within a reasonable time, but cannot guarantee a specific response time.",
            },
          ],
        },
        { type: "heading", level: 3, children: [{ type: "text", text: "Third-Party Links & Embedded Content" }] },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "Links to our social media pages and any embedded map are provided for your convenience. We are not responsible for the content or privacy practices of third-party sites.",
            },
          ],
        },
        { type: "heading", level: 3, children: [{ type: "text", text: "Limitation of Liability" }] },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "This site is provided \"as is.\" To the fullest extent permitted by law, ASF Agro Industry is not liable for any damages arising from your use of, or inability to use, this website.",
            },
          ],
        },
        { type: "heading", level: 3, children: [{ type: "text", text: "Governing Law" }] },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "These terms are governed by the laws of Ethiopia, and any dispute is subject to the competent courts of Addis Ababa.",
            },
          ],
        },
        { type: "heading", level: 3, children: [{ type: "text", text: "Changes to These Terms" }] },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "We may update these terms from time to time. Changes take effect once posted here, and continued use of the site after an update means you accept it.",
            },
          ],
        },
        { type: "heading", level: 3, children: [{ type: "text", text: "Contact Us" }] },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "Questions about these terms can be sent to merihun@asfagro.com or argaw@asfagro.com, or to Akaki Kality Woreda 05, near Kality Maseltegna, Addis Ababa, Ethiopia.",
            },
          ],
        },
      ],
    },
  ],
};

const TERMS_PAGE_LOCALIZED: Record<string, Record<string, unknown>> = {
  am: { title: "የአገልግሎት ውሎች" },
  om: { title: "Haala Tajaajilaa" },
};

// Categories excluded from the "Admin" role below: credentials/tokens that
// grant broad programmatic or data-transfer access to the whole instance,
// plus webhook endpoints (which can leak content to arbitrary URLs). Any
// action within these categories, including ones added by future Strapi
// versions, is excluded via prefix match.
const ADMIN_ROLE_EXCLUDED_PREFIXES = [
  "admin::webhooks.",
  "admin::api-tokens.",
  "admin::admin-tokens.",
  "admin::transfer.tokens.",
];

async function buildAdminRolePermissions(strapi: Core.Strapi) {
  const permissionService = strapi.service("admin::permission") as any;
  const contentTypeService = strapi.service("admin::content-type") as any;
  const allActions = permissionService.actionProvider.values();

  const contentTypesActions = allActions.filter((a: any) => a.section === "contentTypes");
  const otherActions = allActions.filter(
    (a: any) =>
      a.section !== "contentTypes" &&
      !ADMIN_ROLE_EXCLUDED_PREFIXES.some((prefix) => a.actionId.startsWith(prefix)),
  );

  // Same content-type permission set Super Admin gets (no restrictedSubjects),
  // so Admin has full access to every content type, matching Super Admin.
  const permissions: Record<string, unknown>[] =
    contentTypeService.getPermissionsWithNestedFields(contentTypesActions);

  for (const action of otherActions) {
    const { actionId, subjects } = action;
    if (Array.isArray(subjects) && subjects.length > 0) {
      for (const subject of subjects) {
        permissions.push({ action: actionId, subject });
      }
    } else {
      permissions.push({ action: actionId });
    }
  }

  return permissions;
}

// Additive-only: creates the "Admin" role once if it doesn't already exist,
// with every permission Super Admin has except API tokens, admin tokens,
// transfer tokens and webhooks. Never touches the role again after it
// exists, so any permission tweaks made by hand in the CMS admin UI are
// preserved on every future run of this function.
async function seedAdminRole(strapi: Core.Strapi) {
  const roleService = strapi.service("admin::role") as any;
  const existing = await roleService.findOne({ name: "Admin" });
  if (existing) return;

  const role = await roleService.create({
    name: "Admin",
    description:
      "Admins can manage all content, media and users, but cannot manage API tokens, admin tokens, transfer tokens or webhooks.",
  });

  const permissions = await buildAdminRolePermissions(strapi);
  await roleService.assignPermissions(role.id, permissions);
}

async function seedSiteSettings(strapi: Core.Strapi) {
  const existing = await strapi.documents("api::site-setting.site-setting").findFirst();
  if (existing) return;
  const created = await strapi
    .documents("api::site-setting.site-setting")
    .create({ data: SITE_SETTINGS_SEED });

  for (const locale of LOCALES) {
    await strapi.documents("api::site-setting.site-setting").update({
      documentId: created.documentId,
      locale: locale.code,
      data: { ...SITE_SETTINGS_SEED, ...SITE_SETTINGS_LOCALIZED[locale.code] },
    });
  }
}

async function uploadProductImage(strapi: Core.Strapi, imageFile: string | undefined) {
  if (!imageFile) return undefined;
  const filepath = path.join(strapi.dirs.app.root, "seed-assets", "products", imageFile);
  if (!fs.existsSync(filepath)) return undefined;
  const [uploaded] = await strapi.plugin("upload").service("upload").upload({
    data: {},
    files: {
      filepath,
      originalFilename: imageFile,
      mimetype: "image/webp",
      size: fs.statSync(filepath).size,
    },
  });
  return uploaded.id;
}

async function seedProducts(strapi: Core.Strapi) {
  const existing = await strapi.documents("api::product.product").findFirst();
  if (existing) return;
  for (let i = 0; i < PRODUCTS_SEED.length; i++) {
    const { imageFile, ...seed } = PRODUCTS_SEED[i];
    const imageId = await uploadProductImage(strapi, imageFile);

    const created = await strapi
      .documents("api::product.product")
      .create({ data: { ...seed, image: imageId } as any, status: "published" });

    for (const locale of LOCALES) {
      await strapi.documents("api::product.product").update({
        documentId: created.documentId,
        locale: locale.code,
        data: { ...seed, ...PRODUCTS_LOCALIZED[locale.code][i], image: imageId } as any,
        status: "published",
      });
    }
  }
}

async function seedArticles(strapi: Core.Strapi) {
  const existing = await strapi.documents("api::article.article").findFirst();
  if (existing) return;
  for (let i = 0; i < ARTICLES_SEED.length; i++) {
    const created = await strapi
      .documents("api::article.article")
      .create({ data: ARTICLES_SEED[i], status: "published" });

    for (const locale of LOCALES) {
      await strapi.documents("api::article.article").update({
        documentId: created.documentId,
        locale: locale.code,
        data: { ...ARTICLES_SEED[i], ...ARTICLES_LOCALIZED[locale.code][i] },
        status: "published",
      });
    }
  }
}

async function seedPages(strapi: Core.Strapi) {
  const existing = await strapi.documents("api::page.page").findFirst();
  if (existing) return;

  const pages = [
    { seed: HOME_PAGE_SEED, localized: HOME_PAGE_LOCALIZED },
    { seed: ABOUT_PAGE_SEED, localized: ABOUT_PAGE_LOCALIZED },
    { seed: FACILITIES_PAGE_SEED, localized: FACILITIES_PAGE_LOCALIZED },
    { seed: QUALITY_PAGE_SEED, localized: QUALITY_PAGE_LOCALIZED },
    { seed: SUSTAINABILITY_PAGE_SEED, localized: SUSTAINABILITY_PAGE_LOCALIZED },
    { seed: CROP_RESIDUE_PAGE_SEED, localized: CROP_RESIDUE_PAGE_LOCALIZED },
    { seed: PRIVACY_PAGE_SEED, localized: PRIVACY_PAGE_LOCALIZED },
    { seed: TERMS_PAGE_SEED, localized: TERMS_PAGE_LOCALIZED },
  ];

  for (const { seed, localized } of pages) {
    const created = await strapi
      .documents("api::page.page")
      .create({ data: seed as any, status: "published" });

    for (const locale of LOCALES) {
      await strapi.documents("api::page.page").update({
        documentId: created.documentId,
        locale: locale.code,
        data: { ...seed, ...localized[locale.code] } as any,
        status: "published",
      });
    }
  }
}

interface GalleryAlbumSeed {
  folder: string;
  slug: string;
  category: "Factory" | "Production" | "Farming" | "Products" | "Team" | "Events" | "Projects";
  title: string;
  description: string;
}

const GALLERY_ALBUMS_SEED: GalleryAlbumSeed[] = [
  {
    folder: "factory",
    slug: "factory-site",
    category: "Factory",
    title: "Factory Site",
    description: "Photos from ASF's Tulu Bolo animal feed factory.",
  },
  {
    folder: "team",
    slug: "management-team",
    category: "Team",
    title: "Management Team",
    description: "ASF's management team.",
  },
  {
    folder: "bulbula-park",
    slug: "bulbula-integrated-agro-industry-park",
    category: "Projects",
    title: "Bulbula Integrated Agro Industry Park",
    description: "ASF's expansion site at the Bulbula Integrated Agro Industry Park.",
  },
];

const GALLERY_ALBUMS_LOCALIZED: Record<string, { title: string; description: string }[]> = {
  am: [
    { title: "የፋብሪካ ቦታ", description: "ከASF የቱሉ ቦሎ የእንስሳት መኖ ፋብሪካ የተወሰዱ ፎቶዎች።" },
    { title: "የስራ አመራር ቡድን", description: "የASF የስራ አመራር ቡድን።" },
    { title: "ቡልቡላ የተቀናጀ አግሮ ኢንዱስትሪ ፓርክ", description: "የASF የማስፋፊያ ቦታ በቡልቡላ የተቀናጀ አግሮ ኢንዱስትሪ ፓርክ።" },
  ],
  om: [
    { title: "Bakka Warshaa", description: "Suuraalee Warshaa Nyaata Beeladaa Tulu Bolo ASF irraa." },
    { title: "Garee Hoggansaa", description: "Garee Hoggansaa ASF." },
    { title: "Paarkii Warshaa Qonnaa Walitti Qindaa'e Bulbula", description: "Bakka babal'ina ASF Paarkii Warshaa Qonnaa Walitti Qindaa'e Bulbula keessatti." },
  ],
};

async function seedGalleryAlbums(strapi: Core.Strapi) {
  const existing = await strapi.documents("api::gallery-album.gallery-album").findFirst();
  if (existing) return;

  const assetsRoot = path.join(strapi.dirs.app.root, "seed-assets", "gallery");
  if (!fs.existsSync(assetsRoot)) return;

  for (let i = 0; i < GALLERY_ALBUMS_SEED.length; i++) {
    const album = GALLERY_ALBUMS_SEED[i];
    const albumDir = path.join(assetsRoot, album.folder);
    if (!fs.existsSync(albumDir)) continue;

    const filenames = fs.readdirSync(albumDir).filter((f) => /\.(jpg|jpeg|png)$/i.test(f));
    const uploaded = await Promise.all(
      filenames.map((filename) => {
        const filepath = path.join(albumDir, filename);
        return strapi.plugin("upload").service("upload").upload({
          data: {},
          files: {
            filepath,
            originalFilename: filename,
            mimetype: filename.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg",
            size: fs.statSync(filepath).size,
          },
        });
      })
    );
    const imageIds = uploaded.flat().map((file: any) => file.id);

    const created = await strapi.documents("api::gallery-album.gallery-album").create({
      data: {
        title: album.title,
        slug: album.slug,
        category: album.category,
        description: album.description,
        images: imageIds,
      } as any,
      status: "published",
    });

    for (const locale of LOCALES) {
      const localized = GALLERY_ALBUMS_LOCALIZED[locale.code]?.[i];
      if (!localized) continue;
      await strapi.documents("api::gallery-album.gallery-album").update({
        documentId: created.documentId,
        locale: locale.code,
        data: {
          title: localized.title,
          slug: album.slug,
          category: album.category,
          description: localized.description,
          images: imageIds,
        } as any,
        status: "published",
      });
    }
  }
}

// Exported for the one-off content-update script (scripts/apply-content-updates.js):
// the bootstrap seed functions below only create content on first run, so updating
// already-seeded environments needs direct access to this data.
export {
  SITE_SETTINGS_SEED,
  SITE_SETTINGS_LOCALIZED,
  ABOUT_PAGE_SEED,
  ABOUT_PAGE_LOCALIZED,
  FACILITIES_PAGE_SEED,
  FACILITIES_PAGE_LOCALIZED,
  QUALITY_PAGE_SEED,
  QUALITY_PAGE_LOCALIZED,
  SUSTAINABILITY_PAGE_SEED,
  SUSTAINABILITY_PAGE_LOCALIZED,
  CROP_RESIDUE_PAGE_SEED,
  CROP_RESIDUE_PAGE_LOCALIZED,
  PRIVACY_PAGE_SEED,
  PRIVACY_PAGE_LOCALIZED,
  TERMS_PAGE_SEED,
  TERMS_PAGE_LOCALIZED,
  ARTICLES_SEED,
  ARTICLES_LOCALIZED,
  PRODUCTS_SEED,
  PRODUCTS_LOCALIZED,
  uploadProductImage,
  LOCALES,
  seedAdminRole,
};

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    registerAnalyticsDashboardRoutes(strapi);
  },
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await seedLocales(strapi);
    await setPublicPermissions(strapi);
    await seedSiteSettings(strapi);
    await seedProducts(strapi);
    await seedArticles(strapi);
    await seedPages(strapi);
    await seedGalleryAlbums(strapi);
    await seedAdminRole(strapi);
  },
};
