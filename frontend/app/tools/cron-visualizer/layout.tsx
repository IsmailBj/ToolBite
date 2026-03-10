import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Cron Visualizer",
  description:
    "Convert cryptic cron expressions into human-readable sentences and schedules.",
  path: "/tools/cron-visualizer",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
