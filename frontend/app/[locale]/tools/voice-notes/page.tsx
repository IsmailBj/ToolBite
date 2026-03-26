"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Mic,
  Square,
  FileAudio,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Download,
  Trash2,
} from "lucide-react";
import { transcribeAudioWithWorker } from "../../../../utils/transcribe-util";
import { useDictionary } from "@/components/DictionaryProvider";
import BackButton from "@/components/BackButton";

export default function VoiceNotesPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const dict = useDictionary();
  const ui = dict.tools?.voiceNotes?.page;

  // Cleanup URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      // Logic for cleanup if preview URLs are added later
    };
  }, []);

  // --- Transcription Logic ---
  const processAudio = async (blob: Blob) => {
    setIsProcessing(true);
    setError("");
    setTranscript("");
    setProgress(10); // Start progress bar

    try {
      const text = await transcribeAudioWithWorker(blob, (statusMessage) => {
        // You can update a "status" state here if you want to show
        // specific messages like "Downloading..." or "Analysing..."
        console.log(statusMessage);
      });
      setTranscript(text);
    } catch (err: any) {
      {
        ui?.errorTranscriptionFailed ||
          "Transcription failed. The file might be too large for your device's memory.";
      }
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  // --- Recording Logic ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
        processAudio(audioBlob);
      };

      recorder.start();
      setIsRecording(true);
      setError("");
    } catch (err) {
      {
        ui?.errorMicAccessDenied ||
          "Microphone access denied. Please check your browser permissions.";
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
    setIsRecording(false);
  };

  // --- Utility Actions ---
  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsTxt = () => {
    if (!transcript) return;
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transcript-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadAsDocx = async () => {
    if (!transcript) return;
    try {
      const { Document, Packer, Paragraph, TextRun } = await import("docx");

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Voice Notes Transcription",
                    bold: true,
                    size: 32,
                  }),
                ],
              }),
              new Paragraph({ children: [new TextRun({ text: "" })] }),
              new Paragraph({
                children: [new TextRun(transcript)],
              }),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `transcript-${new Date().toISOString().slice(0, 10)}.docx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      {
        ui?.errorWordGeneration || "Failed to generate Word document.";
      }
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <BackButton />

      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center">
          <Mic className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {ui?.title || "Voice Notes"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {ui?.subtitle ||
              "Audio to text. Whisper AI running locally in your browser."}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
        {!isProcessing && !transcript && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Record Button */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex flex-col items-center justify-center p-12 rounded-[2rem] border-2 border-dashed transition-all ${
                isRecording
                  ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                  : "bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 hover:border-indigo-400"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isRecording ? "bg-red-500 animate-pulse" : "bg-indigo-600"}`}
              >
                {isRecording ? (
                  <Square className="text-white fill-white w-6 h-6" />
                ) : (
                  <Mic className="text-white w-8 h-8" />
                )}
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                {isRecording ? "Stop Recording" : "Record Live"}
              </span>
              <p className="text-sm text-slate-500 mt-2">
                {ui?.speakClearlyLabel || "Speak clearly into your mic"}
              </p>
            </button>

            {/* Upload Button */}
            <label className="flex flex-col items-center justify-center p-12 rounded-[2rem] border-2 border-dashed bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 hover:border-indigo-400 cursor-pointer transition-all">
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] && processAudio(e.target.files[0])
                }
              />
              <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <FileAudio className="text-slate-600 dark:text-slate-300 w-8 h-8" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                {ui?.uploadAudioLabel || "Upload Audio"}
              </span>
              <p className="text-sm text-slate-500 mt-2">
                {ui?.supportedFormatsLabel || "MP3, WAV, M4A supported"}
              </p>
            </label>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="text-center py-20 animate-pulse">
            <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
              {ui?.transcribingStatus || "Transcribing..."}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              {ui?.modelRunningLabel ||
                "Running Whisper AI model on your device."}
            </p>
            <div className="w-full max-w-xs mx-auto bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-4 italic">
              {ui?.firstLoadNotice ||
                "First load may take a minute to download models (~40MB)."}
            </p>
          </div>
        )}

        {/* Result State */}
        {transcript && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                {ui?.transcriptionResultLabel || "Transcription Result"}
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 transition-all"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </button>

                <button
                  onClick={downloadAsTxt}
                  className="flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 transition-all"
                >
                  <Download className="w-4 h-4 mr-2" /> .TXT
                </button>

                <button
                  onClick={downloadAsDocx}
                  className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
                >
                  <FileAudio className="w-4 h-4 mr-2" /> .DOCX
                </button>

                <button
                  onClick={() => {
                    setTranscript("");
                    setProgress(0);
                  }}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Clear result"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-700 min-h-[250px] shadow-inner text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              {transcript}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-900/50 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
      </div>
    </main>
  );
}
