"use client";

import React, { useState, useRef } from "react";
import {
  ArrowLeft,
  UploadCloud,
  FileCheck2,
  Loader2,
  Download,
  RefreshCw,
  FileText,
  AlertCircle,
} from "lucide-react";

export default function WordToPdfPage() {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

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

  const handleFileUpload = async (file: File) => {
    // Basic validation for Word documents
    const validExtensions = [".doc", ".docx"];
    const isWord = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext),
    );

    if (!isWord) {
      setError("Please upload a valid Word document (.doc or .docx)");
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);
    setError("");
    setPdfUrl(null);

    const formData = new FormData();
    formData.append("word", file);

    try {
      // Endpoint matches the backend logic we established
      const response = await fetch("http://localhost:8000/api/word-to-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Conversion failed");
      }

      // Backend sends the raw PDF buffer as a blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err: any) {
      setError(
        err.message || "Error connecting to server. Ensure backend is running.",
      );
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setPdfUrl(null);
    setError("");
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Replaced Next.js Link with standard anchor for broader compatibility in current environment */}
      <a
        href="/"
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to workspace
      </a>

      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center shadow-sm">
          <FileText className="w-7 h-7 text-red-600" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Word to PDF
          </h1>
          <p className="text-slate-500 mt-1 text-lg">
            Convert .docx and .doc files to high-quality PDF documents.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-3 border border-slate-200 shadow-xl shadow-slate-200/50">
        {!pdfUrl ? (
          <div
            className={`border-2 border-dashed rounded-[2rem] p-16 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[450px] 
              ${dragActive ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-red-400 hover:bg-slate-50"}
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
              accept=".doc,.docx"
              onChange={handleChange}
            />

            {isProcessing ? (
              <div className="flex flex-col items-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
                  <FileText className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Converting your document...
                </h3>
                <p className="text-slate-500 max-w-sm">
                  We're rendering your Word file into a pixel-perfect PDF. This
                  usually takes 3-5 seconds.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center mb-8 shadow-inner">
                  <UploadCloud className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  Drop your Word document here
                </h3>
                <p className="text-slate-500 mb-10 max-w-xs leading-relaxed">
                  Fast, secure, and private. Your data is processed and
                  instantly deleted.
                </p>
                <button
                  onClick={() => inputRef.current?.click()}
                  className="px-10 py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl shadow-lg shadow-slate-200 transition-all transform hover:scale-105 active:scale-95"
                >
                  Select Word File
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-10 flex flex-col items-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-green-50">
              <FileCheck2 size={40} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
              Ready for Download!
            </h2>
            <p className="text-slate-500 mb-10 font-medium">
              Your PDF for{" "}
              <span className="text-slate-900 font-bold">"{fileName}"</span> is
              generated.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <a
                href={pdfUrl}
                download={fileName.replace(/\.[^/.]+$/, "") + ".pdf"}
                className="flex-1 flex items-center justify-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-xl shadow-red-100 transition-all transform hover:scale-[1.02] active:scale-95"
              >
                <Download className="w-5 h-5 mr-2" /> Download PDF
              </a>
              <button
                onClick={reset}
                className="flex-1 flex items-center justify-center px-8 py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Convert Another
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-8 p-5 bg-red-50 text-red-700 rounded-2xl flex items-start space-x-3 border border-red-100 animate-in slide-in-from-top-2">
          <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Conversion Error</p>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      )}

      <footer className="mt-12 text-center text-slate-400 text-sm">
        <p>Supports .docx and .doc formats. Privacy-focused conversion.</p>
      </footer>
    </main>
  );
}
