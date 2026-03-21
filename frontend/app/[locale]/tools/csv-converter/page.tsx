"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  TableProperties,
  Code,
  Table as TableIcon,
  Copy,
  Check,
  Download,
  FileText,
  Settings,
  FileCode2,
  AlignLeft,
} from "lucide-react";
import { parseCSV, ParsedCSV, ParseOptions } from "../../../../utils/csv-util";

type TabType = "table" | "json" | "html" | "markdown";

export default function CsvConverterPage() {
  const [csvInput, setCsvInput] = useState<string>(
    'id,name,role,department\n1,"Smith, Alice",Engineer,Development\n2,Bob Jones,Designer,Marketing\n3,Charlie Brown,Manager,Sales',
  );
  const [parsedData, setParsedData] = useState<ParsedCSV>({
    headers: [],
    rows: [],
    jsonString: "[]",
    htmlString: "",
    markdownString: "",
  });
  const [activeTab, setActiveTab] = useState<TabType>("table");
  const [copied, setCopied] = useState(false);

  const [options, setOptions] = useState<ParseOptions>({
    delimiter: ",",
    hasHeaders: true,
  });

  useEffect(() => {
    try {
      setParsedData(parseCSV(csvInput, options));
    } catch (e) {
      // Suppress parsing errors during active typing
    }
  }, [csvInput, options]);

  const handleCopy = () => {
    let textToCopy = "";
    if (activeTab === "json") textToCopy = parsedData.jsonString;
    else if (activeTab === "html") textToCopy = parsedData.htmlString;
    else if (activeTab === "markdown") textToCopy = parsedData.markdownString;
    else textToCopy = csvInput; // Fallback for table view

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    let content = "";
    let mimeType = "text/plain";
    let extension = "txt";

    if (activeTab === "json") {
      content = parsedData.jsonString;
      mimeType = "application/json";
      extension = "json";
    } else if (activeTab === "html") {
      content = parsedData.htmlString;
      mimeType = "text/html";
      extension = "html";
    } else if (activeTab === "markdown") {
      content = parsedData.markdownString;
      mimeType = "text/markdown";
      extension = "md";
    } else return;

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted_data.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string")
        setCsvInput(event.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <a
        href="/"
        className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />{" "}
        Back to workspace
      </a>

      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center">
          <TableProperties className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            CSV to JSON Converter
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Robust parser with custom delimiters, JSON, HTML, and Markdown
            export.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input & Config Column */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center mb-2">
              <Settings className="w-4 h-4 mr-2" /> Configuration
            </h3>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                Delimiter
              </label>
              <select
                value={options.delimiter}
                onChange={(e) =>
                  setOptions({ ...options, delimiter: e.target.value })
                }
                className="w-full p-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              >
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="\t">Tab</option>
                <option value="|">Pipe (|)</option>
              </select>
            </div>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.hasHeaders}
                onChange={(e) =>
                  setOptions({ ...options, hasHeaders: e.target.checked })
                }
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                First row contains headers
              </span>
            </label>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex-1 flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Raw Data Input
              </label>
              <label className="flex items-center text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors">
                <FileText className="w-3 h-3 mr-1" /> Upload
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              className="flex-1 w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 whitespace-pre"
              placeholder="Paste your data here..."
            />
          </div>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[650px] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 overflow-x-auto">
            <div className="flex space-x-2">
              {[
                { id: "table", icon: TableIcon, label: "Table" },
                { id: "json", icon: Code, label: "JSON" },
                { id: "html", icon: FileCode2, label: "HTML" },
                { id: "markdown", icon: AlignLeft, label: "Markdown" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === tab.id ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                >
                  <tab.icon className="w-4 h-4 mr-2" /> {tab.label}
                </button>
              ))}
            </div>

            <div className="flex space-x-2 ml-4">
              <button
                onClick={handleCopy}
                title="Copy Output"
                className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              {activeTab !== "table" && (
                <button
                  onClick={handleDownload}
                  title="Download File"
                  className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 bg-slate-50 dark:bg-slate-950">
            {activeTab === "table" && (
              <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <tr>
                      {parsedData.headers.map((header, i) => (
                        <th
                          key={i}
                          className="px-4 py-3 font-bold border-b border-slate-200 dark:border-slate-700"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                    {parsedData.rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        {parsedData.headers.map((header, colIndex) => (
                          <td
                            key={colIndex}
                            className="px-4 py-3 text-slate-600 dark:text-slate-400"
                          >
                            {row[header]}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {parsedData.rows.length === 0 && (
                      <tr>
                        <td
                          colSpan={Math.max(1, parsedData.headers.length)}
                          className="px-4 py-8 text-center text-slate-500"
                        >
                          No valid data provided.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === "json" && (
              <pre className="text-sm font-mono text-slate-700 dark:text-slate-300">
                {parsedData.jsonString}
              </pre>
            )}
            {activeTab === "html" && (
              <pre className="text-sm font-mono text-slate-700 dark:text-slate-300">
                {parsedData.htmlString}
              </pre>
            )}
            {activeTab === "markdown" && (
              <pre className="text-sm font-mono text-slate-700 dark:text-slate-300">
                {parsedData.markdownString}
              </pre>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
