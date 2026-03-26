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

  const seo = dict.tools.neumorphism?.seo;

  return constructMetadata({
    title: seo?.title || "Neumorphism Generator",
    description:
      seo?.description ||
      "Generate soft UI hex codes and complex shadow CSS based on a single base color.",
    path: `/${locale}/tools/neumorphism-generator`,
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
  const seo = dict.tools.neumorphism?.seo;

  // Generate the GEO-optimized schema for the Neumorphism Generator
  const jsonLd = constructJSONLD({
    name: seo?.title || "Neumorphism Generator",
    description:
      seo?.description ||
      "Generate soft-UI CSS shadows and neumorphic designs.",
    url: `https://toolbite.space/${locale}/tools/neumorphism-generator`,
    category: "UtilitiesApplication", // Ideal for design utilities
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
