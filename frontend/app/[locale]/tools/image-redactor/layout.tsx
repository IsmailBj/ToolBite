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
  const seo = dict.tools?.imageRedactor?.seo;

  const jsonLd = constructJSONLD({
    name: seo?.title || "Free Image Redactor | Blur Sensitive Data | ToolBite",
    description:
      seo?.description ||
      "A secure, browser-based tool to blur and pixelate passwords, faces, and API keys from screenshots. Images never leave your device.",
    url: `https://toolbite.space/${locale}/tools/image-redactor`,
    category: "SecurityApplication",
    features: seo?.features || [
      "Client-Side Processing",
      "Blur & Pixelate",
      "Drag & Drop",
      "No Uploads",
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
