'use client';

import { Button } from '@/components/Button';

interface Props {
  onDownloadPNG: () => void;
  onDownloadSVG: () => void;
  disabled: boolean;
}

export function DownloadButtons({ onDownloadPNG, onDownloadSVG, disabled }: Props) {
  return (
    <div className="flex items-center gap-3 w-full max-w-sm">
      <Button
        variant="primary"
        onClick={onDownloadPNG}
        disabled={disabled}
        className="flex-1"
      >
        Download PNG
      </Button>
      <Button
        variant="secondary"
        onClick={onDownloadSVG}
        disabled={disabled}
        className="flex items-center gap-1.5"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
        Download SVG
      </Button>
    </div>
  );
}
