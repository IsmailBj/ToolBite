import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Blob Shape Generator",
  description:
    "Generate fluid, organic SVG blob shapes for modern web layouts and backgrounds.",
  path: "/tools/blob-generator",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
