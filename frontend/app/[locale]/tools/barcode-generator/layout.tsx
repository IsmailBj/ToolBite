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
  const seo = dict.tools?.barcodeGenerator?.seo;

  const jsonLd = constructJSONLD({
    name: seo?.title || "Free Barcode Generator | Code128, UPC, EAN | ToolBite",
    description:
      seo?.description ||
      "Instantly generate high-resolution retail and shipping barcodes in your browser. 100% free and offline.",
    url: `https://toolbite.space/${locale}/tools/barcode-generator`,
    category: "UtilitiesApplication",
    features: seo?.features || [
      "Code128 & Code39",
      "UPC & EAN",
      "Custom Colors",
      "Offline Generation",
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
