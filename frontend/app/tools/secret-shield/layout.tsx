import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Secret Shield",
  description: "Military-grade AES-256 encryption. Secure any file locally.",
  path: "/tools/secret-shield",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
