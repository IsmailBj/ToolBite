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

  const seo = dict.tools?.unitPro?.seo;

  return constructMetadata({
    title: seo?.title || "Unit Converter Pro",
    description:
      seo?.description ||
      "Advanced conversion for web units (PX/REM), digital storage, and physical length.",
    path: `/${locale}/tools/unit-pro`,
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
  const seo = dict.tools?.unitPro?.seo;

  // Generate the GEO-optimized schema for Unit Pro
  const jsonLd = constructJSONLD({
    name: seo?.title || "Unit Converter Pro",
    description:
      seo?.description ||
      "Professional-grade unit converter for web and digital units.",
    url: `https://toolbite.space/${locale}/tools/unit-pro`,
    category: "UtilitiesApplication", // High-intent category for conversion tools
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
