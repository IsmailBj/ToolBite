"use client";

import React, { useState, useRef, useEffect } from "react";
import JsBarcode from "jsbarcode";
import {
  Barcode,
  Download,
  Type,
  Settings2,
  Palette,
  Layout,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

export default function BarcodeGeneratorUtil({ dict }: { dict: any }) {
  // --- 1. STATE & LOGIC ---
  const [text, setText] = useState("TOOLBITE-12345");
  const [format, setFormat] = useState("CODE128");
  const [lineColor, setLineColor] = useState("#0f172a");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [showText, setShowText] = useState(true);
  const [error, setError] = useState("");
  const [isFormatOpen, setIsFormatOpen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const barcodeOptions = [
    { id: "CODE128", label: "Code 128 (Universal)" },
    { id: "CODE39", label: "Code 39 (Alphanumeric)" },
    { id: "EAN13", label: "EAN-13 (Retail Europe)" },
    { id: "UPC", label: "UPC-A (Retail US)" },
    { id: "ITF14", label: "ITF-14 (Shipping/Cartons)" },
  ];

  // Generate the barcode whenever state changes
  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      JsBarcode(canvasRef.current, text || " ", {
        format: format,
        lineColor: lineColor,
        background: bgColor,
        displayValue: showText,
        width: 2,
        height: 100,
        margin: 20,
        fontOptions: "bold",
        font: "monospace",
      });
      setError(""); // Clear error if successful
    } catch (err) {
      setError(dict.errorInvalid || "Invalid data for this barcode format.");
    }
  }, [text, format, lineColor, bgColor, showText, dict]);

  const downloadBarcode = () => {
    if (!canvasRef.current || error) return;
    const pngUrl = canvasRef.current
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `barcode-${format.toLowerCase()}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // --- 2. UI RENDER ---
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Controls */}
        <div className="space-y-8">
          {/* Data Input */}
          <div>
            <label className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
              <Type className="w-4 h-4 mr-2 text-violet-500" />
              {dict.dataLabel || "Barcode Data"}
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text or numbers..."
              className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all text-slate-700 dark:text-slate-300 font-mono"
            />
          </div>

          {/* Custom Format Selection Dropdown */}
          <div className="relative">
            <label className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
              <Settings2 className="w-4 h-4 mr-2 text-violet-500" />
              {dict.formatLabel || "Barcode Format"}
            </label>

            <div
              onClick={() => setIsFormatOpen(!isFormatOpen)}
              className={`flex items-center justify-between w-full p-4 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-2xl cursor-pointer transition-all text-slate-700 dark:text-slate-300 font-bold select-none ${
                isFormatOpen
                  ? "border-violet-400 ring-4 ring-violet-500/10"
                  : "border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-600"
              }`}
            >
              <span>
                {barcodeOptions.find((opt) => opt.id === format)?.label}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isFormatOpen ? "rotate-180" : ""}`}
              />
            </div>

            {isFormatOpen && (
              <div className="absolute z-20 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {barcodeOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => {
                      setFormat(option.id);
                      setIsFormatOpen(false);

                      // Smart UX: Auto-fill valid data for strict formats
                      if (option.id === "UPC") setText("123456789012");
                      else if (option.id === "EAN13") setText("1234567890128");
                      else if (option.id === "ITF14") setText("12345678901234");
                      else setText("TOOLBITE-12345");
                    }}
                    className={`px-4 py-3 cursor-pointer text-sm font-bold transition-colors ${
                      format === option.id
                        ? "bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Color & Visibility Controls */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                <Palette className="w-4 h-4 mr-2 text-violet-500" />
                {dict.lineColorLabel || "Line Color"}
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={lineColor}
                  onChange={(e) => setLineColor(e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent"
                />
              </div>
            </div>
            <div>
              <label className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                <Layout className="w-4 h-4 mr-2 text-violet-500" />
                {dict.bgColorLabel || "Background"}
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Show Text Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showText"
              checked={showText}
              onChange={(e) => setShowText(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
            />
            <label
              htmlFor="showText"
              className="ml-3 font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              {dict.showTextLabel || "Show value below barcode"}
            </label>
          </div>
        </div>

        {/* Right Column: Live Preview & Download */}
        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700">
          {error ? (
            <div className="flex flex-col items-center justify-center h-48 w-full text-center">
              <AlertCircle className="w-12 h-12 text-rose-500 mb-4 animate-bounce" />
              <p className="text-rose-600 dark:text-rose-400 font-bold max-w-xs">
                {error}
              </p>
              <p className="text-sm text-slate-500 mt-2">
                {dict.errorHint ||
                  "Retail formats (UPC/EAN) strictly require numbers."}
              </p>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-8 max-w-full overflow-hidden flex justify-center transition-transform hover:scale-105 duration-300">
              <canvas ref={canvasRef} className="max-w-full h-auto"></canvas>
            </div>
          )}

          <button
            onClick={downloadBarcode}
            disabled={!!error || !text}
            className="w-full py-4 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 disabled:dark:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center transition-all shadow-lg shadow-violet-600/20"
          >
            <Download className="w-5 h-5 mr-2" />
            {dict.btnDownload || "Download PNG"}
          </button>
        </div>
      </div>
    </div>
  );
}
