// utils/shadow-util.ts

export interface ShadowLayer {
  blur: number;
  spread: number;
  opacity: number;
  y: number;
}

// Helper: Convert HEX to RGB string "R, G, B"
function hexToRgb(hex: string): string | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return `${r}, ${g}, ${b}`;
}

export function generateSmoothShadow(
  count: number,
  blurStrength: number,
  transparency: number,
  hexColor: string = "#000000", // New parameter
): string {
  const layers: string[] = [];
  const rgbColor = hexToRgb(hexColor) || "0, 0, 0"; // Fallback to black

  for (let i = 1; i <= count; i++) {
    // Exponentially increase blur and Y-offset for a natural falloff
    const blur = Math.pow(i, 2) * blurStrength;
    const y = i * (blurStrength * 0.5);

    // Decreasing opacity for further layers, scaled by max transparency
    const opacity = (transparency / Math.pow(i, 1.2)).toFixed(3);

    layers.push(`0px ${y}px ${blur}px rgba(${rgbColor}, ${opacity})`);
  }

  return layers.join(", ");
}
