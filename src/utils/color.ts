/**
 * Converts RGB to HSL and returns hue in degrees [0, 360)
 */
function rgbToHue(r: number, g: number, b: number): number {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;

  if (max === min) {
    return h;
  } else {
    const d = max - min;
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  return h; // [0, 360)
}

/**
 * Computes the smallest difference between two hues (in degrees)
 * Result is in range [0, 180]
 */
function hueDifference(hue1: number, hue2: number): number {
  const diff = Math.abs(hue1 - hue2);
  return Math.min(diff, 360 - diff);
}

// Helper: parse CSS-style hex or rgb strings (optional)
function parseColor(colorStr: string): { r: number; g: number; b: number } {
  // Handle "#rgb" or "#rrggbb"
  if (colorStr.startsWith("#")) {
    let hex = colorStr.slice(1);
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return { r, g, b };
  }
  // Handle "rgb(r, g, b)"
  if (colorStr.startsWith("rgb")) {
    const match = colorStr.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
      };
    }
  }
  throw new Error("Unsupported color format");
}

export function rgbStringHueDifference(color1: string, color2: string): number {
  const { r: r1, g: g1, b: b1 } = parseColor(color1);
  const { r: r2, g: g2, b: b2 } = parseColor(color2);
  const hue1 = rgbToHue(r1, g1, b1);
  const hue2 = rgbToHue(r2, g2, b2);
  return hueDifference(hue1, hue2);
}
