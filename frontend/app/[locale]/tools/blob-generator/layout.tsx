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
  const seo = dict.tools?.blobGenerator?.seo;

  return constructMetadata({
    title: seo?.title || "Blob Shape Generator",
    description:
      seo?.description ||
      "Generate fluid, organic SVG blob shapes for modern web layouts and backgrounds.",
    path: `/${locale}/tools/blob-generator`,
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
  const seo = dict.tools?.blobGenerator?.seo;

  // Generate the GEO-optimized schema for the Blob Generator
  const jsonLd = constructJSONLD({
    name: seo?.title || "Blob Shape Generator",
    description: seo?.description || "Generate organic SVG blob shapes.",
    url: `https://toolbite.space/${locale}/tools/blob-generator`,
    category: "UtilitiesApplication", // Changed to Utilities for design tools
    features: seo?.features,
    locale: locale,
  });

  return (
    <>
      {/* Inject the JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
