"use client";

import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  Box,
  Copy,
  Check,
  Sliders,
  Sun,
  Moon,
  Palette,
} from "lucide-react";
import { generateSmoothShadow } from "../../../utils/shadow-util";

export default function ShadowGeneratorPage() {
  const [layers, setLayers] = useState(6);
  const [strength, setStrength] = useState(2);
  const [opacity, setOpacity] = useState(0.15);
  const [color, setColor] = useState("#4F46E5"); // New: Indigo shadow
  const [copied, setCopied] = useState(false);
  const [isDarkModePreview, setIsDarkModePreview] = useState(false);

  const shadowValue = useMemo(
    () => generateSmoothShadow(layers, strength, opacity, color),
    [layers, strength, opacity, color],
  );

  const cssCode = `box-shadow: ${shadowValue};`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <a
        href="/"
        className="inline-flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />{" "}
        Back to workspace
      </a>

      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center">
          <Box className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Shadow Palette Generator
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Create natural, layered CSS shadows with custom colors.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Control Panel */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase text-xs tracking-widest">
              <Sliders className="w-4 h-4" /> Parameters
            </div>
            <button
              onClick={() => setIsDarkModePreview(!isDarkModePreview)}
              className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors"
            >
              {isDarkModePreview ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm font-bold dark:text-white">
              <span>Layers</span>
              <span>{layers}</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={layers}
              onChange={(e) => setLayers(parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm font-bold dark:text-white">
              <span>Strength (Blur)</span>
              <span>{strength}</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={strength}
              onChange={(e) => setStrength(parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm font-bold dark:text-white">
              <span>Max Opacity</span>
              <span>{(opacity * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.5"
              step="0.01"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* New: Color Picker Input */}
          <div className="space-y-4">
            <label className="flex items-center text-sm font-bold dark:text-white">
              <Palette className="w-4 h-4 mr-2" /> Shadow Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-12 rounded-xl cursor-pointer border-none bg-transparent"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                maxLength={7}
                className="flex-grow px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-mono text-sm uppercase dark:text-white border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-3 ml-1 tracking-wider">
              Generated CSS
            </label>
            <div className="relative group">
              <pre className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[11px] font-mono text-slate-600 dark:text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-100 dark:border-slate-700">
                {cssCode}
              </pre>
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 p-2.5 bg-white dark:bg-slate-700 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600 text-slate-400 group-hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div
          className={`flex items-center justify-center rounded-[2.5rem] border border-slate-200 dark:border-slate-800 transition-colors duration-500 shadow-inner ${isDarkModePreview ? "bg-slate-950" : "bg-slate-50"}`}
        >
          <div
            className="w-56 h-56 bg-white dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-slate-400 font-medium animate-in zoom-in-90"
            style={{ boxShadow: shadowValue }}
          >
            Preview Card
          </div>
        </div>
      </div>
    </main>
  );
}
