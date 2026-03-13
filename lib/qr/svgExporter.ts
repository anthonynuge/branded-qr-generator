import { buildFinderSet, getAlignmentCenters } from './finderPatterns';
import { getLuminance } from '../color/colorUtils';
import type { RenderPayload } from './canvasRenderer';

export function exportAsSVG(payload: RenderPayload): string {
  const { matrix, logoImage, options } = payload;
  const { moduleSize, dotStyle, dotScale, bgColor, finderColor } = options;
  const { data, size } = matrix;

  const canvasSize = size * moduleSize;
  const dotPx = moduleSize * dotScale;
  const dotOff = (moduleSize - dotPx) / 2;
  const dr = dotStyle !== 'square' ? dotPx * 0.3 : 0;

  // Capture logo pixels the same way canvasRenderer does
  let pixelData: Uint8ClampedArray | null = null;
  let logoDataUrl: string | null = null;
  if (logoImage && typeof document !== 'undefined') {
    const tmp = document.createElement('canvas');
    tmp.width = canvasSize;
    tmp.height = canvasSize;
    const tCtx = tmp.getContext('2d')!;
    tCtx.drawImage(logoImage, 0, 0, canvasSize, canvasSize);
    pixelData = tCtx.getImageData(0, 0, canvasSize, canvasSize).data;
    logoDataUrl = tmp.toDataURL('image/png');
  }

  const finderSet = buildFinderSet(size);
  const els: string[] = [];

  // Background + optional embedded logo
  els.push(`<rect width="${canvasSize}" height="${canvasSize}" fill="${bgColor}"/>`);
  if (logoDataUrl) {
    els.push(`<image href="${logoDataUrl}" width="${canvasSize}" height="${canvasSize}"/>`);
  }

  // Data modules — same logic as canvasRenderer
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (finderSet.has(`${row},${col}`)) continue;

      const isModuleDark = data[row][col];
      const x = col * moduleSize;
      const y = row * moduleSize;

      let fill: string | null = null;

      if (pixelData) {
        const cx = Math.min(Math.floor(x + moduleSize / 2), canvasSize - 1);
        const cy = Math.min(Math.floor(y + moduleSize / 2), canvasSize - 1);
        const idx = (cy * canvasSize + cx) * 4;
        const lum = getLuminance(pixelData[idx], pixelData[idx + 1], pixelData[idx + 2]);

        if (isModuleDark && lum > 0.5) fill = finderColor;
        else if (!isModuleDark && lum <= 0.5) fill = bgColor;
      } else {
        if (isModuleDark) fill = finderColor;
      }

      if (fill === null) continue;

      const dx = x + dotOff;
      const dy = y + dotOff;

      if (dotStyle === 'circle') {
        els.push(`<circle cx="${dx + dotPx / 2}" cy="${dy + dotPx / 2}" r="${dotPx / 2}" fill="${fill}"/>`);
      } else {
        els.push(`<rect x="${dx}" y="${dy}" width="${dotPx}" height="${dotPx}" rx="${dr}" ry="${dr}" fill="${fill}"/>`);
      }
    }
  }

  // Finder patterns
  const s = moduleSize;
  const fr = dotStyle !== 'square' ? s * 0.6 : 0;
  for (const [frow, fcol] of [[0, 0], [0, size - 7], [size - 7, 0]] as Array<[number, number]>) {
    const fx = fcol * s, fy = frow * s;
    els.push(`<rect x="${fx}" y="${fy}" width="${7*s}" height="${7*s}" rx="${fr}" fill="${finderColor}"/>`);
    els.push(`<rect x="${fx+s}" y="${fy+s}" width="${5*s}" height="${5*s}" rx="${fr*0.6}" fill="${bgColor}"/>`);
    els.push(`<rect x="${fx+2*s}" y="${fy+2*s}" width="${3*s}" height="${3*s}" rx="${fr*0.4}" fill="${finderColor}"/>`);
  }

  // Alignment patterns
  const ar = dotStyle !== 'square' ? s * 0.4 : 0;
  for (const [acRow, acCol] of getAlignmentCenters(size)) {
    const ax = (acCol - 2) * s, ay = (acRow - 2) * s;
    els.push(`<rect x="${ax}" y="${ay}" width="${5*s}" height="${5*s}" rx="${ar}" fill="${finderColor}"/>`);
    els.push(`<rect x="${ax+s}" y="${ay+s}" width="${3*s}" height="${3*s}" rx="${ar*0.5}" fill="${bgColor}"/>`);
    els.push(`<rect x="${ax+2*s}" y="${ay+2*s}" width="${s}" height="${s}" rx="${ar*0.3}" fill="${finderColor}"/>`);
  }

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${canvasSize} ${canvasSize}" width="${canvasSize}" height="${canvasSize}">`,
    ...els,
    '</svg>',
  ].join('\n');
}
