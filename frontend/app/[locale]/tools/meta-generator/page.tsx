import React from "react";
import { Search } from "lucide-react";
import { getDictionary } from "@/dictionaries/get-dictionary";
import BackButton from "@/components/BackButton";
import MetaGeneratorUtil from "@/utils/MetaGenerator-util";
import { Locale } from "@/proxy";

export default async function MetaGeneratorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const ui = dict.tools?.metaGenerator?.page || {};

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <BackButton />
      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
          <Search className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {dict.tools?.metaGenerator?.title || "AI Meta Description"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {dict.tools?.metaGenerator?.description ||
              "Instantly summarize long articles into perfect, SEO-friendly meta descriptions."}
          </p>
        </div>
      </div>
      <MetaGeneratorUtil dict={ui} />
    </main>
  );
}
