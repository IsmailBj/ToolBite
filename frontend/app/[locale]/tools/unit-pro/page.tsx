"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRightLeft,
  Ruler,
  HardDrive,
  Laptop,
  Copy,
  Check,
} from "lucide-react";
import { convertUnits, CONVERSION_DATA } from "../../../../utils/unit-util";
import { useDictionary } from "@/components/DictionaryProvider";
import BackButton from "@/components/BackButton";

type Category = "design" | "storage" | "length";

export default function UnitProPage() {
  const [category, setCategory] = useState<Category>("design");
  const [value, setValue] = useState<string>("16");
  const [fromUnit, setFromUnit] = useState("PX");
  const [toUnit, setToUnit] = useState("REM");
  const [result, setResult] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  const dict = useDictionary();
  const ui = dict.tools?.unitPro?.page;

  useEffect(() => {
    const units =
      category === "length"
        ? CONVERSION_DATA.length.units
        : CONVERSION_DATA[category].units;
    setFromUnit(units[0]);
    setToUnit(units[1]);
  }, [category]);

  useEffect(() => {
    const num = parseFloat(value) || 0;
    setResult(convertUnits(num, fromUnit, toUnit, category));
  }, [value, fromUnit, toUnit, category]);

  const copyResult = () => {
    navigator.clipboard.writeText(result.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = [
    { id: "design", label: "Web Design", icon: <Laptop className="w-4 h-4" /> },
    {
      id: "storage",
      label: "Digital Storage",
      icon: <HardDrive className="w-4 h-4" />,
    },
    {
      id: "length",
      label: "Physical Length",
      icon: <Ruler className="w-4 h-4" />,
    },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <BackButton />

      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center">
          <ArrowRightLeft className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {ui?.title || "Unit Converter Pro"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {ui?.subtitle ||
              "Precision conversion for design, dev, and daily tasks."}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id as Category)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
                category === cat.id
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-500 ml-1 uppercase">
              {ui?.fromLabel || "From"}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-emerald-500 text-xl font-bold dark:text-white"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="px-4 bg-slate-100 dark:bg-slate-700 rounded-2xl font-bold outline-none border-none"
              >
                {(category === "length"
                  ? CONVERSION_DATA.length.units
                  : CONVERSION_DATA[category].units
                ).map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-500 ml-1 uppercase">
              {ui?.toLabel || "To"}
            </label>
            <div className="flex gap-2">
              <div className="w-full px-5 py-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 text-xl font-bold text-emerald-700 dark:text-emerald-400 flex items-center">
                {result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="px-4 bg-slate-100 dark:bg-slate-700 rounded-2xl font-bold outline-none border-none"
              >
                {(category === "length"
                  ? CONVERSION_DATA.length.units
                  : CONVERSION_DATA[category].units
                ).map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={copyResult}
          className="mt-10 w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold flex items-center justify-center hover:scale-[1.02] transition-transform"
        >
          {copied ? (
            <Check className="w-5 h-5 mr-2" />
          ) : (
            <Copy className="w-5 h-5 mr-2" />
          )}
          {copied ? "Result Copied!" : "Copy Result"}
        </button>
      </div>
    </main>
  );
}
