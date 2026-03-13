'use client';

import type { QRRenderOptions, DotStyle } from '@/types';

interface Props {
  options: QRRenderOptions;
  onChange: (options: QRRenderOptions) => void;
}

const DOT_STYLES: { value: DotStyle; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'circle', label: 'Circle' },
];

export function QROptions({ options, onChange }: Props) {
  function update(partial: Partial<QRRenderOptions>) {
    onChange({ ...options, ...partial });
  }

  return (
    <div className="space-y-4">
      {/* Module size */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <label className="text-sm font-medium text-gray-700">Module Size</label>
          <span className="text-sm text-gray-500">{options.moduleSize}px</span>
        </div>
        <input
          type="range"
          min={6}
          max={20}
          value={options.moduleSize}
          onChange={(e) => update({ moduleSize: Number(e.target.value) })}
          className="w-full accent-indigo-600"
        />
      </div>

      {/* Dot scale */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <label className="text-sm font-medium text-gray-700">Dot Size</label>
          <span className="text-sm text-gray-500">{Math.round(options.dotScale * 100)}%</span>
        </div>
        <input
          type="range"
          min={40}
          max={100}
          value={Math.round(options.dotScale * 100)}
          onChange={(e) => update({ dotScale: Number(e.target.value) / 100 })}
          className="w-full accent-indigo-600"
        />
        <p className="text-xs text-gray-400">Smaller dots reveal more of the logo between them</p>
      </div>

      {/* Dot style */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Dot Style</label>
        <div className="flex gap-2">
          {DOT_STYLES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => update({ dotStyle: s.value })}
              className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                options.dotStyle === s.value
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-600 hover:border-indigo-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Background color */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Background</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={options.bgColor}
            onChange={(e) => update({ bgColor: e.target.value })}
            className="h-9 w-14 cursor-pointer rounded border border-gray-200 p-0.5"
          />
          <input
            type="text"
            value={options.bgColor}
            onChange={(e) => update({ bgColor: e.target.value })}
            className="input w-28 font-mono text-sm"
            maxLength={7}
            placeholder="#ffffff"
          />
        </div>
      </div>
    </div>
  );
}
