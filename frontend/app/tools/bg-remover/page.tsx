"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  UploadCloud,
  Loader2,
  Download,
  RefreshCw,
  Scissors,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
// Import our new logic file
import { removeBackgroundLocally } from "../../../utils/bgremover-util";

export default function BgRemoverPage() {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState("Waking up AI...");
  const [error, setError] = useState("");

  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Result state
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (JPEG, PNG, WEBP).");
      return;
    }
    setError("");
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResultUrl(null);
  };

  const handleRemoveBackground = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError("");
    setProgressText("Waking up AI model...");

    try {
      // Run the local AI, passing our setProgressText to update the UI
      const resultBlob = await removeBackgroundLocally(selectedFile, (text) => {
        setProgressText(text);
      });

      setResultUrl(URL.createObjectURL(resultBlob));
    } catch (err: any) {
      setError(err.message || "Error processing image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <a
        href="/"
        className="inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to workspace
      </a>

      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/40 rounded-2xl flex items-center justify-center shadow-sm">
          <Scissors className="w-7 h-7 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Background Remover
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg">
            Instantly extract subjects from images using on-device AI.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-3 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
        {/* Step 1: Upload */}
        {!selectedFile && (
          <div
            className={`border-2 border-dashed rounded-[2rem] p-16 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[450px] 
              ${
                dragActive
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  : "border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
              onChange={(e) =>
                e.target.files?.[0] && handleFileSelect(e.target.files[0])
              }
            />

            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl flex items-center justify-center mb-8 shadow-inner">
              <UploadCloud className="w-12 h-12 text-slate-300 dark:text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Drop your Image here
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-xs leading-relaxed">
              Works best with clear subjects (people, products, animals).
            </p>
            <button
              onClick={() => inputRef.current?.click()}
              className="px-10 py-4 bg-slate-900 dark:bg-purple-600 hover:bg-black dark:hover:bg-purple-500 text-white font-bold rounded-2xl shadow-lg transition-all transform hover:scale-105"
            >
              Select Image
            </button>
          </div>
        )}

        {/* Step 2: Processing / Preview */}
        {selectedFile && !resultUrl && (
          <div className="p-8 md:p-12 flex flex-col items-center">
            <div className="relative w-full max-w-lg rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-center items-center aspect-video shadow-inner mb-8">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Original"
                  className={`max-w-full max-h-full object-contain p-4 transition-opacity duration-300 ${isProcessing ? "opacity-30" : "opacity-100"}`}
                />
              )}

              {/* Overlay loading state directly on the image */}
              {isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-4 border-purple-100 dark:border-purple-900/30 border-t-purple-600 dark:border-t-purple-500 rounded-full animate-spin mb-4"></div>
                  <p className="font-bold text-slate-900 dark:text-white text-lg bg-white/80 dark:bg-slate-900/80 px-4 py-1 rounded-full backdrop-blur-sm">
                    {progressText}
                  </p>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-2 bg-white/80 dark:bg-slate-900/80 px-3 py-1 rounded-full backdrop-blur-sm">
                    First run downloads the AI (takes a moment).
                  </p>
                </div>
              )}
            </div>

            {!isProcessing && (
              <div className="flex space-x-4 w-full max-w-lg">
                <button
                  onClick={handleRemoveBackground}
                  className="flex-1 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-200 dark:shadow-none transition-all flex justify-center items-center"
                >
                  <Scissors className="w-5 h-5 mr-2" /> Remove Background
                </button>
                <button
                  onClick={reset}
                  className="px-6 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl transition-all"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Result */}
        {resultUrl && (
          <div className="p-8 md:p-12 text-center animate-in zoom-in-95 duration-500">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8">
              Subject Extracted! ✨
            </h2>

            {/* Checkered background to show transparency */}
            <div
              className="w-full max-w-lg mx-auto rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 mb-8"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, #f1f5f9 25%, transparent 25%, transparent 75%, #f1f5f9 75%, #f1f5f9), repeating-linear-gradient(45deg, #f1f5f9 25%, #ffffff 25%, #ffffff 75%, #f1f5f9 75%, #f1f5f9)",
                backgroundPosition: "0 0, 10px 10px",
                backgroundSize: "20px 20px",
              }}
            >
              {/* In dark mode, dim the checkerboard slightly by applying a blend mask or keeping it light so transparency is obvious */}
              <div className="dark:bg-slate-800/40 w-full h-full flex justify-center items-center aspect-square p-4">
                <img
                  src={resultUrl}
                  alt="Removed Background Result"
                  className="max-w-full max-h-full object-contain drop-shadow-2xl"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={resultUrl}
                download={`transparent_${selectedFile?.name.replace(/\.[^/.]+$/, "")}.png`}
                className="flex items-center justify-center px-10 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-xl shadow-purple-100 dark:shadow-none transition-all transform hover:scale-[1.02]"
              >
                <Download className="w-5 h-5 mr-2" /> Download PNG
              </a>
              <button
                onClick={reset}
                className="flex items-center justify-center px-10 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Start Over
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-8 p-5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-2xl flex items-start space-x-3 border border-red-100 dark:border-red-900/50 animate-in slide-in-from-top-2">
          <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Error</p>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      )}
    </main>
  );
}
