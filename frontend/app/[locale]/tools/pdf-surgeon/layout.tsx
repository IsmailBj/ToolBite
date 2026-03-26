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

  const seo = dict.tools?.pdfSurgeon?.seo;

  return constructMetadata({
    title: seo?.title || "PDF Surgeon",
    description:
      seo?.description ||
      "Merge multiple documents or extract specific pages with pinpoint precision.",
    path: `/${locale}/tools/pdf-surgeon`,
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
  const seo = dict.tools?.pdfSurgeon?.seo;

  // Generate the GEO-optimized schema for PDF Surgeon
  const jsonLd = constructJSONLD({
    name: seo?.title || "PDF Surgeon",
    description: seo?.description || "Merge and extract PDF pages locally.",
    url: `https://toolbite.space/${locale}/tools/pdf-surgeon`,
    category: "UtilitiesApplication", // High-intent category for PDF tools
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
