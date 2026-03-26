import "server-only";

const dictionaries: Record<string, () => Promise<any>> = {
  en: () => import("./en.json").then((m) => m.default),
  es: () => import("./es.json").then((m) => m.default),
  de: () => import("./de.json").then((m) => m.default),
  fr: () => import("./fr.json").then((m) => m.default),
  pl: () => import("./pl.json").then((m) => m.default),
  ru: () => import("./ru.json").then((m) => m.default),
};

export const getDictionary = async (locale: string) => {
  // Check if the locale exists in our dictionary keys
  const loader = dictionaries[locale] || dictionaries.en;
  return await loader();
};
