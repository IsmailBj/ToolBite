import { constructMetadata } from "@/lib/metadata";
import { getDictionary } from "@/dictionaries/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as "en" | "es");

  const seo = dict.tools?.colorPalette?.seo;

  return constructMetadata({
    title: seo?.title || "Color Palette",
    description:
      seo?.description ||
      "Extract the most dominant and beautiful colors from any photograph.",
    path: `/${locale}/tools/color-palette`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
