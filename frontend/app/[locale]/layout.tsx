import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "../../components/Navbar";
import { Analytics } from "@vercel/analytics/react";
import { getDictionary } from "@/dictionaries/get-dictionary";
import DictionaryProvider from "@/components/DictionaryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ToolBite | Your Utility Workspace",
  description: "Fast, secure, all-in-one utility tools.",
};

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const dictionary = await getDictionary(resolvedParams.locale as "en" | "es");

  return (
    <html lang={resolvedParams.locale}>
      <body
        className={`${inter.className} min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-100 selection:bg-blue-100 dark:selection:bg-blue-900`}
      >
        <DictionaryProvider dictionary={dictionary}>
          <Navbar />
          {children}
          <Analytics />
        </DictionaryProvider>
      </body>
    </html>
  );
}
