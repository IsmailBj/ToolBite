export type ShapeType = "polygon" | "circle" | "ellipse" | "inset";

export interface ClipPoint {
  id: string;
  x: number;
  y: number;
}

export interface ClipState {
  type: ShapeType;
  polygonPoints: ClipPoint[];
  circleRadius: number;
  circleX: number;
  circleY: number;
  ellipseRx: number;
  ellipseRy: number;
  ellipseX: number;
  ellipseY: number;
  insetTop: number;
  insetRight: number;
  insetBottom: number;
  insetLeft: number;
}

export function generateClipPathCss(state: ClipState): string {
  let value = "";
  switch (state.type) {
    case "polygon":
      const args = state.polygonPoints.map((p) => `${p.x}% ${p.y}%`).join(", ");
      value = `polygon(${args})`;
      break;
    case "circle":
      value = `circle(${state.circleRadius}% at ${state.circleX}% ${state.circleY}%)`;
      break;
    case "ellipse":
      value = `ellipse(${state.ellipseRx}% ${state.ellipseRy}% at ${state.ellipseX}% ${state.ellipseY}%)`;
      break;
    case "inset":
      value = `inset(${state.insetTop}% ${state.insetRight}% ${state.insetBottom}% ${state.insetLeft}%)`;
      break;
  }
  return `.clip-shape {\n  clip-path: ${value};\n}`;
}

export const presetShapes: Record<string, ClipPoint[]> = {
  Triangle: [
    { id: "p1", x: 50, y: 0 },
    { id: "p2", x: 0, y: 100 },
    { id: "p3", x: 100, y: 100 },
  ],
  Rhombus: [
    { id: "p1", x: 50, y: 0 },
    { id: "p2", x: 100, y: 50 },
    { id: "p3", x: 50, y: 100 },
    { id: "p4", x: 0, y: 50 },
  ],
  Hexagon: [
    { id: "p1", x: 25, y: 0 },
    { id: "p2", x: 75, y: 0 },
    { id: "p3", x: 100, y: 50 },
    { id: "p4", x: 75, y: 100 },
    { id: "p5", x: 25, y: 100 },
    { id: "p6", x: 0, y: 50 },
  ],
};
