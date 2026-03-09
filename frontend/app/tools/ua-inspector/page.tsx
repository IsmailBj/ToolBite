"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Monitor,
  Cpu,
  Globe,
  Laptop,
  Smartphone,
  Search,
  Copy,
  Check,
} from "lucide-react";
import { parseUserAgent, UAInfo } from "../../../utils/ua-util";

export default function UaInspectorPage() {
  const [uaInput, setUaInput] = useState("");
  const [info, setInfo] = useState<UAInfo | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const currentUA = navigator.userAgent;
    setUaInput(currentUA);
    setInfo(parseUserAgent(currentUA));
  }, []);

  const handleInspect = () => {
    setInfo(parseUserAgent(uaInput));
  };

  const copyRaw = () => {
    navigator.clipboard.writeText(uaInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const InfoCard = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }) => (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
      <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center shadow-sm text-indigo-600 dark:text-indigo-400">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="text-lg font-bold text-slate-900 dark:text-white truncate">
          {value || "Unknown"}
        </p>
      </div>
    </div>
  );

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <a
        href="/"
        className="inline-flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />{" "}
        Back to workspace
      </a>

      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center">
          <Search className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            UA Inspector
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Analyze browser strings and device fingerprints.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Input Area */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 ml-1">
            User Agent String
          </label>
          <div className="flex gap-3">
            <textarea
              value={uaInput}
              onChange={(e) => setUaInput(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs dark:text-slate-300 h-24 resize-none"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleInspect}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md"
            >
              Analyze String
            </button>
            <button
              onClick={copyRaw}
              className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold flex items-center gap-2"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              Copy Raw
            </button>
          </div>
        </div>

        {/* Results Grid */}
        {info && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in zoom-in-95 duration-500">
            <InfoCard
              icon={<Globe />}
              label="Browser"
              value={`${info.browser.name} ${info.browser.version}`}
            />
            <InfoCard
              icon={<Monitor />}
              label="Operating System"
              value={`${info.os.name} ${info.os.version}`}
            />
            <InfoCard
              icon={<Smartphone />}
              label="Device"
              value={info.device.model || "Desktop"}
            />
            <InfoCard
              icon={<Cpu />}
              label="CPU"
              value={info.cpu.architecture || "Unknown"}
            />
            <InfoCard
              icon={<Laptop />}
              label="Engine"
              value={`${info.engine.name} ${info.engine.version}`}
            />
            <InfoCard
              icon={<Search />}
              label="Device Type"
              value={info.device.type || "Computer"}
            />
          </div>
        )}
      </div>
    </main>
  );
}
