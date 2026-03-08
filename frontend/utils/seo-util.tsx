// utils/seo-util.ts

export interface SEOData {
  title: string;
  description: string;
  image: string;
  url: string;
}

export function generateMetaTags(data: SEOData): string {
  return `
<title>${data.title}</title>
<meta name="title" content="${data.title}">
<meta name="description" content="${data.description}">

<meta property="og:type" content="website">
<meta property="og:url" content="${data.url}">
<meta property="og:title" content="${data.title}">
<meta property="og:description" content="${data.description}">
<meta property="og:image" content="${data.image}">

<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${data.url}">
<meta property="twitter:title" content="${data.title}">
<meta property="twitter:description" content="${data.description}">
<meta property="twitter:image" content="${data.image}">
  `.trim();
}
