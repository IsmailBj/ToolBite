// lib/schema.ts

interface SchemaProps {
  name: string;
  description: string;
  url: string;
  category:
    | "MultimediaApplication"
    | "UtilitiesApplication"
    | "DeveloperApplication"
    | "WebApplication";
  features?: string[];
  locale?: string;
  image?: string;
}

export function constructJSONLD({
  name,
  description,
  url,
  category,
  features,
  locale = "en",
  image,
}: SchemaProps) {
  // Fallback defaults for GEO trust signals
  const defaultFeatures = [
    "Free online tool",
    "Fast processing in the browser",
    "No registration required",
    "Privacy-focused local processing",
  ];

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: name,
    description: description,
    url: url,
    applicationCategory: category,
    operatingSystem: "Browser",
    inLanguage: locale,
    publisher: {
      "@id": "https://toolbite.space/#organization", // Stronger linking
      "@type": "Organization",
      name: "ToolBite",
      url: "https://toolbite.space",
    },
    // Spread operator for image is perfect
    ...(image && { image }),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    // CRITICAL: Join the array into a string.
    // AI engines use this to create the "Key Features" bullet points in search results.
    featureList:
      features && features.length > 0
        ? features.join(", ")
        : defaultFeatures.join(", "),
  };
}
