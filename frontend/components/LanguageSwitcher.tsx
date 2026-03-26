"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Languages, ChevronDown, Check } from "lucide-react";

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current locale from pathname (e.g., "/es/tools" -> "es")
  const currentLocale = pathname.split("/")[1] || "en";

  // Close when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 transition-all shadow-sm active:scale-95"
      >
        <Languages className="w-4 h-4 text-slate-500" />
        <span className="text-sm font-medium uppercase">{currentLocale}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span>{lang.flag}</span>
                  <span
                    className={
                      currentLocale === lang.code
                        ? "font-bold text-blue-600"
                        : "text-slate-600 dark:text-slate-300"
                    }
                  >
                    {lang.label}
                  </span>
                </div>
                {currentLocale === lang.code && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
