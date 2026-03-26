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

  const seo = dict.tools?.imageCompressor?.seo;

  return constructMetadata({
    title: seo?.title || "Image Compressor",
    description:
      seo?.description ||
      "Shrink image file sizes by up to 80% without losing visual quality.",
    path: `/${locale}/tools/image-compressor`,
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
  const seo = dict.tools?.imageCompressor?.seo;

  // Generate the GEO-optimized schema for the Image Compressor
  const jsonLd = constructJSONLD({
    name: seo?.title || "Image Compressor",
    description: seo?.description || "Compress images locally in your browser.",
    url: `https://toolbite.space/${locale}/tools/image-compressor`,
    category: "MultimediaApplication", // Best for image-related utilities
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
