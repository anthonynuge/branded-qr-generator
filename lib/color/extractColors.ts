import ColorThief from 'color-thief-browser';
import type { ExtractedPalette } from '@/types';

const thief = new ColorThief();

export function extractColors(img: HTMLImageElement): ExtractedPalette {
  const dominant = thief.getColor(img) as [number, number, number];
  const palette = thief.getPalette(img, 7) as Array<[number, number, number]>;
  // Remove the dominant from palette to avoid duplication, take up to 6
  const filtered = palette.filter(
    (c) => !(c[0] === dominant[0] && c[1] === dominant[1] && c[2] === dominant[2])
  ).slice(0, 6);

  return { dominant, palette: filtered };
}
