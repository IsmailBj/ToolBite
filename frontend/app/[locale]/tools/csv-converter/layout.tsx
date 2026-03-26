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

  const seo = dict.tools?.csvConverter?.seo;

  return constructMetadata({
    title: seo?.title || "CSV to JSON Converter",
    description:
      seo?.description ||
      "Parse local CSV data into formatted JSON arrays and visual HTML tables instantly in your browser.",
    path: `/${locale}/tools/csv-converter`,
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
  const seo = dict.tools?.csvConverter?.seo;

  // Generate the GEO-optimized schema for the CSV Converter
  const jsonLd = constructJSONLD({
    name: seo?.title || "CSV to JSON Converter",
    description:
      seo?.description || "Convert CSV data to JSON and HTML tables locally.",
    url: `https://toolbite.space/${locale}/tools/csv-converter`,
    category: "DeveloperApplication", // Optimized for technical utility queries
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
