"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Bot,
  UploadCloud,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  AlertCircle,
} from "lucide-react";

interface AltTextGeneratorProps {
  dict: any;
}

export default function AltTextGeneratorUtil({ dict }: AltTextGeneratorProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading_model" | "analyzing" | "complete" | "error"
  >("idle");
  const [progress, setProgress] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const worker = useRef<Worker | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize the Web Worker on mount
  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(
        new URL("./workers/alt-text.worker.ts", import.meta.url),
        {
          type: "module",
        },
      );
    }

    const onMessageReceived = (e: MessageEvent) => {
      switch (e.data.status) {
        case "initiate":
        case "download":
          setStatus("loading_model");
          break;
        case "progress":
          // The model downloads in chunks, this shows the progress bar
          setProgress(Math.round((e.data.loaded / e.data.total) * 100));
          break;
        case "done":
          setStatus("analyzing");
          break;
        case "complete":
          setResult(e.data.output);
          setStatus("complete");
          break;
        case "error":
          setStatus("error");
          console.error(e.data.error);
          break;
      }
    };

    worker.current.addEventListener("message", onMessageReceived);
    return () =>
      worker.current?.removeEventListener("message", onMessageReceived);
  }, []);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert(dict.errorNotImage || "Please upload an image file.");
      return;
    }

    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setStatus("analyzing"); // Assume model is already loaded, will switch if it needs downloading

    // Read the file as a Data URL to pass to the AI worker
    const reader = new FileReader();
    reader.onload = (e) => {
      worker.current?.postMessage({ image: e.target?.result });
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const reset = () => {
    setImageUrl(null);
    setResult(null);
    setStatus("idle");
    setProgress(0);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
      {!imageUrl ? (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-indigo-200 dark:border-indigo-900/50 rounded-[2rem] p-20 text-center cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all group"
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
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 relative">
            <UploadCloud className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {dict.dropLabel || "Drop an image for AI analysis"}
          </h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            {dict.disclaimer ||
              "100% Client-Side. The AI model runs directly in your browser."}
          </p>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Image Preview */}
            <div className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-4 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center min-h-[300px]">
              <img
                src={imageUrl}
                alt="Upload preview"
                className="max-w-full max-h-[300px] object-contain rounded-xl shadow-sm"
              />
            </div>

            {/* AI Status & Results */}
            <div className="w-full md:w-1/2 flex flex-col justify-center min-h-[300px]">
              {status === "loading_model" && (
                <div className="text-center space-y-4">
                  <Bot className="w-12 h-12 text-indigo-500 mx-auto animate-bounce" />
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {dict.loadingModel || "Downloading AI Vision Model..."}
                  </h4>
                  <p className="text-sm text-slate-500">
                    {dict.loadingDesc ||
                      "This happens once and is cached in your browser. (~240MB)"}
                  </p>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-4">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {status === "analyzing" && (
                <div className="text-center space-y-4">
                  <RefreshCw className="w-12 h-12 text-indigo-500 mx-auto animate-spin" />
                  <h4 className="font-bold text-slate-900 dark:text-white animate-pulse">
                    {dict.analyzing || "AI is looking at your image..."}
                  </h4>
                </div>
              )}

              {status === "error" && (
                <div className="text-center space-y-4 text-red-500">
                  <AlertCircle className="w-12 h-12 mx-auto" />
                  <h4 className="font-bold">Analysis Failed</h4>
                  <p className="text-sm">
                    Your browser might not support WebGL or ran out of memory.
                  </p>
                </div>
              )}

              {status === "complete" && result && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800/50">
                  <div className="flex items-center space-x-2 mb-3">
                    <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {dict.resultTitle || "Generated Alt-Text"}
                    </h4>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-4">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      "{result}"
                    </p>
                  </div>

                  <button
                    onClick={copyToClipboard}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center transition-all shadow-lg shadow-indigo-600/20"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 mr-2" />
                    ) : (
                      <Copy className="w-5 h-5 mr-2" />
                    )}
                    {copied
                      ? dict.copied || "Copied!"
                      : dict.copyBtn || "Copy to Clipboard"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {(status === "complete" || status === "error") && (
            <button
              onClick={reset}
              className="flex items-center mx-auto text-slate-500 hover:text-indigo-600 font-bold transition-colors pt-4"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {dict.btnReset || "Analyze Another Image"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
