import { constructMetadata } from "@/lib/metadata";
import { getDictionary } from "@/dictionaries/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as "en" | "es");

  const seo = dict.tools?.gridBuilder?.seo;

  return constructMetadata({
    title: seo?.title || "CSS Grid Builder",
    description:
      seo?.description ||
      "Visual interface to define columns, rows, and gaps, instantly exporting CSS grid code.",
    path: `/${locale}/tools/grid-builder`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
