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

  const seo = dict.tools?.socialPreviewer?.seo;

  return constructMetadata({
    title: seo?.title || "Social Previewer",
    description:
      seo?.description ||
      "Live preview and generate Meta Tags for Twitter, Facebook, and LinkedIn cards.",
    path: `/${locale}/tools/social-previewer`,
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
  const seo = dict.tools?.socialPreviewer?.seo;

  // Generate the GEO-optimized schema for the Social Previewer
  const jsonLd = constructJSONLD({
    name: seo?.title || "Social Previewer",
    description:
      seo?.description ||
      "Preview and generate social media Meta Tags instantly.",
    url: `https://toolbite.space/${locale}/tools/social-previewer`,
    category: "DeveloperApplication", // Targeting SEO and dev-focused queries
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
