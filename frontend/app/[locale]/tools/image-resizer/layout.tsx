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
  const seo = dict.tools?.imageResizer?.seo;

  const jsonLd = constructJSONLD({
    name: seo?.title || "Free Online Image Resizer | ToolBite",
    description:
      seo?.description ||
      "Quickly resize your images in the browser. Secure, private, and maintains aspect ratio.",
    url: `https://toolbite.space/${locale}/tools/image-resizer`,
    category: "UtilitiesApplication",
    features: seo?.features || [
      "Local Processing",
      "Aspect Ratio Lock",
      "Instant Download",
      "No Upload Required",
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
