import { constructMetadata } from "@/lib/metadata";
import { getDictionary } from "@/dictionaries/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const seo = dict.tools?.imageCompressor?.seo;

  return constructMetadata({
    title: seo?.title || "Image Compressor",
    description:
      seo?.description ||
      "Shrink image file sizes by up to 80% without losing visual quality.",
    path: `/${locale}/tools/image-compressor`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
