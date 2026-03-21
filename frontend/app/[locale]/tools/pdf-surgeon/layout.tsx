import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "PDF Surgeon",
  description:
    "Merge multiple documents or extract specific pages with pinpoint precision.",
  path: "/tools/pdf-surgeon",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
