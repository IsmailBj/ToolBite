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
  const seo = dict.tools?.aiAltText?.seo;

  const jsonLd = constructJSONLD({
    name: seo?.title || "Free AI Image Alt-Text Generator | ToolBite",
    description:
      seo?.description ||
      "Generate SEO-optimized Alt-Text for your images instantly using local browser AI. No server uploads.",
    url: `https://toolbite.space/${locale}/tools/ai-alt-text`,
    category: "DeveloperApplication", // We use Developer or SEO here
    features: seo?.features || [
      "Local AI Model",
      "Instant Captioning",
      "100% Private",
      "SEO Optimized",
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
