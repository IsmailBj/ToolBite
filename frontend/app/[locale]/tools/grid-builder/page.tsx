"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, LayoutGrid, Copy, Check, Plus, Minus } from "lucide-react";
import { generateGridCss, GridItemConfig } from "../../../../utils/grid-util";
import { useDictionary } from "@/components/DictionaryProvider";
import BackButton from "@/components/BackButton";

export default function GridBuilderPage() {
  const [columns, setColumns] = useState(4);
  const [rows, setRows] = useState(4);
  const [gap, setGap] = useState(16);
  const [copied, setCopied] = useState(false);

  const [items, setItems] = useState<GridItemConfig[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Initialize grid items on first load

  const dict = useDictionary();
  const ui = dict.tools?.gridBuilder?.page;

  useEffect(() => {
    const initialItems = Array.from({ length: 8 }).map((_, i) => ({
      id: `div-${i + 1}`,
      colSpan: 1,
      rowSpan: 1,
    }));
    setItems(initialItems);
    setSelectedId(initialItems[0].id);
  }, []);

  const cssCode = generateGridCss({ columns, rows, gap, items });

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateSelectedItem = (key: keyof GridItemConfig, delta: number) => {
    setItems(
      items.map((item) => {
        if (item.id === selectedId) {
          const newValue = Math.max(1, (item[key] as number) + delta);
          return { ...item, [key]: newValue };
        }
        return item;
      }),
    );
  };

  const addItem = () => {
    const newId = `div-${items.length + 1}`;
    setItems([...items, { id: newId, colSpan: 1, rowSpan: 1 }]);
    setSelectedId(newId);
  };

  const removeItem = () => {
    if (items.length <= 1) return;
    const newItems = items.filter((item) => item.id !== selectedId);
    setItems(newItems);
    setSelectedId(newItems[0].id);
  };

  const selectedItem = items.find((i) => i.id === selectedId);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <BackButton />

      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/40 rounded-2xl flex items-center justify-center">
          <LayoutGrid className="w-7 h-7 text-pink-600 dark:text-pink-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {ui?.title || "CSS Grid Builder"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {ui?.subtitle ||
              "Visually define columns, rows, spans, and gaps to generate grid code."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Sidebar */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          {/* Container Controls */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              {ui?.containerLabel || "Container"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  <span>{ui?.columnsLabel || "Columns"}</span>
                  <span className="text-pink-600">{columns}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={columns}
                  onChange={(e) => setColumns(Number(e.target.value))}
                  className="w-full accent-pink-600"
                />
              </div>
              <div>
                <label className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  <span>{ui?.rowsLabel || "Rows"}</span>
                  <span className="text-pink-600">{rows}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={rows}
                  onChange={(e) => setRows(Number(e.target.value))}
                  className="w-full accent-pink-600"
                />
              </div>
              <div>
                <label className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  <span>{ui?.gapLabel || "Gap"} (px)</span>
                  <span className="text-pink-600">{gap}px</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="64"
                  value={gap}
                  onChange={(e) => setGap(Number(e.target.value))}
                  className="w-full accent-pink-600"
                />
              </div>
            </div>
          </div>

          {/* Item Controls */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              {ui?.selectedItemLabel || "Selected Item"}: {selectedItem?.id}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-2">
                  {ui?.columnSpanLabel || "Column Span"}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateSelectedItem("colSpan", -1)}
                    className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-700 rounded shadow-sm hover:text-pink-600"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-sm w-4 text-center">
                    {selectedItem?.colSpan}
                  </span>
                  <button
                    onClick={() => updateSelectedItem("colSpan", 1)}
                    className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-700 rounded shadow-sm hover:text-pink-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-2">
                  {ui?.rowSpanLabel || "Row Span"}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateSelectedItem("rowSpan", -1)}
                    className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-700 rounded shadow-sm hover:text-pink-600"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-sm w-4 text-center">
                    {selectedItem?.rowSpan}
                  </span>
                  <button
                    onClick={() => updateSelectedItem("rowSpan", 1)}
                    className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-700 rounded shadow-sm hover:text-pink-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={addItem}
                className="flex-1 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 font-bold rounded-lg hover:bg-pink-200 transition-colors text-sm"
              >
                {ui?.addBlockButton || "Add Block"}
              </button>
              <button
                onClick={removeItem}
                className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm"
              >
                {ui?.removeBlockButton || "Remove Block"}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {ui?.cssOutputLabel || "CSS Output"}
              </span>
              <button
                onClick={handleCopy}
                className="text-slate-400 hover:text-pink-600 transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
            <pre className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto max-h-48">
              {cssCode}
            </pre>
          </div>
        </div>

        {/* Live Preview Area */}
        <div className="lg:col-span-8 bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 min-h-[500px] flex overflow-auto">
          <div
            className="w-full h-full min-w-[500px] transition-all duration-300 ease-in-out"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gap: `${gap}px`,
            }}
          >
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                style={{
                  gridColumn: `span ${item.colSpan}`,
                  gridRow: `span ${item.rowSpan}`,
                }}
                className={`flex items-center justify-center font-bold text-sm min-h-[50px] transition-all rounded-xl border-2 cursor-pointer
                  ${
                    selectedId === item.id
                      ? "bg-pink-500 text-white border-pink-600 shadow-lg scale-[1.02] z-10"
                      : "bg-pink-200 dark:bg-pink-900/40 border-pink-300 dark:border-pink-700 text-pink-600 dark:text-pink-400 hover:bg-pink-300"
                  }`}
              >
                {item.id}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
