import { constructMetadata } from "@/lib/metadata";
import { getDictionary } from "@/dictionaries/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
