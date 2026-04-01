"use client";

import React, { useState } from "react";
import Link from "@/components/LocalizedLink";
import {
  ArrowRight,
  Search,
  LayoutGrid,
  Code,
  Palette,
  Shield,
} from "lucide-react";

// 1. Import your hook and your new tool function
import { useDictionary } from "../../components/DictionaryProvider";
import { getTools } from "../../config/tools";

export default function Home() {
  // 2. Grab the dictionary from the global provider
  const dict = useDictionary();

  // 3. Generate the translated tools list
  const translatedTools = getTools(dict);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // 4. Update categories to use the dictionary (or keep English if you prefer)
  const categories = [
    {
      name: "All",
      label: dict.home?.categories?.All || "All",
      icon: <LayoutGrid className="w-4 h-4" />,
    },
    {
      name: "Design",
      label: dict.home?.categories?.Design || "Design",
      icon: <Palette className="w-4 h-4" />,
    },
    {
      name: "Developer",
      label: dict.home?.categories?.Developer || "Developer",
      icon: <Code className="w-4 h-4" />,
    },
    {
      name: "Security",
      label: dict.home?.categories?.Security || "Security",
      icon: <Shield className="w-4 h-4" />,
    },
  ];

  // 5. Filter the translated tools
  const filteredTools = translatedTools.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || tool.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
          {dict.home?.title1 || "Your all-in-one"}{" "}
          <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            {dict.home?.title2 || "utility workspace."}
          </span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
          {dict.home?.subtitle ||
            "Fast, secure, and running directly in your browser."}
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto group mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
            placeholder={dict.home?.search || "Search for tools..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories Section */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                activeCategory === cat.name
                  ? "bg-slate-900 text-white border-slate-900 dark:bg-blue-600 dark:border-blue-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 dark:hover:border-slate-700"
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <Link
              href={tool.href}
              key={tool.id}
              className={`group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full ${tool.hoverBorder}`}
            >
              <div className="absolute top-6 right-6">
                <span className="px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700">
                  {/* Translate category label on the card */}
                  {dict.home?.categories?.[tool.category] || tool.category}
                </span>
              </div>
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
              <div className="mt-6 flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {dict.home?.launch || "Launch Tool"}{" "}
                <ArrowRight className="ml-1 w-4 h-4" />
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
              {dict.home?.noTools || "No tools found matching your criteria."}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-4 text-blue-600 font-bold hover:underline"
            >
              {dict.home?.reset || "Reset filters"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
