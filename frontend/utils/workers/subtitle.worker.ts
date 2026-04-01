import { pipeline, env } from "@xenova/transformers";

env.allowLocalModels = false;

class PipelineSingleton {
  static task = "automatic-speech-recognition" as const;
  // We use the 'tiny' model. It's ~40MB and super fast for browser use.
  static model = "Xenova/whisper-tiny";
  static instance: any = null;

  static async getInstance(progress_callback: Function) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }
    return this.instance;
  }
}

self.addEventListener("message", async (event) => {
  try {
    const transcriber = await PipelineSingleton.getInstance((x: any) => {
      self.postMessage(x);
    });

    // Run Whisper on the audio data, requesting timestamps!
    const output = await transcriber(event.data.audio, {
      chunk_length_s: 30,
      stride_length_s: 5,
      return_timestamps: true, // This is the magic flag for subtitles
    });

    self.postMessage({
      status: "complete",
      output: output,
    });
  } catch (error) {
    self.postMessage({ status: "error", error: String(error) });
  }
});
