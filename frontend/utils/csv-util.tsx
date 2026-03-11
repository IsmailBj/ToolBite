export interface ParseOptions {
  delimiter: string;
  hasHeaders: boolean;
}

export interface ParsedCSV {
  headers: string[];
  rows: Record<string, string>[];
  jsonString: string;
  htmlString: string;
  markdownString: string;
}

// Robust CSV line parser handling quoted values
function parseCsvLine(text: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"' && text[i + 1] === '"' && inQuotes) {
      current += '"';
      i++; // skip escaped quote
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function parseCSV(csvText: string, options: ParseOptions): ParsedCSV {
  const { delimiter, hasHeaders } = options;
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim() !== "");

  if (lines.length === 0) {
    return {
      headers: [],
      rows: [],
      jsonString: "[]",
      htmlString: "",
      markdownString: "",
    };
  }

  const rawGrid = lines.map((line) => parseCsvLine(line, delimiter));
  const columnCount = Math.max(...rawGrid.map((row) => row.length));

  let headers: string[] = [];
  let dataRows: string[][] = [];

  if (hasHeaders) {
    headers = rawGrid[0];
    // Ensure headers array matches max column count
    while (headers.length < columnCount)
      headers.push(`Column ${headers.length + 1}`);
    dataRows = rawGrid.slice(1);
  } else {
    headers = Array.from({ length: columnCount }, (_, i) => `Column ${i + 1}`);
    dataRows = rawGrid;
  }

  const rows = dataRows.map((rowValues) => {
    const rowObject: Record<string, string> = {};
    headers.forEach((header, index) => {
      rowObject[header] = rowValues[index] || "";
    });
    return rowObject;
  });

  // Generate HTML
  const htmlHead = `<thead>\n  <tr>\n${headers.map((h) => `    <th>${h}</th>`).join("\n")}\n  </tr>\n</thead>`;
  const htmlBody = `<tbody>\n${dataRows.map((row) => `  <tr>\n${headers.map((_, i) => `    <td>${row[i] || ""}</td>`).join("\n")}\n  </tr>`).join("\n")}\n</tbody>`;
  const htmlString = `<table>\n${htmlHead}\n${htmlBody}\n</table>`;

  // Generate Markdown
  const mdHeader = `| ${headers.join(" | ")} |`;
  const mdDivider = `| ${headers.map(() => "---").join(" | ")} |`;
  const mdBody = dataRows
    .map((row) => `| ${headers.map((_, i) => row[i] || "").join(" | ")} |`)
    .join("\n");
  const markdownString = `${mdHeader}\n${mdDivider}\n${mdBody}`;

  return {
    headers,
    rows,
    jsonString: JSON.stringify(rows, null, 2),
    htmlString,
    markdownString,
  };
}
