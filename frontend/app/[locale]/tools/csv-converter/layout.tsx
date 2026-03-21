import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "CSV to JSON Converter",
  description:
    "Parse local CSV data into formatted JSON arrays and visual HTML tables instantly in your browser.",
  path: "/tools/csv-converter",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
