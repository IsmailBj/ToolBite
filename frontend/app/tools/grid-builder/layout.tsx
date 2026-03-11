import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "CSS Grid Builder",
  description:
    "Visual interface to define columns, rows, and gaps, instantly exporting CSS grid code.",
  path: "/tools/grid-builder",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
