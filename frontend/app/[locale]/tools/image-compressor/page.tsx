"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  UploadCloud,
  Loader2,
  Download,
  RefreshCw,
  Minimize,
  AlertCircle,
  Settings2,
  Image as ImageIcon,
} from "lucide-react";
// Import your new clean logic (adjust path if your lib folder is located elsewhere)
import { compressImageLocally } from "../../../../utils/compressor-util";
import { useDictionary } from "@/components/DictionaryProvider";
import BackButton from "@/components/BackButton";

export default function ImageCompressorPage() {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(70);

  // Result state
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    original: number;
    compressed: number;
  } | null>(null);

  const dict = useDictionary();
  const ui = dict.tools?.imageCompressor?.page;

  const inputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [previewUrl, compressedUrl]);

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
      setError(
        ui?.errors?.invalidFile ||
          "Please upload a valid image file (JPEG, PNG, WEBP).",
      );
      return;
    }
    setError("");
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setCompressedUrl(null);
    setStats(null);
  };

  const handleCompress = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError("");

    try {
      // 1. Compress the image locally using the user's browser CPU
      const compressedFile = await compressImageLocally(selectedFile, quality);

      // 2. Read the file sizes locally (no headers needed!)
      const originalSize = selectedFile.size;
      const compressedSize = compressedFile.size;

      // 3. Create a URL for the compressed file and update UI
      setCompressedUrl(URL.createObjectURL(compressedFile));
      setStats({ original: originalSize, compressed: compressedSize });
    } catch (err: any) {
      setError(
        err.message || ui?.errors?.processingError || "Error processing image.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCompressedUrl(null);
    setStats(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <BackButton />

      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center shadow-sm">
          <Minimize className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {ui?.title || "Image Compressor"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg">
            {ui?.subtitle ||
              "Shrink JPEGs, PNGs, and WEBPs with zero visual quality loss."}
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
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
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
              <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              {ui?.dropzoneLabel || "Drop your Image here"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-xs leading-relaxed">
              {ui?.uploadRestrictions ||
                "Supports JPG, PNG, and WEBP up to 15MB."}
            </p>
            <button
              onClick={() => inputRef.current?.click()}
              className="px-10 py-4 bg-slate-900 dark:bg-emerald-600 hover:bg-black dark:hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg transition-all transform hover:scale-105"
            >
              {ui?.selectImageButton || "Select Image"}
            </button>
          </div>
        )}

        {/* Step 2: Settings & Processing */}
        {selectedFile && !compressedUrl && (
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-center items-center aspect-square shadow-inner">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain p-4"
                  />
                )}
              </div>

              <div className="flex flex-col">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {ui?.compressionSettingsLabel || "Compression Settings"}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
                  {ui?.imageQualityLabel || "Image Quality"}:{" "}
                  <span className="text-slate-900 dark:text-white font-bold">
                    {formatBytes(selectedFile.size)}
                  </span>
                </p>

                <div className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold flex items-center text-slate-700 dark:text-slate-200">
                      <Settings2 className="w-5 h-5 mr-2" />{" "}
                      {ui?.imageQualityLabel || "Image Quality"}
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 rounded-full">
                      {quality}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:accent-emerald-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
                    <span>{ui?.smallestFileLabel || "Smallest File"}</span>
                    <span>{ui?.bestQualityLabel || "Best Quality"}</span>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleCompress}
                    disabled={isProcessing}
                    className="flex-1 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 dark:shadow-none transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />{" "}
                        {ui?.compressingLabel || "Compressing..."}
                      </>
                    ) : (
                      "Compress Now"
                    )}
                  </button>
                  <button
                    onClick={reset}
                    className="px-6 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl transition-all"
                  >
                    {ui?.cancelButton || "Cancel"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Result */}
        {compressedUrl && stats && (
          <div className="p-8 md:p-12 text-center animate-in zoom-in-95 duration-500">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8">
              {ui?.compressionCompleteLabel || "Compression Complete! 🎉"}
            </h2>

            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 w-48 shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-1">
                  {ui?.originalSizeLabel || "Original Size"}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatBytes(stats.original)}
                </p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-6 w-48 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-100 text-[10px] font-black px-2 py-1 rounded-bl-lg">
                  {ui?.newSizeLabel || "NEW"}
                </div>
                <p className="text-emerald-700 dark:text-emerald-400 text-sm font-semibold mb-1">
                  {ui?.compressedSizeLabel || "Compressed Size"}
                </p>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-500">
                  {formatBytes(stats.compressed)}
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-2xl p-6 w-48 shadow-sm">
                <p className="text-blue-700 dark:text-blue-400 text-sm font-semibold mb-1">
                  {ui?.totalSavedLabel || "Total Saved"}
                </p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-500">
                  {Math.round((1 - stats.compressed / stats.original) * 100)}%
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={compressedUrl}
                download={`compressed_${selectedFile?.name}`}
                className="flex items-center justify-center px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-100 dark:shadow-none transition-all transform hover:scale-[1.02]"
              >
                <Download className="w-5 h-5 mr-2" />
                {ui?.downloadImageButton || "Download Image"}
              </a>
              <button
                onClick={reset}
                className="flex items-center justify-center px-10 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <RefreshCw className="w-4 h-4 mr-2" />{" "}
                {ui?.compressAnotherButton || "Compress Another"}
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-8 p-5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-2xl flex items-start space-x-3 border border-red-100 dark:border-red-900/50 animate-in slide-in-from-top-2">
          <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">
              {ui?.compressionErrorLabel || "Compression Error"}
            </p>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      )}
    </main>
  );
}
