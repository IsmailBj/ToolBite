"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  UploadCloud,
  FileCheck2,
  Settings,
  Wand2,
  Loader2,
  Download,
  RefreshCw,
} from "lucide-react";

export default function BgRemoverPage() {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

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
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (selectedFile: File) => {
    setIsProcessing(true);
    setError("");
    setResultImage(null);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to process image");

      // The backend returns the processed image as a blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResultImage(url);
    } catch (err) {
      setError(
        "Error processing image. Make sure the backend is running and has the AI library installed.",
      );
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in slide-in-from-bottom-4 duration-500">
      <Link
        href="/"
        className="inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to tools
      </Link>

      <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shadow-sm">
          <Wand2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Background Remover
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Strip backgrounds using local AI processing.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-2 border border-slate-200 dark:border-slate-800 shadow-sm">
        {!resultImage ? (
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[450px] 
              ${dragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"}
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
              accept="image/*"
              onChange={handleChange}
            />

            {isProcessing ? (
              <div className="flex flex-col items-center animate-pulse">
                <Loader2 className="w-16 h-16 text-blue-600 dark:text-blue-400 animate-spin mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  AI is working...
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Removing background locally. This may take a few seconds.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-full flex items-center justify-center mb-6">
                  <UploadCloud className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Drag & drop your image
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs text-center">
                  Your data stays secure. Processing happens on the server.
                </p>
                <button
                  onClick={() => inputRef.current?.click()}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95"
                >
                  Browse Files
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 flex flex-col items-center animate-in zoom-in duration-500">
            <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-[url('[https://www.transparenttextures.com/patterns/checkerboard.png](https://www.transparenttextures.com/patterns/checkerboard.png)')] bg-slate-200 dark:bg-slate-800 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resultImage}
                alt="Result"
                className="max-h-[500px] w-auto rounded-lg shadow-2xl"
              />
            </div>

            <div className="mt-8 flex space-x-4">
              <a
                href={resultImage}
                download="toolbite-result.png"
                className="flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105"
              >
                <Download className="w-5 h-5 mr-2" /> Download Image
              </a>
              <button
                onClick={() => setResultImage(null)}
                className="flex items-center px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Start Over
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-center font-medium border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}
    </main>
  );
}
