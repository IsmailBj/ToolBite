// utils/pdf-util.ts
import { PDFDocument } from "pdf-lib";

/**
 * Merges multiple PDF files into a single PDF Blob
 */
export async function mergeFiles(files: File[]): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const pdfBytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedPdfBytes = await mergedPdf.save();
  return new Blob([new Uint8Array(mergedPdfBytes)], {
    type: "application/pdf",
  });
}

/**
 * Extracts specific pages from a PDF and returns a new PDF Blob
 */
export async function splitFile(
  file: File,
  pageIndices: number[],
): Promise<Blob> {
  const pdfBytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(pdfBytes);
  const newPdf = await PDFDocument.create();

  const copiedPages = await newPdf.copyPages(pdf, pageIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  const newPdfBytes = await newPdf.save();
  return new Blob([new Uint8Array(newPdfBytes)], { type: "application/pdf" });
}
