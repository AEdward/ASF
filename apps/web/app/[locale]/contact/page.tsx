import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Eyebrow } from "@/components/ui";
import { ContactForm } from "@/components/contact/contact-form";
import { getSiteSettings } from "@/lib/strapi";
import { buildMetadata, breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return buildMetadata({
    locale: locale as Locale,
    path: "/contact",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function Contact({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("contact");
  const tc = await getTranslations("common");
  const settings = await getSiteSettings(locale as Locale);

  const details = [
    [t("labels.headOffice"), settings.headOffice],
    [t("labels.factory"), settings.factoryAddress],
    [t("labels.expansion"), settings.expansionAddress],
    [t("labels.phone"), `${settings.phonePrimary} · ${settings.phoneSecondary}`],
    [t("labels.email"), `${settings.emailPrimary} · ${settings.emailSecondary}`],
  ];

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: tc("breadcrumbHome"), path: "" },
            { name: t("metaTitle"), path: "/contact" },
          ],
          locale as Locale
        )}
      />
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
        <div className="mx-auto grid max-w-7xl gap-6 px-5 lg:grid-cols-2 lg:px-8">
          <div className="rounded-3xl border p-8">
            <Eyebrow>{t("detailsEyebrow")}</Eyebrow>
            <h2 className="text-3xl font-black">{t("detailsHeading")}</h2>
            <div className="mt-7 space-y-3">
              {details.map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-slate-50 p-4">
                  <b className="block text-xs uppercase tracking-widest text-green-700">
                    {label}
                  </b>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
          <ContactForm />
        </div>
        {settings.mapEmbedUrl && (
          <div className="mx-auto mt-6 max-w-7xl px-5 lg:px-8">
            <div className="overflow-hidden rounded-3xl border">
              <iframe
                src={settings.mapEmbedUrl}
                title={t("mapTitle")}
                width="100%"
                height="420"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
