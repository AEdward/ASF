import { setRequestLocale } from "next-intl/server";
import { SectionRenderer } from "@/components/section-renderer";
import { DEFAULT_HOME_SECTIONS } from "@/lib/sections";
import { getPage } from "@/lib/strapi";
import type { Locale } from "@/i18n/routing";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const sections = (await getPage("home", locale as Locale)) ?? DEFAULT_HOME_SECTIONS;

  return (
    <main>
      <SectionRenderer sections={sections} />
    </main>
  );
}
