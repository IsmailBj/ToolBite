// utils/blob-util.ts

export interface BlobOptions {
  size: number;
  growth: number;
  edges: number;
  seed: number;
}

export function generateBlobPath(options: BlobOptions): string {
  const { size, growth, edges, seed } = options;
  const center = size / 2;
  const radius = center * 0.8;
  const slice = (Math.PI * 2) / edges;
  const points: { x: number; y: number }[] = [];

  // Simple pseudo-random generator based on seed
  const random = (i: number) => {
    const x = Math.sin(seed + i) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 0; i < edges; i++) {
    const angle = i * slice;
    const r = radius - random(i) * growth;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    points.push({ x, y });
  }

  return createSmoothPath(points);
}

function createSmoothPath(points: { x: number; y: number }[]): string {
  const n = points.length;
  if (n < 3) return "";

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < n; i++) {
    const p0 = points[i === 0 ? n - 1 : i - 1];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];

    // Catmull-Rom to Cubic Bezier conversion
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return path + " Z";
}
