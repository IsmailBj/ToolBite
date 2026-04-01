import { pipeline, env } from "@xenova/transformers";

env.allowLocalModels = false;

class PipelineSingleton {
  static task = "token-classification" as const;
  static model = "Xenova/bert-base-NER";
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
    const classifier = await PipelineSingleton.getInstance((x: any) => {
      self.postMessage(x);
    });

    // Run the text through the NER model
    const output = await classifier(event.data.text, {
      aggregation_strategy: "simple", // Groups sub-words together perfectly!
    });

    self.postMessage({
      status: "complete",
      output: output,
    });
  } catch (error) {
    self.postMessage({ status: "error", error: String(error) });
  }
});
