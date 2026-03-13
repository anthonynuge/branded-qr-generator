'use client';

import { RefObject } from 'react';

interface Props {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  hasMatrix: boolean;
  error: string | null;
}

export function QRPreview({ canvasRef, hasMatrix, error }: Props) {
  return (
    <div className="flex aspect-square w-full max-w-sm items-center justify-center rounded-lg border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
      {error ? (
        <div className="p-6 text-center">
          <p className="text-sm font-medium text-red-400">Error generating QR</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">{error}</p>
        </div>
      ) : !hasMatrix ? (
        <div className="p-6 text-center">
          <div className="mx-auto mb-3 h-16 w-16 rounded-lg border-2 border-dashed" style={{ borderColor: 'var(--border-color)' }} />
          <p className="text-sm text-[var(--text-muted)]">Enter content to generate QR code</p>
        </div>
      ) : (
        <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', lineHeight: 0 }}>
          <canvas
            ref={canvasRef}
            className="max-h-full max-w-full block"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      )}
    </div>
  );
}
