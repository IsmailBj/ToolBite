import "server-only";

const dictionaries = {
  en: () => import("./en.json").then((module) => module.default),
  es: () => import("./es.json").then((module) => module.default),
};

export const getDictionary = async (locale: "en" | "es") => {
  // Fallback to English if the locale doesn't exist
  return dictionaries[locale]?.() ?? dictionaries.en();
};
