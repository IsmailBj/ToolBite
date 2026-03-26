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

  const rawPath = path.replace(/^\/[a-z]{2}(\/|$)/, "/");
  const url = `${baseUrl}${path}`;

  const ogImageUrl =
    image || `${baseUrl}/api/og?title=${encodeURIComponent(title)}`;

  // Define your supported locales here in one place
  const supportedLocales = ["en", "es", "fr", "de", "pl", "ru"];

  const languages: Record<string, string> = {
    "x-default": `${baseUrl}/en${rawPath}`,
  };

  supportedLocales.forEach((locale) => {
    // Map the locale to the correct URL
    // rawPath already starts with a "/", so we join carefully
    languages[locale] =
      `${baseUrl}/${locale}${rawPath.startsWith("/") ? rawPath : "/" + rawPath}`;
  });

  return {
    title: `${title} | ToolBite`,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "ToolBite",
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
      languages: languages,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
