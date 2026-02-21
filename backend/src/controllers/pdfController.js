const pdfService = require("../services/pdfService");
const path = require("path");
const fs = require("fs");

exports.handleConvertPdf = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF provided" });

    console.log(`[PDF] Processing: ${req.file.originalname}`);

    const absolutePath = path.resolve(req.file.path);
    const outputDir = path.join(
      __dirname,
      "../../uploads/temp_pdf_" + Date.now(),
    );

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const images = await pdfService.convertPdfToImages(absolutePath, outputDir);

    // Cleanup: Remove original PDF and temp output folder
    fs.unlinkSync(absolutePath);
    fs.rmSync(outputDir, { recursive: true, force: true });

    res.json({ images });

    console.log(`[PDF] Successfully converted: ${req.file.originalname}`);
  } catch (error) {
    console.error("[PDF ERROR]", error);
    res
      .status(500)
      .json({ error: "PDF conversion failed. Ensure poppler is installed." });
  }
};
