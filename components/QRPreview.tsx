'use client';

import { RefObject } from 'react';

interface Props {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  hasMatrix: boolean;
  error: string | null;
}

export function QRPreview({ canvasRef, hasMatrix, error }: Props) {
  return (
    <div className="flex aspect-square w-full max-w-sm items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
      {error ? (
        <div className="p-6 text-center">
          <p className="text-sm font-medium text-red-600">Error generating QR</p>
          <p className="mt-1 text-xs text-gray-500">{error}</p>
        </div>
      ) : !hasMatrix ? (
        <div className="p-6 text-center">
          <div className="mx-auto mb-3 h-16 w-16 rounded-xl border-2 border-dashed border-gray-300" />
          <p className="text-sm text-gray-400">Enter content to generate QR code</p>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          className="max-h-full max-w-full rounded-xl"
          style={{ imageRendering: 'pixelated' }}
        />
      )}
    </div>
  );
}
