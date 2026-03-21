"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Clock,
  Calendar,
  AlertCircle,
  Info,
  Copy,
  Check,
} from "lucide-react";
import { getCronDescription } from "../../../../utils/cron-util";

export default function CronVisualizerPage() {
  const [expression, setExpression] = useState("*/5 * * * *");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      if (expression.trim() === "") {
        setDescription("");
        setError("");
        return;
      }
      const desc = getCronDescription(expression);
      setDescription(desc);
      setError("");
    } catch (err: any) {
      setError("Invalid Cron expression. Please check the format.");
      setDescription("");
    }
  }, [expression]);

  const copyExpression = () => {
    navigator.clipboard.writeText(expression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const examples = [
    { label: "Every 5 mins", val: "*/5 * * * *" },
    { label: "Every hour", val: "0 * * * *" },
    { label: "Midnight daily", val: "0 0 * * *" },
    { label: "Every Monday", val: "0 0 * * 1" },
  ];

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
          <Clock className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Cron Visualizer
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Decode cron expressions into plain English schedules.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 ml-1">
              Cron Expression
            </label>
            <div className="relative">
              <input
                type="text"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                className="w-full pl-5 pr-12 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500 text-xl font-mono dark:text-white transition-all"
                placeholder="* * * * *"
              />
              <button
                onClick={copyExpression}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-indigo-500 transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                key={ex.val}
                onClick={() => setExpression(ex.val)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 transition-colors"
              >
                {ex.label}
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            {error ? (
              <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-900/50">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            ) : description ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-start gap-4 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-800/50">
                  <Info className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider mb-1">
                      Schedule Description
                    </h3>
                    <p className="text-xl font-medium text-slate-900 dark:text-white leading-relaxed">
                      “{description}”
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
