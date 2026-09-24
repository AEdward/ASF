// One-off script to push seed-data updates into an ALREADY-SEEDED environment.
//
// The bootstrap seed functions in src/index.ts only create the Site Setting and
// Page records on first run (`if (existing) return;`), so once an environment has
// been seeded once, editing the seed data in code no longer reaches production —
// this script re-applies seed content directly via the Document Service API.
//
// Run from the CMS app root (apps/cms), after building, with the SAME env vars
// used to start the app (DATABASE_*, etc):
//   node scripts/apply-content-updates.js
//
// EVERY step below runs AT MOST ONCE, ever, per environment — each one is
// tagged with a migration key, and once a key has run it is recorded
// permanently (in Strapi's core store) and never runs again, even if this
// script is re-run on every future deploy (which it should be — it's how new
// migrations reach an already-seeded environment). This is what makes it
// actually safe to re-run: re-running it is a genuine no-op for anything
// already applied, so it can never overwrite content you've since edited by
// hand in the CMS admin.
//
// To push a NEW content change through this script in a future build, add a
// new block with a NEW, never-used-before migration key (e.g. bump "-v1" to
// "-v2") — never reuse an existing key, or it'll re-run and clobber any admin
// edits made to that content since the key was first marked done.
//
// This version also migrates any environment that ran an OLDER, unguarded
// copy of this script: every migration key below is pre-marked "already
// applied" the first time this guarded version runs (see ALREADY_APPLIED_ON_UPGRADE),
// without touching content, so upgrading to this script cannot itself
// overwrite whatever is currently live.

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
  PRIVACY_PAGE_SEED,
  PRIVACY_PAGE_LOCALIZED,
  TERMS_PAGE_SEED,
  TERMS_PAGE_LOCALIZED,
  ARTICLES_SEED,
  ARTICLES_LOCALIZED,
  PRODUCTS_SEED,
  PRODUCTS_LOCALIZED,
  FEED_RATES_SEED,
  FEED_RATES_LOCALIZED,
  uploadProductImage,
  LOCALES,
  seedAdminRole,
} = require("../dist/src/index.js");

const STORE = { type: "plugin", name: "asf-cms-migrations" };

async function hasRun(strapi, key) {
  return Boolean(await strapi.store.get({ ...STORE, key }));
}

async function markRun(strapi, key) {
  await strapi.store.set({ ...STORE, key, value: true });
}

// Migration keys that used to run unconditionally on EVERY script run,
// before this ledger existed, with no way to tell "seed value" apart from
// "value an admin has since edited by hand" just by looking at the current
// content. These are grandfathered as already-applied the first time this
// guarded script runs, WITHOUT touching content, so whatever is currently
// live (including any admin edits) is preserved rather than re-overwritten
// one more time on upgrade.
//
// The product rename/create/delete migrations are NOT listed here — those
// already had real existence checks (does the old slug still exist? does
// the new one already exist?), so they keep determining their own status
// from actual data below instead of being blindly assumed done, in case
// this script is being run for the first time on an environment that never
// got the products migration at all.
const ALREADY_APPLIED_ON_UPGRADE = [
  "site-setting-nav-footer-v1",
  "page-sections-about-v1",
  "page-sections-quality-v1",
  "page-sections-crop-residue-feed-v1",
  "article-excerpt-why-quality-feed-matters-v1",
  "article-excerpt-next-chapter-at-bulbula-v1",
  "article-excerpt-connecting-farmers-markets-agro-processing-v1",
];

// Existing products being renamed + given a real photo (index into PRODUCTS_SEED).
const PRODUCTS_TO_RENAME = [
  { oldSlug: "dairy-feed", seedIndex: 0, key: "product-rename-dairy-feed-v1" },
  { oldSlug: "fattening-feed", seedIndex: 1, key: "product-rename-fattening-feed-v1" },
  { oldSlug: "poultry-feed", seedIndex: 2, key: "product-rename-poultry-feed-v1" },
];

// New products (index into PRODUCTS_SEED) created if they don't exist yet.
const PRODUCTS_TO_CREATE = [
  { seedIndex: 3, key: "product-create-pullet-feed-v1" },
  { seedIndex: 4, key: "product-create-sheep-goat-feed-v1" },
  { seedIndex: 5, key: "product-create-camel-feed-v1" },
];

// Products removed because they're now covered by specific named products above.
const PRODUCTS_TO_DELETE = [{ slug: "other-livestock-feed", key: "product-delete-other-livestock-feed-v1" }];

// Pages whose sections should be force-updated to match the current seed
// (i.e. pages that existed before this script was introduced, or whose
// content has since changed here).
const PAGES_TO_UPDATE = [
  { slug: "about", seed: ABOUT_PAGE_SEED, localized: ABOUT_PAGE_LOCALIZED, key: "page-sections-about-v1" },
  { slug: "quality", seed: QUALITY_PAGE_SEED, localized: QUALITY_PAGE_LOCALIZED, key: "page-sections-quality-v1" },
  {
    slug: "crop-residue-feed",
    seed: CROP_RESIDUE_PAGE_SEED,
    localized: CROP_RESIDUE_PAGE_LOCALIZED,
    key: "page-sections-crop-residue-feed-v1",
  },
];

// Pages that should be created if they don't exist yet.
const PAGES_TO_CREATE = [
  { slug: "facilities", seed: FACILITIES_PAGE_SEED, localized: FACILITIES_PAGE_LOCALIZED },
  { slug: "quality", seed: QUALITY_PAGE_SEED, localized: QUALITY_PAGE_LOCALIZED },
  { slug: "sustainability", seed: SUSTAINABILITY_PAGE_SEED, localized: SUSTAINABILITY_PAGE_LOCALIZED },
  { slug: "crop-residue-feed", seed: CROP_RESIDUE_PAGE_SEED, localized: CROP_RESIDUE_PAGE_LOCALIZED },
  { slug: "privacy-policy", seed: PRIVACY_PAGE_SEED, localized: PRIVACY_PAGE_LOCALIZED },
  { slug: "terms-of-service", seed: TERMS_PAGE_SEED, localized: TERMS_PAGE_LOCALIZED },
];

const ARTICLE_EXCERPT_KEYS = {
  "why-quality-feed-matters": "article-excerpt-why-quality-feed-matters-v1",
  "next-chapter-at-bulbula": "article-excerpt-next-chapter-at-bulbula-v1",
  "connecting-farmers-markets-agro-processing":
    "article-excerpt-connecting-farmers-markets-agro-processing-v1",
};

async function main() {
  const appDir = path.join(__dirname, "..");
  const distDir = path.join(appDir, "dist");
  const strapi = await createStrapi({ appDir, distDir }).load();

  for (const key of ALREADY_APPLIED_ON_UPGRADE) {
    if (!(await hasRun(strapi, key))) {
      await markRun(strapi, key);
      console.log(`Upgrading to guarded migrations: marked "${key}" as already applied (no content changed).`);
    }
  }

  const siteSettingKey = "site-setting-nav-footer-v1";
  if (!(await hasRun(strapi, siteSettingKey))) {
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
      await markRun(strapi, siteSettingKey);
      console.log("Updated Site Setting footerLinks + navLinks (en/am/om).");
    } else {
      console.log("No Site Setting document found — skipped.");
    }
  }

  // Additive-only: appends the new Privacy Policy / Terms of Service footer
  // links WITHOUT replacing the footerLinks array, so any links an admin has
  // since added, removed or reordered by hand are preserved untouched.
  const footerLegalLinksKey = "site-setting-footer-legal-links-v1";
  if (!(await hasRun(strapi, footerLegalLinksKey))) {
    const siteSetting = await strapi.documents("api::site-setting.site-setting").findFirst();
    if (siteSetting) {
      const FOOTER_LEGAL_LINKS = {
        en: [
          { label: "Privacy Policy", href: "/privacy-policy" },
          { label: "Terms of Service", href: "/terms-of-service" },
        ],
        am: [
          { label: "የግላዊነት ፖሊሲ", href: "/privacy-policy" },
          { label: "የአገልግሎት ውሎች", href: "/terms-of-service" },
        ],
        om: [
          { label: "Imaammata Dhuunfaa", href: "/privacy-policy" },
          { label: "Haala Tajaajilaa", href: "/terms-of-service" },
        ],
      };

      const appendFooterLegalLinks = async (locale) => {
        const current = await strapi.documents("api::site-setting.site-setting").findOne({
          documentId: siteSetting.documentId,
          ...(locale ? { locale } : {}),
        });
        const existingLinks = current?.footerLinks ?? [];
        const alreadyHasLegalLinks = existingLinks.some(
          (l) => l.href === "/privacy-policy" || l.href === "/terms-of-service",
        );
        if (alreadyHasLegalLinks) return;
        await strapi.documents("api::site-setting.site-setting").update({
          documentId: siteSetting.documentId,
          ...(locale ? { locale } : {}),
          data: { footerLinks: [...existingLinks, ...FOOTER_LEGAL_LINKS[locale || "en"]] },
        });
      };

      await appendFooterLegalLinks(undefined);
      for (const locale of LOCALES) {
        await appendFooterLegalLinks(locale.code);
      }
      await markRun(strapi, footerLegalLinksKey);
      console.log(
        "Appended Privacy Policy / Terms of Service links to Site Setting footerLinks (en/am/om), keeping existing entries as-is.",
      );
    } else {
      console.log("No Site Setting document found — skipped footer legal links.");
    }
  }

  // Additive-only: appends Testimonials + Documents under the existing About
  // submenu, and Feed Calculator under the existing Products submenu, WITHOUT
  // replacing navLinks — so any items an admin has since added, removed or
  // reordered by hand are preserved. Nested under existing menus (rather than
  // added as new top-level items) to avoid overcrowding the header.
  const navNewPagesKey = "site-setting-nav-new-pages-v2";
  if (!(await hasRun(strapi, navNewPagesKey))) {
    const siteSetting = await strapi.documents("api::site-setting.site-setting").findFirst();
    if (siteSetting) {
      const NEW_NAV_ITEMS = {
        en: {
          testimonials: { label: "Testimonials", href: "/about/testimonials" },
          documents: { label: "Documents", href: "/documents" },
          calculator: { label: "Feed Calculator", href: "/calculator" },
        },
        am: {
          testimonials: { label: "ምስክርነቶች", href: "/about/testimonials" },
          documents: { label: "ሰነዶች", href: "/documents" },
          calculator: { label: "የመኖ ማስያ", href: "/calculator" },
        },
        om: {
          testimonials: { label: "Ragaa Maamiltootaa", href: "/about/testimonials" },
          documents: { label: "Sanadoota", href: "/documents" },
          calculator: { label: "Herregaa Nyaataa", href: "/calculator" },
        },
      };

      const appendChild = (navLinks, parentHref, child) =>
        navLinks.map((link) => {
          if (link.href !== parentHref) return link;
          const children = link.children ?? [];
          if (children.some((c) => c.href === child.href)) return link;
          return { ...link, children: [...children, child] };
        });

      const appendNavItems = async (locale) => {
        const current = await strapi.documents("api::site-setting.site-setting").findOne({
          documentId: siteSetting.documentId,
          ...(locale ? { locale } : {}),
        });
        const items = NEW_NAV_ITEMS[locale || "en"];

        let nextNavLinks = current?.navLinks ?? [];
        nextNavLinks = appendChild(nextNavLinks, "/about", items.testimonials);
        nextNavLinks = appendChild(nextNavLinks, "/about", items.documents);
        nextNavLinks = appendChild(nextNavLinks, "/products", items.calculator);

        await strapi.documents("api::site-setting.site-setting").update({
          documentId: siteSetting.documentId,
          ...(locale ? { locale } : {}),
          data: { navLinks: nextNavLinks },
        });
      };

      await appendNavItems(undefined);
      for (const locale of LOCALES) {
        await appendNavItems(locale.code);
      }
      await markRun(strapi, navNewPagesKey);
      console.log(
        "Appended Testimonials + Documents (under About) and Feed Calculator (under Products) to Site Setting navLinks (en/am/om), keeping existing entries as-is.",
      );
    } else {
      console.log("No Site Setting document found — skipped nav additions.");
    }
  }

  // Seeds the Feed Calculator's default rates only if the collection is
  // completely empty — never overwrites rates an admin has since edited.
  const feedRatesKey = "feed-rates-seed-v1";
  if (!(await hasRun(strapi, feedRatesKey))) {
    const existingCount = await strapi.documents("api::feed-rate.feed-rate").count();
    if (existingCount > 0) {
      console.log(`Feed rates collection already has ${existingCount} entr(y/ies) — skipped seeding.`);
    } else {
      for (let i = 0; i < FEED_RATES_SEED.length; i++) {
        const seed = FEED_RATES_SEED[i];
        const created = await strapi.documents("api::feed-rate.feed-rate").create({
          data: seed,
          status: "published",
        });
        for (const locale of LOCALES) {
          await strapi.documents("api::feed-rate.feed-rate").update({
            documentId: created.documentId,
            locale: locale.code,
            data: { ...seed, ...FEED_RATES_LOCALIZED[locale.code][i] },
            status: "published",
          });
        }
      }
      console.log(`Created ${FEED_RATES_SEED.length} default feed rates (en/am/om).`);
    }
    await markRun(strapi, feedRatesKey);
  }

  for (const { slug, seed, localized, key } of PAGES_TO_UPDATE) {
    if (await hasRun(strapi, key)) continue;
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
    await markRun(strapi, key);
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
    const key = ARTICLE_EXCERPT_KEYS[slug];
    if (key && (await hasRun(strapi, key))) continue;
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
    if (key) await markRun(strapi, key);
    console.log(`Updated "${slug}" article excerpt (en/am/om).`);
  }

  for (const { oldSlug, seedIndex, key } of PRODUCTS_TO_RENAME) {
    if (await hasRun(strapi, key)) continue;
    const product = await strapi
      .documents("api::product.product")
      .findFirst({ filters: { slug: oldSlug }, populate: ["image"] });
    if (!product) {
      console.log(`No product with slug "${oldSlug}" found — skipped.`);
      continue;
    }
    // For products whose slug doesn't change (e.g. "dairy-feed" -> "dairy-feed"),
    // the old-slug match above can't tell "never migrated" apart from
    // "already migrated, since the slug is the same either way". A real
    // photo attached is a signal that never exists pre-migration, so treat
    // that as "already done" rather than re-overwriting the description
    // fields (which may have been edited by hand since).
    if (product.image) {
      await markRun(strapi, key);
      console.log(`Product "${oldSlug}" already has a photo attached — treating as already migrated, skipped.`);
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
    await markRun(strapi, key);
    console.log(`Updated product "${oldSlug}" -> "${slug}" (en/am/om), image attached.`);
  }

  for (const { seedIndex, key } of PRODUCTS_TO_CREATE) {
    if (await hasRun(strapi, key)) continue;
    const { imageFile, ...seed } = PRODUCTS_SEED[seedIndex];
    const existing = await strapi.documents("api::product.product").findFirst({ filters: { slug: seed.slug } });
    if (existing) {
      await markRun(strapi, key);
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
    await markRun(strapi, key);
    console.log(`Created product "${seed.slug}" (en/am/om), image attached.`);
  }

  for (const { slug, key } of PRODUCTS_TO_DELETE) {
    if (await hasRun(strapi, key)) continue;
    const existing = await strapi.documents("api::product.product").findFirst({ filters: { slug } });
    if (!existing) {
      await markRun(strapi, key);
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
    await markRun(strapi, key);
    console.log(`Deleted product "${slug}" (en/am/om), superseded by specific products.`);
  }

  const adminRoleBefore = await strapi.service("admin::role").findOne({ name: "Admin" });
  if (!adminRoleBefore) {
    await seedAdminRole(strapi);
    console.log('Created "Admin" role with full access except tokens/webhooks.');
  } else {
    console.log('"Admin" role already exists — skipped.');
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
