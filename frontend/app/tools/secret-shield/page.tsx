"use client";

import React, { useState, useRef } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Download,
  FileKey,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { encryptFile, decryptFile } from "../../../utils/encryption-util";

export default function SecretShieldPage() {
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setError("");
    setSelectedFile(file);
    setResultUrl(null);
  };

  const handleProcess = async () => {
    if (!selectedFile || !password) {
      setError("Please provide both a file and a password.");
      return;
    }
    setIsProcessing(true);
    setError("");
    try {
      const blob =
        mode === "encrypt"
          ? await encryptFile(selectedFile, password)
          : await decryptFile(selectedFile, password);

      setResultUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setResultUrl(null);
    setPassword("");
    setError("");
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <a
        href="/"
        className="inline-flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />{" "}
        Back to workspace
      </a>

      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center shadow-sm">
          {mode === "encrypt" ? (
            <ShieldCheck className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          ) : (
            <ShieldAlert className="w-7 h-7 text-orange-600 dark:text-orange-400" />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Secret Shield
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            AES-256 military-grade encryption. Happens entirely in your browser.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
        {/* Toggle Switch */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-8 w-fit mx-auto border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              setMode("encrypt");
              reset();
            }}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              mode === "encrypt"
                ? "bg-white dark:bg-slate-700 shadow-md text-blue-600 dark:text-blue-400"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            Encrypt
          </button>
          <button
            onClick={() => {
              setMode("decrypt");
              reset();
            }}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              mode === "decrypt"
                ? "bg-white dark:bg-slate-700 shadow-md text-orange-600 dark:text-orange-400"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            Decrypt
          </button>
        </div>

        {!selectedFile ? (
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] p-16 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && handleFileSelect(e.target.files[0])
              }
            />
            <FileKey className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Select file to {mode}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Privacy first: Files never leave your device.
            </p>
          </div>
        ) : !resultUrl ? (
          <div className="space-y-6 max-w-md mx-auto">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center">
              <span className="truncate flex-grow font-medium text-slate-900 dark:text-slate-200">
                {selectedFile.name}
              </span>
              <button
                onClick={reset}
                className="text-xs text-red-500 hover:text-red-600 font-bold ml-2"
              >
                Remove
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1 text-slate-700 dark:text-slate-300">
                Set Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters..."
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border border-transparent focus:border-blue-500 dark:text-white transition-all"
              />
            </div>
            <button
              onClick={handleProcess}
              disabled={isProcessing}
              className={`w-full py-4 rounded-xl text-white font-bold transition-all flex justify-center items-center shadow-lg ${
                mode === "encrypt"
                  ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200 dark:shadow-none"
                  : "bg-orange-600 hover:bg-orange-700 shadow-orange-200 dark:shadow-none"
              }`}
            >
              {isProcessing ? (
                <RefreshCw className="animate-spin mr-2" />
              ) : mode === "encrypt" ? (
                <Lock className="mr-2 w-5 h-5" />
              ) : (
                <Unlock className="mr-2 w-5 h-5" />
              )}
              {mode === "encrypt" ? "Secure File" : "Unlock File"}
            </button>
          </div>
        ) : (
          <div className="text-center py-10 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
              File {mode === "encrypt" ? "Encrypted" : "Decrypted"}!
            </h2>
            <div className="flex flex-col gap-4 items-center">
              <a
                href={resultUrl}
                download={
                  mode === "encrypt"
                    ? `${selectedFile.name}.locked`
                    : selectedFile.name.replace(".locked", "")
                }
                className="inline-flex items-center px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform shadow-xl"
              >
                <Download className="mr-2 w-5 h-5" /> Download Result
              </a>
              <button
                onClick={reset}
                className="mt-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors"
              >
                Start New
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/50 flex items-center">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
      </div>
    </main>
  );
}
