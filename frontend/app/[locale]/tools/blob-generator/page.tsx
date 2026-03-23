"use client";

import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  Shapes,
  Copy,
  Check,
  RefreshCw,
  Download,
  Settings2,
} from "lucide-react";
import { generateBlobPath } from "../../../../utils/blob-util";
import { useDictionary } from "@/components/DictionaryProvider";
import BackButton from "@/components/BackButton";

export default function BlobGeneratorPage() {
  const [edges, setEdges] = useState(6);
  const [growth, setGrowth] = useState(60);
  const [seed, setSeed] = useState(123);
  const [color, setColor] = useState("#4F46E5");
  const [copied, setCopied] = useState(false);

  const dict = useDictionary();
  const ui = dict.tools?.blobGenerator?.page;

  const size = 400;
  const path = useMemo(
    () => generateBlobPath({ size, growth, edges, seed }),
    [edges, growth, seed],
  );

  const svgCode = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">\n  <path fill="${color}" d="${path}" />\n</svg>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(svgCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSvg = () => {
    const blob = new Blob([svgCode], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blob-${seed}.svg`;
    a.click();
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <BackButton />

      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center">
          <Shapes className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {ui?.blobTitle || "Blob Shape Generator"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {ui?.blobSubtitle ||
              "Create organic SVG shapes for your web designs."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Controls */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
          <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase text-xs tracking-widest">
            <Settings2 className="w-4 h-4" /> {ui?.parameters || "Parameters"}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm font-bold dark:text-white">
              <span>{ui?.edgesLabel || "Edges (Complexity)"}</span>
              <span>{edges}</span>
            </div>
            <input
              type="range"
              min="3"
              max="20"
              value={edges}
              onChange={(e) => setEdges(parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm font-bold dark:text-white">
              <span>{ui?.growthLabel || "Growth (Randomness)"}</span>
              <span>{growth}px</span>
            </div>
            <input
              type="range"
              min="10"
              max="150"
              value={growth}
              onChange={(e) => setGrowth(parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold dark:text-white">
              Color
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setSeed(Math.random())}
              className="flex-grow flex items-center justify-center gap-2 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl font-bold transition-all"
            >
              <RefreshCw className="w-4 h-4" />{" "}
              {ui?.randomizeButton || "Randomize"}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 aspect-square rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-center p-12 overflow-hidden relative">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-full drop-shadow-2xl"
            >
              <path
                fill={color}
                d={path}
                className="transition-all duration-500 ease-in-out"
              />
            </svg>
          </div>

          <div className="flex gap-4">
            <button
              onClick={copyToClipboard}
              className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center shadow-lg"
            >
              {copied ? (
                <Check className="w-5 h-5 mr-2" />
              ) : (
                <Copy className="w-5 h-5 mr-2" />
              )}
              {copied ? "SVG Copied!" : "Copy SVG Code"}
            </button>
            <button
              onClick={downloadSvg}
              className="px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl transition-all flex items-center justify-center hover:scale-105"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
