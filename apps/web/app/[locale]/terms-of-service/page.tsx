import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionRenderer } from "@/components/section-renderer";
import { DEFAULT_TERMS_SECTIONS } from "@/lib/sections";
import { getPage } from "@/lib/strapi";
import { buildMetadata, breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "termsOfService" });
  return buildMetadata({
    locale: locale as Locale,
    path: "/terms-of-service",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function TermsOfService({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const tc = await getTranslations("common");
  const tPage = await getTranslations("termsOfService");

  const sections = (await getPage("terms-of-service", locale as Locale)) ?? DEFAULT_TERMS_SECTIONS;

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: tc("breadcrumbHome"), path: "" },
            { name: tPage("metaTitle"), path: "/terms-of-service" },
          ],
          locale as Locale
        )}
      />
      <SectionRenderer sections={sections} />
    </main>
  );
}
