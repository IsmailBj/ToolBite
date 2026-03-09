// config/tools.tsx
import {
  Wand2,
  Minimize,
  Film,
  ShieldCheck,
  Mic,
  Scissors,
  Palette,
  ArrowRightLeft,
  Globe,
  Clock,
  FileEdit,
  Lock,
  Shapes,
  Search,
  Box,
} from "lucide-react";

export interface Tool {
  id: string;
  title: string;
  category: "Design" | "Video" | "Security" | "Developer";
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  hoverBorder: string;
  status: "Active" | "Coming Soon";
  href: string;
}

export const tools: Tool[] = [
  {
    id: "bg-remover",
    title: "Background Remover",
    category: "Design",
    description:
      "Instantly strip backgrounds from any image using high-speed AI.",
    icon: <Wand2 className="w-7 h-7 text-blue-600 dark:text-blue-400" />,
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    hoverBorder: "hover:border-blue-300 dark:hover:border-blue-700",
    status: "Active",
    href: "/tools/bg-remover",
  },
  {
    id: "video-to-gif",
    title: "Video to GIF",
    category: "Video",
    description:
      "Convert video clips into high-quality, shareable animated GIFs.",
    icon: <Film className="w-7 h-7 text-purple-600 dark:text-purple-400" />,
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    hoverBorder: "hover:border-purple-300 dark:hover:border-purple-700",
    status: "Active",
    href: "/tools/video-to-gif",
  },
  {
    id: "blob-generator",
    title: "Blob Shape Generator",
    category: "Design",
    description:
      "Generate fluid, organic SVG blob shapes for modern web layouts and backgrounds.",
    icon: <Shapes className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />,
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    hoverBorder: "hover:border-indigo-300 dark:hover:border-indigo-700",
    status: "Active",
    href: "/tools/blob-generator",
  },
  {
    id: "social-previewer",
    title: "Social Previewer",
    category: "Design",
    description:
      "Live preview and generate Meta Tags for Twitter, Facebook, and LinkedIn cards.",
    icon: <Globe className="w-7 h-7 text-blue-600 dark:text-blue-400" />,
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    hoverBorder: "hover:border-blue-300 dark:hover:border-blue-700",
    status: "Active",
    href: "/tools/social-previewer",
  },
  {
    id: "ua-inspector",
    title: "UA Inspector",
    category: "Developer",
    description:
      "Detect and parse User-Agent strings to identify browsers, OS, and hardware details.",
    icon: <Search className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />,
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    hoverBorder: "hover:border-indigo-300 dark:hover:border-indigo-700",
    status: "Active",
    href: "/tools/ua-inspector",
  },
  {
    id: "shadow-generator",
    title: "Shadow Palette Generator",
    category: "Design",
    description:
      "Create smooth, multi-layered CSS shadows for natural-looking UI elements.",
    icon: <Box className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />,
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    hoverBorder: "hover:border-indigo-300 dark:hover:border-indigo-700",
    status: "Active",
    href: "/tools/shadow-generator",
  },
  {
    id: "safe-link",
    title: "Safe-Link Encoder",
    category: "Security",
    description:
      "Obfuscate links to hide them from bots and scrapers using browser-native encoding.",
    icon: <Lock className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />,
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    hoverBorder: "hover:border-indigo-300 dark:hover:border-indigo-700",
    status: "Active",
    href: "/tools/safe-link",
  },
  {
    id: "markdown-lab",
    title: "Markdown Lab",
    category: "Developer",
    description:
      "Real-time Markdown editor with live HTML preview and sanitization.",
    icon: <FileEdit className="w-7 h-7 text-orange-600 dark:text-orange-400" />,
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    hoverBorder: "hover:border-orange-300 dark:hover:border-orange-700",
    status: "Active",
    href: "/tools/markdown-lab",
  },
  {
    id: "image-compressor",
    title: "Image Compressor",
    category: "Design",
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
  {
    id: "unit-pro",
    title: "Unit Converter Pro",
    category: "Developer",
    description:
      "Advanced conversion for web units (PX/REM), digital storage, and physical length.",
    icon: (
      <ArrowRightLeft className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
    ),
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-700",
    status: "Active",
    href: "/tools/unit-pro",
  },
  {
    id: "pdf-surgeon",
    title: "PDF Surgeon",
    category: "Developer",
    description:
      "Merge multiple documents or extract specific pages with pinpoint precision.",
    icon: <Scissors className="w-7 h-7 text-red-600 dark:text-red-400" />,
    bgColor: "bg-red-100 dark:bg-red-900/30",
    hoverBorder: "hover:border-red-300 dark:hover:border-red-700",
    status: "Active",
    href: "/tools/pdf-surgeon",
  },
  {
    id: "secret-shield",
    title: "Secret Shield",
    category: "Security",
    description: "Military-grade AES-256 encryption. Secure any file locally.",
    icon: <ShieldCheck className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />,
    bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    hoverBorder: "hover:border-cyan-300 dark:hover:border-cyan-700",
    status: "Active",
    href: "/tools/secret-shield",
  },
  {
    id: "voice-notes",
    title: "Voice Notes",
    category: "Developer",
    description: "Convert speech to text instantly using OpenAI's Whisper AI.",
    icon: <Mic className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />,
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    hoverBorder: "hover:border-indigo-300 dark:hover:border-indigo-700",
    status: "Active",
    href: "/tools/voice-notes",
  },
  {
    id: "color-palette",
    title: "Color Palette",
    category: "Design",
    description:
      "Extract the most dominant and beautiful colors from any photograph.",
    icon: <Palette className="w-7 h-7 text-pink-600 dark:text-pink-400" />,
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
    hoverBorder: "hover:border-pink-300 dark:hover:border-pink-700",
    status: "Active",
    href: "/tools/color-palette",
  },
  {
    id: "cron-visualizer",
    title: "Cron Visualizer",
    category: "Developer",
    description:
      "Convert cryptic cron expressions into human-readable sentences and schedules.",
    icon: <Clock className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />,
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    hoverBorder: "hover:border-indigo-300 dark:hover:border-indigo-700",
    status: "Active",
    href: "/tools/cron-visualizer",
  },
];
