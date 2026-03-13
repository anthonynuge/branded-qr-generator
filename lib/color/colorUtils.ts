/**
 * Ensures a sampled color is dark enough to be visible as a QR module.
 * If luminance > 0.5, blends 60% toward the dominant brand color.
 */
export function ensureDarkEnough(
  r: number,
  g: number,
  b: number,
  dominant: [number, number, number]
): [number, number, number] {
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  if (lum > 0.5) {
    const blend = 0.6;
    return [
      Math.round(r * (1 - blend) + dominant[0] * blend),
      Math.round(g * (1 - blend) + dominant[1] * blend),
      Math.round(b * (1 - blend) + dominant[2] * blend),
    ];
  }
  return [r, g, b];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const n = parseInt(clean, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function getLuminance(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
