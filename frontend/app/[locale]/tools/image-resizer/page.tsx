import React from "react";
import { Maximize } from "lucide-react";
import { getDictionary } from "@/dictionaries/get-dictionary";
import BackButton from "@/components/BackButton";
import ImageResizerUtil from "@/utils/ImageResizer-util";
import { Locale } from "@/proxy";

export default async function ImageResizerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const ui = dict.tools?.imageResizer?.ui || {};

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <BackButton />

      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
          <Maximize className="w-7 h-7 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {dict.tools?.imageResizer?.title || "Image Resizer"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {dict.tools?.imageResizer?.description ||
              "Resize images locally in your browser without losing quality."}
          </p>
        </div>
      </div>

      <ImageResizerUtil dict={ui} />
    </main>
  );
}
