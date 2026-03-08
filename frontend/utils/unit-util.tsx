// utils/unit-util.ts

export const CONVERSION_DATA = {
  storage: {
    units: ["B", "KB", "MB", "GB", "TB"],
    base: 1024,
  },
  design: {
    units: ["PX", "REM"],
    base: 16, // Standard 16px = 1rem
  },
  length: {
    units: ["mm", "cm", "m", "km", "in", "ft", "yd", "mi"],
    // Conversion to meters
    toMeter: {
      mm: 0.001,
      cm: 0.01,
      m: 1,
      km: 1000,
      in: 0.0254,
      ft: 0.3048,
      yd: 0.9144,
      mi: 1609.34,
    },
  },
};

export function convertUnits(
  value: number,
  from: string,
  to: string,
  category: string,
): number {
  if (from === to) return value;

  if (category === "design") {
    return from === "PX" ? value / 16 : value * 16;
  }

  if (category === "storage") {
    const units = CONVERSION_DATA.storage.units;
    const fromIndex = units.indexOf(from);
    const toIndex = units.indexOf(to);
    return value * Math.pow(1024, fromIndex - toIndex);
  }

  if (category === "length") {
    const rates = CONVERSION_DATA.length.toMeter as any;
    const meters = value * rates[from];
    return meters / rates[to];
  }

  return value;
}
