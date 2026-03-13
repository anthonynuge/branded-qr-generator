/**
 * Builds a Set of "row,col" strings for all finder pattern modules
 * (three 7×7 corner patterns) and alignment patterns.
 * These modules always render with solid finderColor for scannability.
 */
export function buildFinderSet(size: number): Set<string> {
  const set = new Set<string>();

  // Three finder patterns (7×7) at corners, including separator rows/cols
  // Top-left: rows 0-7, cols 0-7
  // Top-right: rows 0-7, cols size-8 to size-1
  // Bottom-left: rows size-8 to size-1, cols 0-7
  const finderRegions = [
    { rowStart: 0, rowEnd: 8, colStart: 0, colEnd: 8 },
    { rowStart: 0, rowEnd: 8, colStart: size - 8, colEnd: size },
    { rowStart: size - 8, rowEnd: size, colStart: 0, colEnd: 8 },
  ];

  for (const region of finderRegions) {
    for (let r = region.rowStart; r < region.rowEnd; r++) {
      for (let c = region.colStart; c < region.colEnd; c++) {
        set.add(`${r},${c}`);
      }
    }
  }

  // Format information areas (timing strips and format info bands)
  // Horizontal timing strip: row 6
  // Vertical timing strip: col 6
  for (let i = 0; i < size; i++) {
    set.add(`6,${i}`);
    set.add(`${i},6`);
  }

  // Alignment patterns — version-dependent
  // For simplicity, add the standard alignment pattern positions for common versions
  const alignmentPositions = getAlignmentPositions(size);
  for (const [ar, ac] of alignmentPositions) {
    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) {
        set.add(`${ar + dr},${ac + dc}`);
      }
    }
  }

  return set;
}

/**
 * Exported version — used by the renderer to draw alignment squares.
 */
export function getAlignmentCenters(size: number): Array<[number, number]> {
  return getAlignmentPositions(size);
}

/**
 * Returns alignment pattern center positions for a given QR size.
 * Skips positions that overlap with finder patterns.
 */
function getAlignmentPositions(size: number): Array<[number, number]> {
  // QR version lookup: size = 4*version + 17
  const version = (size - 17) / 4;
  if (version < 2) return [];

  // Alignment pattern position table (version 2-40)
  const alignTable: Record<number, number[]> = {
    2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30],
    6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46],
    10: [6, 28, 50], 11: [6, 30, 54], 12: [6, 32, 58], 13: [6, 34, 62],
    14: [6, 26, 46, 66], 15: [6, 26, 48, 70], 16: [6, 26, 50, 74],
    17: [6, 30, 54, 78], 18: [6, 30, 56, 82], 19: [6, 30, 58, 86],
    20: [6, 34, 62, 90], 21: [6, 28, 50, 72, 94], 22: [6, 26, 50, 74, 98],
    23: [6, 30, 54, 78, 102], 24: [6, 28, 54, 80, 106], 25: [6, 32, 58, 84, 110],
    26: [6, 30, 58, 86, 114], 27: [6, 34, 62, 90, 118], 28: [6, 26, 50, 74, 98, 122],
    29: [6, 30, 54, 78, 102, 126], 30: [6, 26, 52, 78, 104, 130],
    31: [6, 30, 56, 82, 108, 134], 32: [6, 34, 60, 86, 112, 138],
    33: [6, 30, 58, 86, 114, 142], 34: [6, 34, 62, 90, 118, 146],
    35: [6, 30, 54, 78, 102, 126, 150], 36: [6, 24, 50, 76, 102, 128, 154],
    37: [6, 28, 54, 80, 106, 132, 158], 38: [6, 32, 58, 84, 110, 136, 162],
    39: [6, 26, 54, 82, 110, 138, 166], 40: [6, 30, 58, 86, 114, 142, 170],
  };

  const positions = alignTable[version];
  if (!positions) return [];

  const centers: Array<[number, number]> = [];
  for (const r of positions) {
    for (const c of positions) {
      // Skip positions that overlap with finder patterns
      if (r === 6 && c === 6) continue;
      if (r === 6 && c === positions[positions.length - 1]) continue;
      if (r === positions[positions.length - 1] && c === 6) continue;
      centers.push([r, c]);
    }
  }
  return centers;
}
