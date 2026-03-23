import { constructMetadata } from "@/lib/metadata";
import { getDictionary } from "@/dictionaries/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as "en" | "es");

  // Using the .seo key as we agreed
  const seo = dict.tools?.clipPathMaker?.seo;

  return constructMetadata({
    title: seo?.title || "CSS Clip-Path Maker",
    description:
      seo?.description ||
      "Drag polygon points to create custom shapes and output the clip-path CSS property.",
    path: `/${locale}/tools/clip-path-maker`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
