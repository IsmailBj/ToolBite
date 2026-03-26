import { constructMetadata } from "@/lib/metadata";
import { getDictionary } from "@/dictionaries/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const seo = dict.tools?.socialPreviewer?.seo;

  return constructMetadata({
    title: seo?.title || "Social Previewer",
    description:
      seo?.description ||
      "Live preview and generate Meta Tags for Twitter, Facebook, and LinkedIn cards.",
    path: `/${locale}/tools/social-previewer`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
