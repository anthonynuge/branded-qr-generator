'use client';

import { useState, useEffect } from 'react';
import type { QRContent, QRRenderOptions } from '@/types';
import { useLogoImage } from '@/hooks/useLogoImage';
import { useColorExtraction } from '@/hooks/useColorExtraction';
import { useQRMatrix } from '@/hooks/useQRMatrix';
import { useQRRenderer } from '@/hooks/useQRRenderer';
import { rgbToHex } from '@/lib/color/colorUtils';

import Logo from '@/components/Logo';
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
    <div className="min-h-screen pb-(--footer-h)" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <header className="border-b px-6 py-5" style={{ borderColor: 'var(--border-color)' }}>
        <div className="mx-auto max-w-5xl flex gap-8 items-center">
          <Logo />
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>QR codes blended with your brand logo</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left column — controls, no cards */}
          <div className="space-y-14">
            <section>
              <h2 className="mb-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Upload logo</h2>
              <p className="mb-4 text-xs" style={{ color: 'var(--text-muted)' }}>PNG, JPG, SVG or WebP. Becomes the QR background.</p>
              <UploadLogo onFileChange={setLogoFile} objectUrl={objectUrl} />
              {logoError && <p className="mt-2 text-xs text-red-400">{logoError}</p>}
            </section>

            <section>
              <h2 className="mb-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>QR content</h2>
              <p className="mb-4 text-xs" style={{ color: 'var(--text-muted)' }}>URL, text, or vCard to encode.</p>
              <QRContentForm content={content} onChange={setContent} />
            </section>

            <section>
              <h2 className="mb-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Colors</h2>
              <p className="mb-4 text-xs" style={{ color: 'var(--text-muted)' }}>Finder pattern color from palette or custom.</p>
              <ColorPalette
                palette={palette}
                finderColor={options.finderColor}
                onFinderColorChange={(hex) => setOptions((o) => ({ ...o, finderColor: hex }))}
              />
            </section>

            <section>
              <h2 className="mb-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Style</h2>
              <p className="mb-4 text-xs" style={{ color: 'var(--text-muted)' }}>Module size, dot shape and background.</p>
              <QROptions options={options} onChange={setOptions} />
            </section>
          </div>

          {/* Right column — preview first (unchanged from original for reliable scanning), then actions */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-8 lg:self-start">
            <section>
              <h2 className="mb-4 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Preview</h2>
              <div className="flex justify-center">
                <QRPreview canvasRef={canvasRef} hasMatrix={hasContent} error={qrError} />
              </div>
              {hasContent && !imgElement && (
                <p className="mt-3 text-center text-xs" style={{ color: 'var(--text-muted)' }}>Upload a logo — it becomes the background with QR dots overlaid</p>
              )}
            </section>

            <DownloadButtons
              onDownloadPNG={exportAsPNG}
              onDownloadSVG={exportAsSVGFile}
              disabled={!hasContent}
            />

            {hasContent && (
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Tip:</strong> Scan before sharing. Error correction H allows ~30% damage; heavy logos can affect readability.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
