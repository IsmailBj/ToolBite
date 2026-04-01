import React from "react";
import { Subtitles } from "lucide-react";
import { getDictionary } from "@/dictionaries/get-dictionary";
import BackButton from "@/components/BackButton";
import VideoToSubtitlesUtil from "@/utils/VideoToSubtitles-util";
import { Locale } from "@/proxy";

export default async function VideoSubtitlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const ui = dict.tools?.videoSubtitles?.page || {};

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <BackButton />
      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/40 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
          <Subtitles className="w-7 h-7 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {dict.tools?.videoSubtitles?.title || "AI Video Subtitles"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {dict.tools?.videoSubtitles?.description ||
              "Auto-generate subtitles (.vtt) for your videos using local browser AI."}
          </p>
        </div>
      </div>
      <VideoToSubtitlesUtil dict={ui} />
    </main>
  );
}
