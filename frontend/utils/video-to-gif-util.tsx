// utils/video-to-gif-util.ts
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

// Singleton instance to prevent reloading the engine multiple times
let ffmpegInstance: FFmpeg | null = null;

export async function loadFFmpegEngine(
  onProgress?: (progressText: string) => void,
): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance;

  const ffmpeg = new FFmpeg();

  if (onProgress) {
    ffmpeg.on("progress", ({ progress }) => {
      onProgress(`Converting to GIF: ${Math.round(progress * 100)}%`);
    });
  }

  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  ffmpegInstance = ffmpeg;
  return ffmpegInstance;
}

export async function convertVideoToGifLocally(
  videoFile: File,
  onProgress?: (progressText: string) => void,
): Promise<Blob> {
  try {
    // Ensure the engine is loaded before attempting conversion
    const ffmpeg = await loadFFmpegEngine(onProgress);

    const inputName =
      "input" + videoFile.name.substring(videoFile.name.lastIndexOf("."));
    const outputName = "output.gif";

    if (onProgress) onProgress("Preparing video...");

    // 1. Write the file to FFmpeg's virtual file system
    await ffmpeg.writeFile(inputName, await fetchFile(videoFile));

    if (onProgress) onProgress("Processing frames...");

    // 2. Execute the FFmpeg command
    await ffmpeg.exec([
      "-i",
      inputName,
      "-vf",
      "fps=10,scale=500:-1:flags=lanczos",
      "-c:v",
      "gif",
      outputName,
    ]);

    // 3. Read the result and create a Blob
    const fileData = await ffmpeg.readFile(outputName);
    const data = new Uint8Array(fileData as any);

    return new Blob([data.buffer], { type: "image/gif" });
  } catch (error) {
    console.error("Error converting video:", error);
    throw new Error(
      "Failed to convert video to GIF. Ensure your file is valid.",
    );
  }
}
