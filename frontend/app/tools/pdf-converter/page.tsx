"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  UploadCloud,
  FileCheck2,
  Settings,
  FileText,
  Loader2,
  Download,
  RefreshCw,
} from "lucide-react";

export default function PdfConverterPage() {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultFiles, setResultFiles] = useState<string[]>([]);
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
    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }

    setIsProcessing(true);
    setError("");
    setResultFiles([]);

    const formData = new FormData();
    formData.append("pdf", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/api/convert-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to convert PDF");

      const data = await response.json();
      // Assuming backend returns an array of base64 images or links
      setResultFiles(data.images);
    } catch (err) {
      setError(
        "Error converting PDF. Ensure backend dependencies like poppler are installed.",
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
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center shadow-sm">
          <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            PDF Converter
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Convert PDF pages into high-quality images.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-2 border border-slate-200 dark:border-slate-800 shadow-sm">
        {resultFiles.length === 0 ? (
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[450px] 
              ${dragActive ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-slate-300 dark:border-slate-700 hover:border-red-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"}
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
              accept=".pdf"
              onChange={handleChange}
            />

            {isProcessing ? (
              <div className="flex flex-col items-center animate-pulse">
                <Loader2 className="w-16 h-16 text-red-600 dark:text-red-400 animate-spin mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Processing PDF...
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Rendering pages as images. This may take a moment.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-full flex items-center justify-center mb-6">
                  <UploadCloud className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Drag & drop your PDF
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs text-center">
                  Select a PDF file to extract pages as images.
                </p>
                <button
                  onClick={() => inputRef.current?.click()}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95"
                >
                  Browse PDF
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 flex flex-col items-center animate-in zoom-in duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {resultFiles.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700"
                >
                  <img
                    src={img}
                    alt={`Page ${idx + 1}`}
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a
                      href={img}
                      download={`page-${idx + 1}.png`}
                      className="p-2 bg-white rounded-lg text-slate-900 shadow-lg"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex space-x-4">
              <button
                onClick={() => setResultFiles([])}
                className="flex items-center px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Convert Another
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
