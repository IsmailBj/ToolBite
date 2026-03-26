import { constructMetadata } from "@/lib/metadata";
import { getDictionary } from "@/dictionaries/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const seo = dict.tools?.shadowGenerator?.seo;

  return constructMetadata({
    title: seo?.title || "Shadow Palette Generator",
    description:
      seo?.description ||
      "Create smooth, multi-layered CSS shadows for natural-looking UI elements.",
    path: `/${locale}/tools/shadow-generator`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
