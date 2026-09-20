import type { Core } from "@strapi/strapi";

const PUBLIC_READ_PERMISSIONS: Record<string, string[]> = {
  "site-setting": ["find"],
  product: ["find", "findOne"],
  article: ["find", "findOne"],
  page: ["find", "findOne"],
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
      { label: "ስለ እኛ", href: "/about" },
      { label: "ምርቶች", href: "/products" },
      { label: "ብሎግ", href: "/blog" },
    ],
    headerCtaLabel: "ከእኛ ጋር ይነጋገሩ →",
    footerLinks: [
      { label: "ስለ እኛ", href: "/about" },
      { label: "ምርቶች", href: "/products" },
      { label: "ብሎግ", href: "/blog" },
      { label: "አግኙን", href: "/contact" },
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
      { label: "Waa'ee Keenya", href: "/about" },
      { label: "Oomishaalee", href: "/products" },
      { label: "Barreeffama", href: "/blog" },
    ],
    headerCtaLabel: "Nu haasofsiisi →",
    footerLinks: [
      { label: "Waa'ee Keenya", href: "/about" },
      { label: "Oomishaalee", href: "/products" },
      { label: "Barreeffama", href: "/blog" },
      { label: "Nu Qunnami", href: "/contact" },
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
        "ASF currently operates in animal feed production, dairy and poultry farms. Its stated upcoming portfolio includes cereal processing, an export-standard livestock slaughter house, and livestock medicine and equipment supply.",
      bodyParagraph2:
        "Our vision is to become one of the most reliable companies in agro processing, agriculture and agribusiness in the Eastern Africa Subcontinent, in the year 2030.",
      panelBadge: "Ethiopia · Vision 2030",
      panelTitle: "Reliable solutions for a stronger livestock value chain.",
      panelText:
        "From feed production to future integrated agro-processing, ASF is building for farmers, production and sustainable growth.",
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
          "ASF በአሁኑ ጊዜ በእንስሳት መኖ ምርት፣ በወተትና በዶሮ እርባታ ቦታዎች ይሰራል። የተገለጸው መጪ የስራ ዘርፍ የእህል ማቀነባበር፣ ለውጭ ገበያ ደረጃ የእንስሳት እርድ ቤት እና የእንስሳት መድሃኒት እና መገልገያ አቅርቦትን ያካትታል።",
        bodyParagraph2:
          "ራዕያችን በምስራቅ አፍሪካ ክፍለ አህጉር በአግሮ ማቀነባበር፣ በግብርና እና በአግሪቢዝነስ ውስጥ ከሚታመኑ ኩባንያዎች አንዱ በ2030 መሆን ነው።",
        panelBadge: "ኢትዮጵያ · ራዕይ 2030",
        panelTitle: "ለጠንካራ የእንስሳት እሴት ሰንሰለት አስተማማኝ መፍትሄዎች።",
        panelText:
          "ከመኖ ምርት ወደ የወደፊት የተቀናጀ አግሮ ማቀነባበር፣ ASF ለአርሶ አደሮች፣ ለምርት እና ለዘላቂ እድገት ይገነባል።",
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
          "ASF yeroo ammaa oomisha nyaata beeladaa, qonna aannanii fi lukkuu keessa hojjeta. Karoorri fuulduraa ibsame adeemsa midhaanii, mana qalma beeladaa sadarkaa alergii, fi dhiyeessii qoricha fi meeshaalee beeladaa dabalata.",
        bodyParagraph2:
          "Mul'ata keenya kutaa biyyoota Afrikaa Bahaa keessatti dhaabbata amanamaa warshaa qonnaa, qonnaa fi daldala qonnaa keessatti tokko ta'uu, bara 2030 ti.",
        panelBadge: "Itoophiyaa · Mul'ata 2030",
        panelTitle: "Furmaata amanamaa sarara gatii beeladaa cimaaf.",
        panelText:
          "Oomisha nyaataa irraa gara adeemsa warshaa qonnaa walitti qindaa'e fuulduraatti, ASF qonnaan bultootaaf, oomishaaf, fi guddina itti fufiinsa qabuuf ijaaraa jira.",
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
    ],
  },
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
      name: "የማድለብ መኖ",
      description: "በASF የእንስሳት ምርት ትኩረት ውስጥ የተነደፈ መኖ።",
      details: [
        "የአሁኑ የተገለጸ አቅም፦ 200 ኩንታል/ቀን",
        "የ1ኛ ዓመት ዕቅድ፦ 60,000 ኩንታል",
        "የ3ኛ ዓመት ዕቅድ፦ 120,000 ኩንታል",
      ],
    },
    {
      name: "የዶሮ መኖ",
      description: "በምርት ዕቅዱ ውስጥ ትልቅ የታቀደ የእድገት ክፍል።",
      details: [
        "የ3 ወር ዕቅድ፦ 25,000 ኩንታል",
        "የ1ኛ ዓመት ዕቅድ፦ 210,000 ኩንታል",
        "የ3ኛ ዓመት ዕቅድ፦ 370,000 ኩንታል",
      ],
    },
    {
      name: "ሌሎች የእንስሳት መኖዎች",
      description: "በብዙ-ዓመት ዕቅድ ውስጥ ተጨማሪ የእንስሳት መኖ ክፍል።",
      details: [
        "የ1ኛ ዓመት ዕቅድ፦ 40,000 ኩንታል",
        "የ2ኛ ዓመት ዕቅድ፦ 60,000 ኩንታል",
        "የ3ኛ ዓመት ዕቅድ፦ 80,000 ኩንታል",
      ],
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
      name: "Nyaata Coosaa",
      description: "Nyaata xiyyeeffannaa oomisha beeladaa ASF keessatti qophaa'e.",
      details: [
        "Dandeettii ammaa ibsame: Kuntaal 200/guyyaa",
        "Karoora Waggaa 1ffaa: Kuntaal 60,000",
        "Karoora Waggaa 3ffaa: Kuntaal 120,000",
      ],
    },
    {
      name: "Nyaata Lukkuu",
      description: "Kutaa guddina guddaa karoora oomisha keessatti karoorfame.",
      details: [
        "Karoora Ji'a 3: Kuntaal 25,000",
        "Karoora Waggaa 1ffaa: Kuntaal 210,000",
        "Karoora Waggaa 3ffaa: Kuntaal 370,000",
      ],
    },
    {
      name: "Nyaata Beeladaa Biroo",
      description: "Kutaa nyaata beeladaa dabalataa karoora waggoota hedduu keessatti.",
      details: [
        "Karoora Waggaa 1ffaa: Kuntaal 40,000",
        "Karoora Waggaa 2ffaa: Kuntaal 60,000",
        "Karoora Waggaa 3ffaa: Kuntaal 80,000",
      ],
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

// Parallel to ARTICLES_SEED (same order); slug/category/coverImage are shared across locales.
const ARTICLES_LOCALIZED: Record<string, { title: string; excerpt: string }[]> = {
  am: [
    {
      title: "ጥራት ያለው መኖ በእንስሳት እሴት ሰንሰለት ውስጥ ለምን አስፈላጊ ነው",
      excerpt: "እነዚህን የመነሻ ካርዶች ከStrapi CMS በቀጥታ ልጥፎች ይተኩ።",
    },
    {
      title: "የASF ቀጣይ ምዕራፍ በቡልቡላ የተቀናጀ አግሮ ኢንዱስትሪ ፓርክ",
      excerpt: "እነዚህን የመነሻ ካርዶች ከStrapi CMS በቀጥታ ልጥፎች ይተኩ።",
    },
    {
      title: "አርሶ አደሮችን፣ ገበያዎችን እና አግሮ ማቀነባበርን ማገናኘት",
      excerpt: "እነዚህን የመነሻ ካርዶች ከStrapi CMS በቀጥታ ልጥፎች ይተኩ።",
    },
  ],
  om: [
    {
      title: "Nyaatni Qulqullina Qabu Sarara Gatii Beeladaa Keessatti Maaliif Barbaachisaa Ta'e",
      excerpt: "Kaardiiwwan jalqabaa kana barreeffamoota jiraa Strapi CMS irraa bakka buusi.",
    },
    {
      title: "Boqonnaa Itti Aanu ASF Paarkii Warshaalee Qonnaa Walitti Qindaa'e Bulbulaa keessatti",
      excerpt: "Kaardiiwwan jalqabaa kana barreeffamoota jiraa Strapi CMS irraa bakka buusi.",
    },
    {
      title: "Qonnaan Bultoota, Gabaa fi Adeemsa Qonnaa Walitti Fidu",
      excerpt: "Kaardiiwwan jalqabaa kana barreeffamoota jiraa Strapi CMS irraa bakka buusi.",
    },
  ],
};

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

async function seedProducts(strapi: Core.Strapi) {
  const existing = await strapi.documents("api::product.product").findFirst();
  if (existing) return;
  for (let i = 0; i < PRODUCTS_SEED.length; i++) {
    const created = await strapi
      .documents("api::product.product")
      .create({ data: PRODUCTS_SEED[i], status: "published" });

    for (const locale of LOCALES) {
      await strapi.documents("api::product.product").update({
        documentId: created.documentId,
        locale: locale.code,
        data: { ...PRODUCTS_SEED[i], ...PRODUCTS_LOCALIZED[locale.code][i] },
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

export default {
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await seedLocales(strapi);
    await setPublicPermissions(strapi);
    await seedSiteSettings(strapi);
    await seedProducts(strapi);
    await seedArticles(strapi);
    await seedPages(strapi);
  },
};
