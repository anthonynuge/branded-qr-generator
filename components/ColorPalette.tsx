'use client';

import { rgbToHex } from '@/lib/color/colorUtils';
import type { ExtractedPalette } from '@/types';

interface Props {
  palette: ExtractedPalette | null;
  finderColor: string;
  onFinderColorChange: (hex: string) => void;
}

export function ColorPalette({ palette, finderColor, onFinderColorChange }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {palette && (
          <>
            <button
              type="button"
              title="Dominant color"
              onClick={() => onFinderColorChange(rgbToHex(...palette.dominant))}
              className="h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none"
              style={{
                backgroundColor: rgbToHex(...palette.dominant),
                borderColor: finderColor === rgbToHex(...palette.dominant) ? 'var(--text-primary)' : 'transparent',
              }}
            />
            {palette.palette.map((color, i) => {
              const hex = rgbToHex(...color);
              return (
                <button
                  key={i}
                  type="button"
                  title={hex}
                  onClick={() => onFinderColorChange(hex)}
                  className="h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none"
                  style={{
                    backgroundColor: hex,
                    borderColor: finderColor === hex ? 'var(--text-primary)' : 'transparent',
                  }}
                />
              );
            })}
          </>
        )}
        {/* Manual color picker */}
        <label className="relative h-8 w-8 cursor-pointer overflow-hidden rounded-full border hover:border-(--text-muted)" style={{ borderColor: 'var(--border-color)' }}>
          <span className="sr-only">Custom color</span>
          <div className="absolute inset-0 flex items-center justify-center text-xs text-(--text-muted)">+</div>
          <input
            type="color"
            value={finderColor}
            onChange={(e) => onFinderColorChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
        {/* Current color swatch */}
        <div
          className="h-8 w-8 rounded-full border"
          style={{ backgroundColor: finderColor, borderColor: 'var(--border-color)' }}
          title={finderColor}
        />
      </div>
    </div>
  );
}
