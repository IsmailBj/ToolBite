"use client";

import React, { useState } from "react";
import {
  ScanSearch,
  RefreshCw,
  ShieldCheck,
  Cpu,
  MonitorPlay,
} from "lucide-react";
// 1. Import the new Thumbmark class instead of the deprecated functions
import { Thumbmark } from "@thumbmarkjs/thumbmarkjs";

interface FingerprintScannerProps {
  dict: any;
}

export default function FingerprintScannerUtil({
  dict,
}: FingerprintScannerProps) {
  const [hash, setHash] = useState<string | null>(null);
  const [details, setDetails] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const runScan = async () => {
    setIsProcessing(true);
    try {
      // 2. Instantiate the scanner
      const tm = new Thumbmark();

      // 3. .get() returns everything (hash + components) in one single, fast call!
      const res = await tm.get();

      // 4. Update the state with the new response structure
      setHash(res.thumbmark); // 'thumbmark' is the unique hash string
      setDetails(res.components); // 'components' holds the hardware/audio data
    } catch (error) {
      console.error("Scanning failed", error);
    } finally {
      setTimeout(() => setIsProcessing(false), 600);
    }
  };

  const resetScan = () => {
    setHash(null);
    setDetails(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
      {/* INITIAL STATE: Before scanning */}
      {!hash && !isProcessing && (
        <div
          onClick={runScan}
          className="border-2 border-dashed border-emerald-200 dark:border-emerald-900/50 rounded-[2rem] p-16 md:p-20 text-center cursor-pointer hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all group"
        >
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
            <ScanSearch className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {dict.btnScan || "Start Privacy Scan"}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {dict.disclaimer ||
              "100% Client-Side. We analyze your Canvas, WebGL, and Audio stack locally."}
          </p>
        </div>
      )}

      {/* LOADING STATE */}
      {isProcessing && (
        <div className="py-24 flex flex-col items-center justify-center space-y-4">
          <RefreshCw className="animate-spin text-emerald-600 w-12 h-12" />
          <p className="text-lg font-medium text-emerald-600 dark:text-emerald-400 animate-pulse">
            {dict.btnScanning || "Analyzing browser entropy..."}
          </p>
        </div>
      )}

      {/* RESULTS STATE */}
      {hash && details && !isProcessing && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Main Hash Display */}
          <div className="flex items-start p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center mr-4 shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-grow overflow-hidden">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                {dict.hashTitle || "Your Unique Browser Hash"}
              </h3>
              <p className="text-lg md:text-xl font-mono font-bold text-slate-900 dark:text-emerald-400 break-all">
                {hash}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hardware Card */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-3xl hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <Cpu className="w-5 h-5 text-slate-400" />
                <h4 className="font-bold text-slate-900 dark:text-white">
                  {dict.hardwareTitle || "Hardware Entropy"}
                </h4>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500">
                    {dict.cores || "CPU Cores"}
                  </span>
                  <span className="font-medium text-slate-900 dark:text-slate-200">
                    {details.hardware?.hardwareConcurrency || dict.hidden}
                  </span>
                </li>
                <li className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500">
                    {dict.memory || "Device Memory"}
                  </span>
                  <span className="font-medium text-slate-900 dark:text-slate-200">
                    {details.hardware?.deviceMemory || dict.hidden} GB
                  </span>
                </li>
                <li className="flex justify-between pb-1">
                  <span className="text-slate-500">
                    {dict.platform || "Platform"}
                  </span>
                  <span className="font-medium text-slate-900 dark:text-slate-200">
                    {details.system?.platform || "Unknown"}
                  </span>
                </li>
              </ul>
            </div>

            {/* Graphics Card */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-3xl hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <MonitorPlay className="w-5 h-5 text-slate-400" />
                <h4 className="font-bold text-slate-900 dark:text-white">
                  {dict.graphicsTitle || "Graphics & Audio"}
                </h4>
              </div>
              <ul className="space-y-3 text-sm overflow-hidden">
                <li className="flex flex-col border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500 mb-1">
                    {dict.renderer || "WebGL Renderer"}
                  </span>
                  <span
                    className="font-medium text-slate-900 dark:text-slate-200 truncate"
                    title={details.webgl?.unmaskedRenderer}
                  >
                    {details.webgl?.unmaskedRenderer || dict.hidden}
                  </span>
                </li>
                <li className="flex justify-between pt-1">
                  <span className="text-slate-500">
                    {dict.audio || "Audio Sample Rate"}
                  </span>
                  <span className="font-medium text-slate-900 dark:text-slate-200">
                    {details.audio?.sampleRate
                      ? `${details.audio.sampleRate} Hz`
                      : dict.hidden}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Reset Button */}
          <div className="pt-4">
            <button
              onClick={resetScan}
              className="flex items-center mx-auto text-slate-500 hover:text-emerald-600 font-bold transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {dict.btnReset || "Run New Scan"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
