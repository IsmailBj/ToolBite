"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  // Extract the current locale from the URL (e.g., "/en/tools" -> "en")
  const currentLocale = pathname.split("/")[1] || "en";

  const switchLanguage = (newLocale: string) => {
    // 1. Set the cookie so the proxy/middleware remembers it
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

    // 2. Replace the old locale in the URL with the new one
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);

    // 3. Navigate to the new URL
    router.push(newPath);
    router.refresh();
  };

  return (
    <div className="relative inline-flex items-center rounded-lg bg-slate-100 px-3 py-1.5 dark:bg-slate-800/50">
      <Globe className="mr-2 h-4 w-4 text-slate-500" />
      <select
        value={currentLocale}
        onChange={(e) => switchLanguage(e.target.value)}
        className="appearance-none bg-transparent text-sm font-bold text-slate-700 cursor-pointer focus:outline-none dark:text-slate-300 pr-2"
      >
        <option value="en">EN</option>
        <option value="es">ES</option>
      </select>
    </div>
  );
}
