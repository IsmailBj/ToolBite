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
  const seo = dict.tools?.svgToPng?.seo;

  const jsonLd = constructJSONLD({
    name: seo?.title || "Free Online SVG to PNG Converter | ToolBite",
    description:
      seo?.description ||
      "Convert SVG vectors to transparent PNG images instantly in your browser. No data uploaded.",
    url: `https://toolbite.space/${locale}/tools/svg-to-png`,
    category: "MultimediaApplication",
    features: seo?.features || [
      "Local Conversion",
      "Transparent Backgrounds",
      "Instant Download",
      "Zero Server Uploads",
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
