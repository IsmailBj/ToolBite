// utils/color-util.ts

export interface ColorResult {
  hex: string;
  rgb: string;
}

export async function extractPalette(
  file: File,
  colorCount: number = 6,
): Promise<ColorResult[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Could not get canvas context");

      // Scale down for performance
      const scale = Math.min(1, 200 / Math.max(img.width, img.height));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      ).data;

      const colors = getDominantColors(imageData, colorCount);
      resolve(colors);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function getDominantColors(
  data: Uint8ClampedArray,
  count: number,
): ColorResult[] {
  const pixelArray = [];
  for (let i = 0; i < data.length; i += 40) {
    // Sample every 10th pixel for speed
    pixelArray.push([data[i], data[i + 1], data[i + 2]]);
  }

  // Simple bucket-based quantization
  const buckets: Record<string, number> = {};
  pixelArray.forEach(([r, g, b]) => {
    // Round to reduce noise
    const key = `${Math.round(r / 10) * 10},${Math.round(g / 10) * 10},${Math.round(b / 10) * 10}`;
    buckets[key] = (buckets[key] || 0) + 1;
  });

  return Object.keys(buckets)
    .sort((a, b) => buckets[b] - buckets[a])
    .slice(0, count)
    .map((key) => {
      const [r, g, b] = key.split(",").map(Number);
      return {
        hex: rgbToHex(r, g, b),
        rgb: `rgb(${r}, ${g}, ${b})`,
      };
    });
}

const rgbToHex = (r: number, g: number, b: number) =>
  "#" +
  [r, g, b]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
