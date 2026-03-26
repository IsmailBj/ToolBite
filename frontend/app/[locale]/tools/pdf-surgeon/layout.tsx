import { constructMetadata } from "@/lib/metadata";
import { getDictionary } from "@/dictionaries/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const seo = dict.tools?.pdfSurgeon?.seo;

  return constructMetadata({
    title: seo?.title || "PDF Surgeon",
    description:
      seo?.description ||
      "Merge multiple documents or extract specific pages with pinpoint precision.",
    path: `/${locale}/tools/pdf-surgeon`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
