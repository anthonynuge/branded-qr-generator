'use client';

interface Props {
  onDownloadPNG: () => void;
  onDownloadSVG: () => void;
  disabled: boolean;
}

export function DownloadButtons({ onDownloadPNG, onDownloadSVG, disabled }: Props) {
  return (
    <div className="flex items-center gap-3 w-full max-w-sm">
      <button
        type="button"
        onClick={onDownloadPNG}
        disabled={disabled}
        className="flex-1 rounded py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 transition-opacity"
        style={{ backgroundColor: 'var(--accent-resolved)', color: 'var(--bg-primary)' }}
      >
        Download PNG
      </button>
      <button
        type="button"
        onClick={onDownloadSVG}
        disabled={disabled}
        className="rounded border py-2.5 px-4 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 transition-colors flex items-center gap-1.5"
        style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
        Download SVG
      </button>
    </div>
  );
}
