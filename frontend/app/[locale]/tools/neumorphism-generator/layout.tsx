import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Neumorphism Generator",
  description:
    "Generate soft UI hex codes and complex shadow CSS based on a single base color.",
  path: "/tools/neumorphism-generator",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
