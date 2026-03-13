'use client';

import { useState, useEffect } from 'react';

export function useLogoImage(file: File | null): {
  imgElement: HTMLImageElement | null;
  objectUrl: string | null;
  error: string | null;
} {
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setImgElement(null);
      setObjectUrl(null);
      setError(null);
      return;
    }

    setError(null);
    let url: string;

    // SVG files need rasterization via canvas for color extraction
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const svgText = e.target?.result as string;
        const blob = new Blob([svgText], { type: 'image/svg+xml' });
        url = URL.createObjectURL(blob);
        setObjectUrl(url);
        loadImage(url);
      };
      reader.readAsText(file);
    } else {
      url = URL.createObjectURL(file);
      setObjectUrl(url);
      loadImage(url);
    }

    function loadImage(src: string) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => setImgElement(img);
      img.onerror = () => setError('Failed to load image');
      img.src = src;
    }

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [file]);

  return { imgElement, objectUrl, error };
}
