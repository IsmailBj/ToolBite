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
  const seo = dict.tools?.videoSubtitles?.seo;

  const jsonLd = constructJSONLD({
    name: seo?.title || "Free AI Video Subtitle Generator | ToolBite",
    description:
      seo?.description ||
      "Generate subtitles and captions for your videos locally using browser AI. No uploads required.",
    url: `https://toolbite.space/${locale}/tools/video-subtitles`,
    category: "UtilitiesApplication",
    features: seo?.features || [
      "Local AI Model",
      "Instant Transcription",
      "VTT Export",
      "Live Subtitle Preview",
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
