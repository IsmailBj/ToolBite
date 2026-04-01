import { pipeline, env } from "@xenova/transformers";

env.allowLocalModels = false;

class PipelineSingleton {
  static task = "summarization" as const;
  // DistilBART is fantastic for condensing long articles into a few sentences
  static model = "Xenova/distilbart-cnn-6-6";
  static instance: any = null;

  static async getInstance(progress_callback: Function) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, {
        progress_callback,
        quantized: true, // Keeps the model size small for browser use
      });
    }
    return this.instance;
  }
}

self.addEventListener("message", async (event) => {
  try {
    const summarizer = await PipelineSingleton.getInstance((x: any) => {
      self.postMessage(x);
    });

    // We ask the AI to keep the summary short (perfect for Meta Descriptions)
    const output = await summarizer(event.data.text, {
      max_new_tokens: 50,
      min_new_tokens: 15,
    });

    self.postMessage({
      status: "complete",
      output: output[0].summary_text,
    });
  } catch (error) {
    self.postMessage({ status: "error", error: String(error) });
  }
});
