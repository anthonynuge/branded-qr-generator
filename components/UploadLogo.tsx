'use client';

import { useRef, useState } from 'react';

interface Props {
  onFileChange: (file: File | null) => void;
  objectUrl: string | null;
}

export function UploadLogo({ onFileChange, objectUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) return;
    onFileChange(file);
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Brand Logo</label>
      <div
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors cursor-pointer ${
          dragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        {objectUrl ? (
          <div className="flex flex-col items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={objectUrl} alt="Logo preview" className="h-16 w-auto max-w-[10rem] object-contain" />
            <span className="text-xs text-gray-500">Click to replace</span>
          </div>
        ) : (
          <>
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="mt-2 text-sm text-gray-600">Drag & drop or <span className="text-indigo-600 font-medium">browse</span></p>
            <p className="text-xs text-gray-400">PNG, JPG, SVG, WebP</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {objectUrl && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onFileChange(null); }}
          className="text-xs text-red-500 hover:text-red-700"
        >
          Remove logo
        </button>
      )}
    </div>
  );
}
