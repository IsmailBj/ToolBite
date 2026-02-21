"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Wand2, FileType, Minimize, ArrowRight, Search } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const tools = [
    {
      id: "bg-remover",
      title: "Background Remover",
      description:
        "Instantly strip backgrounds from any image using high-speed AI.",
      icon: <Wand2 className="w-7 h-7 text-blue-600 dark:text-blue-400" />,
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      hoverBorder: "hover:border-blue-300 dark:hover:border-blue-700",
      status: "Active",
      href: "/tools/bg-remover",
    },
    {
      id: "word-to-pdf",
      title: "Word to PDF",
      description:
        "Transform .docx and .doc files into professional PDF documents in seconds.",
      icon: <FileType className="w-7 h-7 text-red-600" />,
      bgColor: "bg-red-100",
      hoverBorder: "hover:border-red-300",
      status: "Active",
      href: "/tools/word-to-pdf",
    },
    {
      id: "image-compressor",
      title: "Image Compressor",
      description:
        "Shrink image file sizes by up to 80% without losing visual quality.",
      icon: (
        <Minimize className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
      ),
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-700",
      status: "Active",
      href: "/tools/image-compressor",
    },
  ];

  const filteredTools = tools.filter(
    (tool) =>
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
          Your all-in-one <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            utility workspace.
          </span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
          Fast, secure, and running directly in your browser. Select a tool to
          get started.
        </p>

        <div className="relative max-w-md mx-auto group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm transition-colors"
            placeholder="Search for tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <Link
            href={tool.href}
            key={tool.id}
            className={`group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full ${tool.hoverBorder} ${tool.status === "Coming Soon" ? "pointer-events-none opacity-80" : ""}`}
          >
            {tool.status === "Coming Soon" && (
              <div className="absolute top-6 right-6 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold rounded-full">
                Coming Soon
              </div>
            )}
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 ${tool.bgColor}`}
            >
              {tool.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {tool.title}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 flex-grow leading-relaxed">
              {tool.description}
            </p>
            <div
              className={`mt-6 flex items-center text-sm font-semibold transition-opacity duration-300 ${tool.status === "Coming Soon" ? "text-slate-400 dark:text-slate-500" : "text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100"}`}
            >
              {tool.status === "Coming Soon" ? "In Development" : "Launch Tool"}{" "}
              {tool.status !== "Coming Soon" && (
                <ArrowRight className="ml-1 w-4 h-4" />
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
