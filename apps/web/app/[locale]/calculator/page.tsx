import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Eyebrow } from "@/components/ui";
import { FeedCalculator } from "@/components/calculator/feed-calculator";
import { getFeedRates } from "@/lib/strapi";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "calculator" });
  return buildMetadata({
    locale: locale as Locale,
    path: "/calculator",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function Calculator({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("calculator");
  const rates = await getFeedRates(locale as Locale);

  return (
    <main>
      <section className="no-print bg-[linear-gradient(135deg,#f5fff0,#fffaf0)] py-20">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 className="max-w-3xl text-5xl font-black tracking-tight sm:text-6xl">
            {t("heading")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600">{t("subtitle")}</p>
        </div>
      </section>

      <section className="py-24 print:p-0">
        <div className="mx-auto max-w-5xl px-5 lg:px-8 print:m-0 print:max-w-none print:p-0">
          <FeedCalculator rates={rates} />
        </div>
      </section>
    </main>
  );
}
