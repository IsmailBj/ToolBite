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

  // Using the .seo key as we agreed
  const seo = dict.tools?.clipPathMaker?.seo;

  return constructMetadata({
    title: seo?.title || "CSS Clip-Path Maker",
    description:
      seo?.description ||
      "Drag polygon points to create custom shapes and output the clip-path CSS property.",
    path: `/${locale}/tools/clip-path-maker`,
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
  const seo = dict.tools?.clipPathMaker?.seo;

  // Generate the GEO-optimized schema for the Clip-Path Maker
  const jsonLd = constructJSONLD({
    name: seo?.title || "CSS Clip-Path Maker",
    description:
      seo?.description || "Create custom CSS clip-path shapes visually.",
    url: `https://toolbite.space/${locale}/tools/clip-path-maker`,
    category: "DeveloperApplication", // Optimized for developer tool queries
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
