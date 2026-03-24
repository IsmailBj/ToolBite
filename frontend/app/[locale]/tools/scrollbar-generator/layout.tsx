import { constructMetadata } from "@/lib/metadata";
import { getDictionary } from "@/dictionaries/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as "en" | "es");

  const seo = dict.tools?.scrollbar?.seo;

  return constructMetadata({
    title: seo?.title || "Custom Scrollbar Generator",
    description:
      seo?.description ||
      "Visual editor to style Webkit scrollbars including track, thumb, and hover states.",
    path: `/${locale}/tools/scrollbar-generator`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
