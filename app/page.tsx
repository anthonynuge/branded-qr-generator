'use client';

import { useState, useEffect } from 'react';
import type { QRContent, QRRenderOptions } from '@/types';
import { useLogoImage } from '@/hooks/useLogoImage';
import { useColorExtraction } from '@/hooks/useColorExtraction';
import { useQRMatrix } from '@/hooks/useQRMatrix';
import { useQRRenderer } from '@/hooks/useQRRenderer';
import { rgbToHex } from '@/lib/color/colorUtils';

import { UploadLogo } from '@/components/UploadLogo';
import { QRContentForm } from '@/components/QRContentForm';
import { ColorPalette } from '@/components/ColorPalette';
import { QROptions } from '@/components/QROptions';
import { QRPreview } from '@/components/QRPreview';
import { DownloadButtons } from '@/components/DownloadButtons';

const DEFAULT_OPTIONS: QRRenderOptions = {
  moduleSize: 12,
  dotStyle: 'circle',
  dotScale: 0.75,
  bgColor: '#ffffff',
  finderColor: '#1e1b4b',
};

export default function Home() {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [content, setContent] = useState<QRContent>({ mode: 'url', value: '' });
  const [options, setOptions] = useState<QRRenderOptions>(DEFAULT_OPTIONS);

  const { imgElement, objectUrl, error: logoError } = useLogoImage(logoFile);
  const palette = useColorExtraction(imgElement);
  const { matrix, error: qrError } = useQRMatrix(content);

  // Auto-set finder color to dominant brand color when palette changes
  useEffect(() => {
    if (palette) {
      setOptions((prev) => ({
        ...prev,
        finderColor: rgbToHex(...palette.dominant),
      }));
    }
  }, [palette]);

  const dominant: [number, number, number] = palette?.dominant ?? [30, 27, 75];

  const { canvasRef, exportAsPNG, exportAsSVGFile } = useQRRenderer({
    matrix,
    logoImage: imgElement,
    options,
    dominant,
  });

  const hasContent = matrix !== null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 3.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Branded QR Generator</h1>
            <p className="text-xs text-gray-500">QR codes colored with your brand palette</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left column — controls */}
          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">1. Upload Logo</h2>
              <UploadLogo onFileChange={setLogoFile} objectUrl={objectUrl} />
              {logoError && <p className="mt-2 text-xs text-red-500">{logoError}</p>}
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">2. QR Content</h2>
              <QRContentForm content={content} onChange={setContent} />
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">3. Colors</h2>
              <ColorPalette
                palette={palette}
                finderColor={options.finderColor}
                onFinderColorChange={(hex) => setOptions((o) => ({ ...o, finderColor: hex }))}
              />
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">4. Style</h2>
              <QROptions options={options} onChange={setOptions} />
            </section>
          </div>

          {/* Right column — preview + download */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-8 lg:self-start">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Preview</h2>
              <div className="flex justify-center">
                <QRPreview canvasRef={canvasRef} hasMatrix={hasContent} error={qrError} />
              </div>
              {hasContent && !imgElement && (
                <p className="mt-3 text-center text-xs text-gray-400">Upload a logo — it becomes the background with QR dots overlaid</p>
              )}
            </section>

            <DownloadButtons
              onDownloadPNG={exportAsPNG}
              onDownloadSVG={exportAsSVGFile}
              disabled={!hasContent}
            />

            {hasContent && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-700">
                <strong>Tip:</strong> Always scan your QR code before sharing it. Error correction level H gives 30% damage tolerance, but heavy logos may affect readability.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
