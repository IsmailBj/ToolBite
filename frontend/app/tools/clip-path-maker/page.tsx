"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Crop, Copy, Check, Image as ImageIcon } from "lucide-react";
import {
  generateClipPathCss,
  ClipState,
  ShapeType,
  presetShapes,
} from "../../../utils/clip-path-util";

export default function ClipPathMakerPage() {
  const [state, setState] = useState<ClipState>({
    type: "polygon",
    polygonPoints: presetShapes["Triangle"],
    circleRadius: 50,
    circleX: 50,
    circleY: 50,
    ellipseRx: 40,
    ellipseRy: 50,
    ellipseX: 50,
    ellipseY: 50,
    insetTop: 10,
    insetRight: 10,
    insetBottom: 10,
    insetLeft: 10,
  });

  const [bgImage, setBgImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [draggedPoint, setDraggedPoint] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const cssCode = generateClipPathCss(state);

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBgImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!draggedPoint || !containerRef.current || state.type !== "polygon")
        return;

      const rect = containerRef.current.getBoundingClientRect();
      let x = ((e.clientX - rect.left) / rect.width) * 100;
      let y = ((e.clientY - rect.top) / rect.height) * 100;

      x = Math.max(0, Math.min(100, x));
      y = Math.max(0, Math.min(100, y));

      setState((prev) => ({
        ...prev,
        polygonPoints: prev.polygonPoints.map((p) =>
          p.id === draggedPoint
            ? { ...p, x: Math.round(x), y: Math.round(y) }
            : p,
        ),
      }));
    };

    const handlePointerUp = () => setDraggedPoint(null);

    if (draggedPoint) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [draggedPoint, state.type]);

  const rawCssValue = cssCode.split("clip-path: ")[1]?.replace(";\n}", "");

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <a
        href="/"
        className="inline-flex items-center text-sm text-slate-500 hover:text-orange-600 mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />{" "}
        Back to workspace
      </a>

      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/40 rounded-2xl flex items-center justify-center">
            <Crop className="w-7 h-7 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              CSS Clip-Path Maker
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Advanced generator with drag controls and image preview.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 block mb-2">
                Shape Type
              </label>
              <select
                value={state.type}
                onChange={(e) =>
                  setState({ ...state, type: e.target.value as ShapeType })
                }
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
              >
                <option value="polygon">Polygon</option>
                <option value="circle">Circle</option>
                <option value="ellipse">Ellipse</option>
                <option value="inset">Inset</option>
              </select>
            </div>

            {state.type === "polygon" && (
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-2">
                  Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(presetShapes).map((preset) => (
                    <button
                      key={preset}
                      onClick={() =>
                        setState({
                          ...state,
                          polygonPoints: presetShapes[preset],
                        })
                      }
                      className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 text-xs font-bold rounded-lg hover:bg-orange-200 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase text-slate-400 block mb-2">
                Custom Image
              </label>
              <label className="flex items-center justify-center w-full p-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <ImageIcon className="w-5 h-5 text-slate-400 mr-2" />
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                  Upload Image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase text-slate-400">
                  CSS Output
                </span>
                <button
                  onClick={handleCopy}
                  className="text-slate-400 hover:text-orange-600 transition-colors"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
              <pre className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto">
                {cssCode}
              </pre>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-slate-100 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 min-h-[500px] flex items-center justify-center relative">
          <div
            ref={containerRef}
            className="w-full max-w-md aspect-square relative shadow-2xl touch-none"
            style={{
              backgroundImage: bgImage
                ? `url(${bgImage})`
                : "linear-gradient(45deg, #f97316, #ea580c)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              clipPath: rawCssValue,
            }}
          >
            <div
              className="absolute inset-0 z-0 bg-black/10"
              style={{
                clipPath: rawCssValue === "none" ? undefined : "none",
                display: "none",
              }}
            />
          </div>

          {state.type === "polygon" && (
            <div className="absolute w-full max-w-md aspect-square pointer-events-none">
              {state.polygonPoints.map((p) => (
                <div
                  key={p.id}
                  onPointerDown={() => setDraggedPoint(p.id)}
                  className="absolute w-6 h-6 bg-white border-4 border-orange-500 rounded-full cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 shadow-lg pointer-events-auto"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
