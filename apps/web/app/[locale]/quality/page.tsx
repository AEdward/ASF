import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionRenderer } from "@/components/section-renderer";
import { DEFAULT_QUALITY_SECTIONS } from "@/lib/sections";
import { getPage } from "@/lib/strapi";
import { buildMetadata, breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "quality" });
  return buildMetadata({
    locale: locale as Locale,
    path: "/quality",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function Quality({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const tc = await getTranslations("common");
  const tPage = await getTranslations("quality");

  const sections = (await getPage("quality", locale as Locale)) ?? DEFAULT_QUALITY_SECTIONS;

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: tc("breadcrumbHome"), path: "" },
            { name: tPage("metaTitle"), path: "/quality" },
          ],
          locale as Locale
        )}
      />
      <SectionRenderer sections={sections} />
    </main>
  );
}
