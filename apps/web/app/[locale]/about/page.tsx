import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionRenderer } from "@/components/section-renderer";
import { DEFAULT_ABOUT_SECTIONS } from "@/lib/sections";
import { getPage } from "@/lib/strapi";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return buildMetadata({
    locale: locale as Locale,
    path: "/about",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function About({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const sections = (await getPage("about", locale as Locale)) ?? DEFAULT_ABOUT_SECTIONS;

  return (
    <main>
      <SectionRenderer sections={sections} />
    </main>
  );
}
