// In Jimp v1.0.0+, it requires named destructuring.
// We import both ways to ensure it works regardless of the version installed.
const JimpModule = require("jimp");
const JimpClass = JimpModule.Jimp || JimpModule.default || JimpModule;

/**
 * Service to handle image compression using 'jimp'.
 * Updated to correctly apply Quality settings in BOTH Jimp v0.x and Jimp v1.0+
 */
exports.compressImage = async (buffer, quality = 70) => {
  try {
    const parsedQuality = parseInt(quality);

    // 1. Read the image from the incoming buffer
    const image = await JimpClass.read(buffer);

    // 2. Get the original MIME type (handles v1.0 'mime' property vs old 'getMIME()' method)
    const mime =
      typeof image.getMIME === "function"
        ? image.getMIME()
        : image.mime || "image/jpeg";

    // 3. Export the modified image back to a buffer with the correct quality syntax
    let outputBuffer;

    if (typeof image.getBufferAsync === "function") {
      // --- JIMP v0.x API ---
      if (typeof image.quality === "function") {
        image.quality(parsedQuality); // Apply quality the old way
      }
      outputBuffer = await image.getBufferAsync(mime);
    } else {
      // --- JIMP v1.0+ API ---
      // In the new version, quality MUST be passed as an option during buffer creation
      outputBuffer = await image.getBuffer(mime, { quality: parsedQuality });
    }

    console.log(
      `[JIMP] Original size: ${buffer.length} bytes | New size: ${outputBuffer.length} bytes`,
    );

    // SAFETY NET: If the "compressed" image is actually larger or the same size
    // as the original (common with already small/optimized files), keep the original!
    if (outputBuffer.length >= buffer.length) {
      console.log(
        `[JIMP] Negative compression detected. Reverting to original buffer.`,
      );
      outputBuffer = buffer;
    }

    // 4. Determine the simple format name for the response headers
    let format = "jpeg";
    if (mime === "image/png" || mime === JimpModule.MIME_PNG) {
      format = "png";
    } else if (mime === "image/bmp" || mime === JimpModule.MIME_BMP) {
      format = "bmp";
    } else if (mime === "image/gif" || mime === JimpModule.MIME_GIF) {
      format = "gif";
    }

    return {
      buffer: outputBuffer,
      format: format,
    };
  } catch (error) {
    console.error("[JIMP ERROR]", error);
    throw new Error(
      "Could not process this image format. Please upload a valid JPG or PNG.",
    );
  }
};
