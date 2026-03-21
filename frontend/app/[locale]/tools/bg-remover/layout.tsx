import { constructMetadata } from "@/lib/metadata";
import { getDictionary } from "@/dictionaries/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "en" | "es" }>;
}) {
  // 3. Unwrap the Next.js 16 Promise
  const resolvedParams = await params;

  // 4. Fetch the correct dictionary
  const dict = await getDictionary(resolvedParams.locale);

  const seo = dict.tools?.bgRemover?.seo;

  return constructMetadata({
    title: seo?.title || "Background Remover",
    description:
      seo?.description ||
      "Instantly strip backgrounds from any image using high-speed AI.",
    path: `/${resolvedParams.locale}/tools/bg-remover`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
