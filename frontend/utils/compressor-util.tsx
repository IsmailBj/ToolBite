import imageCompression from "browser-image-compression";

export async function compressImageLocally(
  imageFile: File,
  quality: number,
): Promise<File> {
  const compressionQuality = quality / 100;

  const options = {
    maxSizeMB: 15, // Matches the text in your UI
    useWebWorker: true, // Keeps your React UI from freezing
    initialQuality: compressionQuality,
    alwaysKeepResolution: true, // Prevents the image from resizing, just compresses
  };

  try {
    const compressedFile = await imageCompression(imageFile, options);
    return compressedFile;
  } catch (error) {
    console.error("Local compression error:", error);
    throw new Error(
      "Failed to compress image locally. Please try another image.",
    );
  }
}
