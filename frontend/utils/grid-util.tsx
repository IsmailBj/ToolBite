export interface GridItemConfig {
  id: string;
  colSpan: number;
  rowSpan: number;
}

export interface GridConfig {
  columns: number;
  rows: number;
  gap: number;
  items: GridItemConfig[];
}

export function generateGridCss({
  columns,
  rows,
  gap,
  items,
}: GridConfig): string {
  let css = `.grid-container {\n  display: grid;\n  grid-template-columns: repeat(${columns}, 1fr);\n  grid-template-rows: repeat(${rows}, 1fr);\n  gap: ${gap}px;\n}\n`;

  const spannedItems = items.filter(
    (item) => item.colSpan > 1 || item.rowSpan > 1,
  );

  if (spannedItems.length > 0) {
    css += `\n/* Item specific styles */\n`;
    spannedItems.forEach((item) => {
      css += `.item-${item.id} {\n`;
      if (item.colSpan > 1) css += `  grid-column: span ${item.colSpan};\n`;
      if (item.rowSpan > 1) css += `  grid-row: span ${item.rowSpan};\n`;
      css += `}\n`;
    });
  }

  return css;
}
