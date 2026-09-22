// One-off script to push seed-data updates into an ALREADY-SEEDED environment.
//
// The bootstrap seed functions in src/index.ts only create the Site Setting and
// Page records on first run (`if (existing) return;`), so once an environment has
// been seeded once, editing the seed data in code no longer reaches production —
// this script re-applies the current seed content directly via the Document
// Service API, for exactly the fields covered below, and creates any new pages
// that seedPages() would have skipped because a page already existed.
//
// Run from the CMS app root (apps/cms), after building, with the SAME env vars
// used to start the app (DATABASE_*, etc):
//   node scripts/apply-content-updates.js
//
// Safe to re-run: it only overwrites the "footerLinks" field on Site Setting and
// the "sections" field on pages already listed below, and only creates a page
// when no page with that slug exists yet — it never touches anything you've
// edited by hand elsewhere (phone numbers, emails, other page content, etc).
// The Gallery Album photos are NOT handled here — they're seeded automatically
// by the normal bootstrap on first boot, since that collection starts empty.

const path = require("path");
const { createStrapi } = require("@strapi/core");
const {
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
  LOCALES,
} = require("../dist/src/index.js");

// Pages whose sections should be force-updated to match the current seed
// (i.e. pages that existed before this script was introduced, or whose
// content has since changed here).
const PAGES_TO_UPDATE = [
  { slug: "about", seed: ABOUT_PAGE_SEED, localized: ABOUT_PAGE_LOCALIZED },
  { slug: "quality", seed: QUALITY_PAGE_SEED, localized: QUALITY_PAGE_LOCALIZED },
];

// Pages that should be created if they don't exist yet.
const PAGES_TO_CREATE = [
  { slug: "facilities", seed: FACILITIES_PAGE_SEED, localized: FACILITIES_PAGE_LOCALIZED },
  { slug: "quality", seed: QUALITY_PAGE_SEED, localized: QUALITY_PAGE_LOCALIZED },
  { slug: "sustainability", seed: SUSTAINABILITY_PAGE_SEED, localized: SUSTAINABILITY_PAGE_LOCALIZED },
];

async function main() {
  const appDir = path.join(__dirname, "..");
  const distDir = path.join(appDir, "dist");
  const strapi = await createStrapi({ appDir, distDir }).load();

  const siteSetting = await strapi.documents("api::site-setting.site-setting").findFirst();
  if (siteSetting) {
    await strapi.documents("api::site-setting.site-setting").update({
      documentId: siteSetting.documentId,
      data: { footerLinks: SITE_SETTINGS_SEED.footerLinks, navLinks: SITE_SETTINGS_SEED.navLinks },
    });
    for (const locale of LOCALES) {
      await strapi.documents("api::site-setting.site-setting").update({
        documentId: siteSetting.documentId,
        locale: locale.code,
        data: {
          footerLinks: SITE_SETTINGS_LOCALIZED[locale.code].footerLinks,
          navLinks: SITE_SETTINGS_LOCALIZED[locale.code].navLinks,
        },
      });
    }
    console.log("Updated Site Setting footerLinks + navLinks (en/am/om).");
  } else {
    console.log("No Site Setting document found — skipped.");
  }

  for (const { slug, seed, localized } of PAGES_TO_UPDATE) {
    const page = await strapi.documents("api::page.page").findFirst({ filters: { slug } });
    if (!page) {
      console.log(`No "${slug}" page found — skipped.`);
      continue;
    }
    await strapi.documents("api::page.page").update({
      documentId: page.documentId,
      data: { sections: seed.sections },
      status: "published",
    });
    for (const locale of LOCALES) {
      await strapi.documents("api::page.page").update({
        documentId: page.documentId,
        locale: locale.code,
        data: { sections: localized[locale.code].sections },
        status: "published",
      });
    }
    console.log(`Updated "${slug}" page sections (en/am/om).`);
  }

  for (const { slug, seed, localized } of PAGES_TO_CREATE) {
    const existing = await strapi.documents("api::page.page").findFirst({ filters: { slug } });
    if (existing) {
      console.log(`"${slug}" page already exists — skipped.`);
      continue;
    }
    const created = await strapi.documents("api::page.page").create({ data: seed, status: "published" });
    for (const locale of LOCALES) {
      await strapi.documents("api::page.page").update({
        documentId: created.documentId,
        locale: locale.code,
        data: { ...seed, ...localized[locale.code] },
        status: "published",
      });
    }
    console.log(`Created "${slug}" page (en/am/om).`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
