import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Eyebrow } from "@/components/ui";
import { getPartners } from "@/lib/strapi";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "partners" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function Partners({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("partners");
  const partners = await getPartners(locale as Locale);

  return (
    <main>
      <section className="bg-[linear-gradient(135deg,#f5fff0,#fffaf0)] py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl">
            {t("heading")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600">{t("subtitle")}</p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {partners.length === 0 ? (
            <div className="rounded-3xl border bg-slate-50 p-10 text-center">
              <h2 className="text-2xl font-black">{t("emptyTitle")}</h2>
              <p className="mt-3 text-slate-500">{t("emptyBody")}</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {partners.map((partner) => (
                <div key={partner.id} className="rounded-3xl border p-7">
                  {partner.logoUrl && (
                    <div className="relative mb-4 h-14 w-32">
                      <Image src={partner.logoUrl} alt={partner.name} fill className="object-contain" />
                    </div>
                  )}
                  <h2 className="text-xl font-black">{partner.name}</h2>
                  {partner.category && (
                    <span className="mt-1 inline-block text-xs font-black tracking-widest text-green-700">
                      {partner.category.toUpperCase()}
                    </span>
                  )}
                  {partner.description && (
                    <p className="mt-3 text-sm leading-6 text-slate-600">{partner.description}</p>
                  )}
                  {partner.websiteUrl && (
                    <a
                      href={partner.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-sm font-bold text-green-700"
                    >
                      {t("visitWebsite")} →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
