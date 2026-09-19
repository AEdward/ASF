import {
  Article,
  DEFAULT_ARTICLES,
  DEFAULT_PRODUCTS,
  DEFAULT_SITE_SETTINGS,
  Product,
  SiteSettings,
} from "@/lib/content";

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
