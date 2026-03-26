import { constructMetadata } from "@/lib/metadata";
import { getDictionary } from "@/dictionaries/get-dictionary";
import { constructJSONLD } from "@/lib/schema";
import { Locale } from "@/proxy"; // Using your global Locale type

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const seo = dict.tools?.bgRemover?.seo;

  return constructMetadata({
    title: seo?.title || "Background Remover",
    description:
      seo?.description ||
      "Instantly strip backgrounds from any image using high-speed AI.",
    path: `/${locale}/tools/bg-remover`,
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
  const seo = dict.tools?.bgRemover?.seo;

  // 1. Generate the GEO-optimized schema
  const jsonLd = constructJSONLD({
    name: seo?.title || "Background Remover",
    description:
      seo?.description || "Instantly strip backgrounds from any image.",
    url: `https://toolbite.space/${locale}/tools/bg-remover`,
    category: "MultimediaApplication",
    features: seo?.features, // This will pull from your JSON later
    locale: locale,
  });

  return (
    <>
      {/* 2. Inject the JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
