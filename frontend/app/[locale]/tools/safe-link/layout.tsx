import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Safe-Link Encoder",
  description:
    "Obfuscate links to hide them from bots and scrapers using browser-native encoding.",
  path: "/tools/safe-link",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
