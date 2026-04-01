import React from "react";
import { Bot } from "lucide-react";
import { getDictionary } from "@/dictionaries/get-dictionary";
import BackButton from "@/components/BackButton";
import AltTextGeneratorUtil from "@/utils/AltTextGenerator-util";
import { Locale } from "@/proxy";

export default async function AltTextPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const ui = dict.tools?.aiAltText?.page || {};

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <BackButton />
      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
          <Bot className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {dict.tools?.aiAltText?.title || "AI Smart Alt-Text"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {dict.tools?.aiAltText?.description ||
              "Generate SEO-friendly image descriptions using local browser AI."}
          </p>
        </div>
      </div>
      <AltTextGeneratorUtil dict={ui} />
    </main>
  );
}
