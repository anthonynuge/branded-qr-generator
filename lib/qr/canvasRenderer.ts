import { buildFinderSet, getAlignmentCenters } from './finderPatterns';
import { getLuminance } from '../color/colorUtils';
import type { QRMatrix } from './generateMatrix';
import type { QRRenderOptions } from '@/types';

export interface RenderPayload {
  matrix: QRMatrix;
  logoImage: HTMLImageElement | null;
  options: QRRenderOptions;
  dominant: [number, number, number];
}

/**
 * Render algorithm: logo is the background.
 *
 * For each module we only draw when the logo's luminance would mislead
 * the QR scanner — otherwise the logo color already conveys the right
 * dark/light value and we leave it untouched.
 *
 *  dark module + dark logo  → nothing  (logo = dark ✓)
 *  dark module + light logo → draw finderColor dot  (make it dark ✓)
 *  light module + light logo → nothing  (logo = light ✓)
 *  light module + dark logo → draw bgColor dot  (punch a light hole ✓)
 *
 * This keeps >70% of modules correct even at lower dot-scale values,
 * well within EC-H's 30% damage tolerance.
 */
export function renderQRToCanvas(
  canvas: HTMLCanvasElement,
  payload: RenderPayload
): void {
  const { matrix, logoImage, options } = payload;
  const { moduleSize, dotStyle, dotScale, bgColor, finderColor } = options;
  const { data, size } = matrix;

  const canvasSize = size * moduleSize;
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  const ctx = canvas.getContext('2d')!;

  // Step 1: Fill background colour
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Step 2: Draw logo as full-canvas background; capture pixel snapshot
  let pixelData: Uint8ClampedArray | null = null;
  if (logoImage) {
    ctx.drawImage(logoImage, 0, 0, canvasSize, canvasSize);
    pixelData = ctx.getImageData(0, 0, canvasSize, canvasSize).data;
  }

  // Step 3: Structural module set — rendered explicitly later
  const finderSet = buildFinderSet(size);

  // Step 4: Draw data modules
  const dotPx = moduleSize * dotScale;
  const dotOff = (moduleSize - dotPx) / 2;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (finderSet.has(`${row},${col}`)) continue; // handled in steps 5-6

      const isModuleDark = data[row][col];
      const x = col * moduleSize;
      const y = row * moduleSize;

      if (pixelData) {
        const cx = Math.min(Math.floor(x + moduleSize / 2), canvasSize - 1);
        const cy = Math.min(Math.floor(y + moduleSize / 2), canvasSize - 1);
        const idx = (cy * canvasSize + cx) * 4;
        const lum = getLuminance(pixelData[idx], pixelData[idx + 1], pixelData[idx + 2]);

        if (isModuleDark && lum > 0.5) {
          // Logo is too light for a dark module — draw a dark dot
          ctx.fillStyle = finderColor;
          drawDot(ctx, x + dotOff, y + dotOff, dotPx, dotStyle);
        } else if (!isModuleDark && lum <= 0.5) {
          // Logo is too dark for a light module — punch a light hole
          ctx.fillStyle = bgColor;
          drawDot(ctx, x + dotOff, y + dotOff, dotPx, dotStyle);
        }
        // Otherwise logo luminance already matches the required module value
      } else {
        // No logo — draw standard QR (dark dot on bgColor background)
        if (isModuleDark) {
          ctx.fillStyle = finderColor;
          drawDot(ctx, x + dotOff, y + dotOff, dotPx, dotStyle);
        }
      }
    }
  }

  // Step 5: Draw finder patterns prominently on top of everything (3 corners)
  const corners: Array<[number, number]> = [
    [0, 0],
    [0, size - 7],
    [size - 7, 0],
  ];
  for (const [r, c] of corners) {
    drawFinderSquare(ctx, r, c, moduleSize, finderColor, bgColor, dotStyle);
  }

  // Step 6: Draw alignment patterns (version ≥ 2)
  for (const [ar, ac] of getAlignmentCenters(size)) {
    drawAlignmentPattern(ctx, ar, ac, moduleSize, finderColor, bgColor, dotStyle);
  }
}

/** Classic 3-ring finder square at grid position (row, col) */
function drawFinderSquare(
  ctx: CanvasRenderingContext2D,
  row: number,
  col: number,
  moduleSize: number,
  color: string,
  bgColor: string,
  dotStyle: QRRenderOptions['dotStyle']
): void {
  const x = col * moduleSize;
  const y = row * moduleSize;
  const s = moduleSize;
  const r = dotStyle !== 'square' ? s * 0.6 : 0;

  ctx.fillStyle = color;
  fillRoundRect(ctx, x, y, 7 * s, 7 * s, r);

  ctx.fillStyle = bgColor;
  fillRoundRect(ctx, x + s, y + s, 5 * s, 5 * s, r * 0.6);

  ctx.fillStyle = color;
  fillRoundRect(ctx, x + 2 * s, y + 2 * s, 3 * s, 3 * s, r * 0.4);
}

/** 5×5 alignment pattern centred at grid position (row, col) */
function drawAlignmentPattern(
  ctx: CanvasRenderingContext2D,
  row: number,
  col: number,
  moduleSize: number,
  color: string,
  bgColor: string,
  dotStyle: QRRenderOptions['dotStyle']
): void {
  const x = (col - 2) * moduleSize;
  const y = (row - 2) * moduleSize;
  const s = moduleSize;
  const r = dotStyle !== 'square' ? s * 0.4 : 0;

  ctx.fillStyle = color;
  fillRoundRect(ctx, x, y, 5 * s, 5 * s, r);

  ctx.fillStyle = bgColor;
  fillRoundRect(ctx, x + s, y + s, 3 * s, 3 * s, r * 0.5);

  ctx.fillStyle = color;
  fillRoundRect(ctx, x + 2 * s, y + 2 * s, s, s, r * 0.3);
}

function fillRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
): void {
  if (r <= 0) { ctx.fillRect(x, y, w, h); return; }
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function drawDot(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, size: number,
  style: QRRenderOptions['dotStyle']
): void {
  if (style === 'circle') {
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (style === 'rounded') {
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, size * 0.3);
    ctx.fill();
  } else {
    ctx.fillRect(x, y, size, size);
  }
}
