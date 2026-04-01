"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FileVideo,
  Download,
  RefreshCw,
  Subtitles,
  Loader2,
  PlayCircle,
} from "lucide-react";

interface VideoToSubtitlesProps {
  dict: any;
}

// Helper to format seconds into WebVTT timestamp format (HH:MM:SS.mmm)
const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
};

export default function VideoToSubtitlesUtil({ dict }: VideoToSubtitlesProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [vttUrl, setVttUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("video");
  const [status, setStatus] = useState<
    | "idle"
    | "extracting"
    | "loading_model"
    | "transcribing"
    | "complete"
    | "error"
  >("idle");
  const [progress, setProgress] = useState(0);

  const worker = useRef<Worker | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!worker.current) {
      // Notice the path: ../lib/workers/ (only up one level from components/tools)
      worker.current = new Worker(
        new URL("./workers/subtitle.worker.ts", import.meta.url),
        {
          type: "module",
        },
      );
    }

    worker.current.addEventListener("message", (e) => {
      switch (e.data.status) {
        case "initiate":
        case "download":
          setStatus("loading_model");
          break;
        case "progress":
          setProgress(Math.round((e.data.loaded / e.data.total) * 100));
          break;
        case "done":
          setStatus("transcribing");
          break;
        case "complete":
          generateVTT(e.data.output.chunks);
          break;
        case "error":
          setStatus("error");
          console.error(e.data.error);
          break;
      }
    });

    return () => worker.current?.terminate();
  }, []);

  const generateVTT = (chunks: any[]) => {
    let vttContent = "WEBVTT\n\n";
    chunks.forEach((chunk) => {
      // Fallback end time to +2 seconds if Whisper misses it
      const start = formatTime(chunk.timestamp[0]);
      const end = formatTime(chunk.timestamp[1] || chunk.timestamp[0] + 2);
      vttContent += `${start} --> ${end}\n${chunk.text.trim()}\n\n`;
    });

    // Create a Blob URL for the VTT file so the video player can read it
    const blob = new Blob([vttContent], { type: "text/vtt" });
    setVttUrl(URL.createObjectURL(blob));
    setStatus("complete");
  };

  const processVideo = async (file: File) => {
    if (!file.type.startsWith("video/")) {
      alert(dict.errorNotVideo || "Please upload a valid video file.");
      return;
    }

    setStatus("extracting");
    setFileName(file.name.replace(/\.[^/.]+$/, ""));
    setVideoUrl(URL.createObjectURL(file));

    try {
      // 1. Extract audio from video using AudioContext (Your amazing method!)
      const audioContext = new (
        window.AudioContext || (window as any).webkitAudioContext
      )({ sampleRate: 16000 });
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const audioData = audioBuffer.getChannelData(0); // 16kHz Float32Array

      // 2. Send to AI Worker
      setStatus("loading_model");
      worker.current?.postMessage({ audio: audioData });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
      {!videoUrl ? (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-orange-200 dark:border-orange-900/50 rounded-[2rem] p-20 text-center cursor-pointer hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-all group"
        >
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] && processVideo(e.target.files[0])
            }
          />
          <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
            <FileVideo className="w-10 h-10 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {dict.dropLabel || "Drop a video to generate subtitles"}
          </h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            {dict.disclaimer ||
              "100% Client-Side. We extract the audio and transcribe it in your browser."}
          </p>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Live Video Preview with Subtitles */}
            <div className="w-full md:w-1/2 bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-lg relative min-h-[250px] flex items-center justify-center">
              {videoUrl && (
                <video
                  controls
                  className="w-full h-auto max-h-[400px]"
                  crossOrigin="anonymous"
                >
                  <source src={videoUrl} />
                  {/* Inject the AI generated VTT subtitles here! */}
                  {vttUrl && (
                    <track
                      kind="subtitles"
                      src={vttUrl}
                      srcLang="en"
                      label="English"
                      default
                    />
                  )}
                </video>
              )}
            </div>

            {/* Status & Controls */}
            <div className="w-full md:w-1/2 flex flex-col justify-center min-h-[250px]">
              {status === "extracting" && (
                <div className="text-center space-y-4">
                  <PlayCircle className="w-10 h-10 text-orange-500 mx-auto animate-pulse" />
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Extracting Audio Track...
                  </h4>
                </div>
              )}

              {status === "loading_model" && (
                <div className="text-center space-y-4">
                  <Loader2 className="w-10 h-10 text-orange-500 mx-auto animate-spin" />
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Loading AI Whisper Model...
                  </h4>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-4">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {status === "transcribing" && (
                <div className="text-center space-y-4">
                  <Subtitles className="w-10 h-10 text-orange-500 mx-auto animate-bounce" />
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Generating Subtitles...
                  </h4>
                  <p className="text-sm text-slate-500">
                    This might take a moment depending on your device.
                  </p>
                </div>
              )}

              {status === "complete" && vttUrl && (
                <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-3xl border border-orange-100 dark:border-orange-800/50 text-center">
                  <Subtitles className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    {dict.readyTitle || "Subtitles Generated!"}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    {dict.readyDesc ||
                      "Press play on the video to preview them."}
                  </p>

                  <a
                    href={vttUrl}
                    download={`${fileName}-subtitles.vtt`}
                    className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl flex items-center justify-center transition-all shadow-lg shadow-orange-600/20"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    {dict.btnDownload || "Download .VTT File"}
                  </a>
                </div>
              )}
            </div>
          </div>

          {(status === "complete" || status === "error") && (
            <button
              onClick={() => {
                setVideoUrl(null);
                setVttUrl(null);
                setStatus("idle");
              }}
              className="flex items-center mx-auto text-slate-500 hover:text-orange-600 font-bold transition-colors pt-4"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {dict.btnReset || "Subtitle Another Video"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
