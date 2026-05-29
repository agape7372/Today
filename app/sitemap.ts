import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/games";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://today-mwo-hagi.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, priority: 1 },
    { url: `${BASE_URL}/manual`, lastModified: now, priority: 0.9 },
    { url: `${BASE_URL}/games`, lastModified: now, priority: 0.9 },
  ];

  const gameRoutes: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${BASE_URL}/games/${slug}`,
    lastModified: now,
    priority: 0.8,
  }));

  return [...staticRoutes, ...gameRoutes];
}
