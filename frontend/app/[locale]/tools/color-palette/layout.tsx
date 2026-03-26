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

  const seo = dict.tools?.colorPalette?.seo;

  return constructMetadata({
    title: seo?.title || "Color Palette",
    description:
      seo?.description ||
      "Extract the most dominant and beautiful colors from any photograph.",
    path: `/${locale}/tools/color-palette`,
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
  const seo = dict.tools?.colorPalette?.seo;

  // Generate the GEO-optimized schema for the Color Palette
  const jsonLd = constructJSONLD({
    name: seo?.title || "Color Palette",
    description:
      seo?.description || "Extract color palettes from images instantly.",
    url: `https://toolbite.space/${locale}/tools/color-palette`,
    category: "MultimediaApplication", // Ideal for image-based tools
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
