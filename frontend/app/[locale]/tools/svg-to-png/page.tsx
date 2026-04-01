import React from "react";
import { Shapes } from "lucide-react";
import { getDictionary } from "@/dictionaries/get-dictionary";
import BackButton from "@/components/BackButton";
import SvgToPngUtil from "@/utils/SvgToPng-util";
import { Locale } from "@/proxy";

export default async function SvgToPngPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const ui = dict.tools?.svgToPng?.ui || {};

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <BackButton />

      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900/40 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
          <Shapes className="w-7 h-7 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {dict.tools?.svgToPng?.title || "SVG to PNG Converter"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {dict.tools?.svgToPng?.description ||
              "Instantly convert vector SVG files to transparent PNG images locally."}
          </p>
        </div>
      </div>

      <SvgToPngUtil dict={ui} />
    </main>
  );
}
