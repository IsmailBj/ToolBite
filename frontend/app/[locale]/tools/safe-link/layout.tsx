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

  const seo = dict.tools?.safeLink?.seo;

  return constructMetadata({
    title: seo?.title || "Safe-Link Encoder",
    description:
      seo?.description ||
      "Obfuscate links to hide them from bots and scrapers using browser-native encoding.",
    path: `/${locale}/tools/safe-link`,
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
  const seo = dict.tools?.safeLink?.seo;

  // Generate the GEO-optimized schema for the Safe-Link Encoder
  const jsonLd = constructJSONLD({
    name: seo?.title || "Safe-Link Encoder",
    description:
      seo?.description || "Hide URLs from bots using native browser encoding.",
    url: `https://toolbite.space/${locale}/tools/safe-link`,
    category: "DeveloperApplication", // Best for security & obfuscation tools
    features: seo?.features,
    locale: locale,
  });

  return (
    <>
      {/* Inject the JSON-LD Script for AI Engines (GEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
