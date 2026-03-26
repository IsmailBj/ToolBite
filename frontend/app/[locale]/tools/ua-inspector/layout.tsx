import { constructMetadata } from "@/lib/metadata";
import { getDictionary } from "@/dictionaries/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const seo = dict.tools?.uaInspector?.seo;

  return constructMetadata({
    title: seo?.title || "UA Inspector",
    description:
      seo?.description ||
      "Detect and parse User-Agent strings to identify browsers, OS, and hardware details.",
    path: `/${locale}/tools/ua-inspector`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
