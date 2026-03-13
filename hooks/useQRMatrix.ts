'use client';

import { useMemo, useState } from 'react';
import type { QRContent } from '@/types';
import { generateMatrix, type QRMatrix } from '@/lib/qr/generateMatrix';
import { buildVCard } from '@/lib/vcard';

export function useQRMatrix(content: QRContent): { matrix: QRMatrix | null; error: string | null } {
  return useMemo(() => {
    let text = '';
    try {
      if (content.mode === 'url') {
        text = content.value.trim();
      } else if (content.mode === 'text') {
        text = content.value.trim();
      } else {
        text = buildVCard(content.data);
      }

      if (!text) return { matrix: null, error: null };

      const matrix = generateMatrix(text);
      return { matrix, error: null };
    } catch (e) {
      return { matrix: null, error: (e as Error).message };
    }
  }, [content]);
}
