import { setRequestLocale } from "next-intl/server";
import { SectionRenderer } from "@/components/section-renderer";
import { LatestNews } from "@/components/latest-news";
import { PartnersMarquee } from "@/components/partners-marquee";
import { DEFAULT_HOME_SECTIONS } from "@/lib/sections";
import { getLatestArticles, getPage, getPartners } from "@/lib/strapi";
import type { Locale } from "@/i18n/routing";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const [sections, latestArticles, partners] = await Promise.all([
    getPage("home", locale as Locale).then((s) => s ?? DEFAULT_HOME_SECTIONS),
    getLatestArticles(locale as Locale),
    getPartners(locale as Locale),
  ]);

  return (
    <main>
      <SectionRenderer sections={sections} />
      <PartnersMarquee partners={partners} />
      <LatestNews articles={latestArticles} />
    </main>
  );
}
