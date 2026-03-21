"use client";

import React from "react";
import Link from "@/components/LocalizedLink";
import { ArrowLeft } from "lucide-react";
import { useDictionary } from "./DictionaryProvider";

export default function BackButton() {
  const dict = useDictionary();

  return (
    <Link
      href="/"
      className="inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 mb-8 transition-colors group"
    >
      <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
      {dict.common?.backToWorkspace || "Back to workspace"}
    </Link>
  );
}
