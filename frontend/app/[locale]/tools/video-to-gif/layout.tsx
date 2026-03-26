import { constructMetadata } from "@/lib/metadata";
import { getDictionary } from "@/dictionaries/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const seo = dict.tools?.videoToGif?.seo;

  return constructMetadata({
    title: seo?.title || "Video to GIF",
    description:
      seo?.description ||
      "Convert video clips into high-quality, shareable animated GIFs.",
    path: `/${locale}/tools/video-to-gif`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
