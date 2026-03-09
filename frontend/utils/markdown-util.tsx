// utils/markdown-util.ts
import { marked } from "marked";
import DOMPurify from "dompurify";

export async function parseMarkdown(content: string): Promise<string> {
  // Convert Markdown to HTML
  const rawHtml = await marked.parse(content);

  // Sanitize the HTML to prevent XSS attacks
  return DOMPurify.sanitize(rawHtml);
}

export function downloadAsHtml(html: string) {
  const fullHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: sans-serif; line-height: 1.6; padding: 2rem; max-width: 800px; margin: auto; }
        img { max-width: 100%; }
      </style>
    </head>
    <body>${html}</body>
    </html>
  `;
  const blob = new Blob([fullHtml], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "document.html";
  a.click();
}
