import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "UA Inspector",
  description:
    "Detect and parse User-Agent strings to identify browsers, OS, and hardware details.",
  path: "/tools/ua-inspector",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
