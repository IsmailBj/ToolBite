import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Color Palette",
  description:
    "Extract the most dominant and beautiful colors from any photograph.",
  path: "/tools/color-palette",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
