import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Shadow Palette Generator",
  description:
    "Create smooth, multi-layered CSS shadows for natural-looking UI elements.",
  path: "/tools/shadow-generator",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
