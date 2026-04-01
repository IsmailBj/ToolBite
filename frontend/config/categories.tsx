import React from "react";
import { LayoutGrid, Palette, Code, Shield, TrendingUp } from "lucide-react";

export const getCategories = (dict: any) => {
  return [
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
    {
      name: "SEO",
      label: dict.home?.categories?.SEO || "SEO",
      icon: <TrendingUp className="w-4 h-4" />,
    },
  ];
};
