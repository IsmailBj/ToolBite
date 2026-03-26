import { constructMetadata } from "@/lib/metadata";
import { getDictionary } from "@/dictionaries/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const ui = dict.tools?.blobGenerator?.seo;

  return constructMetadata({
    title: ui?.title || "Blob Shape Generator",
    description:
      ui?.description ||
      "Generate fluid, organic SVG blob shapes for modern web layouts and backgrounds.",
    path: `/${locale}/tools/blob-generator`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
