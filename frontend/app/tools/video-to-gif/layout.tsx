import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Video to GIF",
  description:
    "Convert video clips into high-quality, shareable animated GIFs.",
  path: "/tools/video-to-gif",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
