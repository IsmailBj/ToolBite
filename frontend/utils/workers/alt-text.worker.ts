import { pipeline, env } from "@xenova/transformers";

// Tell Transformers.js not to look for local files on your Vercel server,
// but to fetch the model directly to the user's browser cache.
env.allowLocalModels = false;

class PipelineSingleton {
  static task: "image-to-text" = "image-to-text";
  static model = "Xenova/vit-gpt2-image-captioning";
  static instance: any = null;

  static async getInstance(progress_callback: Function) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }
    return this.instance;
  }
}

// Listen for messages from the UI component
self.addEventListener("message", async (event) => {
  try {
    // 1. Load the model (and send download progress back to the UI)
    const captioner = await PipelineSingleton.getInstance((x: any) => {
      self.postMessage(x);
    });

    // 2. Run the AI on the image the user uploaded
    const output = await captioner(event.data.image, {
      max_new_tokens: 50,
    });

    // 3. Send the final Alt-Text back to the UI
    self.postMessage({
      status: "complete",
      output: output[0].generated_text,
    });
  } catch (error) {
    self.postMessage({ status: "error", error: String(error) });
  }
});
