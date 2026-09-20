// One-off script to push seed-data updates into an ALREADY-SEEDED environment.
//
// The bootstrap seed functions in src/index.ts only create the Site Setting and
// Page records on first run (`if (existing) return;`), so once an environment has
// been seeded once, editing the seed data in code no longer reaches production —
// this script re-applies the current seed content directly via the Document
// Service API, for exactly the fields covered below.
//
// Run from the CMS app root (apps/cms), after building, with the SAME env vars
// used to start the app (DATABASE_*, etc):
//   node scripts/apply-content-updates.js
//
// Safe to re-run; it only overwrites the "footerLinks" field on Site Setting and
// the "sections" field on the About page — it never touches anything you've
// edited by hand elsewhere (phone numbers, emails, other pages, etc).

const path = require("path");
const { createStrapi } = require("@strapi/core");
const {
  SITE_SETTINGS_SEED,
  SITE_SETTINGS_LOCALIZED,
  ABOUT_PAGE_SEED,
  ABOUT_PAGE_LOCALIZED,
  LOCALES,
} = require("../dist/src/index.js");

async function main() {
  const appDir = path.join(__dirname, "..");
  const distDir = path.join(appDir, "dist");
  const strapi = await createStrapi({ appDir, distDir }).load();

  const siteSetting = await strapi.documents("api::site-setting.site-setting").findFirst();
  if (siteSetting) {
    await strapi.documents("api::site-setting.site-setting").update({
      documentId: siteSetting.documentId,
      data: { footerLinks: SITE_SETTINGS_SEED.footerLinks },
    });
    for (const locale of LOCALES) {
      await strapi.documents("api::site-setting.site-setting").update({
        documentId: siteSetting.documentId,
        locale: locale.code,
        data: { footerLinks: SITE_SETTINGS_LOCALIZED[locale.code].footerLinks },
      });
    }
    console.log("Updated Site Setting footerLinks (en/am/om).");
  } else {
    console.log("No Site Setting document found — skipped.");
  }

  const aboutPage = await strapi.documents("api::page.page").findFirst({ filters: { slug: "about" } });
  if (aboutPage) {
    await strapi.documents("api::page.page").update({
      documentId: aboutPage.documentId,
      data: { sections: ABOUT_PAGE_SEED.sections },
      status: "published",
    });
    for (const locale of LOCALES) {
      await strapi.documents("api::page.page").update({
        documentId: aboutPage.documentId,
        locale: locale.code,
        data: { sections: ABOUT_PAGE_LOCALIZED[locale.code].sections },
        status: "published",
      });
    }
    console.log("Updated About page sections (en/am/om).");
  } else {
    console.log("No About page document found — skipped.");
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
