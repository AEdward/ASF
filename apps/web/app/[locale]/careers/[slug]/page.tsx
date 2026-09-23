import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Eyebrow } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { getJobVacancies, getJobVacancy, getSiteSettings } from "@/lib/strapi";
import { buildMetadata, jobPostingJsonLd, JsonLd } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  const jobs = await getJobVacancies(params.locale as Locale);
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const job = await getJobVacancy(slug, locale as Locale);
  if (!job) return {};
  return buildMetadata({
    locale: locale as Locale,
    path: `/careers/${slug}`,
    title: job.title,
    description: job.summary || job.title,
  });
}

export default async function JobVacancyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("careers");
  const [job, settings] = await Promise.all([
    getJobVacancy(slug, locale as Locale),
    getSiteSettings(locale as Locale),
  ]);

  if (!job) notFound();

  return (
    <main>
      <JsonLd
        data={jobPostingJsonLd({
          title: job.title,
          description: job.description || job.summary || job.title,
          datePosted: job.postedAt,
          employmentType: job.employmentType,
          location: job.location,
        })}
      />
      <section className="bg-[linear-gradient(135deg,#f5fff0,#fffaf0)] py-20">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <Link href="/careers" className="text-sm font-bold text-green-700">
            {t("backToCareers")}
          </Link>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">{job.title}</h1>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
            {job.location && <span>{job.location}</span>}
            {job.employmentType && <span>· {job.employmentType}</span>}
            {job.postedAt && (
              <span>
                · {t("postedLabel")} {job.postedAt}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          {job.description && (
            <div className="whitespace-pre-line leading-7 text-slate-700">{job.description}</div>
          )}

          {job.requirements.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-black">{t("requirementsHeading")}</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
                {job.requirements.map((requirement) => (
                  <li key={requirement}>{requirement}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-12 rounded-3xl border bg-slate-50 p-8">
            <h2 className="text-2xl font-black">{t("applyHeading")}</h2>
            <p className="mt-3 text-slate-600">
              {t("applyBody", { email: settings.emailPrimary })}
            </p>
            <a
              href={`mailto:${settings.emailPrimary}?subject=${encodeURIComponent(job.title)}`}
              className="mt-5 inline-block rounded-xl bg-[#58c900] px-5 py-3 font-extrabold text-[#092713]"
            >
              {t("applyButton")}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
