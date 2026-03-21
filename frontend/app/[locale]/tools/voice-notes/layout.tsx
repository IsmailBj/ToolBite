import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Voice Notes",
  description: "Convert speech to text instantly using OpenAI's Whisper AI.",
  path: "/tools/voice-notes",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
