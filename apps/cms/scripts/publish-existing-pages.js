// One-off fix for pages that exist in the CMS but were never published, so
// the public website only ever saw hardcoded fallback content for them.
//
// This ONLY flips the publish state on whatever draft content already
// exists — it never creates, edits, or overwrites any content, so any
// admin edits (including uploaded images) are published exactly as they
// currently are. Safe to re-run any time: already-published locales are
// skipped every time.
//
// Run from the CMS app root (apps/cms), after building, with the SAME env
// vars used to start the app (DATABASE_*, etc):
//   node scripts/publish-existing-pages.js

const path = require("path");
const { createStrapi } = require("@strapi/core");

const LOCALES = ["en", "am", "om"];

async function main() {
  const appDir = path.join(__dirname, "..");
  const distDir = path.join(appDir, "dist");
  const strapi = await createStrapi({ appDir, distDir }).load();

  const pageService = strapi.documents("api::page.page");
  const entries = await pageService.findMany({ locale: "en", status: "draft" });
  console.log(`Found ${entries.length} page document(s) to check.`);

  let publishedCount = 0;
  for (const entry of entries) {
    for (const locale of LOCALES) {
      const draftEntry = await pageService.findOne({
        documentId: entry.documentId,
        locale,
        status: "draft",
      });
      if (!draftEntry) continue;

      const publishedEntry = await pageService.findOne({
        documentId: entry.documentId,
        locale,
        status: "published",
      });
      if (publishedEntry) continue;

      await pageService.publish({ documentId: entry.documentId, locale });
      console.log(`Published "${entry.slug}" [${locale}].`);
      publishedCount++;
    }
  }
  console.log(`Done. Published ${publishedCount} page/locale combination(s) that were previously unpublished.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
