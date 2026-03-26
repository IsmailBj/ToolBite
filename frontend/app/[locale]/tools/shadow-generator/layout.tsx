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

  const seo = dict.tools?.shadowGenerator?.seo;

  return constructMetadata({
    title: seo?.title || "Shadow Palette Generator",
    description:
      seo?.description ||
      "Create smooth, multi-layered CSS shadows for natural-looking UI elements.",
    path: `/${locale}/tools/shadow-generator`,
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
  const seo = dict.tools?.shadowGenerator?.seo;

  // Generate the GEO-optimized schema for the Shadow Generator
  const jsonLd = constructJSONLD({
    name: seo?.title || "Shadow Palette Generator",
    description:
      seo?.description ||
      "Visual tool for creating multi-layered CSS box-shadows.",
    url: `https://toolbite.space/${locale}/tools/shadow-generator`,
    category: "DeveloperApplication", // Targeting high-intent design-to-code queries
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
