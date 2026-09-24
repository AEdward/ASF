import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Eyebrow } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { SearchBox } from "@/components/search-box";
import { runSiteSearch } from "@/lib/search";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

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
  const query = (q ?? "").trim();

  const st = await getTranslations({ locale, namespace: "search" });
  const groups = await runSiteSearch(locale as Locale, query);
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
