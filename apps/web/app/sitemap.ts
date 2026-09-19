import type { MetadataRoute } from "next";

const SITE_URL = process.env.SITE_URL || "https://asf-agro.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/products", "/blog", "/contact"];
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
