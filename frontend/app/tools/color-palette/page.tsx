"use client";

import React, { useState, useRef } from "react";
import {
  ArrowLeft,
  Palette,
  Upload,
  Copy,
  Check,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";
import { extractPalette, ColorResult } from "../../../utils/color-util";

export default function ColorPalettePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [colors, setColors] = useState<ColorResult[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setImageUrl(URL.createObjectURL(file));
    try {
      const palette = await extractPalette(file);
      setColors(palette);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <a
        href="/"
        className="inline-flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-pink-600 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />{" "}
        Back to workspace
      </a>

      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/40 rounded-2xl flex items-center justify-center shadow-sm">
          <Palette className="w-7 h-7 text-pink-600 dark:text-pink-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Color Palette
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Extract dominant colors from any image instantly.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
        {!imageUrl ? (
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] p-20 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && handleFileSelect(e.target.files[0])
              }
            />
            <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Drop image to sample colors
            </h3>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/2 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg">
                <img
                  src={imageUrl}
                  alt="Source"
                  className="w-full h-auto object-cover max-h-[400px]"
                />
              </div>

              <div className="w-full md:w-1/2 grid grid-cols-1 gap-3">
                {isProcessing ? (
                  <div className="flex items-center justify-center py-10">
                    <RefreshCw className="animate-spin text-pink-600 w-8 h-8" />
                  </div>
                ) : (
                  colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => copyToClipboard(color.hex, i)}
                      className="group flex items-center p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-pink-400 dark:hover:border-pink-500 transition-all text-left"
                    >
                      <div
                        className="w-12 h-12 rounded-xl shadow-inner mr-4"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="flex-grow">
                        <p className="font-bold text-slate-900 dark:text-white uppercase">
                          {color.hex}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {color.rgb}
                        </p>
                      </div>
                      {copiedIndex === i ? (
                        <Check className="w-5 h-5 text-green-500 mr-2" />
                      ) : (
                        <Copy className="w-5 h-5 text-slate-300 group-hover:text-pink-500 mr-2 transition-colors" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={() => {
                setImageUrl(null);
                setColors([]);
              }}
              className="flex items-center mx-auto text-slate-500 hover:text-pink-600 font-bold transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Upload New Image
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
