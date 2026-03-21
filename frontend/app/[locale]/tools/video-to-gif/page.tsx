"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  UploadCloud,
  Download,
  RefreshCw,
  Film,
  AlertCircle,
} from "lucide-react";
import {
  loadFFmpegEngine,
  convertVideoToGifLocally,
} from "../../../../utils/video-to-gif-util";

export default function VideoToGifPage() {
  const [dragActive, setDragActive] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState("Loading engine...");
  const [error, setError] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initializeEngine = async () => {
      try {
        await loadFFmpegEngine();
        setIsReady(true);
      } catch (err) {
        console.error("FFmpeg load error:", err);
        setError(
          "Failed to load video processing engine. Ensure cross-origin headers are set in next.config.",
        );
      }
    };

    initializeEngine();

    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [videoUrl, resultUrl]);

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
    if (!file.type.startsWith("video/")) {
      setError("Please upload a valid video file (MP4, WEBM, MOV).");
      return;
    }
    setError("");
    setSelectedFile(file);
    setVideoUrl(URL.createObjectURL(file));
    setResultUrl(null);
  };

  const handleConvertToGif = async () => {
    if (!selectedFile || !isReady) return;

    setIsProcessing(true);
    setError("");

    try {
      const resultBlob = await convertVideoToGifLocally(
        selectedFile,
        (text) => {
          setProgressText(text);
        },
      );

      setResultUrl(URL.createObjectURL(resultBlob));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error converting video.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setVideoUrl(null);
    setResultUrl(null);
    setError("");
    setProgressText("Ready");
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
          <Film className="w-7 h-7 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Video to GIF
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg">
            Convert videos to high-quality GIFs entirely in your browser.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-3 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
        {!selectedFile && (
          <div
            className={`border-2 border-dashed rounded-[2rem] p-16 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[450px] ${
              dragActive
                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                : "border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            } ${!isReady ? "opacity-50 pointer-events-none" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept="video/mp4, video/webm, video/quicktime"
              onChange={(e) =>
                e.target.files?.[0] && handleFileSelect(e.target.files[0])
              }
              disabled={!isReady}
            />
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl flex items-center justify-center mb-8 shadow-inner">
              {isReady ? (
                <UploadCloud className="w-12 h-12 text-slate-300 dark:text-slate-500" />
              ) : (
                <RefreshCw className="w-12 h-12 text-slate-300 dark:text-slate-500 animate-spin" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              {isReady ? "Drop your Video here" : "Loading Engine..."}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-xs leading-relaxed">
              {isReady
                ? "Works best with short clips (under 15 seconds)."
                : "Downloading required processing files..."}
            </p>
            <button
              onClick={() => inputRef.current?.click()}
              disabled={!isReady}
              className="px-10 py-4 bg-slate-900 dark:bg-purple-600 hover:bg-black dark:hover:bg-purple-500 text-white font-bold rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              Select Video
            </button>
          </div>
        )}

        {selectedFile && !resultUrl && (
          <div className="p-8 md:p-12 flex flex-col items-center">
            <div className="relative w-full max-w-lg rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-center items-center aspect-video shadow-inner mb-8">
              {videoUrl && (
                <video
                  src={videoUrl}
                  controls
                  className={`max-w-full max-h-full object-contain p-4 transition-opacity duration-300 ${isProcessing ? "opacity-30" : "opacity-100"}`}
                />
              )}
              {isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-4 border-purple-100 dark:border-purple-900/30 border-t-purple-600 dark:border-t-purple-500 rounded-full animate-spin mb-4"></div>
                  <p className="font-bold text-slate-900 dark:text-white text-lg bg-white/80 dark:bg-slate-900/80 px-4 py-1 rounded-full backdrop-blur-sm">
                    {progressText}
                  </p>
                </div>
              )}
            </div>
            {!isProcessing && (
              <div className="flex space-x-4 w-full max-w-lg">
                <button
                  onClick={handleConvertToGif}
                  className="flex-1 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-200 dark:shadow-none transition-all flex justify-center items-center"
                >
                  <Film className="w-5 h-5 mr-2" /> Convert to GIF
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

        {resultUrl && (
          <div className="p-8 md:p-12 text-center animate-in zoom-in-95 duration-500">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8">
              Conversion Complete! ✨
            </h2>
            <div className="w-full max-w-lg mx-auto rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 mb-8 bg-slate-50 dark:bg-slate-800/40">
              <div className="w-full flex justify-center items-center p-4">
                <img
                  src={resultUrl}
                  alt="Converted GIF"
                  className="max-w-full max-h-[500px] object-contain drop-shadow-xl rounded-lg"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={resultUrl}
                download={`converted_${selectedFile?.name.replace(/\.[^/.]+$/, "")}.gif`}
                className="flex items-center justify-center px-10 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-xl shadow-purple-100 dark:shadow-none transition-all transform hover:scale-[1.02]"
              >
                <Download className="w-5 h-5 mr-2" /> Download GIF
              </a>
              <button
                onClick={reset}
                className="flex items-center justify-center px-10 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Convert Another
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
