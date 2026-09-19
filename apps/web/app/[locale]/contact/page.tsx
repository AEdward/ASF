import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Eyebrow } from "@/components/ui";
import { getSiteSettings } from "@/lib/strapi";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function Contact({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("contact");
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
          <form
            className="rounded-3xl border p-8"
            action={`mailto:${settings.emailPrimary}`}
            method="post"
            encType="text/plain"
          >
            <Eyebrow>{t("form.eyebrow")}</Eyebrow>
            <div className="grid gap-3">
              <input
                required
                name="name"
                placeholder={t("form.namePlaceholder")}
                className="rounded-xl border p-3"
              />
              <input
                required
                type="email"
                name="email"
                placeholder={t("form.emailPlaceholder")}
                className="rounded-xl border p-3"
              />
              <input
                name="company"
                placeholder={t("form.companyPlaceholder")}
                className="rounded-xl border p-3"
              />
              <textarea
                required
                name="message"
                placeholder={t("form.messagePlaceholder")}
                className="min-h-40 rounded-xl border p-3"
              />
              <button className="rounded-xl bg-[#58c900] px-5 py-3 font-extrabold text-[#092713]">
                {t("form.submit")}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
