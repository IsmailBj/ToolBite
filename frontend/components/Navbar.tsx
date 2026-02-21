import React from "react";
import Link from "next/link";
import { Settings, User, Zap } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Tool<span className="text-blue-600 dark:text-blue-500">Bite</span>
            </span>
          </Link>
          <div className="flex items-center space-x-4 text-slate-500 dark:text-slate-400">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
