"use client";

import React, { createContext, useContext } from "react";

// Create the context
const DictionaryContext = createContext<any>(null);

// Create the provider wrapper
export default function DictionaryProvider({
  dictionary,
  children,
}: {
  dictionary: any;
  children: React.ReactNode;
}) {
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  );
}

// Create a custom hook so components can easily grab the dictionary
export function useDictionary() {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error("useDictionary must be used within a DictionaryProvider");
  }
  return context;
}
