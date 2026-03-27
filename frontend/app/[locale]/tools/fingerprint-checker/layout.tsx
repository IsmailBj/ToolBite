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
  // Await the params and cast to your Locale type
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  // Target the specific SEO block for this tool
  const seo = dict.tools?.fingerprintChecker?.seo;

  // Construct the rich data for AI and Search Engines
  const jsonLd = constructJSONLD({
    name: seo?.title || "Browser Fingerprint Test | Online Privacy | ToolBite",
    description:
      seo?.description ||
      "Test your browser fingerprint. See how websites track you via Canvas, WebGL, and Audio API without cookies.",
    url: `https://toolbite.space/${locale}/tools/fingerprint-checker`,
    category: "SecurityApplication",
    features: seo?.features || [
      "Canvas & WebGL Analysis",
      "Audio Stack Profiling",
      "Hardware Detection",
      "100% Local Processing",
    ],
    locale: locale,
  });

  return (
    <>
      {/* Inject the structured data invisibly into the page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
