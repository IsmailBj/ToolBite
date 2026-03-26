import { constructMetadata } from "@/lib/metadata";
import { getDictionary } from "@/dictionaries/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const seo = dict.tools?.cronVisualizer?.seo;

  return constructMetadata({
    title: seo?.title || "Cron Visualizer",
    description:
      seo?.description ||
      "Convert cryptic cron expressions into human-readable sentences and schedules.",
    path: `/${locale}/tools/cron-visualizer`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
