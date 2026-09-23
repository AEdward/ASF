import type { Metadata } from "next";
import { Noto_Sans_Ethiopic } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "../globals.css";
import { Analytics } from "@/components/analytics";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getSiteSettings } from "@/lib/strapi";
import { routing, type Locale } from "@/i18n/routing";

const notoSansEthiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  weight: ["400", "700", "900"],
  variable: "--font-ethiopic",
  display: "swap",
});

const SITE_URL = process.env.SITE_URL || "https://asf-agro.example.com";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  const description = t("siteDescription");

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: "ASF Agro Industry", template: "%s | ASF Agro Industry" },
    description,
    icons: { icon: "/asf-logo.png" },
    openGraph: {
      title: "ASF Agro Industry",
      description,
      url: SITE_URL,
      siteName: "ASF Agro Industry",
      images: ["/asf-logo.png"],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale as Locale);

  const settings = await getSiteSettings(locale as Locale);

  return (
    <html lang={locale} className={notoSansEthiopic.variable}>
      <body>
        <NextIntlClientProvider>
          <Analytics strapiUrl={process.env.STRAPI_URL || "http://localhost:1337"} />
          <Header
            companyName={settings.companyName}
            tagline={settings.tagline}
            navLinks={settings.navLinks}
            ctaLabel={settings.headerCtaLabel}
            ctaHref={settings.headerCtaHref}
          />
          {children}
          <Footer
            companyName={settings.companyName}
            tagline={settings.tagline}
            footerLinks={settings.footerLinks}
            headOffice={settings.headOffice}
            phonePrimary={settings.phonePrimary}
            phoneSecondary={settings.phoneSecondary}
            emailPrimary={settings.emailPrimary}
            emailSecondary={settings.emailSecondary}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
