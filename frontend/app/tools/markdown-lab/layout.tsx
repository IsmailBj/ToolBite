import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Markdown Lab",
  description:
    "Real-time Markdown editor with live HTML preview and sanitization.",
  path: "/tools/markdown-lab",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
