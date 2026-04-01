import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "../../components/Navbar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getDictionary } from "@/dictionaries/get-dictionary";
import DictionaryProvider from "@/components/DictionaryProvider";
import { constructMetadata } from "@/lib/metadata";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as any);

  return constructMetadata({
    title: dict.home?.seo?.title || "ToolBite | Your Utility Workspace",
    description:
      dict.home?.seo?.description ||
      "Fast, secure, all-in-one utility tools directly in your browser.",
    path: `/${locale}`,
  });
}

export async function generateStaticParams() {
  return [
    { locale: "en" },
    { locale: "es" },
    { locale: "fr" },
    { locale: "de" },
    { locale: "pl" },
    { locale: "ru" },
  ];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  const dictionary = await getDictionary(locale as any);

  return (
    <html lang={locale} className="scroll-smooth">
      <body
        className={`${inter.className} min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-100 selection:bg-blue-100 dark:selection:bg-blue-900`}
      >
        <DictionaryProvider dictionary={dictionary}>
          <Navbar />
          <main>{children}</main>
          <Analytics />
          <SpeedInsights />
        </DictionaryProvider>
      </body>
    </html>
  );
}
