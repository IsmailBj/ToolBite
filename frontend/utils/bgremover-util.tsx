// utils/bgremover-util.ts

export async function removeBackgroundLocally(
  imageFile: File,
  onProgress?: (progressText: string) => void,
): Promise<Blob> {
  try {
    // Hide the import from Next.js Turbopack to prevent WebAssembly 404 errors
    const getImgly = new Function(
      'return import("https://esm.sh/@imgly/background-removal@1.7.0")',
    );
    const imgly = await getImgly();

    // Execute background removal natively via CDN with high-quality settings
    const resultBlob = await imgly.removeBackground(imageFile, {
      debug: false,
      device: "cpu",
      model: "isnet", // Forces the 168MB high-precision model for the cleanest edges
      proxyToWorker: false, // Prevents isolated worker 404s
      publicPath:
        "https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/",
      output: {
        format: "image/png",
        quality: 1, // Maximum image quality retention
      },
      progress: (key: string, current: number, total: number) => {
        if (onProgress) {
          const percent = Math.round((current / total) * 100);
          onProgress(`Downloading High-Res AI (${key}): ${percent}%`);
        }
      },
    });

    return resultBlob;
  } catch (error) {
    console.error("Error removing background:", error);
    throw new Error("Failed to remove background. Please try again.");
  }
}
