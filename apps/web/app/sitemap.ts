import type { MetadataRoute } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { getArticles, getJobVacancies, getProducts } from "@/lib/strapi";

const SITE_URL = process.env.SITE_URL || "https://asf-agro.example.com";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/products", priority: 0.8, changeFrequency: "monthly" },
  { path: "/facilities", priority: 0.6, changeFrequency: "monthly" },
  { path: "/quality", priority: 0.6, changeFrequency: "monthly" },
  { path: "/sustainability", priority: 0.6, changeFrequency: "monthly" },
  { path: "/crop-residue-feed", priority: 0.6, changeFrequency: "monthly" },
  { path: "/calculator", priority: 0.6, changeFrequency: "monthly" },
  { path: "/partners", priority: 0.5, changeFrequency: "monthly" },
  { path: "/gallery", priority: 0.5, changeFrequency: "monthly" },
  { path: "/documents", priority: 0.5, changeFrequency: "monthly" },
  { path: "/about/testimonials", priority: 0.5, changeFrequency: "monthly" },
  { path: "/careers", priority: 0.6, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms-of-service", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries = routing.locales.flatMap((locale) =>
    STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    }))
  );

  const dynamicEntries = await Promise.all(
    routing.locales.map(async (locale) => {
      const [articles, jobs, products] = await Promise.all([
        getArticles(locale as Locale),
        getJobVacancies(locale as Locale),
        getProducts(locale as Locale),
      ]);
      const articleEntries = articles.map((article) => ({
        url: `${SITE_URL}/${locale}/blog/${article.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      }));
      const jobEntries = jobs.map((job) => ({
        url: `${SITE_URL}/${locale}/careers/${job.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.5,
      }));
      const productEntries = products
        .filter((product) => product.imageUrl)
        .map((product) => ({
          url: `${SITE_URL}/${locale}/products/${product.slug}`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        }));
      return [...articleEntries, ...jobEntries, ...productEntries];
    })
  );

  return [...staticEntries, ...dynamicEntries.flat()];
}
