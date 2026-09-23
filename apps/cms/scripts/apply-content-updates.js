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
// Safe to re-run: it only overwrites the "footerLinks"/"navLinks" fields on Site
// Setting, the "sections" field on pages listed below, the "excerpt" field on
// articles listed below, and the name/slug/description/details/image fields on
// the products listed below, and only creates a page/product when none with
// that slug exists yet — it never touches anything you've edited by hand
// elsewhere (phone numbers, emails, other page content, article titles/content,
// etc). Renamed products are matched by their OLD slug, so this is a one-time
// migration per product — after it runs once, the old slug no longer exists and
// the rename step becomes a no-op on future runs.
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
  CROP_RESIDUE_PAGE_SEED,
  CROP_RESIDUE_PAGE_LOCALIZED,
  ARTICLES_SEED,
  ARTICLES_LOCALIZED,
  PRODUCTS_SEED,
  PRODUCTS_LOCALIZED,
  uploadProductImage,
  LOCALES,
} = require("../dist/src/index.js");

// Existing products being renamed + given a real photo (index into PRODUCTS_SEED).
const PRODUCTS_TO_RENAME = [
  { oldSlug: "dairy-feed", seedIndex: 0 },
  { oldSlug: "fattening-feed", seedIndex: 1 },
  { oldSlug: "poultry-feed", seedIndex: 2 },
];

// New products (index into PRODUCTS_SEED) created if they don't exist yet.
const PRODUCTS_TO_CREATE_INDEXES = [3, 4, 5];

// Products removed because they're now covered by specific named products above.
const PRODUCTS_TO_DELETE_SLUGS = ["other-livestock-feed"];

// Pages whose sections should be force-updated to match the current seed
// (i.e. pages that existed before this script was introduced, or whose
// content has since changed here).
const PAGES_TO_UPDATE = [
  { slug: "about", seed: ABOUT_PAGE_SEED, localized: ABOUT_PAGE_LOCALIZED },
  { slug: "quality", seed: QUALITY_PAGE_SEED, localized: QUALITY_PAGE_LOCALIZED },
  { slug: "crop-residue-feed", seed: CROP_RESIDUE_PAGE_SEED, localized: CROP_RESIDUE_PAGE_LOCALIZED },
];

// Pages that should be created if they don't exist yet.
const PAGES_TO_CREATE = [
  { slug: "facilities", seed: FACILITIES_PAGE_SEED, localized: FACILITIES_PAGE_LOCALIZED },
  { slug: "quality", seed: QUALITY_PAGE_SEED, localized: QUALITY_PAGE_LOCALIZED },
  { slug: "sustainability", seed: SUSTAINABILITY_PAGE_SEED, localized: SUSTAINABILITY_PAGE_LOCALIZED },
  { slug: "crop-residue-feed", seed: CROP_RESIDUE_PAGE_SEED, localized: CROP_RESIDUE_PAGE_LOCALIZED },
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

  for (let i = 0; i < ARTICLES_SEED.length; i++) {
    const { slug, excerpt } = ARTICLES_SEED[i];
    const article = await strapi.documents("api::article.article").findFirst({ filters: { slug } });
    if (!article) {
      console.log(`No "${slug}" article found — skipped.`);
      continue;
    }
    await strapi.documents("api::article.article").update({
      documentId: article.documentId,
      data: { excerpt },
      status: "published",
    });
    for (const locale of LOCALES) {
      await strapi.documents("api::article.article").update({
        documentId: article.documentId,
        locale: locale.code,
        data: { excerpt: ARTICLES_LOCALIZED[locale.code][i].excerpt },
        status: "published",
      });
    }
    console.log(`Updated "${slug}" article excerpt (en/am/om).`);
  }

  for (const { oldSlug, seedIndex } of PRODUCTS_TO_RENAME) {
    const product = await strapi.documents("api::product.product").findFirst({ filters: { slug: oldSlug } });
    if (!product) {
      console.log(`No product with slug "${oldSlug}" found — skipped.`);
      continue;
    }
    const { imageFile, slug, ...seedWithoutSlug } = PRODUCTS_SEED[seedIndex];
    // Only send "slug" when it's actually changing — Strapi's uid uniqueness
    // check on update doesn't exclude the document being updated, so resending
    // a document's OWN unchanged slug (e.g. dairy-feed -> dairy-feed) fails
    // with a false "must be unique" validation error.
    const slugPatch = slug !== oldSlug ? { slug } : {};
    const imageId = await uploadProductImage(strapi, imageFile);
    await strapi.documents("api::product.product").update({
      documentId: product.documentId,
      data: { ...seedWithoutSlug, ...slugPatch, image: imageId },
      status: "published",
    });
    for (const locale of LOCALES) {
      await strapi.documents("api::product.product").update({
        documentId: product.documentId,
        locale: locale.code,
        data: { ...seedWithoutSlug, ...slugPatch, ...PRODUCTS_LOCALIZED[locale.code][seedIndex], image: imageId },
        status: "published",
      });
    }
    console.log(`Updated product "${oldSlug}" -> "${slug}" (en/am/om), image attached.`);
  }

  for (const seedIndex of PRODUCTS_TO_CREATE_INDEXES) {
    const { imageFile, ...seed } = PRODUCTS_SEED[seedIndex];
    const existing = await strapi.documents("api::product.product").findFirst({ filters: { slug: seed.slug } });
    if (existing) {
      console.log(`Product "${seed.slug}" already exists — skipped.`);
      continue;
    }
    const imageId = await uploadProductImage(strapi, imageFile);
    const created = await strapi.documents("api::product.product").create({
      data: { ...seed, image: imageId },
      status: "published",
    });
    for (const locale of LOCALES) {
      await strapi.documents("api::product.product").update({
        documentId: created.documentId,
        locale: locale.code,
        data: { ...seed, ...PRODUCTS_LOCALIZED[locale.code][seedIndex], image: imageId },
        status: "published",
      });
    }
    console.log(`Created product "${seed.slug}" (en/am/om), image attached.`);
  }

  for (const slug of PRODUCTS_TO_DELETE_SLUGS) {
    const existing = await strapi.documents("api::product.product").findFirst({ filters: { slug } });
    if (!existing) {
      console.log(`Product "${slug}" not found — nothing to delete.`);
      continue;
    }
    // .delete({ documentId }) only removes the default-locale ("en") row —
    // it does not cascade to other locales, so am/om rows are deleted
    // explicitly too, or they'd survive as orphans.
    await strapi.documents("api::product.product").delete({ documentId: existing.documentId });
    for (const locale of LOCALES) {
      await strapi.documents("api::product.product").delete({ documentId: existing.documentId, locale: locale.code });
    }
    console.log(`Deleted product "${slug}" (en/am/om), superseded by specific products.`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
