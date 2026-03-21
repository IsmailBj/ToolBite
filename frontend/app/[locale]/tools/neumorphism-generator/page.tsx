"use client";

import React, { useState } from "react";
import { ArrowLeft, Layers, Copy, Check } from "lucide-react";
import {
  generateNeumorphismCss,
  NeumorphismConfig,
  NeumorphismShape,
} from "../../../../utils/neumorphism-util";

export default function NeumorphismGeneratorPage() {
  const [config, setConfig] = useState<NeumorphismConfig>({
    baseColor: "#1f6ddb",
    distance: 28,
    blur: 60,
    intensity: 26,
    shape: "flat",
  });
  const [copied, setCopied] = useState(false);

  const cssCode = generateNeumorphismCss(config);

  // Extract box-shadow and background for inline styling
  const boxShadowMatch = cssCode.match(/box-shadow: (.*?);/);
  const backgroundMatch = cssCode.match(/background: (.*?);/);

  const previewStyle = {
    backgroundColor: config.baseColor,
    boxShadow: boxShadowMatch ? boxShadowMatch[1] : "",
    background: backgroundMatch ? backgroundMatch[1] : config.baseColor,
    borderRadius: "50px",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateConfig = (key: keyof NeumorphismConfig, value: any) => {
    setConfig({ ...config, [key]: value });
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <a
        href="/"
        className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />{" "}
        Back to workspace
      </a>

      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center">
          <Layers className="w-7 h-7 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Neumorphism Generator
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Generate soft UI CSS code based on a single base color.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Base Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={config.baseColor}
                onChange={(e) => updateConfig("baseColor", e.target.value)}
                className="w-12 h-12 rounded cursor-pointer border-0 bg-transparent p-0"
              />
              <input
                type="text"
                value={config.baseColor}
                onChange={(e) => updateConfig("baseColor", e.target.value)}
                className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
              Shape
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                ["flat", "pressed", "convex", "concave"] as NeumorphismShape[]
              ).map((shape) => (
                <button
                  key={shape}
                  onClick={() => updateConfig("shape", shape)}
                  className={`p-2 rounded-lg text-sm font-bold capitalize transition-all ${
                    config.shape === shape
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {shape}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                <span>Distance</span>
                <span className="text-blue-600">{config.distance}px</span>
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={config.distance}
                onChange={(e) =>
                  updateConfig("distance", Number(e.target.value))
                }
                className="w-full accent-blue-600"
              />
            </div>
            <div>
              <label className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                <span>Blur</span>
                <span className="text-blue-600">{config.blur}px</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={config.blur}
                onChange={(e) => updateConfig("blur", Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
            <div>
              <label className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                <span>Intensity</span>
                <span className="text-blue-600">{config.intensity}</span>
              </label>
              <input
                type="range"
                min="1"
                max="60"
                value={config.intensity}
                onChange={(e) =>
                  updateConfig("intensity", Number(e.target.value))
                }
                className="w-full accent-blue-600"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                CSS Output
              </span>
              <button
                onClick={handleCopy}
                className="text-slate-400 hover:text-blue-600 transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
            <pre className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto">
              {cssCode}
            </pre>
          </div>
        </div>

        <div
          className="lg:col-span-8 p-8 rounded-3xl min-h-[500px] flex items-center justify-center transition-colors duration-300"
          style={{ backgroundColor: config.baseColor }}
        >
          <div
            className="w-64 h-64 transition-all duration-300 ease-in-out"
            style={previewStyle}
          />
        </div>
      </div>
    </main>
  );
}
