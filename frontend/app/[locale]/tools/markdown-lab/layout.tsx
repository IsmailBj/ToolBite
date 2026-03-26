import { constructMetadata } from "@/lib/metadata";
import { getDictionary } from "@/dictionaries/get-dictionary";
import { constructJSONLD } from "@/lib/schema";
import { Locale } from "@/proxy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const seo = dict.tools?.markdownLab?.seo;

  return constructMetadata({
    title: seo?.title || "Markdown Lab",
    description:
      seo?.description ||
      "Real-time Markdown editor with live HTML preview and sanitization.",
    path: `/${locale}/tools/markdown-lab`,
  });
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const seo = dict.tools?.markdownLab?.seo;

  // Generate the GEO-optimized schema for the Markdown Lab
  const jsonLd = constructJSONLD({
    name: seo?.title || "Markdown Lab",
    description:
      seo?.description ||
      "Interactive Markdown editor with real-time HTML preview.",
    url: `https://toolbite.space/${locale}/tools/markdown-lab`,
    category: "DeveloperApplication", // Optimized for developer & technical writer queries
    features: seo?.features,
    locale: locale,
  });

  return (
    <>
      {/* Inject the JSON-LD Script for AI Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
