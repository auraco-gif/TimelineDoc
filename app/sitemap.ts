import type { MetadataRoute } from "next";
import { RESOURCES } from "@/lib/resources";

const BASE_URL = "https://www.timelinedoc.app";

// Sitemap is generated automatically from the RESOURCES array.
// Adding a new resource to lib/resources.ts will include it here with no
// additional changes required.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date() },
    { url: `${BASE_URL}/resources`, lastModified: new Date() },
  ];

  const resourceRoutes: MetadataRoute.Sitemap = RESOURCES.map((r) => ({
    url: `${BASE_URL}/resources/${r.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...resourceRoutes];
}
