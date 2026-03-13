'use client';

interface Props {
  onDownloadPNG: () => void;
  onDownloadSVG: () => void;
  disabled: boolean;
}

export function DownloadButtons({ onDownloadPNG, onDownloadSVG, disabled }: Props) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onDownloadPNG}
        disabled={disabled}
        className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
      >
        Download PNG
      </button>
      <button
        type="button"
        onClick={onDownloadSVG}
        disabled={disabled}
        className="flex-1 rounded-xl border border-indigo-600 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
      >
        Download SVG
      </button>
    </div>
  );
}
