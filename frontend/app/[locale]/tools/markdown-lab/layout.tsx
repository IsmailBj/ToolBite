import { constructMetadata } from "@/lib/metadata";
import { getDictionary } from "@/dictionaries/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const seo = dict.tools?.markdownLab?.seo;

  return constructMetadata({
    title: seo?.title || "Markdown Lab",
    description:
      seo?.description ||
      "Real-time Markdown editor with live HTML preview and sanitization.",
    path: `/${locale}/tools/markdown-lab`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
