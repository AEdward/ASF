import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import type { SiteSettings } from "@/lib/content";

export const SITE_URL = process.env.SITE_URL || "https://asf-agro.example.com";
export const SITE_NAME = "ASF Agro Industry";

/**
 * Builds a consistent Metadata object for a locale-aware page: canonical
 * URL, hreflang alternates for every locale (required for a trilingual
 * site to avoid duplicate-content signals), and matching Open Graph /
 * Twitter cards. `path` is the locale-less route, e.g. "/about" or "" for
 * home.
 */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  image,
  noIndex,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}/${l}${path}`;
  }
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}${path}`;

  const canonical = `${SITE_URL}/${locale}${path}`;
  const ogImage = image ?? `${SITE_URL}/asf-logo.png`;

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      images: [ogImage],
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

export function organizationJsonLd(settings: SiteSettings) {
  const sameAs = [
    settings.youtubeUrl,
    settings.facebookUrl,
    settings.instagramUrl,
    settings.telegramUrl,
    settings.tiktokUrl,
    settings.linkedinUrl,
  ].filter((url): url is string => Boolean(url));

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.companyName,
    url: SITE_URL,
    logo: `${SITE_URL}/asf-logo.png`,
    description: settings.tagline,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.headOffice,
      addressCountry: "ET",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.phonePrimary,
      email: settings.emailPrimary,
      contactType: "customer service",
    },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function articleJsonLd({
  title,
  description,
  url,
  imageUrl,
}: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    ...(imageUrl ? { image: [imageUrl] } : {}),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/asf-logo.png` },
    },
  };
}

export function jobPostingJsonLd({
  title,
  description,
  datePosted,
  employmentType,
  location,
}: {
  title: string;
  description: string;
  datePosted?: string;
  employmentType?: string;
  location?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title,
    description,
    ...(datePosted ? { datePosted } : {}),
    ...(employmentType ? { employmentType } : {}),
    hiringOrganization: {
      "@type": "Organization",
      name: SITE_NAME,
      sameAs: SITE_URL,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: location || "Addis Ababa",
        addressCountry: "ET",
      },
    },
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/${locale}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
  locale: Locale
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}/${locale}${item.path}`,
    })),
  };
}

export function itemListJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function productJsonLd({
  name,
  description,
  imageUrl,
  url,
}: {
  name: string;
  description: string;
  imageUrl?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url,
    ...(imageUrl ? { image: [imageUrl] } : {}),
    brand: { "@type": "Brand", name: SITE_NAME },
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
