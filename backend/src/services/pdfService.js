const { fromPath } = require("pdf2pic");
const path = require("path");
const fs = require("fs");

exports.convertPdfToImages = async (pdfPath, outputDir) => {
  const options = {
    density: 100,
    saveFilename: "page",
    savePath: outputDir,
    format: "png",
    width: 2048,
    height: 2896,
  };

  const convert = fromPath(pdfPath, options);

  // Convert all pages. For production, you might want to limit this.
  const results = await convert.bulk(-1, { responseType: "base64" });

  return results.map((res) => `data:image/png;base64,${res.base64}`);
};
