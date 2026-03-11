export interface ScrollbarConfig {
  width: number;
  trackColor: string;
  thumbColor: string;
  thumbHoverColor: string;
  borderRadius: number;
  padding: number;
}

export function generateScrollbarCss(config: ScrollbarConfig): string {
  const {
    width,
    trackColor,
    thumbColor,
    thumbHoverColor,
    borderRadius,
    padding,
  } = config;

  let thumbStyles = `  background-color: ${thumbColor};\n  border-radius: ${borderRadius}px;`;

  // Apply background-clip and border to create the "floating" track effect
  if (padding > 0) {
    thumbStyles += `\n  border: ${padding}px solid transparent;\n  background-clip: padding-box;`;
  }

  return `/* Chrome, Edge, Safari */
.custom-scroll::-webkit-scrollbar {
  width: ${width}px;
  height: ${width}px; /* Horizontal scrollbar height */
}

.custom-scroll::-webkit-scrollbar-track {
  background: ${trackColor};
  border-radius: ${borderRadius}px;
}

.custom-scroll::-webkit-scrollbar-thumb {
${thumbStyles}
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background-color: ${thumbHoverColor};
}

/* Firefox */
.custom-scroll {
  scrollbar-width: ${width <= 10 ? "thin" : "auto"};
  scrollbar-color: ${thumbColor} ${trackColor};
}`;
}
