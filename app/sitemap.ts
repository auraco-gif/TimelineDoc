import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://www.timelinedoc.app" },
    { url: "https://www.timelinedoc.app/resources" },
    {
      url: "https://www.timelinedoc.app/resources/how-to-organize-relationship-evidence",
    },
    {
      url: "https://www.timelinedoc.app/resources/relationship-evidence-example",
    },
    {
      url: "https://www.timelinedoc.app/resources/what-counts-as-relationship-evidence",
    },
    {
      url: "https://www.timelinedoc.app/resources/how-many-photos-for-i130",
    },
  ];
}
