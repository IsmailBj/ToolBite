// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://toolbite.space";

  return {
    rules: {
      // '*' means these rules apply to all web crawlers (Google, Bing, etc.)
      userAgent: "*",
      // Allow crawling of the entire main site
      allow: "/",
      // Prevent crawlers from indexing internal API routes or private folders
      disallow: ["/api/", "/private/"],
    },
    // Point the crawlers directly to the dynamic sitemap you just built
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
