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
      <label className="block text-sm font-medium text-gray-700">Finder Color</label>
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
                borderColor: finderColor === rgbToHex(...palette.dominant) ? '#6366f1' : 'transparent',
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
                    borderColor: finderColor === hex ? '#6366f1' : 'transparent',
                  }}
                />
              );
            })}
          </>
        )}
        {/* Manual color picker */}
        <label className="relative h-8 w-8 cursor-pointer overflow-hidden rounded-full border-2 border-dashed border-gray-300 hover:border-indigo-400">
          <span className="sr-only">Custom color</span>
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">+</div>
          <input
            type="color"
            value={finderColor}
            onChange={(e) => onFinderColorChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
        {/* Current color swatch */}
        <div
          className="h-8 w-8 rounded-full border border-gray-200"
          style={{ backgroundColor: finderColor }}
          title={finderColor}
        />
      </div>
    </div>
  );
}
