'use client';

import { useState, useEffect } from 'react';
import type { ExtractedPalette } from '@/types';
import { extractColors } from '@/lib/color/extractColors';

export function useColorExtraction(imgElement: HTMLImageElement | null): ExtractedPalette | null {
  const [palette, setPalette] = useState<ExtractedPalette | null>(null);

  useEffect(() => {
    if (!imgElement) {
      setPalette(null);
      return;
    }

    try {
      const result = extractColors(imgElement);
      setPalette(result);
    } catch {
      setPalette(null);
    }
  }, [imgElement]);

  return palette;
}
