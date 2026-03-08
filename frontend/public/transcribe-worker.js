// public/transcribe-worker.js
import {
  pipeline,
  env,
} from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2";

// Skip local check to ensure it fetches from CDN
env.allowLocalModels = false;

let transcriber = null;

self.onmessage = async (e) => {
  const { audioData } = e.data;

  try {
    if (!transcriber) {
      self.postMessage({
        status: "loading",
        message: "Downloading AI model...",
      });
      transcriber = await pipeline(
        "automatic-speech-recognition",
        "Xenova/whisper-tiny.en",
      );
    }

    self.postMessage({ status: "processing", message: "Analyzing audio..." });

    const result = await transcriber(audioData, {
      chunk_length_s: 30,
      stride_length_s: 5,
    });

    self.postMessage({ status: "complete", transcript: result.text });
  } catch (error) {
    self.postMessage({ status: "error", error: error.message });
  }
};
