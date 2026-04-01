import { constructJSONLD } from "@/lib/schema";
import { getDictionary } from "@/dictionaries/get-dictionary";
import { Locale } from "@/proxy";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const seo = dict.tools?.entityExtractor?.seo;

  const jsonLd = constructJSONLD({
    name: seo?.title || "Free AI PII Redactor & Entity Extractor | ToolBite",
    description:
      seo?.description ||
      "Scan text to extract Names, Locations, and Organizations. Redact sensitive PII instantly in your browser.",
    url: `https://toolbite.space/${locale}/tools/entity-extractor`,
    category: "SecurityApplication",
    features: seo?.features || [
      "Local NER Model",
      "PII Redaction",
      "100% Private",
      "No Server Uploads",
    ],
    locale: locale,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
