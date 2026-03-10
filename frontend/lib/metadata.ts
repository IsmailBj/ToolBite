import { Metadata } from "next";

interface MetadataProps {
  title: string;
  description: string;
  path: string;
  image?: string;
}

export function constructMetadata({
  title,
  description,
  path,
  image,
}: MetadataProps): Metadata {
  const baseUrl = "https://toolbite.space";
  const url = `${baseUrl}${path}`;

  // Dynamically generate the image URL using the tool's title
  // encodeURIComponent ensures spaces and special characters are URL-safe
  const ogImageUrl =
    image || `${baseUrl}/api/og?title=${encodeURIComponent(title)}`;

  return {
    title: `${title} | Utility Workspace`,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Utility Workspace",
      type: "website",
      images: [{ url: ogImageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
    },
  };
}
