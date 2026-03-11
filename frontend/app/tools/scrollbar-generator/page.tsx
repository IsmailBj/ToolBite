"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  SlidersVertical,
  Copy,
  Check,
  Moon,
  Sun,
} from "lucide-react";
import {
  generateScrollbarCss,
  ScrollbarConfig,
} from "../../../utils/scrollbar-util";

export default function ScrollbarGeneratorPage() {
  const [config, setConfig] = useState<ScrollbarConfig>({
    width: 14,
    trackColor: "#f1f5f9",
    thumbColor: "#cbd5e1",
    thumbHoverColor: "#94a3b8",
    borderRadius: 8,
    padding: 3,
  });

  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");
  const [copied, setCopied] = useState(false);

  const cssCode = generateScrollbarCss(config);

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateConfig = (key: keyof ScrollbarConfig, value: string | number) => {
    setConfig({ ...config, [key]: value });
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Scope the generated CSS directly to the preview box so it functions live */}
      <style dangerouslySetInnerHTML={{ __html: cssCode }} />

      <a
        href="/"
        className="inline-flex items-center text-sm text-slate-500 hover:text-emerald-600 mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />{" "}
        Back to workspace
      </a>

      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center">
          <SlidersVertical className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Custom Scrollbar
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Cross-browser visual editor for Webkit and Firefox scrollbars.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-5">
            <div>
              <label className="flex justify-between text-xs font-bold uppercase text-slate-400 mb-2">
                <span>Width / Height</span>
                <span className="text-emerald-600">{config.width}px</span>
              </label>
              <input
                type="range"
                min="4"
                max="30"
                value={config.width}
                onChange={(e) => updateConfig("width", Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <label className="flex justify-between text-xs font-bold uppercase text-slate-400 mb-2">
                <span>Padding (Floating Effect)</span>
                <span className="text-emerald-600">{config.padding}px</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={config.padding}
                onChange={(e) =>
                  updateConfig("padding", Number(e.target.value))
                }
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <label className="flex justify-between text-xs font-bold uppercase text-slate-400 mb-2">
                <span>Border Radius</span>
                <span className="text-emerald-600">
                  {config.borderRadius}px
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={config.borderRadius}
                onChange={(e) =>
                  updateConfig("borderRadius", Number(e.target.value))
                }
                className="w-full accent-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 block mb-2">
                Track Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={config.trackColor}
                  onChange={(e) => updateConfig("trackColor", e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  value={config.trackColor}
                  onChange={(e) => updateConfig("trackColor", e.target.value)}
                  className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm uppercase"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400 block mb-2">
                Thumb Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={config.thumbColor}
                  onChange={(e) => updateConfig("thumbColor", e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  value={config.thumbColor}
                  onChange={(e) => updateConfig("thumbColor", e.target.value)}
                  className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm uppercase"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400 block mb-2">
                Thumb Hover
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={config.thumbHoverColor}
                  onChange={(e) =>
                    updateConfig("thumbHoverColor", e.target.value)
                  }
                  className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  value={config.thumbHoverColor}
                  onChange={(e) =>
                    updateConfig("thumbHoverColor", e.target.value)
                  }
                  className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm uppercase"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                CSS Output
              </span>
              <button
                onClick={handleCopy}
                className="text-slate-400 hover:text-emerald-600 transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
            <pre className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 overflow-auto max-h-48 custom-scroll">
              {cssCode}
            </pre>
          </div>
        </div>

        <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center justify-center">
          <div
            className={`w-full max-w-lg h-[500px] rounded-2xl shadow-xl overflow-hidden border transition-colors duration-300 flex flex-col ${
              previewTheme === "dark"
                ? "bg-slate-900 border-slate-700 text-slate-200"
                : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            {/* Preview Header & Theme Toggle */}
            <div
              className={`p-4 border-b flex justify-between items-center ${previewTheme === "dark" ? "border-slate-800" : "border-slate-100"}`}
            >
              <h3 className="font-bold">Live Preview</h3>
              <div className="flex space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                  onClick={() => setPreviewTheme("light")}
                  className={`p-1.5 rounded-md ${previewTheme === "light" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400"}`}
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewTheme("dark")}
                  className={`p-1.5 rounded-md ${previewTheme === "dark" ? "bg-slate-700 text-emerald-400 shadow-sm" : "text-slate-400"}`}
                >
                  <Moon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Container (Vertical and Horizontal) */}
            <div className="custom-scroll p-6 overflow-auto flex-1">
              <div className="w-[150%] space-y-6 pb-6">
                <h4 className="font-bold text-lg mb-4">
                  Vertical & Horizontal Scroll Content
                </h4>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-16 rounded-xl w-full ${previewTheme === "dark" ? "bg-slate-800" : "bg-slate-100"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
