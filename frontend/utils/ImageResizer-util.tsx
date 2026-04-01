"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Image as ImageIcon,
  Download,
  RefreshCw,
  Lock,
  Unlock,
  Settings2,
} from "lucide-react";

interface ImageResizerProps {
  dict: any;
}

export default function ImageResizerUtil({ dict }: ImageResizerProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("resized-image.png");

  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setFileName(file.name);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setImage(img);
      setWidth(img.width);
      setHeight(img.height);
      setAspectRatio(img.width / img.height);
    };
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

  const downloadImage = () => {
    if (!image) return;

    // Create a temporary canvas to draw the resized image
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(image, 0, 0, width, height);
      const link = document.createElement("a");
      link.download = `resized-${fileName}`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  return (
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
            {dict.dropImageLabel || "Drop image to resize"}
          </h3>
          <p className="text-slate-500 mt-2">100% Client-Side. No uploads.</p>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Image Preview */}
            <div className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-center min-h-[300px]">
              <img
                src={imageUrl}
                alt="Preview"
                className="max-w-full max-h-[300px] object-contain rounded-xl shadow-sm"
              />
            </div>

            {/* Controls */}
            <div className="w-full md:w-1/2 space-y-6">
              <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold mb-4">
                <Settings2 className="w-5 h-5" />
                <h3>{dict.dimensionsTitle || "Dimensions (Pixels)"}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 relative">
                <div>
                  <label className="text-sm font-semibold text-slate-500 mb-1 block">
                    {dict.widthLabel || "Width"}
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={handleWidthChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
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
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                {/* Ratio Lock Button */}
                <button
                  onClick={() => setMaintainRatio(!maintainRatio)}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-1 bg-white dark:bg-slate-700 p-2 rounded-full border border-slate-200 dark:border-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
                  title={dict.lockRatio || "Toggle Aspect Ratio"}
                >
                  {maintainRatio ? (
                    <Lock className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Unlock className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>

              <button
                onClick={downloadImage}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-blue-600/20"
              >
                <Download className="w-5 h-5 mr-2" />
                {dict.btnDownload || "Download Resized Image"}
              </button>
            </div>
          </div>

          <button
            onClick={() => setImageUrl(null)}
            className="flex items-center mx-auto text-slate-500 hover:text-blue-600 font-bold transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {dict.btnReset || "Upload New Image"}
          </button>
        </div>
      )}
    </div>
  );
}
