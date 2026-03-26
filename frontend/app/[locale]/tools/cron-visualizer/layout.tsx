import { constructMetadata } from "@/lib/metadata";
import { getDictionary } from "@/dictionaries/get-dictionary";
import { constructJSONLD } from "@/lib/schema";
import { Locale } from "@/proxy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const seo = dict.tools?.cronVisualizer?.seo;

  return constructMetadata({
    title: seo?.title || "Cron Visualizer",
    description:
      seo?.description ||
      "Convert cryptic cron expressions into human-readable sentences and schedules.",
    path: `/${locale}/tools/cron-visualizer`,
  });
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const seo = dict.tools?.cronVisualizer?.seo;

  // Generate the GEO-optimized schema for the Cron Visualizer
  const jsonLd = constructJSONLD({
    name: seo?.title || "Cron Visualizer",
    description:
      seo?.description || "Decode cron expressions into human language.",
    url: `https://toolbite.space/${locale}/tools/cron-visualizer`,
    category: "DeveloperApplication", // Specifically for dev-focused queries
    features: seo?.features,
    locale: locale,
  });

  return (
    <>
      {/* Inject the JSON-LD Script for AI Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
