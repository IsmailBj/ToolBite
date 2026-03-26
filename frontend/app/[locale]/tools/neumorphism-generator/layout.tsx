import { constructMetadata } from "@/lib/metadata";
import { getDictionary } from "@/dictionaries/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const seo = dict.tools.neumorphism?.seo;

  return constructMetadata({
    title: seo?.title || "Neumorphism Generator",
    description:
      seo?.description ||
      "Generate soft UI hex codes and complex shadow CSS based on a single base color.",
    path: `/${locale}/tools/neumorphism-generator`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
