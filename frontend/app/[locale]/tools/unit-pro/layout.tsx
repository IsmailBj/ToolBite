import { constructMetadata } from "@/lib/metadata";
import { getDictionary } from "@/dictionaries/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const seo = dict.tools?.unitPro?.seo;

  return constructMetadata({
    title: seo?.title || "Unit Converter Pro",
    description:
      seo?.description ||
      "Advanced conversion for web units (PX/REM), digital storage, and physical length.",
    path: `/${locale}/tools/unit-pro`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
