import { constructMetadata } from "@/lib/metadata";
import { getDictionary } from "@/dictionaries/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const seo = dict.tools?.csvConverter?.seo;

  return constructMetadata({
    title: seo?.title || "CSV to JSON Converter",
    description:
      seo?.description ||
      "Parse local CSV data into formatted JSON arrays and visual HTML tables instantly in your browser.",
    path: `/${locale}/tools/csv-converter`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
