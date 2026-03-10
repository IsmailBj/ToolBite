import { MetadataRoute } from "next";
import { tools } from "@/config/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://toolbite.space";

  // 1. Generate URLs for all active tools dynamically
  const toolUrls = tools.map((tool) => ({
    url: `${baseUrl}${tool.href}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 2. Combine the homepage URL with the tool URLs
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    ...toolUrls,
  ];
}
