import { constructMetadata } from "@/lib/metadata";
import { getDictionary } from "@/dictionaries/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const seo = dict.tools?.secretShield?.seo;

  return constructMetadata({
    title: seo?.title || "Secret Shield",
    description:
      seo?.description ||
      "Military-grade AES-256 encryption. Secure any file locally.",
    path: `/${locale}/tools/secret-shield`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
