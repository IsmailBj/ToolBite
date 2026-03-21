import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Social Previewer",
  description:
    "Live preview and generate Meta Tags for Twitter, Facebook, and LinkedIn cards.",
  path: "/tools/social-previewer",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
