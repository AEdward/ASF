import { notFound } from "next/navigation";

// A [locale] dynamic segment only matches paths that resolve to an actual
// leaf route, so an arbitrary unknown path (e.g. /en/some-typo) would
// otherwise never enter this layout tree at all, and Next would render its
// generic default 404 instead of the branded one at not-found.tsx. This
// catch-all gives every other path under a locale a real route to match,
// so it hits notFound() from inside the tree and renders the branded page.
export default function CatchAll() {
  notFound();
}
