const mammoth = require("mammoth");
const puppeteer = require("puppeteer");

/**
 * Service to handle the heavy lifting of document conversion.
 * Separating this allows you to reuse this logic elsewhere or test it independently.
 */
exports.convertWordToPdf = async (fileBuffer) => {
  // 1. Convert Word Buffer to HTML
  const { value: html } = await mammoth.convertToHtml({ buffer: fileBuffer });

  // 2. Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // 3. Define the document styling
  const styledHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            padding: 50px; 
            color: #333;
          }
          img { max-width: 100%; height: auto; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
          table, th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          h1, h2, h3 { color: #1a1a1a; }
        </style>
      </head>
      <body>${html}</body>
    </html>
  `;

  await page.setContent(styledHtml, { waitUntil: "networkidle0" });

  // 4. Generate PDF Buffer
  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
    printBackground: true,
  });

  await browser.close();
  return pdfBuffer;
};
