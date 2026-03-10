import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Unit Converter Pro",
  description:
    "Advanced conversion for web units (PX/REM), digital storage, and physical length.",
  path: "/tools/unit-pro",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
