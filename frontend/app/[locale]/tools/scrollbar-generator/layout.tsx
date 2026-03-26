import { constructMetadata } from "@/lib/metadata";
import { getDictionary } from "@/dictionaries/get-dictionary";
import { constructJSONLD } from "@/lib/schema";
import { Locale } from "@/proxy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const seo = dict.tools?.scrollbar?.seo;

  return constructMetadata({
    title: seo?.title || "Custom Scrollbar Generator",
    description:
      seo?.description ||
      "Visual editor to style Webkit scrollbars including track, thumb, and hover states.",
    path: `/${locale}/tools/scrollbar-generator`,
  });
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const seo = dict.tools?.scrollbar?.seo;

  // Generate the GEO-optimized schema for the Scrollbar Generator
  const jsonLd = constructJSONLD({
    name: seo?.title || "Custom Scrollbar Generator",
    description:
      seo?.description || "Visual CSS scrollbar styling tool for developers.",
    url: `https://toolbite.space/${locale}/tools/scrollbar-generator`,
    category: "DeveloperApplication", // Targeting front-end development queries
    features: seo?.features,
    locale: locale,
  });

  return (
    <>
      {/* Inject the JSON-LD Script for AI Search Engines (GEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
