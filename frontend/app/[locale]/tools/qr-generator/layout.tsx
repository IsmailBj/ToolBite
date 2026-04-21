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
  const seo = dict.tools?.qrGenerator?.seo;

  const jsonLd = constructJSONLD({
    name:
      seo?.title || "Free Custom QR Code Generator | Privacy First | ToolBite",
    description:
      seo?.description ||
      "Generate custom QR codes instantly in your browser. Change colors, adjust size, and download as PNG. No tracking, no limits.",
    url: `https://toolbite.space/${locale}/tools/qr-generator`,
    category: "UtilitiesApplication",
    features: seo?.features || [
      "Custom Colors",
      "High Resolution PNG",
      "No Expiration",
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
