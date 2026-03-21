"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Lock,
  Unlock,
  Copy,
  Check,
  Link,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  encodeUrl,
  decodeUrl,
  isValidUrl,
} from "../../../../utils/encoding-util";

export default function SafeLinkPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleProcess = () => {
    setError("");
    if (!input) return;

    try {
      if (mode === "encode") {
        if (!isValidUrl(input)) {
          setError(
            "Warning: This doesn't look like a valid URL, but I will encode it anyway.",
          );
        }
        setOutput(encodeUrl(input));
      } else {
        setOutput(decodeUrl(input));
      }
    } catch (err: any) {
      setError(err.message);
      setOutput("");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <a
        href="/"
        className="inline-flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />{" "}
        Back to workspace
      </a>

      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center">
          <Lock className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Safe-Link Encoder
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Obfuscate URLs to protect them from scrapers and bots.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
        {/* Toggle Mode */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-8 w-fit mx-auto border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              setMode("encode");
              setInput("");
              setOutput("");
              setError("");
            }}
            className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${mode === "encode" ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600" : "text-slate-500"}`}
          >
            <Lock className="w-4 h-4" /> Encode
          </button>
          <button
            onClick={() => {
              setMode("decode");
              setInput("");
              setOutput("");
              setError("");
            }}
            className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${mode === "decode" ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600" : "text-slate-500"}`}
          >
            <Unlock className="w-4 h-4" /> Decode
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 ml-1">
              {mode === "encode"
                ? "Enter Original URL"
                : "Enter Encoded String"}
            </label>
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm dark:text-white"
                placeholder={
                  mode === "encode"
                    ? "https://example.com/private-path"
                    : "aHR0cHM6Ly9leGFtcGxlLmNvbQ=="
                }
              />
              <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>

          <button
            onClick={handleProcess}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center"
          >
            <RefreshCw className="w-5 h-5 mr-2" />{" "}
            {mode === "encode" ? "Obfuscate URL" : "Reveal URL"}
          </button>

          {output && (
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 ml-1">
                Result
              </label>
              <div className="group relative">
                <div className="w-full p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 font-mono text-sm text-indigo-700 dark:text-indigo-300 break-all">
                  {output}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="absolute right-3 top-3 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:text-indigo-600 transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-2xl border border-amber-100 dark:border-amber-900/50">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
