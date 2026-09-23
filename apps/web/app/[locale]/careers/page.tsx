import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Eyebrow } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { getJobVacancies } from "@/lib/strapi";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "careers" });
  return buildMetadata({
    locale: locale as Locale,
    path: "/careers",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function Careers({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("careers");
  const jobs = await getJobVacancies(locale as Locale);

  return (
    <main>
      <section className="bg-[linear-gradient(135deg,#f5fff0,#fffaf0)] py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl">
            {t("heading")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600">{t("subtitle")}</p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          {jobs.length === 0 ? (
            <div className="rounded-3xl border bg-slate-50 p-10 text-center">
              <h2 className="text-2xl font-black">{t("emptyTitle")}</h2>
              <p className="mt-3 text-slate-500">{t("emptyBody")}</p>
            </div>
          ) : (
            <div className="grid gap-5">
              {jobs.map((job) => (
                <Link
                  key={job.slug}
                  href={`/careers/${job.slug}`}
                  className="block rounded-3xl border p-7 transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <h2 className="text-2xl font-black">{job.title}</h2>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                    {job.location && <span>{job.location}</span>}
                    {job.employmentType && <span>· {job.employmentType}</span>}
                  </div>
                  {job.summary && <p className="mt-3 text-sm leading-6 text-slate-600">{job.summary}</p>}
                  <span className="mt-4 inline-block text-sm font-bold text-green-700">
                    {t("viewDetails")}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
