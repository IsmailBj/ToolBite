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
  const seo = dict.tools?.metaGenerator?.seo;

  const jsonLd = constructJSONLD({
    name:
      seo?.title ||
      "Free AI Meta Description Generator | Local SEO Tool | ToolBite",
    description:
      seo?.description ||
      "Generate perfectly sized SEO meta descriptions from long articles using local browser AI. No data tracking, 100% private.",
    url: `https://toolbite.space/${locale}/tools/meta-generator`,
    category: "SEOApplication",
    features: seo?.features || [
      "Client-Side AI",
      "Character Counter",
      "SEO Optimization",
      "Instant Summarization",
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
