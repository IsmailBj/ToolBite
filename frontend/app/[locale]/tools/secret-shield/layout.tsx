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

  const seo = dict.tools?.secretShield?.seo;

  return constructMetadata({
    title: seo?.title || "Secret Shield",
    description:
      seo?.description ||
      "Military-grade AES-256 encryption. Secure any file locally.",
    path: `/${locale}/tools/secret-shield`,
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
  const seo = dict.tools?.secretShield?.seo;

  // Generate the GEO-optimized schema for Secret Shield
  const jsonLd = constructJSONLD({
    name: seo?.title || "Secret Shield",
    description:
      seo?.description ||
      "High-security AES-256 file encryption locally in your browser.",
    url: `https://toolbite.space/${locale}/tools/secret-shield`,
    category: "UtilitiesApplication", // Best for security & privacy tools
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
