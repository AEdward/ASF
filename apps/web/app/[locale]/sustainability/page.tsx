import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionRenderer } from "@/components/section-renderer";
import { DEFAULT_SUSTAINABILITY_SECTIONS } from "@/lib/sections";
import { getPage } from "@/lib/strapi";
import { buildMetadata, breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sustainability" });
  return buildMetadata({
    locale: locale as Locale,
    path: "/sustainability",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function Sustainability({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const tc = await getTranslations("common");
  const tPage = await getTranslations("sustainability");

  const sections = (await getPage("sustainability", locale as Locale)) ?? DEFAULT_SUSTAINABILITY_SECTIONS;

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: tc("breadcrumbHome"), path: "" },
            { name: tPage("metaTitle"), path: "/sustainability" },
          ],
          locale as Locale
        )}
      />
      <SectionRenderer sections={sections} />
    </main>
  );
}
