"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  FileEdit,
  Eye,
  Copy,
  Check,
  Download,
  Bold,
  Italic,
  Link,
  Code,
  List,
  Heading1,
  Heading2,
} from "lucide-react";
import { parseMarkdown, downloadAsHtml } from "../../../../utils/markdown-util";

export default function MarkdownLabPage() {
  const [markdown, setMarkdown] = useState(
    "# Welcome to Markdown Lab\n\nType here to see **live** changes!",
  );
  const [html, setHtml] = useState("");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const updatePreview = async () => {
      const cleanHtml = await parseMarkdown(markdown);
      setHtml(cleanHtml);
    };
    updatePreview();
  }, [markdown]);

  const insertSnippet = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const newText =
      text.substring(0, start) +
      before +
      selectedText +
      after +
      text.substring(end);

    setMarkdown(newText);

    // Reset focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const snippets = [
    {
      icon: <Heading1 className="w-4 h-4" />,
      action: () => insertSnippet("# ", ""),
      label: "H1",
    },
    {
      icon: <Heading2 className="w-4 h-4" />,
      action: () => insertSnippet("## ", ""),
      label: "H2",
    },
    {
      icon: <Bold className="w-4 h-4" />,
      action: () => insertSnippet("**", "**"),
      label: "Bold",
    },
    {
      icon: <Italic className="w-4 h-4" />,
      action: () => insertSnippet("_", "_"),
      label: "Italic",
    },
    {
      icon: <Link className="w-4 h-4" />,
      action: () => insertSnippet("[", "](https://)"),
      label: "Link",
    },
    {
      icon: <Code className="w-4 h-4" />,
      action: () => insertSnippet("`", "`"),
      label: "Code",
    },
    {
      icon: <List className="w-4 h-4" />,
      action: () => insertSnippet("- "),
      label: "List",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <a
        href="/"
        className="inline-flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-orange-600 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />{" "}
        Back to workspace
      </a>

      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/40 rounded-2xl flex items-center justify-center">
            <FileEdit className="w-7 h-7 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Markdown Lab
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Write with snippets and preview styled HTML in real-time.
            </p>
          </div>
        </div>

        <div className="hidden md:flex gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-sm dark:hover:bg-slate-700 hover:bg-slate-200 transition-all dark:text-white"
          >
            {copied ? (
              <Check className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            Copy MD
          </button>
          <button
            onClick={() => downloadAsHtml(html)}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-xl font-bold text-sm hover:bg-orange-700 transition-all shadow-md"
          >
            <Download className="w-4 h-4 mr-2" /> Download HTML
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[70vh]">
        {/* Editor Wrapper */}
        <div className="flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
          {/* Snippet Toolbar */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex gap-1 overflow-x-auto">
            {snippets.map((s, i) => (
              <button
                key={i}
                onClick={s.action}
                className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
                title={s.label}
              >
                {s.icon}
              </button>
            ))}
          </div>

          <textarea
            ref={textareaRef}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="flex-grow p-6 font-mono text-sm bg-transparent outline-none resize-none dark:text-slate-300 leading-relaxed"
            placeholder="Start typing..."
          />
        </div>

        {/* Preview Wrapper */}
        <div className="flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
          <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center">
            <Eye className="w-3 h-3 mr-2 text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Live Preview
            </span>
          </div>
          <div
            className="flex-grow p-8 overflow-y-auto prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </main>
  );
}
