const officeService = require("../services/officeService");
const fs = require("fs");
const path = require("path");

/**
 * Controller handles the HTTP request/response logic.
 * It coordinates between the incoming file and the service.
 */
exports.handleWordToPdf = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No Word file was uploaded." });
  }

  const filePath = path.resolve(req.file.path);

  try {
    const fileBuffer = fs.readFileSync(filePath);

    // Call the service
    const pdfBuffer = await officeService.convertWordToPdf(fileBuffer);

    // Cleanup: Delete the uploaded docx file
    fs.unlinkSync(filePath);

    // Send response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="converted.pdf"`,
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("[OFFICE CONTROLLER ERROR]", error);

    // Cleanup on failure
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.status(500).json({ error: "Failed to convert document." });
  }
};
