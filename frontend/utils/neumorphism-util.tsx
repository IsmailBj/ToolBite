export type NeumorphismShape = "flat" | "pressed" | "convex" | "concave";

export interface NeumorphismConfig {
  baseColor: string;
  distance: number;
  blur: number;
  intensity: number;
  shape: NeumorphismShape;
}

// Helper to adjust hex color brightness
function adjustColor(hex: string, intensity: number): string {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3)
    hex = hex
      .split("")
      .map((x) => x + x)
      .join("");

  const r = Math.max(
    0,
    Math.min(255, parseInt(hex.slice(0, 2), 16) + intensity),
  );
  const g = Math.max(
    0,
    Math.min(255, parseInt(hex.slice(2, 4), 16) + intensity),
  );
  const b = Math.max(
    0,
    Math.min(255, parseInt(hex.slice(4, 6), 16) + intensity),
  );

  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

export function generateNeumorphismCss(config: NeumorphismConfig): string {
  const { baseColor, distance, blur, intensity, shape } = config;

  const lightColor = adjustColor(baseColor, intensity * 2.5);
  const darkColor = adjustColor(baseColor, -intensity * 2.5);

  let boxShadow = "";
  let background = baseColor;

  switch (shape) {
    case "flat":
      boxShadow = `${distance}px ${distance}px ${blur}px ${darkColor}, -${distance}px -${distance}px ${blur}px ${lightColor}`;
      break;
    case "pressed":
      boxShadow = `inset ${distance}px ${distance}px ${blur}px ${darkColor}, inset -${distance}px -${distance}px ${blur}px ${lightColor}`;
      break;
    case "convex":
      background = `linear-gradient(145deg, ${lightColor}, ${darkColor})`;
      boxShadow = `${distance}px ${distance}px ${blur}px ${darkColor}, -${distance}px -${distance}px ${blur}px ${lightColor}`;
      break;
    case "concave":
      background = `linear-gradient(145deg, ${darkColor}, ${lightColor})`;
      boxShadow = `${distance}px ${distance}px ${blur}px ${darkColor}, -${distance}px -${distance}px ${blur}px ${lightColor}`;
      break;
  }

  return `.neu-element {\n  border-radius: 50px;\n  background: ${background};\n  box-shadow: ${boxShadow};\n}`;
}
