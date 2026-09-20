import {
  Article,
  DEFAULT_ARTICLES,
  DEFAULT_JOB_VACANCIES,
  DEFAULT_PRODUCTS,
  DEFAULT_SITE_SETTINGS,
  JobVacancy,
  Product,
  SiteSettings,
} from "@/lib/content";
import { PageSection } from "@/lib/sections";
import type { Locale } from "@/i18n/routing";

const API_URL = process.env.STRAPI_URL || "http://localhost:1337";

async function strapiFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function mediaUrl(image: { url?: string } | null | undefined): string | undefined {
  const url = image?.url;
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${API_URL}${url}`;
}

interface StrapiSiteSettingEntry extends Partial<SiteSettings> {
  id?: number;
}

interface StrapiProductEntry {
  id: number;
  name: string;
  slug: string;
  stage: Product["stage"];
  description: string;
  details: string[] | null;
  image?: { url?: string } | null;
}

interface StrapiArticleEntry {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImage?: { url?: string } | null;
}

interface StrapiJobVacancyEntry {
  id: number;
  title: string;
  slug: string;
  location?: string | null;
  employmentType?: string | null;
  summary?: string | null;
  description?: string | null;
  requirements?: string[] | null;
  postedAt?: string | null;
}

function mapJobVacancy(entry: StrapiJobVacancyEntry): JobVacancy {
  return {
    id: entry.id,
    title: entry.title,
    slug: entry.slug,
    location: entry.location ?? undefined,
    employmentType: entry.employmentType ?? undefined,
    summary: entry.summary ?? undefined,
    description: entry.description ?? undefined,
    requirements: entry.requirements ?? [],
    postedAt: entry.postedAt ?? undefined,
  };
}

export async function getSiteSettings(locale: Locale = "en"): Promise<SiteSettings> {
  const json = await strapiFetch<{ data: StrapiSiteSettingEntry | null }>(
    `/api/site-setting?populate=*&locale=${locale}`
  );
  if (!json?.data) return DEFAULT_SITE_SETTINGS;
  return { ...DEFAULT_SITE_SETTINGS, ...json.data };
}

export async function getProducts(locale: Locale = "en"): Promise<Product[]> {
  const json = await strapiFetch<{ data: StrapiProductEntry[] }>(
    `/api/products?sort=id:asc&populate=image&locale=${locale}`
  );
  if (!json?.data?.length) return DEFAULT_PRODUCTS;
  return json.data.map((entry) => ({
    id: entry.id,
    name: entry.name,
    slug: entry.slug,
    stage: entry.stage,
    description: entry.description,
    details: entry.details ?? [],
    imageUrl: mediaUrl(entry.image),
  }));
}

interface StrapiRawSection {
  __component: string;
  id: number;
  image?: { url?: string } | null;
  cards?: { label: string; text?: string }[];
  items?: { icon?: string; title: string; text?: string }[];
  stats?: { value: string; label: string }[];
  video?: { url?: string } | null;
  poster?: { url?: string } | null;
  members?: { name: string; role?: string; qualification?: string; experience?: string }[];
  [key: string]: unknown;
}

interface StrapiPageEntry {
  id: number;
  title: string;
  slug: string;
  sections?: StrapiRawSection[];
}

const PAGE_POPULATE =
  "populate[sections][on][sections.hero][populate]=image" +
  "&populate[sections][on][sections.glance][populate]=cards" +
  "&populate[sections][on][sections.mission][populate]=*" +
  "&populate[sections][on][sections.feature-grid][populate]=items" +
  "&populate[sections][on][sections.stats-band][populate]=stats" +
  "&populate[sections][on][sections.intro][populate]=*" +
  "&populate[sections][on][sections.story-panel][populate]=*" +
  "&populate[sections][on][sections.video][populate]=*" +
  "&populate[sections][on][sections.team-grid][populate]=members";

function mapSection(raw: StrapiRawSection): PageSection | null {
  switch (raw.__component) {
    case "sections.hero":
      return {
        __component: "sections.hero",
        eyebrow: raw.eyebrow as string | undefined,
        headingLine1: raw.headingLine1 as string,
        headingLine2: raw.headingLine2 as string | undefined,
        subtitle: raw.subtitle as string | undefined,
        primaryButtonLabel: raw.primaryButtonLabel as string | undefined,
        primaryButtonHref: raw.primaryButtonHref as string | undefined,
        secondaryButtonLabel: raw.secondaryButtonLabel as string | undefined,
        secondaryButtonHref: raw.secondaryButtonHref as string | undefined,
        imageUrl: mediaUrl(raw.image),
        imageStyle: (raw.imageStyle as "disc-spin" | "plain" | "none") ?? "disc-spin",
      };
    case "sections.glance":
      return {
        __component: "sections.glance",
        glanceEyebrow: raw.glanceEyebrow as string | undefined,
        glanceHeading: raw.glanceHeading as string | undefined,
        glanceBody: raw.glanceBody as string | undefined,
        cards: (raw.cards ?? []).map((c) => ({ label: c.label, text: c.text })),
      };
    case "sections.mission":
      return {
        __component: "sections.mission",
        eyebrow: raw.eyebrow as string | undefined,
        heading: raw.heading as string | undefined,
        body: raw.body as string | undefined,
      };
    case "sections.feature-grid":
      return {
        __component: "sections.feature-grid",
        eyebrow: raw.eyebrow as string | undefined,
        heading: raw.heading as string | undefined,
        items: (raw.items ?? []).map((i) => ({ icon: i.icon, title: i.title, text: i.text })),
      };
    case "sections.stats-band":
      return {
        __component: "sections.stats-band",
        eyebrow: raw.eyebrow as string | undefined,
        heading: raw.heading as string | undefined,
        dark: (raw.dark as boolean) ?? true,
        stats: (raw.stats ?? []).map((s) => ({ value: s.value, label: s.label })),
      };
    case "sections.intro":
      return {
        __component: "sections.intro",
        eyebrow: raw.eyebrow as string | undefined,
        heading: raw.heading as string,
        body: raw.body as string | undefined,
      };
    case "sections.story-panel":
      return {
        __component: "sections.story-panel",
        eyebrow: raw.eyebrow as string | undefined,
        heading: raw.heading as string | undefined,
        bodyParagraph1: raw.bodyParagraph1 as string | undefined,
        bodyParagraph2: raw.bodyParagraph2 as string | undefined,
        panelBadge: raw.panelBadge as string | undefined,
        panelTitle: raw.panelTitle as string | undefined,
        panelText: raw.panelText as string | undefined,
      };
    case "sections.video":
      return {
        __component: "sections.video",
        eyebrow: raw.eyebrow as string | undefined,
        heading: raw.heading as string | undefined,
        caption: raw.caption as string | undefined,
        videoUrl: mediaUrl(raw.video),
        posterUrl: mediaUrl(raw.poster),
      };
    case "sections.team-grid":
      return {
        __component: "sections.team-grid",
        eyebrow: raw.eyebrow as string | undefined,
        heading: raw.heading as string | undefined,
        members: (raw.members ?? []).map((m) => ({
          name: m.name,
          role: m.role,
          qualification: m.qualification,
          experience: m.experience,
        })),
      };
    default:
      return null;
  }
}

export async function getPage(
  slug: string,
  locale: Locale = "en"
): Promise<PageSection[] | null> {
  const json = await strapiFetch<{ data: StrapiPageEntry[] }>(
    `/api/pages?filters[slug][$eq]=${slug}&locale=${locale}&${PAGE_POPULATE}`
  );
  const entry = json?.data?.[0];
  if (!entry?.sections?.length) return null;
  const sections = entry.sections.map(mapSection).filter((s): s is PageSection => s !== null);
  return sections.length ? sections : null;
}

export async function getArticles(locale: Locale = "en"): Promise<Article[]> {
  const json = await strapiFetch<{ data: StrapiArticleEntry[] }>(
    `/api/articles?sort=id:asc&populate=coverImage&locale=${locale}`
  );
  if (!json?.data?.length) return DEFAULT_ARTICLES;
  return json.data.map((entry) => ({
    id: entry.id,
    title: entry.title,
    slug: entry.slug,
    excerpt: entry.excerpt,
    category: entry.category,
    coverImageUrl: mediaUrl(entry.coverImage),
  }));
}

export async function getJobVacancies(locale: Locale = "en"): Promise<JobVacancy[]> {
  const json = await strapiFetch<{ data: StrapiJobVacancyEntry[] }>(
    `/api/job-vacancies?filters[isOpen][$eq]=true&sort=postedAt:desc&locale=${locale}`
  );
  if (!json?.data) return DEFAULT_JOB_VACANCIES;
  return json.data.map(mapJobVacancy);
}

export async function getJobVacancy(slug: string, locale: Locale = "en"): Promise<JobVacancy | null> {
  const json = await strapiFetch<{ data: StrapiJobVacancyEntry[] }>(
    `/api/job-vacancies?filters[slug][$eq]=${slug}&locale=${locale}`
  );
  const entry = json?.data?.[0];
  return entry ? mapJobVacancy(entry) : null;
}
