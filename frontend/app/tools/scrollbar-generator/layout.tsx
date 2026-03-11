import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Custom Scrollbar Generator",
  description:
    "Visual editor to style Webkit scrollbars including track, thumb, and hover states.",
  path: "/tools/scrollbar-generator",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
