// utils/transcribe-util.ts

export async function transcribeAudioWithWorker(
  audioBlob: Blob,
  onStatusUpdate: (status: string) => void,
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    // 1. Prepare Audio Data
    const audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )({ sampleRate: 16000 });
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const audioData = audioBuffer.getChannelData(0);

    // 2. Initialize Worker
    const worker = new Worker("/transcribe-worker.js", { type: "module" });

    worker.onmessage = (e) => {
      const { status, transcript, message, error } = e.data;

      if (status === "loading" || status === "processing") {
        onStatusUpdate(message);
      } else if (status === "complete") {
        resolve(transcript);
        worker.terminate();
      } else if (status === "error") {
        reject(new Error(error));
        worker.terminate();
      }
    };

    // 3. Send data to worker
    worker.postMessage({ audioData });
  });
}
