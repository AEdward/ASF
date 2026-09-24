import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionRenderer } from "@/components/section-renderer";
import { LatestNews } from "@/components/latest-news";
import { PartnersMarquee } from "@/components/partners-marquee";
import { TestimonialsHighlight } from "@/components/testimonials-highlight";
import { DEFAULT_HOME_SECTIONS } from "@/lib/sections";
import { getFeaturedTestimonials, getLatestArticles, getPage, getPartners } from "@/lib/strapi";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  return buildMetadata({
    locale: locale as Locale,
    path: "",
    title: "ASF Agro Industry",
    description: t("siteDescription"),
  });
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const [sections, latestArticles, partners, featuredTestimonials] = await Promise.all([
    getPage("home", locale as Locale).then((s) => s ?? DEFAULT_HOME_SECTIONS),
    getLatestArticles(locale as Locale),
    getPartners(locale as Locale),
    getFeaturedTestimonials(locale as Locale),
  ]);

  return (
    <main>
      <SectionRenderer sections={sections} />
      <PartnersMarquee partners={partners} />
      <TestimonialsHighlight testimonials={featuredTestimonials} />
      <LatestNews articles={latestArticles} />
    </main>
  );
}
