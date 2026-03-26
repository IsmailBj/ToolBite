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

  const seo = dict.tools?.videoToGif?.seo;

  return constructMetadata({
    title: seo?.title || "Video to GIF Converter",
    description:
      seo?.description ||
      "Convert video clips into high-quality, shareable animated GIFs instantly in your browser.",
    path: `/${locale}/tools/video-to-gif`,
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
  const seo = dict.tools?.videoToGif?.seo;

  // Generate the GEO-optimized schema for the Video to GIF tool
  const jsonLd = constructJSONLD({
    name: seo?.title || "Video to GIF Converter",
    description:
      seo?.description || "High-quality video to animated GIF conversion.",
    url: `https://toolbite.space/${locale}/tools/video-to-gif`,
    category: "MultimediaApplication", // Ideal for video and animation tools
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
