import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Background Remover",
  description:
    "Instantly strip backgrounds from any image using high-speed AI.",
  path: "/tools/bg-remover",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
