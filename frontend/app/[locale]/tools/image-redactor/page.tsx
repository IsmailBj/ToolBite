import React from "react";
import { ShieldCheck } from "lucide-react";
import { getDictionary } from "@/dictionaries/get-dictionary";
import BackButton from "@/components/BackButton";
import ImageRedactorUtil from "@/utils/ImageRedactor-util";
import { Locale } from "@/proxy";

export default async function ImageRedactorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const ui = dict.tools?.imageRedactor?.ui || {};

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <BackButton />
      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-cyan-100 dark:bg-cyan-900/40 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
          <ShieldCheck className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {dict.tools?.imageRedactor?.title || "Image Redactor & Blur"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {dict.tools?.imageRedactor?.description ||
              "Securely blur or pixelate sensitive information from screenshots. 100% local."}
          </p>
        </div>
      </div>
      <ImageRedactorUtil dict={ui} />
    </main>
  );
}
