import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Image Compressor",
  description:
    "Shrink image file sizes by up to 80% without losing visual quality.",
  path: "/tools/image-compressor",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
