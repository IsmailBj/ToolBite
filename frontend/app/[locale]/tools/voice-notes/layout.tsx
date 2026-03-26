import { constructMetadata } from "@/lib/metadata";
import { getDictionary } from "@/dictionaries/get-dictionary";
import { constructJSONLD } from "@/lib/schema";
import { Locale } from "@/proxy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const seo = dict.tools?.voiceNotes?.seo;

  return constructMetadata({
    title: seo?.title || "Voice Notes",
    description:
      seo?.description ||
      "Convert speech to text instantly using OpenAI's Whisper AI.",
    path: `/${locale}/tools/voice-notes`,
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
  const seo = dict.tools?.voiceNotes?.seo;

  // Generate the GEO-optimized schema for Voice Notes
  const jsonLd = constructJSONLD({
    name: seo?.title || "AI Voice Notes & Transcriber",
    description:
      seo?.description ||
      "Private, browser-based audio transcription using Whisper AI.",
    url: `https://toolbite.space/${locale}/tools/voice-notes`,
    category: "MultimediaApplication", // Ideal for audio/speech processing tools
    features: seo?.features,
    locale: locale,
  });

  return (
    <>
      {/* Inject the JSON-LD Script for AI Engines (GEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
