"use client";

import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  QrCode,
  Download,
  Link as LinkIcon,
  Palette,
  Layout,
} from "lucide-react";

export default function QRCodeGeneratorUtil({ dict }: { dict: any }) {
  const [url, setUrl] = useState("https://toolbite.space");
  const [fgColor, setFgColor] = useState("#0f172a"); // Dark slate
  const [bgColor, setBgColor] = useState("#ffffff"); // White
  const [size, setSize] = useState(256);

  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "toolbite-qrcode.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Controls */}
        <div className="space-y-8">
          {/* URL Input */}
          <div>
            <label className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
              <LinkIcon className="w-4 h-4 mr-2 text-blue-500" />
              {dict.urlLabel || "Enter URL or Text"}
            </label>
            <textarea
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-website.com"
              className="w-full h-24 p-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none resize-none transition-all text-slate-700 dark:text-slate-300"
            />
          </div>

          {/* Color Controls */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                <Palette className="w-4 h-4 mr-2 text-blue-500" />
                {dict.fgColorLabel || "QR Color"}
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent"
                />
                <span className="text-sm font-mono text-slate-500 uppercase">
                  {fgColor}
                </span>
              </div>
            </div>
            <div>
              <label className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                <Layout className="w-4 h-4 mr-2 text-blue-500" />
                {dict.bgColorLabel || "Background"}
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent"
                />
                <span className="text-sm font-mono text-slate-500 uppercase">
                  {bgColor}
                </span>
              </div>
            </div>
          </div>

          {/* Size Slider */}
          <div>
            <label className="flex justify-between items-center text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
              <span>{dict.sizeLabel || "Image Size"}</span>
              <span className="text-blue-500">{size}px</span>
            </label>
            <input
              type="range"
              min="128"
              max="512"
              step="8"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        {/* Right Column: Live Preview & Download */}
        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700">
          <div
            ref={qrRef}
            className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-8 transition-transform hover:scale-105 duration-300"
            // We force the wrapper to be white if they choose a dark background so it doesn't bleed
            style={{ backgroundColor: bgColor }}
          >
            <QRCodeCanvas
              value={url || "https://toolbite.space"}
              size={200} // We keep the UI preview at a fixed size so it doesn't break the layout
              fgColor={fgColor}
              bgColor={bgColor}
              level="H" // High error correction
              includeMargin={true}
              // We render a hidden canvas for the actual high-res download
              className="hidden"
            />

            {/* This is the visible preview */}
            <QRCodeCanvas
              value={url || "https://toolbite.space"}
              size={200}
              fgColor={fgColor}
              bgColor={bgColor}
              level="H"
              includeMargin={true}
            />

            {/* This is the hidden high-res canvas used for downloading */}
            <div className="hidden">
              <QRCodeCanvas
                value={url || "https://toolbite.space"}
                size={size}
                fgColor={fgColor}
                bgColor={bgColor}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>

          <button
            onClick={downloadQRCode}
            disabled={!url}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center transition-all shadow-lg shadow-blue-600/20"
          >
            <Download className="w-5 h-5 mr-2" />
            {dict.btnDownload || "Download PNG"}
          </button>
        </div>
      </div>
    </div>
  );
}
