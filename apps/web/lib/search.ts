import { getTranslations } from "next-intl/server";
import { getArticles, getJobVacancies, getProducts } from "@/lib/strapi";
import type { Locale } from "@/i18n/routing";

export const STATIC_PAGES = [
  { namespace: "about", href: "/about" },
  { namespace: "facilities", href: "/facilities" },
  { namespace: "quality", href: "/quality" },
  { namespace: "sustainability", href: "/sustainability" },
  { namespace: "cropResidueFeed", href: "/crop-residue-feed" },
  { namespace: "products", href: "/products" },
  { namespace: "blog", href: "/blog" },
  { namespace: "partners", href: "/partners" },
  { namespace: "gallery", href: "/gallery" },
  { namespace: "careers", href: "/careers" },
  { namespace: "contact", href: "/contact" },
  { namespace: "documents", href: "/documents" },
  { namespace: "calculator", href: "/calculator" },
  { namespace: "testimonials", href: "/about/testimonials" },
  { namespace: "privacyPolicy", href: "/privacy-policy" },
  { namespace: "termsOfService", href: "/terms-of-service" },
] as const;

function matches(query: string, ...values: (string | undefined)[]) {
  return values.some((v) => v?.toLowerCase().includes(query));
}

export interface SearchResult {
  title: string;
  description?: string;
  href: string;
}

export interface SearchResultGroup {
  label: string;
  results: SearchResult[];
}

export async function runSiteSearch(locale: Locale, rawQuery: string): Promise<SearchResultGroup[]> {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const t = await getTranslations({ locale });
  const st = await getTranslations({ locale, namespace: "search" });

  const [products, articles, jobs] = await Promise.all([
    getProducts(locale),
    getArticles(locale),
    getJobVacancies(locale),
  ]);

  const pageResults: SearchResult[] = STATIC_PAGES.filter(({ namespace }) =>
    matches(query, t(`${namespace}.metaTitle`), t(`${namespace}.metaDescription`)),
  ).map(({ namespace, href }) => ({
    title: t(`${namespace}.metaTitle`),
    description: t(`${namespace}.metaDescription`),
    href,
  }));

  const productResults: SearchResult[] = products
    .filter((p) => matches(query, p.name, p.description))
    .map((p) => ({ title: p.name, description: p.description, href: `/products/${p.slug}` }));

  const articleResults: SearchResult[] = articles
    .filter((a) => matches(query, a.title, a.excerpt))
    .map((a) => ({ title: a.title, description: a.excerpt, href: `/blog/${a.slug}` }));

  const jobResults: SearchResult[] = jobs
    .filter((j) => matches(query, j.title, j.summary))
    .map((j) => ({ title: j.title, description: j.summary, href: `/careers/${j.slug}` }));

  return [
    { label: st("categoryPages"), results: pageResults },
    { label: st("categoryProducts"), results: productResults },
    { label: st("categoryNews"), results: articleResults },
    { label: st("categoryCareers"), results: jobResults },
  ].filter((g) => g.results.length > 0);
}
