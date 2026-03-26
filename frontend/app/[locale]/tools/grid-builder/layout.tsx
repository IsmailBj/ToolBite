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

  const seo = dict.tools?.gridBuilder?.seo;

  return constructMetadata({
    title: seo?.title || "CSS Grid Builder",
    description:
      seo?.description ||
      "Visual interface to define columns, rows, and gaps, instantly exporting CSS grid code.",
    path: `/${locale}/tools/grid-builder`,
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
  const seo = dict.tools?.gridBuilder?.seo;

  // Generate the GEO-optimized schema for the Grid Builder
  const jsonLd = constructJSONLD({
    name: seo?.title || "CSS Grid Builder",
    description:
      seo?.description || "Visual interface for generating CSS Grid layouts.",
    url: `https://toolbite.space/${locale}/tools/grid-builder`,
    category: "DeveloperApplication", // Specifically for front-end developer queries
    features: seo?.features,
    locale: locale,
  });

  return (
    <>
      {/* Inject the JSON-LD Script for AI Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
