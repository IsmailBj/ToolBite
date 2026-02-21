const backgroundService = require("../services/backgroundService");
const path = require("path");
const fs = require("fs");

exports.handleRemoveBackground = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image provided" });

    console.log(`[AI] Processing: ${req.file.originalname}`);

    // Convert relative path to absolute path for the AI library
    const absolutePath = path.resolve(req.file.path);
    const processedBuffer =
      await backgroundService.stripBackground(absolutePath);

    // Clean up: Delete the uploaded file from the 'uploads' folder after processing
    fs.unlink(absolutePath, (err) => {
      if (err) console.error("[Cleanup Error]", err);
    });

    res.setHeader("Content-Type", "image/png");
    res.send(processedBuffer);

    console.log(`[AI] Successfully processed: ${req.file.originalname}`);
  } catch (error) {
    console.error("[AI ERROR]", error);
    res.status(500).json({ error: "Background removal failed" });
  }
};
