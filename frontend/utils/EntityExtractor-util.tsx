"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ScanText,
  RefreshCw,
  ShieldAlert,
  User,
  MapPin,
  Building2,
  Copy,
  Check,
} from "lucide-react";

interface EntityExtractorProps {
  dict: any;
}

interface Entity {
  entity_group: string;
  score: number;
  word: string;
  start: number;
  end: number;
}

export default function EntityExtractorUtil({ dict }: EntityExtractorProps) {
  const [text, setText] = useState("");
  const [entities, setEntities] = useState<Entity[]>([]);
  const [redactedText, setRedactedText] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading_model" | "analyzing" | "complete" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const worker = useRef<Worker | null>(null);

  // THE FIX: This keeps track of the latest text so the worker doesn't see an empty string!
  const textRef = useRef("");
  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(
        new URL("./workers/ner.worker.ts", import.meta.url),
        {
          type: "module",
        },
      );
    }

    const handleWorkerMessage = (e: MessageEvent) => {
      switch (e.data.status) {
        case "initiate":
        case "download":
          setStatus("loading_model");
          break;
        case "progress":
          setProgress(Math.round((e.data.loaded / e.data.total) * 100));
          break;
        case "done":
          setStatus("analyzing");
          break;
        case "complete":
          processEntities(e.data.output);
          break;
        case "error":
          setStatus("error");
          console.error(e.data.error);
          break;
      }
    };

    worker.current.addEventListener("message", handleWorkerMessage);
    return () =>
      worker.current?.removeEventListener("message", handleWorkerMessage);
  }, []);

  const analyzeText = () => {
    if (!text.trim()) return;
    setStatus("analyzing");
    worker.current?.postMessage({ text });
  };

  const processEntities = (rawOutput: any[]) => {
    const aggregatedEntities: Entity[] = [];

    // 1. Clean and merge the AI tokens
    rawOutput.forEach((token) => {
      if (!token.word || token.entity === "O" || token.entity_group === "O")
        return;

      const rawTag = token.entity || token.entity_group || "";
      const cleanTag = rawTag.replace(/^(B-|I-)/, "");
      const last = aggregatedEntities[aggregatedEntities.length - 1];
      const isContinuation =
        rawTag.startsWith("I-") || token.word.startsWith("##");

      if (last && last.entity_group === cleanTag && isContinuation) {
        if (token.word.startsWith("##")) {
          last.word += token.word.replace(/^##/, "");
        } else {
          last.word += " " + token.word;
        }
      } else {
        aggregatedEntities.push({
          entity_group: cleanTag,
          score: token.score || 1,
          word: token.word.replace(/^##/, ""),
          start: token.start || 0,
          end: token.end || 0,
        });
      }
    });

    setEntities(aggregatedEntities);

    // 2. The Redaction Logic (Using the textRef to get the actual text!)
    let redacted = textRef.current;

    // Sort by length so we replace "New York City" before replacing "New York"
    const sortedEntities = [...aggregatedEntities].sort(
      (a, b) => b.word.length - a.word.length,
    );

    sortedEntities.forEach((ent) => {
      if (!ent.word.trim()) return;
      // Escape special characters so the regex doesn't break
      const safeWord = ent.word.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      // Replace the word globally, ignoring case
      const regex = new RegExp(safeWord, "gi");
      redacted = redacted.replace(regex, `[${ent.entity_group}]`);
    });

    setRedactedText(redacted);
    setStatus("complete");
  };

  const copyRedacted = () => {
    navigator.clipboard.writeText(redactedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getEntityStyle = (type: string) => {
    switch (type) {
      case "PER":
        return {
          color:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
          icon: <User className="w-3 h-3 mr-1" />,
          label: dict.labelPerson || "Person",
        };
      case "LOC":
        return {
          color:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
          icon: <MapPin className="w-3 h-3 mr-1" />,
          label: dict.labelLocation || "Location",
        };
      case "ORG":
        return {
          color:
            "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
          icon: <Building2 className="w-3 h-3 mr-1" />,
          label: dict.labelOrganization || "Organization",
        };
      default:
        return {
          color:
            "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
          icon: null,
          label: dict.labelMisc || "Misc",
        };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
      {status === "idle" ||
      status === "loading_model" ||
      status === "analyzing" ? (
        <div className="space-y-6">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                dict.placeholder ||
                "Paste an article, email, or document here to extract names, locations, and organizations..."
              }
              className="w-full h-64 p-6 bg-slate-50 dark:bg-slate-800/50 border-2 border-cyan-100 dark:border-cyan-900/30 rounded-[2rem] focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 outline-none resize-none transition-all text-slate-700 dark:text-slate-300"
            />
            {text && status === "idle" && (
              <button
                onClick={analyzeText}
                className="absolute bottom-6 right-6 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg shadow-cyan-600/20 transition-all"
              >
                <ScanText className="w-5 h-5 mr-2" />
                {dict.btnAnalyze || "Analyze Entities"}
              </button>
            )}
          </div>

          {status === "loading_model" && (
            <div className="text-center p-6 bg-cyan-50 dark:bg-cyan-900/10 rounded-2xl border border-cyan-100 dark:border-cyan-800/50">
              <RefreshCw className="w-8 h-8 text-cyan-500 mx-auto animate-spin mb-3" />
              <h4 className="font-bold text-slate-900 dark:text-white">
                {dict.loadingModel || "Downloading NER Model..."}
              </h4>
              <div className="w-full max-w-md mx-auto bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-3">
                <div
                  className="bg-cyan-500 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {status === "analyzing" && (
            <div className="text-center p-6">
              <ScanText className="w-10 h-10 text-cyan-500 mx-auto animate-pulse mb-3" />
              <h4 className="font-bold text-slate-900 dark:text-white">
                {dict.analyzingText || "Scanning text for sensitive data..."}
              </h4>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Extracted Entities List */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <ScanText className="w-5 h-5 mr-2 text-cyan-500" />
                {dict.foundTitle || "Extracted Entities"}
              </h3>

              {entities.length === 0 ? (
                <p className="text-slate-500 italic">
                  {dict.noEntities || "No entities detected in this text."}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {entities.map((ent, i) => {
                    const style = getEntityStyle(ent.entity_group);
                    return (
                      <span
                        key={i}
                        className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border border-current/10 ${style.color}`}
                      >
                        {style.icon}
                        <span className="mr-2 opacity-75">{style.label}:</span>
                        <span className="font-bold">{ent.word}</span>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Redacted Output */}
            <div className="bg-cyan-50 dark:bg-cyan-900/10 p-6 rounded-3xl border border-cyan-200 dark:border-cyan-800/50 flex flex-col">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <ShieldAlert className="w-5 h-5 mr-2 text-cyan-600" />
                {dict.redactedTitle || "Redacted Safe-Text"}
              </h3>

              <div className="flex-grow p-4 bg-white dark:bg-slate-900 rounded-xl border border-cyan-100 dark:border-cyan-800 text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-mono text-sm mb-4 max-h-[250px] overflow-y-auto">
                {redactedText}
              </div>

              <button
                onClick={copyRedacted}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl flex items-center justify-center transition-all shadow-lg shadow-cyan-600/20"
              >
                {copied ? (
                  <Check className="w-5 h-5 mr-2" />
                ) : (
                  <Copy className="w-5 h-5 mr-2" />
                )}
                {copied
                  ? dict.copied || "Copied to Clipboard!"
                  : dict.btnCopy || "Copy Redacted Text"}
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              setStatus("idle");
              setEntities([]);
              setRedactedText("");
            }}
            className="flex items-center mx-auto text-slate-500 hover:text-cyan-600 font-bold transition-colors pt-4"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {dict.btnReset || "Scan New Text"}
          </button>
        </div>
      )}
    </div>
  );
}
