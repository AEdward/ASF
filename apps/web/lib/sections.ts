export interface HeroSection {
  __component: "sections.hero";
  eyebrow?: string;
  headingLine1: string;
  headingLine2?: string;
  subtitle?: string;
  primaryButtonLabel?: string;
  primaryButtonHref?: string;
  secondaryButtonLabel?: string;
  secondaryButtonHref?: string;
  imageUrl?: string;
  imageStyle: "disc-spin" | "plain" | "none";
}

export interface GlanceSection {
  __component: "sections.glance";
  glanceEyebrow?: string;
  glanceHeading?: string;
  glanceBody?: string;
  cards: { label: string; text?: string }[];
}

export interface MissionSection {
  __component: "sections.mission";
  eyebrow?: string;
  heading?: string;
  body?: string;
}

export interface FeatureGridSection {
  __component: "sections.feature-grid";
  eyebrow?: string;
  heading?: string;
  items: { icon?: string; title: string; text?: string }[];
}

export interface StatsBandSection {
  __component: "sections.stats-band";
  eyebrow?: string;
  heading?: string;
  dark: boolean;
  stats: { value: string; label: string }[];
}

export interface IntroSection {
  __component: "sections.intro";
  eyebrow?: string;
  heading: string;
  body?: string;
}

export interface StoryPanelSection {
  __component: "sections.story-panel";
  eyebrow?: string;
  heading?: string;
  bodyParagraph1?: string;
  bodyParagraph2?: string;
  panelBadge?: string;
  panelTitle?: string;
  panelText?: string;
}

export interface VideoSection {
  __component: "sections.video";
  eyebrow?: string;
  heading?: string;
  caption?: string;
  videoUrl?: string;
  posterUrl?: string;
}

export interface TeamGridSection {
  __component: "sections.team-grid";
  eyebrow?: string;
  heading?: string;
  members: { name: string; role?: string; qualification?: string; experience?: string }[];
}

export type PageSection =
  | HeroSection
  | GlanceSection
  | MissionSection
  | FeatureGridSection
  | StatsBandSection
  | IntroSection
  | StoryPanelSection
  | VideoSection
  | TeamGridSection;

export const DEFAULT_HOME_SECTIONS: PageSection[] = [
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
];

export const DEFAULT_ABOUT_SECTIONS: PageSection[] = [
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
        name: "Amanuel Baze",
        role: "Management Team",
        qualification: "BA in Management, BA in Theology",
        experience: "More than 10 years in business and leadership, running businesses.",
      },
      {
        name: "Dr. Tesfu Tadesse",
        role: "Chief Nutritionist",
        qualification: "PhD in Animal Nutrition",
        experience: "More than 25 years in livestock farming, nutrition and consultancy.",
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
      { title: "Technical & General Services", text: "Maintains equipment and electromechanical operations." },
      { title: "Procurement", text: "Sources raw materials and supplies for production." },
    ],
  },
];
