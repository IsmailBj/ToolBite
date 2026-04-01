"use client";

import React, { useState, useRef, useEffect, MouseEvent } from "react";
import {
  UploadCloud,
  Download,
  RefreshCw,
  Eraser,
  Grid,
  Image as ImageIcon,
} from "lucide-react";

interface RedactionBox {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "blur" | "pixelate";
}

export default function ImageRedactorUtil({ dict }: { dict: any }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [redactionMode, setRedactionMode] = useState<"blur" | "pixelate">(
    "blur",
  );
  const [boxes, setBoxes] = useState<RedactionBox[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentBox, setCurrentBox] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // 1. Handle Image Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        imageRef.current = img;
        setImageSrc(event.target?.result as string);
        setBoxes([]);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // 2. Draw everything to the canvas whenever state changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imageRef.current;

    if (!canvas || !ctx || !img) return;

    // Set high-res internal canvas dimensions
    canvas.width = img.width;
    canvas.height = img.height;

    // Clear and draw original
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    // Draw all confirmed redactions
    boxes.forEach((box) => applyRedaction(ctx, img, box));

    // Draw the active drag box (red outline)
    if (isDrawing && currentBox) {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(currentBox.x, currentBox.y, currentBox.w, currentBox.h);
      ctx.setLineDash([]); // reset
    }
  }, [imageSrc, boxes, isDrawing, currentBox]);

  // 3. The exact math to Blur or Pixelate a specific box
  const applyRedaction = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    box: RedactionBox,
  ) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(box.x, box.y, box.width, box.height);
    ctx.clip(); // Only affect the drawn box

    if (box.type === "blur") {
      ctx.filter = "blur(15px)";
      ctx.drawImage(img, 0, 0);
    } else {
      // Pixelate: Draw small, then scale up
      const size = 0.05; // 5% of original size
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = box.width * size;
      tempCanvas.height = box.height * size;
      const tCtx = tempCanvas.getContext("2d");
      if (tCtx) {
        tCtx.drawImage(
          canvasRef.current!,
          box.x,
          box.y,
          box.width,
          box.height,
          0,
          0,
          tempCanvas.width,
          tempCanvas.height,
        );
        ctx.imageSmoothingEnabled = false; // Keep it blocky
        ctx.drawImage(
          tempCanvas,
          0,
          0,
          tempCanvas.width,
          tempCanvas.height,
          box.x,
          box.y,
          box.width,
          box.height,
        );
      }
    }
    ctx.restore();
  };

  // 4. Mouse interaction math (Scaling CSS pixels to exact Image pixels)
  const getMousePos = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    setIsDrawing(true);
    setCurrentBox({ x: pos.x, y: pos.y, w: 0, h: 0 });
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentBox) return;
    const pos = getMousePos(e);
    setCurrentBox({
      ...currentBox,
      w: pos.x - currentBox.x,
      h: pos.y - currentBox.y,
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (
      currentBox &&
      Math.abs(currentBox.w) > 10 &&
      Math.abs(currentBox.h) > 10
    ) {
      // Normalize negative widths/heights (if user drags backwards)
      const finalX =
        currentBox.w < 0 ? currentBox.x + currentBox.w : currentBox.x;
      const finalY =
        currentBox.h < 0 ? currentBox.y + currentBox.h : currentBox.y;

      setBoxes([
        ...boxes,
        {
          x: finalX,
          y: finalY,
          width: Math.abs(currentBox.w),
          height: Math.abs(currentBox.h),
          type: redactionMode,
        },
      ]);
    }
    setCurrentBox(null);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "redacted-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
      {!imageSrc ? (
        // Upload State
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-12 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative cursor-pointer group">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <UploadCloud className="w-16 h-16 text-slate-400 mx-auto mb-4 group-hover:text-cyan-500 transition-colors" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {dict.dropTitle || "Upload an Image"}
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            {dict.dropDesc || "PNG, JPG, or WebP. Processing happens locally."}
          </p>
        </div>
      ) : (
        // Editor State
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setRedactionMode("blur")}
                className={`px-4 py-2 rounded-xl font-bold flex items-center transition-all ${redactionMode === "blur" ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/20" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"}`}
              >
                <Eraser className="w-4 h-4 mr-2" />
                {dict.btnBlur || "Blur"}
              </button>
              <button
                onClick={() => setRedactionMode("pixelate")}
                className={`px-4 py-2 rounded-xl font-bold flex items-center transition-all ${redactionMode === "pixelate" ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/20" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"}`}
              >
                <Grid className="w-4 h-4 mr-2" />
                {dict.btnPixelate || "Pixelate"}
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setBoxes(boxes.slice(0, -1))}
                disabled={boxes.length === 0}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-50"
              >
                {dict.btnUndo || "Undo Last"}
              </button>
              <button
                onClick={() => {
                  setImageSrc(null);
                  setBoxes([]);
                }}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-rose-500 flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                {dict.btnReset || "Reset"}
              </button>
            </div>
          </div>

          {/* Canvas Container */}
          <div className="relative border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-100 dark:bg-black group">
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg pointer-events-none z-10 flex items-center">
              <ImageIcon className="w-3 h-3 mr-1" />
              {dict.instruction || "Click and drag to redact"}
            </div>

            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="w-full max-h-[60vh] object-contain cursor-crosshair block"
              style={{ touchAction: "none" }} // Prevents scrolling on mobile when drawing
            />
          </div>

          {/* Action Footer */}
          <button
            onClick={downloadImage}
            className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl flex items-center justify-center transition-all shadow-lg shadow-cyan-600/20 text-lg"
          >
            <Download className="w-5 h-5 mr-2" />
            {dict.btnDownload || "Download Safe Image"}
          </button>
        </div>
      )}
    </div>
  );
}
