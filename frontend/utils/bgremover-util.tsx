// lib/bg-remover.ts
import { removeBackground } from "@imgly/background-removal";
import * as ort from "onnxruntime-web";

// 1. Force the engine to fetch the .wasm files from a global CDN, bypassing Next.js 404s
ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/";

export async function removeBackgroundLocally(
  imageFile: File,
  onProgress?: (progressText: string) => void,
): Promise<Blob> {
  try {
    const imageBlob = await removeBackground(imageFile, {
      debug: false,
      device: "cpu",
      // 2. DO NOT set publicPath!
      // The library will now automatically find the correct AI models on its own.
      progress: (key, current, total) => {
        if (onProgress) {
          const percent = Math.round((current / total) * 100);
          onProgress(`Downloading AI Model (${key}): ${percent}%`);
        }
      },
    });

    return imageBlob;
  } catch (error) {
    console.error("Error removing background:", error);
    throw new Error("Failed to remove background. Please try again.");
  }
}
