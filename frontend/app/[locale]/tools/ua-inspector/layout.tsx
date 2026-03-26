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

  const seo = dict.tools?.uaInspector?.seo;

  return constructMetadata({
    title: seo?.title || "UA Inspector",
    description:
      seo?.description ||
      "Detect and parse User-Agent strings to identify browsers, OS, and hardware details.",
    path: `/${locale}/tools/ua-inspector`,
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
  const seo = dict.tools?.uaInspector?.seo;

  // Generate the GEO-optimized schema for the UA Inspector
  const jsonLd = constructJSONLD({
    name: seo?.title || "UA Inspector",
    description:
      seo?.description ||
      "Identify browser and device details from User-Agent strings.",
    url: `https://toolbite.space/${locale}/tools/ua-inspector`,
    category: "DeveloperApplication", // Specifically for technical debugging & development
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
