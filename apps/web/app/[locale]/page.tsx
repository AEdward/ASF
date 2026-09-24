import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionRenderer } from "@/components/section-renderer";
import { LatestNews } from "@/components/latest-news";
import { PartnersMarquee } from "@/components/partners-marquee";
import { TestimonialsHighlight } from "@/components/testimonials-highlight";
import { DEFAULT_HOME_SECTIONS } from "@/lib/sections";
import { getFeaturedTestimonials, getLatestArticles, getPage, getPartners } from "@/lib/strapi";
import { buildMetadata, websiteJsonLd, JsonLd } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  const meta = buildMetadata({
    locale: locale as Locale,
    path: "",
    title: t("homeTitle"),
    description: t("siteDescription"),
  });
  // The home title already includes the brand name, so pin it as absolute
  // to bypass the layout's title.template — otherwise the root route
  // inconsistently drops the templated suffix that every other page gets.
  return { ...meta, title: { absolute: t("homeTitle") } };
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
      <JsonLd data={websiteJsonLd(locale as Locale)} />
      <SectionRenderer sections={sections} />
      <PartnersMarquee partners={partners} />
      <TestimonialsHighlight testimonials={featuredTestimonials} />
      <LatestNews articles={latestArticles} />
    </main>
  );
}
