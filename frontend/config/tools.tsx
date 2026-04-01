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
  LayoutGrid,
  Crop,
  Layers,
  SlidersVertical,
  TableProperties,
  Fingerprint,
  Maximize,
  Bot,
  Subtitles,
  ScanText,
} from "lucide-react";

export interface Tool {
  id: string;
  title: string;
  category: "Design" | "Security" | "Developer";
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  hoverBorder: string;
  status: "Active" | "Coming Soon";
  href: string;
}

export const getTools = (dict: any): Tool[] => [
  {
    id: "bg-remover",
    title: dict.tools?.bgRemover?.title || "Background Remover",
    category: "Design",
    description:
      dict.tools?.bgRemover?.description ||
      "Instantly strip backgrounds from any image using high-speed AI.",
    icon: <Wand2 className="w-7 h-7 text-blue-600 dark:text-blue-400" />,
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    hoverBorder: "hover:border-blue-300 dark:hover:border-blue-700",
    status: "Active",
    href: "/tools/bg-remover",
  },
  {
    id: "video-subtitles",
    title: dict.tools?.videoSubtitles?.title || "AI Video Subtitles",
    category: "Design",
    description:
      dict.tools?.videoSubtitles?.description ||
      "Auto-generate subtitles (.vtt) for your videos using local browser AI.",
    icon: (
      <Subtitles className="w-7 h-7 text-orange-600 dark:text-orange-400" />
    ),
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    hoverBorder: "hover:border-orange-300 dark:hover:border-orange-700",
    status: "Active",
    href: "/tools/video-subtitles",
  },
  {
    id: "entity-extractor",
    title: dict.tools?.entityExtractor?.title || "AI Entity Extractor",
    category: "Security", // Perfect fit for Security or Developer
    description:
      dict.tools?.entityExtractor?.description ||
      "Find and redact names, locations, and organizations in text.",
    icon: <ScanText className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />,
    bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    hoverBorder: "hover:border-cyan-300 dark:hover:border-cyan-700",
    status: "Active",
    href: "/tools/entity-extractor",
  },
  {
    id: "ai-alt-text",
    title: dict.tools?.aiAltText?.title || "AI Smart Alt-Text",
    category: "Developer",
    description:
      dict.tools?.aiAltText?.description ||
      "Generate perfect SEO-friendly image descriptions instantly using local AI.",
    icon: <Bot className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />,
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    hoverBorder: "hover:border-indigo-300 dark:hover:border-indigo-700",
    status: "Active",
    href: "/tools/ai-alt-text",
  },
  {
    id: "svg-to-png",
    title: dict.tools?.svgToPng?.title || "SVG to PNG Converter",
    category: "Design",
    description:
      dict.tools?.svgToPng?.description ||
      "Instantly convert vector SVG files to transparent PNG images locally.",
    icon: <Shapes className="w-7 h-7 text-violet-600 dark:text-violet-400" />,
    bgColor: "bg-violet-100 dark:bg-violet-900/30",
    hoverBorder: "hover:border-violet-300 dark:hover:border-violet-700",
    status: "Active",
    href: "/tools/svg-to-png",
  },
  {
    id: "neumorphism-generator",
    title: dict.tools?.neumorphism?.title || "Neumorphism Generator",
    category: "Design",
    description:
      dict.tools?.neumorphism?.description ||
      "Generate soft UI hex codes and complex shadow CSS based on a single base color.",
    icon: <Layers className="w-7 h-7 text-blue-600 dark:text-blue-400" />,
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    hoverBorder: "hover:border-blue-300 dark:hover:border-blue-700",
    status: "Active",
    href: "/tools/neumorphism-generator",
  },
  {
    id: "csv-converter",
    title: dict.tools?.csvConverter?.title || "CSV to JSON",
    category: "Developer",
    description:
      dict.tools?.csvConverter?.description ||
      "Parse local CSV data into formatted JSON arrays and visual HTML tables.",
    icon: (
      <TableProperties className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
    ),
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    hoverBorder: "hover:border-indigo-300 dark:hover:border-indigo-700",
    status: "Active",
    href: "/tools/csv-converter",
  },
  {
    id: "scrollbar-generator",
    title: dict.tools?.scrollbar?.title || "Custom Scrollbar",
    category: "Design",
    description:
      dict.tools?.scrollbar?.description ||
      "Visual editor to style Webkit scrollbars including track, thumb, and hover states.",
    icon: (
      <SlidersVertical className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
    ),
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-700",
    status: "Active",
    href: "/tools/scrollbar-generator",
  },
  {
    id: "video-to-gif",
    title: dict.tools?.videoToGif?.title || "Video to GIF",
    category: "Design",
    description:
      dict.tools?.videoToGif?.description ||
      "Convert video clips into high-quality, shareable animated GIFs.",
    icon: <Film className="w-7 h-7 text-purple-600 dark:text-purple-400" />,
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    hoverBorder: "hover:border-purple-300 dark:hover:border-purple-700",
    status: "Active",
    href: "/tools/video-to-gif",
  },
  {
    id: "clip-path-maker",
    title: dict.tools?.clipPathMaker?.title || "CSS Clip-Path Maker",
    category: "Design",
    description:
      dict.tools?.clipPathMaker?.description ||
      "Drag polygon points to create custom shapes and output the clip-path CSS property.",
    icon: <Crop className="w-7 h-7 text-orange-600 dark:text-orange-400" />,
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    hoverBorder: "hover:border-orange-300 dark:hover:border-orange-700",
    status: "Active",
    href: "/tools/clip-path-maker",
  },
  {
    id: "grid-builder",
    title: dict.tools?.gridBuilder?.title || "CSS Grid Builder",
    category: "Design",
    description:
      dict.tools?.gridBuilder?.description ||
      "Visual interface to define columns, rows, and gaps, instantly exporting CSS grid code.",
    icon: <LayoutGrid className="w-7 h-7 text-pink-600 dark:text-pink-400" />,
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
    hoverBorder: "hover:border-pink-300 dark:hover:border-pink-700",
    status: "Active",
    href: "/tools/grid-builder",
  },
  {
    id: "blob-generator",
    title: dict.tools?.blobGenerator?.title || "Blob Shape Generator",
    category: "Design",
    description:
      dict.tools?.blobGenerator?.description ||
      "Generate fluid, organic SVG blob shapes for modern web layouts and backgrounds.",
    icon: <Shapes className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />,
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    hoverBorder: "hover:border-indigo-300 dark:hover:border-indigo-700",
    status: "Active",
    href: "/tools/blob-generator",
  },
  {
    id: "fingerprint-checker",
    title:
      dict.tools?.fingerprintChecker?.title || "Browser Fingerprint Checker",
    category: "Security",
    description:
      dict.tools?.fingerprintChecker?.description ||
      "Discover your unique browser footprint and see how websites track you.",
    icon: (
      <Fingerprint className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
    ),
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-700",
    status: "Active",
    href: "/tools/fingerprint-checker",
  },
  {
    id: "image-resizer",
    title: dict.tools?.imageResizer?.title || "Image Resizer",
    category: "Design",
    description:
      dict.tools?.imageResizer?.description ||
      "Resize images locally in your browser without losing quality.",
    icon: <Maximize className="w-7 h-7 text-blue-600 dark:text-blue-400" />,
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    hoverBorder: "hover:border-blue-300 dark:hover:border-blue-700",
    status: "Active",
    href: "/tools/image-resizer",
  },
  {
    id: "social-previewer",
    title: dict.tools?.socialPreviewer?.title || "Social Previewer",
    category: "Design",
    description:
      dict.tools?.socialPreviewer?.description ||
      "Live preview and generate Meta Tags for Twitter, Facebook, and LinkedIn cards.",
    icon: <Globe className="w-7 h-7 text-blue-600 dark:text-blue-400" />,
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    hoverBorder: "hover:border-blue-300 dark:hover:border-blue-700",
    status: "Active",
    href: "/tools/social-previewer",
  },
  {
    id: "ua-inspector",
    title: dict.tools?.uaInspector?.title || "UA Inspector",
    category: "Developer",
    description:
      dict.tools?.uaInspector?.description ||
      "Detect and parse User-Agent strings to identify browsers, OS, and hardware details.",
    icon: <Search className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />,
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    hoverBorder: "hover:border-indigo-300 dark:hover:border-indigo-700",
    status: "Active",
    href: "/tools/ua-inspector",
  },
  {
    id: "shadow-generator",
    title: dict.tools?.shadowGenerator?.title || "Shadow Palette Generator",
    category: "Design",
    description:
      dict.tools?.shadowGenerator?.description ||
      "Create smooth, multi-layered CSS shadows for natural-looking UI elements.",
    icon: <Box className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />,
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    hoverBorder: "hover:border-indigo-300 dark:hover:border-indigo-700",
    status: "Active",
    href: "/tools/shadow-generator",
  },
  {
    id: "safe-link",
    title: dict.tools?.safeLink?.title || "Safe-Link Encoder",
    category: "Security",
    description:
      dict.tools?.safeLink?.description ||
      "Obfuscate links to hide them from bots and scrapers using browser-native encoding.",
    icon: <Lock className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />,
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    hoverBorder: "hover:border-indigo-300 dark:hover:border-indigo-700",
    status: "Active",
    href: "/tools/safe-link",
  },
  {
    id: "markdown-lab",
    title: dict.tools?.markdownLab?.title || "Markdown Lab",
    category: "Developer",
    description:
      dict.tools?.markdownLab?.description ||
      "Real-time Markdown editor with live HTML preview and sanitization.",
    icon: <FileEdit className="w-7 h-7 text-orange-600 dark:text-orange-400" />,
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    hoverBorder: "hover:border-orange-300 dark:hover:border-orange-700",
    status: "Active",
    href: "/tools/markdown-lab",
  },
  {
    id: "image-compressor",
    title: dict.tools?.imageCompressor?.title || "Image Compressor",
    category: "Design",
    description:
      dict.tools?.imageCompressor?.description ||
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
    title: dict.tools?.unitPro?.title || "Unit Converter Pro",
    category: "Developer",
    description:
      dict.tools?.unitPro?.description ||
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
    title: dict.tools?.pdfSurgeon?.title || "PDF Surgeon",
    category: "Developer",
    description:
      dict.tools?.pdfSurgeon?.description ||
      "Merge multiple documents or extract specific pages with pinpoint precision.",
    icon: <Scissors className="w-7 h-7 text-red-600 dark:text-red-400" />,
    bgColor: "bg-red-100 dark:bg-red-900/30",
    hoverBorder: "hover:border-red-300 dark:hover:border-red-700",
    status: "Active",
    href: "/tools/pdf-surgeon",
  },
  {
    id: "secret-shield",
    title: dict.tools?.secretShield?.title || "Secret Shield",
    category: "Security",
    description:
      dict.tools?.secretShield?.description ||
      "Military-grade AES-256 encryption. Secure any file locally.",
    icon: <ShieldCheck className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />,
    bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    hoverBorder: "hover:border-cyan-300 dark:hover:border-cyan-700",
    status: "Active",
    href: "/tools/secret-shield",
  },
  {
    id: "voice-notes",
    title: dict.tools?.voiceNotes?.title || "Voice Notes",
    category: "Developer",
    description:
      dict.tools?.voiceNotes?.description ||
      "Convert speech to text instantly using OpenAI's Whisper AI.",
    icon: <Mic className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />,
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    hoverBorder: "hover:border-indigo-300 dark:hover:border-indigo-700",
    status: "Active",
    href: "/tools/voice-notes",
  },
  {
    id: "color-palette",
    title: dict.tools?.colorPalette?.title || "Color Palette",
    category: "Design",
    description:
      dict.tools?.colorPalette?.description ||
      "Extract the most dominant and beautiful colors from any photograph.",
    icon: <Palette className="w-7 h-7 text-pink-600 dark:text-pink-400" />,
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
    hoverBorder: "hover:border-pink-300 dark:hover:border-pink-700",
    status: "Active",
    href: "/tools/color-palette",
  },
  {
    id: "cron-visualizer",
    title: dict.tools?.cronVisualizer?.title || "Cron Visualizer",
    category: "Developer",
    description:
      dict.tools?.cronVisualizer?.description ||
      "Convert cryptic cron expressions into human-readable sentences and schedules.",
    icon: <Clock className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />,
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    hoverBorder: "hover:border-indigo-300 dark:hover:border-indigo-700",
    status: "Active",
    href: "/tools/cron-visualizer",
  },
];
