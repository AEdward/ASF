import {
  Article,
  DEFAULT_ARTICLES,
  DEFAULT_PRODUCTS,
  DEFAULT_SITE_SETTINGS,
  Product,
  SiteSettings,
} from "@/lib/content";
import { PageSection } from "@/lib/sections";

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

export async function getSiteSettings(): Promise<SiteSettings> {
  const json = await strapiFetch<{ data: StrapiSiteSettingEntry | null }>(
    "/api/site-setting?populate=*"
  );
  if (!json?.data) return DEFAULT_SITE_SETTINGS;
  return { ...DEFAULT_SITE_SETTINGS, ...json.data };
}

export async function getProducts(): Promise<Product[]> {
  const json = await strapiFetch<{ data: StrapiProductEntry[] }>(
    "/api/products?sort=id:asc&populate=image"
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
  "&populate[sections][on][sections.mission-glance][populate]=cards" +
  "&populate[sections][on][sections.feature-grid][populate]=items" +
  "&populate[sections][on][sections.stats-band][populate]=stats" +
  "&populate[sections][on][sections.intro][populate]=*" +
  "&populate[sections][on][sections.story-panel][populate]=*";

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
    case "sections.mission-glance":
      return {
        __component: "sections.mission-glance",
        missionHeading: raw.missionHeading as string | undefined,
        missionBody: raw.missionBody as string | undefined,
        glanceEyebrow: raw.glanceEyebrow as string | undefined,
        glanceHeading: raw.glanceHeading as string | undefined,
        glanceBody: raw.glanceBody as string | undefined,
        cards: (raw.cards ?? []).map((c) => ({ label: c.label, text: c.text })),
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
    default:
      return null;
  }
}

export async function getPage(slug: string): Promise<PageSection[] | null> {
  const json = await strapiFetch<{ data: StrapiPageEntry[] }>(
    `/api/pages?filters[slug][$eq]=${slug}&${PAGE_POPULATE}`
  );
  const entry = json?.data?.[0];
  if (!entry?.sections?.length) return null;
  const sections = entry.sections.map(mapSection).filter((s): s is PageSection => s !== null);
  return sections.length ? sections : null;
}

export async function getArticles(): Promise<Article[]> {
  const json = await strapiFetch<{ data: StrapiArticleEntry[] }>(
    "/api/articles?sort=id:asc&populate=coverImage"
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
