import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Eyebrow } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { SearchBox } from "@/components/search-box";
import { getArticles, getJobVacancies, getProducts } from "@/lib/strapi";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

const STATIC_PAGES = [
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
  { namespace: "privacyPolicy", href: "/privacy-policy" },
  { namespace: "termsOfService", href: "/terms-of-service" },
] as const;

function matches(query: string, ...values: (string | undefined)[]) {
  return values.some((v) => v?.toLowerCase().includes(query));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "search" });
  return buildMetadata({
    locale: locale as Locale,
    path: "/search",
    title: t("metaTitle"),
    description: t("metaDescription"),
    noIndex: true,
  });
}

export default async function Search({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const { q } = await searchParams;
  const query = (q ?? "").trim().toLowerCase();

  const t = await getTranslations({ locale });
  const st = await getTranslations({ locale, namespace: "search" });

  const [products, articles, jobs] = query
    ? await Promise.all([
        getProducts(locale as Locale),
        getArticles(locale as Locale),
        getJobVacancies(locale as Locale),
      ])
    : [[], [], []];

  const pageResults = query
    ? STATIC_PAGES.filter(({ namespace }) =>
        matches(query, t(`${namespace}.metaTitle`), t(`${namespace}.metaDescription`)),
      ).map(({ namespace, href }) => ({
        title: t(`${namespace}.metaTitle`),
        description: t(`${namespace}.metaDescription`),
        href,
      }))
    : [];

  const productResults = query
    ? products
        .filter((p) => matches(query, p.name, p.description))
        .map((p) => ({ title: p.name, description: p.description, href: "/products" }))
    : [];

  const articleResults = query
    ? articles
        .filter((a) => matches(query, a.title, a.excerpt))
        .map((a) => ({ title: a.title, description: a.excerpt, href: `/blog/${a.slug}` }))
    : [];

  const jobResults = query
    ? jobs
        .filter((j) => matches(query, j.title, j.summary))
        .map((j) => ({ title: j.title, description: j.summary, href: `/careers/${j.slug}` }))
    : [];

  const groups = [
    { label: st("categoryPages"), results: pageResults },
    { label: st("categoryProducts"), results: productResults },
    { label: st("categoryNews"), results: articleResults },
    { label: st("categoryCareers"), results: jobResults },
  ].filter((g) => g.results.length > 0);

  const totalResults = groups.reduce((sum, g) => sum + g.results.length, 0);

  return (
    <main>
      <section className="bg-[linear-gradient(135deg,#f5fff0,#fffaf0)] py-20">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <Eyebrow>{st("eyebrow")}</Eyebrow>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">{st("heading")}</h1>
          <div className="mt-8">
            <SearchBox initialQuery={q ?? ""} />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          {!query && (
            <div className="rounded-3xl border bg-slate-50 p-10 text-center">
              <h2 className="text-2xl font-black">{st("noQueryTitle")}</h2>
              <p className="mt-3 text-slate-500">{st("noQueryBody")}</p>
            </div>
          )}

          {query && totalResults === 0 && (
            <div className="rounded-3xl border bg-slate-50 p-10 text-center">
              <h2 className="text-2xl font-black">{st("noResultsTitle")}</h2>
              <p className="mt-3 text-slate-500">{st("noResultsBody")}</p>
            </div>
          )}

          {query && totalResults > 0 && (
            <>
              <p className="mb-8 text-sm font-semibold text-slate-500">
                {st("resultsFor", { query: q ?? "" })}
              </p>
              <div className="space-y-10">
                {groups.map((group) => (
                  <div key={group.label}>
                    <h2 className="mb-3 text-xs font-black uppercase tracking-widest text-green-700">
                      {group.label}
                    </h2>
                    <div className="grid gap-3">
                      {group.results.map((result, i) => (
                        <Link
                          key={`${result.href}-${i}`}
                          href={result.href}
                          className="block rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
                        >
                          <h3 className="text-lg font-bold">{result.title}</h3>
                          {result.description && (
                            <p className="mt-1 text-sm text-slate-600">{result.description}</p>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
