"use client";

import React, { useState, useRef } from "react";
import {
  Shapes,
  Download,
  RefreshCw,
  FileImage,
  Settings2,
  Lock,
  Unlock,
} from "lucide-react";

interface SvgToPngProps {
  dict: any;
}

export default function SvgToPngUtil({ dict }: SvgToPngProps) {
  const [svgUrl, setSvgUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("converted-image");
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  // Custom Size State
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.includes("svg")) {
      alert(dict.errorNotSvg || "Please upload a valid SVG file.");
      return;
    }

    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    setFileName(nameWithoutExt);

    const url = URL.createObjectURL(file);
    setSvgUrl(url);

    // Read the native SVG dimensions
    const img = new Image();
    img.onload = () => {
      // Fallback to 800 if the SVG has no native width/height
      const nativeWidth = img.width || 800;
      const nativeHeight = img.height || 800;

      setImgElement(img);
      setWidth(nativeWidth);
      setHeight(nativeHeight);
      setAspectRatio(nativeWidth / nativeHeight);
    };
    img.src = url;
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number(e.target.value);
    setWidth(newWidth);
    if (maintainRatio && aspectRatio) {
      setHeight(Math.round(newWidth / aspectRatio));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number(e.target.value);
    setHeight(newHeight);
    if (maintainRatio && aspectRatio) {
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  const downloadPng = () => {
    if (!imgElement) return;
    setIsProcessing(true);

    // Create canvas at the EXACT size the user requested
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Draw the vector onto the canvas, scaling it perfectly without pixelation
      ctx.drawImage(imgElement, 0, 0, width, height);

      const link = document.createElement("a");
      link.download = `${fileName}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }

    // Tiny delay so the user sees the button feedback
    setTimeout(() => setIsProcessing(false), 300);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
      {!svgUrl ? (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-violet-200 dark:border-violet-900/50 rounded-[2rem] p-20 text-center cursor-pointer hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-all group"
        >
          <input
            ref={inputRef}
            type="file"
            accept=".svg, image/svg+xml"
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] && handleFileSelect(e.target.files[0])
            }
          />
          <Shapes className="w-12 h-12 text-violet-400 dark:text-violet-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {dict.dropLabel || "Drop your SVG here"}
          </h3>
          <p className="text-slate-500">
            {dict.disclaimer || "Instant client-side conversion. Zero uploads."}
          </p>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* SVG Preview */}
            <div className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center min-h-[300px]">
              <img
                src={svgUrl}
                alt="SVG Preview"
                className="max-w-full max-h-[250px] object-contain drop-shadow-sm mb-4"
              />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                Original SVG
              </span>
            </div>

            {/* Size Controls & Download */}
            <div className="w-full md:w-1/2 space-y-6">
              <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold mb-2">
                <Settings2 className="w-5 h-5 text-violet-500" />
                <h3>{dict.dimensionsTitle || "Export Size (Pixels)"}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 relative bg-violet-50/50 dark:bg-violet-900/10 p-5 rounded-3xl border border-violet-100 dark:border-violet-800/50">
                <div>
                  <label className="text-sm font-semibold text-slate-500 mb-1 block">
                    {dict.widthLabel || "Width"}
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={handleWidthChange}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-500 mb-1 block">
                    {dict.heightLabel || "Height"}
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={handleHeightChange}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                  />
                </div>

                {/* Ratio Lock Button */}
                <button
                  onClick={() => setMaintainRatio(!maintainRatio)}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-1 bg-white dark:bg-slate-800 p-2 rounded-full border border-slate-200 dark:border-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
                  title={dict.lockRatio || "Toggle Aspect Ratio"}
                >
                  {maintainRatio ? (
                    <Lock className="w-4 h-4 text-violet-600" />
                  ) : (
                    <Unlock className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>

              <button
                onClick={downloadPng}
                disabled={isProcessing}
                className="w-full py-4 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-bold rounded-xl flex items-center justify-center transition-all shadow-lg shadow-violet-600/20"
              >
                {isProcessing ? (
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Download className="w-5 h-5 mr-2" />
                )}
                {dict.btnDownload || "Download PNG"}
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              setSvgUrl(null);
              setImgElement(null);
            }}
            className="flex items-center mx-auto text-slate-500 hover:text-violet-600 font-bold transition-colors pt-4"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {dict.btnReset || "Convert Another SVG"}
          </button>
        </div>
      )}
    </div>
  );
}
