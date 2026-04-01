"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  RefreshCw,
  Search,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";

export default function MetaGeneratorUtil({ dict }: { dict: any }) {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading_model" | "summarizing" | "complete" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const worker = useRef<Worker | null>(null);

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(
        new URL("./workers/summarizer.worker.ts", import.meta.url),
        {
          type: "module",
        },
      );
    }

    const handleMessage = (e: MessageEvent) => {
      switch (e.data.status) {
        case "initiate":
        case "download":
          setStatus("loading_model");
          break;
        case "progress":
          setProgress(Math.round((e.data.loaded / e.data.total) * 100));
          break;
        case "done":
          setStatus("summarizing");
          break;
        case "complete":
          setSummary(e.data.output);
          setStatus("complete");
          break;
        case "error":
          setStatus("error");
          console.error(e.data.error);
          break;
      }
    };

    worker.current.addEventListener("message", handleMessage);
    return () => worker.current?.removeEventListener("message", handleMessage);
  }, []);

  const MIN_CHARS = 100;
  const currentChars = text.trim().length;
  const isReady = currentChars >= MIN_CHARS;

  const generateSummary = () => {
    // Safety check in case they bypass the disabled button somehow
    if (!isReady) return;

    setStatus("summarizing");
    worker.current?.postMessage({ text });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SEO constraints: Green if under 160 chars, Orange if over
  const summaryCharCount = summary.length;
  const isOptimalLength = summaryCharCount > 0 && summaryCharCount <= 160;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
      {status === "idle" ||
      status === "loading_model" ||
      status === "summarizing" ? (
        <div className="space-y-6">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                dict.placeholder ||
                "Paste your full blog post or article here..."
              }
              // Added pb-24 here so the text doesn't hide behind the button!
              className="w-full h-64 p-6 pb-24 bg-slate-50 dark:bg-slate-800/50 border-2 border-emerald-100 dark:border-emerald-900/30 rounded-[2rem] focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 outline-none resize-none transition-all text-slate-700 dark:text-slate-300"
            />

            {status === "idle" && (
              <>
                {/* Real-time Character Counter */}
                <div className="absolute bottom-8 left-6 text-sm font-bold flex items-center transition-colors">
                  <span
                    className={
                      isReady
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-400 dark:text-slate-500"
                    }
                  >
                    {currentChars} / {MIN_CHARS} {dict.minChars || "min chars"}
                  </span>
                </div>

                {/* Dynamic Button */}
                <button
                  onClick={generateSummary}
                  disabled={!isReady}
                  className={`absolute bottom-6 right-6 px-6 py-3 rounded-xl font-bold flex items-center transition-all ${
                    isReady
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 cursor-pointer"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                  }`}
                >
                  <FileText className="w-5 h-5 mr-2" />
                  {dict.btnGenerate || "Generate Meta Description"}
                </button>
              </>
            )}
          </div>

          {status === "loading_model" && (
            <div className="text-center p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
              <RefreshCw className="w-8 h-8 text-emerald-500 mx-auto animate-spin mb-3" />
              <h4 className="font-bold text-slate-900 dark:text-white">
                {dict.loadingModel || "Downloading Summarizer AI..."}
              </h4>
              <div className="w-full max-w-md mx-auto bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-3">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {status === "summarizing" && (
            <div className="text-center p-6">
              <Search className="w-10 h-10 text-emerald-500 mx-auto animate-pulse mb-3" />
              <h4 className="font-bold text-slate-900 dark:text-white">
                {dict.analyzing ||
                  "Reading your article and extracting key points..."}
              </h4>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-3xl border border-emerald-200 dark:border-emerald-800/50">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                <Search className="w-5 h-5 mr-2 text-emerald-600" />
                {dict.resultTitle || "Generated Meta Description"}
              </h3>
              <span
                className={`text-sm font-bold px-3 py-1 rounded-full flex items-center ${isOptimalLength ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}
              >
                {summaryCharCount} / 160 {dict.chars || "chars"}
                {!isOptimalLength && <AlertCircle className="w-4 h-4 ml-1" />}
              </span>
            </div>

            <p className="text-xl text-slate-800 dark:text-slate-200 leading-relaxed font-medium mb-6">
              {summary}
            </p>

            <button
              onClick={copyToClipboard}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center transition-all shadow-lg shadow-emerald-600/20"
            >
              {copied ? (
                <Check className="w-5 h-5 mr-2" />
              ) : (
                <Copy className="w-5 h-5 mr-2" />
              )}
              {copied
                ? dict.copied || "Copied!"
                : dict.btnCopy || "Copy to Clipboard"}
            </button>
          </div>

          <button
            onClick={() => {
              setStatus("idle");
              setSummary("");
            }}
            className="flex items-center mx-auto text-slate-500 hover:text-emerald-600 font-bold transition-colors pt-2"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {dict.btnReset || "Summarize Another Article"}
          </button>
        </div>
      )}
    </div>
  );
}
