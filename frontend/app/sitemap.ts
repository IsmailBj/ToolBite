import { MetadataRoute } from "next";
import { getTools } from "@/config/tools"; // Import the function instead
import { locales } from "@/proxy";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://toolbite.space";

  // 1. Call the function with an empty object to get the array
  // We don't need real translations for the sitemap URLs, just the hrefs.
  const tools = getTools({});

  // 2. Generate homepage URLs
  const homeUrls = locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1.0,
  }));

  // 3. Generate tool URLs using the 'href' from the returned array
  const toolUrls = locales.flatMap((locale) =>
    tools.map((tool) => ({
      url: `${baseUrl}/${locale}${tool.href}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  );

  return [...homeUrls, ...toolUrls];
}
