const imageService = require("../services/imageCompressorService");

exports.handleCompressImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided." });
  }

  console.log(`[IMAGE] Starting compression for: ${req.file.originalname}`);

  try {
    // Quality comes from the frontend slider (default to 70 if missing)
    const quality = parseInt(req.body.quality) || 70;
    const originalSize = req.file.size;

    // Call the compression service
    const { buffer, format } = await imageService.compressImage(
      req.file.buffer,
      quality,
    );
    const compressedSize = buffer.length;

    // We must expose custom headers so the frontend can read the sizes!
    res.setHeader(
      "Access-Control-Expose-Headers",
      "X-Original-Size, X-Compressed-Size",
    );

    // Set response headers
    res.setHeader("Content-Type", `image/${format}`);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="compressed_${req.file.originalname}"`,
    );
    res.setHeader("X-Original-Size", originalSize.toString());
    res.setHeader("X-Compressed-Size", compressedSize.toString());

    // Send the binary image buffer back
    res.send(buffer);

    console.log(
      `[IMAGE] Compressed ${req.file.originalname} | Before: ${originalSize} bytes -> After: ${compressedSize} bytes`,
    );
  } catch (error) {
    console.error("[IMAGE ERROR]", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to compress image." });
  }
};
