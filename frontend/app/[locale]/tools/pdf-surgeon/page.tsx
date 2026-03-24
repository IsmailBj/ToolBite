"use client";

import React, { useState, useRef } from "react";
import {
  ArrowLeft,
  Scissors,
  Combine,
  Download,
  FileText,
  Trash2,
  Plus,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { mergeFiles, splitFile } from "../../../../utils/pdf-util";
import { useDictionary } from "@/components/DictionaryProvider";
import BackButton from "@/components/BackButton";

export default function PdfSurgeonPage() {
  const [mode, setMode] = useState<"merge" | "split">("merge");
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [splitRange, setSplitRange] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const dict = useDictionary();
  const ui = dict.tools?.pdfSurgeon?.page;

  const handleFileSelect = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const incoming = Array.from(newFiles).filter(
      (f) => f.type === "application/pdf",
    );
    if (mode === "split") setFiles([incoming[0]]);
    else setFiles((prev) => [...prev, ...incoming]);
    setResultUrl(null);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setResultUrl(null);
  };

  const handleAction = async () => {
    setIsProcessing(true);
    setError("");
    try {
      let blob: Blob;
      if (mode === "merge") {
        if (files.length < 2)
          throw new Error(
            ui?.minFilesError || "Please add at least 2 PDFs to merge.",
          );
        blob = await mergeFiles(files);
      } else {
        if (files.length === 0)
          throw new Error(
            ui?.uploadSplitError || "Please upload a PDF to split.",
          );
        // Simple range parser: "1-3, 5" -> [0, 1, 2, 4]
        const indices = splitRange
          .split(",")
          .flatMap((r) => {
            if (r.includes("-")) {
              const [start, end] = r
                .split("-")
                .map((n) => parseInt(n.trim()) - 1);
              return Array.from(
                { length: end - start + 1 },
                (_, i) => start + i,
              );
            }
            return [parseInt(r.trim()) - 1];
          })
          .filter((n) => !isNaN(n));

        blob = await splitFile(files[0], indices);
      }
      setResultUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <BackButton />

      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-red-100 dark:bg-red-900/40 rounded-2xl flex items-center justify-center">
          <Scissors className="w-7 h-7 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {ui?.title || "PDF Surgeon"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {ui?.subtitle ||
              "Merge or split PDF documents instantly in your browser."}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
        {/* Mode Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-8 w-fit mx-auto border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              setMode("merge");
              setFiles([]);
              setResultUrl(null);
            }}
            className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${mode === "merge" ? "bg-white dark:bg-slate-700 shadow-sm text-red-600" : "text-slate-500"}`}
          >
            <Combine className="w-4 h-4" /> {ui?.mergeTabLabel || "Merge"}
          </button>
          <button
            onClick={() => {
              setMode("split");
              setFiles([]);
              setResultUrl(null);
            }}
            className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${mode === "split" ? "bg-white dark:bg-slate-700 shadow-sm text-red-600" : "text-slate-500"}`}
          >
            <Scissors className="w-4 h-4" /> {ui?.splitTabLabel || "Split"}
          </button>
        </div>

        {/* File Queue */}
        <div className="space-y-4 mb-8">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700"
            >
              <FileText className="w-6 h-6 text-red-500 mr-4" />
              <span className="flex-grow truncate font-medium dark:text-slate-200">
                {file.name}
              </span>
              <button
                onClick={() => removeFile(i)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}

          {(!files.length || (mode === "merge" && files.length > 0)) && (
            <button
              onClick={() => inputRef.current?.click()}
              className="w-full py-10 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all"
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                multiple={mode === "merge"}
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
              <Plus className="w-8 h-8 mb-2" />
              <span className="font-semibold text-slate-600 dark:text-slate-400">
                {mode === "merge" ? "Add PDFs to Merge" : "Select PDF to Split"}
              </span>
            </button>
          )}
        </div>

        {mode === "split" && files.length > 0 && (
          <div className="mb-8">
            <label className="block text-sm font-bold mb-2 dark:text-slate-300 ml-1">
              {ui?.pageRangeLabel || "Page Range"} (e.g. 1-3, 5)
            </label>
            <input
              type="text"
              value={splitRange}
              onChange={(e) => setSplitRange(e.target.value)}
              placeholder="1-5 or 2, 4, 6"
              className="w-full px-5 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none dark:text-white"
            />
          </div>
        )}

        {files.length > 0 && !resultUrl && (
          <button
            onClick={handleAction}
            disabled={isProcessing}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center"
          >
            {isProcessing ? (
              <RefreshCw className="animate-spin mr-2" />
            ) : mode === "merge" ? (
              <Combine className="mr-2" />
            ) : (
              <Scissors className="mr-2" />
            )}
            {mode === "merge" ? "Merge Documents" : "Extract Pages"}
          </button>
        )}

        {resultUrl && (
          <div className="text-center py-6 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Download className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              {ui?.pdfReadyLabel || "PDF Ready!"}
            </h2>
            <a
              href={resultUrl}
              download={`processed_${new Date().getTime()}.pdf`}
              className="inline-flex items-center px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl hover:scale-105 transition-transform"
            >
              <Download className="mr-2 w-5 h-5" />{" "}
              {ui?.downloadResultButton || "Download Result"}
            </a>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-900/50 flex items-center">
            <AlertCircle className="w-5 h-5 mr-3" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
      </div>
    </main>
  );
}
