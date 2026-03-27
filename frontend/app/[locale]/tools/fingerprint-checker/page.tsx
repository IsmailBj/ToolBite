import React from "react";
import { Fingerprint } from "lucide-react";
import { getDictionary } from "@/dictionaries/get-dictionary";
import BackButton from "@/components/BackButton";
import FingerprintScannerUtil from "@/utils/FingerprintScanner-util";
import { Locale } from "@/proxy";

export default async function FingerprintCheckerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  // Safely fallback to an empty object if the translation isn't added yet
  const ui = dict.tools?.fingerprintChecker?.page || {};

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <BackButton />

      {/* Premium Icon Header matching your Color Palette design */}
      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
          <Fingerprint className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {dict.tools?.fingerprintChecker?.title || "Browser Fingerprint"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {dict.tools?.fingerprintChecker?.description ||
              "Discover your unique browser footprint and see how websites track you."}
          </p>
        </div>
      </div>

      {/* The Interactive Client Component */}
      <FingerprintScannerUtil dict={ui} />
    </main>
  );
}
