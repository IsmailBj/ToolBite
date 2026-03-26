import { constructMetadata } from "@/lib/metadata";
import { getDictionary } from "@/dictionaries/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const seo = dict.tools?.safeLink?.seo;

  return constructMetadata({
    title: seo?.title || "Safe-Link Encoder",
    description:
      seo?.description ||
      "Obfuscate links to hide them from bots and scrapers using browser-native encoding.",
    path: `/${locale}/tools/safe-link`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
