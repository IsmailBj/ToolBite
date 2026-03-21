import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "CSS Clip-Path Maker",
  description:
    "Drag polygon points to create custom shapes and output the clip-path CSS property.",
  path: "/tools/clip-path-maker",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
