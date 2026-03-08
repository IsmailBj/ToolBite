"use client";

import React, { useState, useRef } from "react";
import {
  ArrowLeft,
  Globe,
  Share2,
  Copy,
  Check,
  Type,
  ImageIcon,
  Upload,
  Trash2,
} from "lucide-react";
import { generateMetaTags } from "../../../utils/seo-util";

export default function SocialPreviewerPage() {
  const [data, setData] = useState({
    title: "My Awesome Project",
    description:
      "This is a brief description of what my website does and why it is great for users.",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    url: "https://mywebsite.com",
  });
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData({ ...data, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const copyTags = () => {
    navigator.clipboard.writeText(generateMetaTags(data));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <a
        href="/"
        className="inline-flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />{" "}
        Back to workspace
      </a>

      <div className="flex items-center space-x-4 mb-10">
        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center">
          <Globe className="w-7 h-7 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Social Previewer
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Preview and generate SEO meta tags with local image support.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Editor Side */}
        <div className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="space-y-4">
            <label className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300">
              <Type className="w-4 h-4 mr-2" /> Page Title
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300">
              <Share2 className="w-4 h-4 mr-2" /> Description
            </label>
            <textarea
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
              className="w-full h-24 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-none"
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300">
              <ImageIcon className="w-4 h-4 mr-2" /> Preview Image
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={
                  data.image.startsWith("data:")
                    ? "Local Image Uploaded"
                    : data.image
                }
                onChange={(e) => setData({ ...data, image: e.target.value })}
                disabled={data.image.startsWith("data:")}
                className="flex-grow px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 dark:text-white disabled:opacity-50"
                placeholder="Paste URL or upload..."
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              {/* Fix: Added dark mode support and hover state to the upload button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl transition-colors"
                title="Upload Local Image"
              >
                <Upload className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
              {data.image.startsWith("data:") && (
                <button
                  onClick={() => setData({ ...data, image: "" })}
                  className="p-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 rounded-xl transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              )}
            </div>
          </div>

          <button
            onClick={copyTags}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center shadow-lg"
          >
            {copied ? (
              <Check className="w-5 h-5 mr-2" />
            ) : (
              <Copy className="w-5 h-5 mr-2" />
            )}
            {copied ? "Tags Copied!" : "Copy Meta Tags"}
          </button>
        </div>

        {/* Preview Side (Cards) */}
        <div className="space-y-8 sticky top-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
            Live Previews
          </h3>

          <div className="bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <img
              src={data.image}
              alt="Preview"
              className="w-full h-56 object-cover"
            />
            <div className="p-4 bg-white dark:bg-black border-t border-slate-100 dark:border-slate-900">
              <p className="text-[13px] text-slate-500 dark:text-slate-500 mb-0.5">
                {new URL(data.url || "https://example.com").hostname}
              </p>
              <h4 className="font-bold text-[15px] text-slate-900 dark:text-white truncate">
                {data.title}
              </h4>
              <p className="text-[14px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                {data.description}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <img
              src={data.image}
              alt="Preview"
              className="w-full h-64 object-cover"
            />
            <div className="p-4 bg-[#f0f2f5] dark:bg-[#242526] border-t border-slate-100 dark:border-slate-800/50">
              <p className="text-[12px] text-slate-600 dark:text-slate-400 uppercase tracking-tight">
                {new URL(data.url || "https://example.com").hostname}
              </p>
              <h4 className="font-bold text-[16px] text-slate-900 dark:text-white mt-1 leading-tight">
                {data.title}
              </h4>
              <p className="text-[14px] text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                {data.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
