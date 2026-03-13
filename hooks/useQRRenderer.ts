'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { QRMatrix } from '@/lib/qr/generateMatrix';
import type { QRRenderOptions } from '@/types';
import { renderQRToCanvas, type RenderPayload } from '@/lib/qr/canvasRenderer';
import { exportAsSVG } from '@/lib/qr/svgExporter';

interface UseQRRendererOptions {
  matrix: QRMatrix | null;
  logoImage: HTMLImageElement | null;
  options: QRRenderOptions;
  dominant: [number, number, number];
}

export function useQRRenderer({
  matrix,
  logoImage,
  options,
  dominant,
}: UseQRRendererOptions) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const payload: RenderPayload | null = matrix
    ? { matrix, logoImage, options, dominant }
    : null;

  useEffect(() => {
    if (!canvasRef.current || !payload) return;
    renderQRToCanvas(canvasRef.current, payload);
  }, [matrix, logoImage, options, dominant]); // eslint-disable-line react-hooks/exhaustive-deps

  const exportAsPNG = useCallback(() => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'branded-qr.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  }, []);

  const exportAsSVGFile = useCallback(() => {
    if (!payload) return;
    const svgString = exportAsSVG(payload);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'branded-qr.svg';
    link.href = url;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [payload]);

  return { canvasRef, exportAsPNG, exportAsSVGFile };
}
