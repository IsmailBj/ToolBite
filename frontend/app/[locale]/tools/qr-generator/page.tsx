import React from "react";
import { QrCode } from "lucide-react";
import { getDictionary } from "@/dictionaries/get-dictionary";
import BackButton from "@/components/BackButton";
import QRCodeGeneratorUtil from "@/utils/QRCodeGenerator-util";
import { Locale } from "@/proxy";

export default async function QRCodePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const ui = dict.tools?.qrGenerator?.ui || {};

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <BackButton />
      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
          <QrCode className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {dict.tools?.qrGenerator?.title || "QR Code Generator"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {dict.tools?.qrGenerator?.description ||
              "Create custom, high-resolution QR codes instantly. 100% offline."}
          </p>
        </div>
      </div>
      <QRCodeGeneratorUtil dict={ui} />
    </main>
  );
}
